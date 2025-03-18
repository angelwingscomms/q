const { GoogleGenerativeAI } = require("@google/generative-ai");
//const { SchemaType } = require("@google/generative-ai/server");
//const { patchDocument, PatchType, TextRun } = require("docx");
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require("fs");
const readline = require("readline");
const path = require("path");
const { exec } = require("child_process");
require("dotenv").config();

// Function to manually extract exams from text when JSON parsing fails
function manuallyExtractExams(text, subjectList) {
  console.log("Manually extracting exams from text...");
  const exams = [];
  
  // Try to identify subject headers and their content
  // This assumes the text has subject headers followed by content
  let currentSubject = null;
  let currentContent = [];
  
  // Split the text into lines for processing
  const lines = text.split(/\r?\n/);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check if this line is a subject header
    const subjectMatch = subjectList.find(subject => 
      line.toUpperCase().includes(subject.toUpperCase()) || 
      line.toUpperCase() === subject.toUpperCase()
    );
    
    if (subjectMatch) {
      // If we already have a subject, save the previous one
      if (currentSubject && currentContent.length > 0) {
        exams.push({
          subject: currentSubject,
          content: currentContent.join('\n')
        });
        currentContent = [];
      }
      
      currentSubject = subjectMatch;
    } else if (currentSubject) {
      // Add this line to the current content
      currentContent.push(line);
    }
  }
  
  // Add the last subject if there is one
  if (currentSubject && currentContent.length > 0) {
    exams.push({
      subject: currentSubject,
      content: currentContent.join('\n')
    });
  }
  
  // If we couldn't find any subjects using the above method,
  // try a more aggressive approach by splitting the text into equal chunks
  if (exams.length === 0 && subjectList.length > 0) {
    console.log("No subjects found using header detection. Trying chunk-based extraction...");
    
    // Remove any markdown or code block markers
    const cleanText = text.replace(/```[\s\S]*?```/g, '');
    
    // Split the text into roughly equal chunks based on the number of subjects
    const chunkSize = Math.ceil(cleanText.length / subjectList.length);
    
    for (let i = 0; i < subjectList.length; i++) {
      const startPos = i * chunkSize;
      const endPos = Math.min(startPos + chunkSize, cleanText.length);
      const chunk = cleanText.substring(startPos, endPos);
      
      if (chunk.trim()) {
        exams.push({
          subject: subjectList[i],
          content: chunk.trim()
        });
      }
    }
  }
  
  console.log(`Manually extracted ${exams.length} exams`);
  return exams;
}

// Helper function to sanitize and parse JSON responses from AI models
function sanitizeJsonResponse(response) {
  // First try direct parsing
  try {
    return JSON.parse(response);
  } catch (error) {
    console.log(`JSON parse error: ${error.message}`);
    
    // Check if the response starts with markdown code block
    const markdownMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (markdownMatch) {
      try {
        console.log("Found markdown code block, attempting to parse its contents");
        return JSON.parse(markdownMatch[1]);
      } catch (markdownError) {
        console.log(`Markdown extraction failed: ${markdownError.message}`);
      }
    }
    
    // Try to extract a valid JSON array using regex
    try {
      const jsonArrayMatch = response.match(/\[\s*\{[\s\S]*?\}\s*\]/);
      if (jsonArrayMatch) {
        console.log("Found JSON array pattern, attempting to parse");
        return JSON.parse(jsonArrayMatch[0]);
      }
    } catch (regexError) {
      console.log(`Regex extraction failed: ${regexError.message}`);
    }
    
    // Try to fix common JSON issues
    try {
      console.log("Attempting to sanitize and fix JSON");
      // Replace common problematic characters
      let sanitized = response
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
        .replace(/\\(?!["\\/bfnrt])/g, "\\\\") // Escape backslashes not followed by valid escape chars
        .replace(/(?<!\\)"/g, '\\"') // Escape unescaped quotes
        .replace(/[\r\n]+/g, " ") // Replace newlines with spaces
        .replace(/,\s*]/g, "]") // Remove trailing commas in arrays
        .replace(/,\s*}/g, "}"); // Remove trailing commas in objects
      
      // Try to find the beginning and end of a JSON array
      const startIdx = sanitized.indexOf('[');
      const endIdx = sanitized.lastIndexOf(']');
      
      if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
        sanitized = sanitized.substring(startIdx, endIdx + 1);
        console.log("Extracted JSON array by finding brackets");
        return JSON.parse(sanitized);
      }
      
      // If we can't find an array, try to find an object
      const objStartIdx = sanitized.indexOf('{');
      const objEndIdx = sanitized.lastIndexOf('}');
      
      if (objStartIdx !== -1 && objEndIdx !== -1 && objStartIdx < objEndIdx) {
        sanitized = sanitized.substring(objStartIdx, objEndIdx + 1);
        console.log("Extracted JSON object by finding braces");
        const parsedObj = JSON.parse(sanitized);
        // If we found an object but need an array, wrap it
        return Array.isArray(parsedObj) ? parsedObj : [parsedObj];
      }
    } catch (sanitizeError) {
      console.log(`Sanitization failed: ${sanitizeError.message}`);
    }
    
    // Last resort: try to manually construct a valid array from the content
    try {
      console.log("Attempting manual JSON construction as last resort");
      
      // Look for patterns that might indicate subject/content pairs
      const subjects = response.match(/["']subject["']\s*:\s*["']([^"']+)["']/g) || [];
      const contents = response.match(/["']content["']\s*:\s*["']([^"']+)["']/g) || [];
      
      if (subjects.length > 0 && contents.length > 0) {
        console.log(`Found ${subjects.length} subjects and ${contents.length} contents`);
        
        // Try to construct a simple array of objects
        const manualArray = [];
        for (let i = 0; i < Math.min(subjects.length, contents.length); i++) {
          const subjectMatch = subjects[i].match(/["']subject["']\s*:\s*["']([^"']+)["']/);
          const contentMatch = contents[i].match(/["']content["']\s*:\s*["']([^"']+)["']/);
          
          if (subjectMatch && contentMatch) {
            manualArray.push({
              subject: subjectMatch[1],
              content: contentMatch[1]
            });
          }
        }
        
        if (manualArray.length > 0) {
          console.log(`Manually constructed ${manualArray.length} exam objects`);
          return manualArray;
        }
      }
    } catch (manualError) {
      console.log(`Manual construction failed: ${manualError.message}`);
    }
    
    // If all else fails, throw the original error
    throw new Error(`Failed to parse JSON response: ${error.message}`);
  }
}

const G = process.env.G || "YOUR_API_KEY_HERE";
const genAI = new GoogleGenerativeAI(G);
const grades = {
  1: "ONE",
  2: "TWO",
  3: "THREE",
  4: "FOUR",
  5: "FIVE",
};
//const grades = ["ONE", "TWO", "THREE", "FOUR", "FIVE"];
const subjects = [
 "Math",
 "English Language",
 "Basic Science and Technology",
 "Computer",
 "History",
 "Physical and Health Education",
 "National Values",
 "Cultural and Creative Arts",
 "PreVocational Studies",
 "French",
 "Religion Studies",
 "Music",
];

// Map grade names to todolist section names
const gradeToSectionMap = {
  "ONE": "g1",
  "TWO": "g2",
  "THREE": "g3",
  "FOUR": "g4",
  "FIVE": "g5",
};

// Function to update todolist-data.json
function updateTodolistData(subject, grade) {
  const todolistDataPath = path.join(__dirname, 'todolist-data.json');
  
  // Check if todolist-data.json exists
  if (!existsSync(todolistDataPath)) {
    console.log("todolist-data.json not found. No update performed.");
    return;
  }
  
  try {
    // Read the current todolist data
    const todoData = JSON.parse(readFileSync(todolistDataPath, 'utf8'));
    
    // Map the grade to the corresponding section
    const section = gradeToSectionMap[grade];
    
    // If the section is not mapped, log a warning and return
    if (!section) {
      console.log(`Warning: Grade ${grade} does not map to a known section. No update performed.`);
      return;
    }
    
    // Check if the subject exists in the todolist data
    if (todoData[subject] && todoData[subject][section]) {
      // Update the 'done' status to true
      todoData[subject][section].done = true;
      
      // Write the updated data back to the file
      writeFileSync(todolistDataPath, JSON.stringify(todoData, null, 2));
      console.log(`Updated todolist-data.json: Marked ${subject} (${section}) as done.`);
    } else {
      console.log(`Warning: Subject ${subject} or section ${section} not found in todolist data.`);
    }
  } catch (error) {
    console.error("Error updating todolist-data.json:", error.message);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const singleQuizModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 65536,
    responseMimeType: "application/json",
    responseSchema: {
      description: "Array of questions",
      type: "ARRAY",
      items: {
        type: "STRING",
      },
    },
  },
});

const multiQuizModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 999999,
    responseMimeType: "application/json",
    responseSchema: {
      description: "list of exams",
      type: "ARRAY",
      items: {
        description: "an exam object",
        type: "OBJECT",
        properties: {
          subject: {
            type: "STRING",
            description: "this exam's subject",
            nullable: false,
          },
          content: {
            type: "STRING",
            description: "this exam's content",
            nullable: false,
          },
        },
        required: ["subject", "content"],
      },
    },
  },
});

async function createSingleQuiz({ t }) {
  try {
    const result =
      await singleQuizModel.generateContent(`Perfectly following the format of the first quiz, edit the second quiz while retaining all questions.
Rephrase all questions to use different words to ask the same question, but maintain the same meaning, tone, and English language level as the original, and improve grammar and clarity.
Within each section (objective, Section B, Section C), randomize the order of questions while keeping them within their respective sections.
Make all concise. Leave a line break after each question.

For Section A (objective questions):
- Replace multiple blanks (e.g., "_____") with a single underscore (e.g., "_")
- Never end with a full stop
- Use brackets for options (e.g., (a)...) and place questions and options on same line
- Fix bad questions by removing or replacing options to ensure one correct answer
- Questions may end with question marks

For Section B (short answer questions):
- Use exactly 9 underscores (_________) for fill in the blanks

For Section C (essay questions, if any):
- Rephrase the question to maintain the same meaning, tone, and English language level as the original, but use different words to ask the same question, and improve grammar and clarity.

Respond with ONLY the edited version of the second quiz as JSON.

The first quiz:
"""
1. When you take care of your body you will look attractive (a) True (b) False
2. How many noses do you have? (a) 2 (b) 1 (c) 3
3. How many nostrils do you have? (a) 1 (b) 2 (c) 3

Section B: Short answer
1. How many sides does a hexagon have? _________
2. Sum of angles in a triangle. _________
3. 5 + 4 = _________

Section C: Essay
1. Write the theory of relative posterity.
2. Describe the relationship of astronomy and sacred geometry
3. What did the wind tell the sun?
"""

Text to create quiz from:
"""
${t}
"""
`);
    
    const responseText = result.response.text();
    
    // Try to parse the response as JSON, but handle cases where it might not be valid JSON
    try {
      return JSON.stringify(sanitizeJsonResponse(responseText));
    } catch (error) {
      // If it's not valid JSON, return the raw text
      console.log("Response is not valid JSON, returning raw text");
      return JSON.stringify([responseText]);
    }
  } catch (error) {
    console.error(`Error in createSingleQuiz: ${error.message}`);
    throw error;
  }
}

async function generateDoc({ g, t, s }) {
  const q = await createSingleQuiz({ t });
  const { patchDocument, PatchType, TextRun, Paragraph } = require("docx");
  
  let quizContent;
  try {
    // Try to parse the quiz content as JSON
    quizContent = JSON.parse(q);
  } catch (error) {
    console.error(`Error parsing quiz content: ${error.message}`);
    // If parsing fails, wrap the content in an array
    quizContent = [q];
  }
  
  // Ensure quizContent is an array
  if (!Array.isArray(quizContent)) {
    quizContent = [quizContent];
  }

  // Get grade number and create json folder path
  const gradeNum = Object.keys(grades).find(key => grades[key] === g);
  const jsonDir = `./files/output/g${gradeNum}/json`;
  
  // Create json directory if it doesn't exist
  if (!existsSync(jsonDir)) {
    mkdirSync(jsonDir, { recursive: true });
  }

  // Save the quiz JSON data
  const jsonPath = `${jsonDir}/${s}.json`;
  writeFileSync(jsonPath, JSON.stringify(quizContent, null, 2));
  console.log(`Saved quiz JSON to: ${jsonPath}`);
  
  const doc = await patchDocument({
    data: readFileSync(`./files/template${g === "ONE" ? "-cc" : ""}.docx`),
    outputType: "nodebuffer", 
    keepOriginalStyles: true,
    patches: {
      s: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(s)],
      },
      g: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(g)],
      },
      q: {
        type: PatchType.DOCUMENT,
        children: quizContent.map(content => {
          return new Paragraph({
            children: [new TextRun(content)],
            spacing: { after: 9 }
          });
        }),
      },
      
    },
  });
  return doc;
}

// Function to run git commands after quiz generation
function runGitCommands() {
  return new Promise((resolve, reject) => {
    console.log("Running git commands...");
    exec('git add .; git commit --allow-empty -m "Add new quiz"; git push', (error, stdout, stderr) => {
      if (error) {
        console.error(`Git command error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.log(`Git stderr: ${stderr}`);
      }
      console.log(`Git commands executed: ${stdout}`);
      resolve();
    });
  });
}

async function generateSingleQuiz({ g, t, s }) {
  const doc = await generateDoc({ g, t, s });
  // Get the grade number from the grade name
  const gradeNum = Object.keys(grades).find(key => grades[key] === g);
  const outputPath = `./files/output/g${gradeNum}/${s}.docx`;
  
  // Ensure the directory exists
  const outputDir = path.dirname(outputPath);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  
  writeFileSync(outputPath, doc);
  console.log(`Quiz generated: ${outputPath}`);
  
  // Update todolist-data.json after generating the quiz
  updateTodolistData(s, g);
  
  // Run git commands
  try {
    await runGitCommands();
  } catch (error) {
    console.error("Failed to run git commands:", error);
  }
}

async function generateMultipleQuizzes({ c, g, file }) {
  if (!existsSync("./files/input/parsed")) {
    mkdirSync("./files/input/parsed", { recursive: true });
  }

  // Get grade number for the json directory path
  const currentGradeNum = Object.keys(grades).find(key => grades[key] === g);
  const jsonDir = `./files/output/g${currentGradeNum}/json`;
  
  // Create json directory if it doesn't exist
  if (!existsSync(jsonDir)) {
    mkdirSync(jsonDir, { recursive: true });
  }

  const parsedFilePath = `./files/input/parsed/${file}.json`;
  let exams;

  if (existsSync(parsedFilePath)) {
    console.log(`Using cached parsed data from ${parsedFilePath}`);
    try {
      exams = JSON.parse(readFileSync(parsedFilePath, "utf8"));
    } catch (error) {
      console.error(`Error reading cached data: ${error.message}`);
      console.log("Regenerating parsed data...");
      // Continue to regenerate the data
    }
  }

  if (!exams) {
    console.log("Parsing exams...");
    try {
      const aiResponse = (
        await multiQuizModel.generateContent(
          `return a JSON array of EACH AND EVERY exam given, where each exam object has 'subject' and 'content', the subject being that exam's subject, and the content being the exam's content as a string. Use exactly these subjects were relevant: ${JSON.stringify(subjects)}
                Include EVERY subject.
                The exams:
                ${c}
                `,
        )
      ).response.text();

      // Save the raw response for debugging
      const debugFilePath = `./files/input/parsed/${file}-raw-response.txt`;
      writeFileSync(debugFilePath, aiResponse);
      console.log(`Saved raw AI response to ${debugFilePath} for debugging`);

      try {
        // Use the sanitizeJsonResponse helper function to parse the AI response
        exams = sanitizeJsonResponse(aiResponse);
      } catch (parseError) {
        throw 'nonJSON response'
        console.error(`JSON parsing error: ${parseError.message}`);
        console.log("Raw response excerpt (first 500 chars):");
        console.log(aiResponse.substring(0, 500));
        console.log("...");
        console.log("Raw response excerpt (last 500 chars):");
        console.log(aiResponse.substring(Math.max(0, aiResponse.length - 500)));
        
        // Try a more aggressive approach for JSON extraction
        console.log("Attempting more aggressive JSON extraction...");
        
        // Look for array-like structures
        const arrayMatch = aiResponse.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (arrayMatch) {
          try {
            exams = JSON.parse(arrayMatch[0]);
            console.log("Successfully extracted JSON array using regex");
          } catch (regexError) {
            console.error(`Regex extraction failed: ${regexError.message}`);
            
            // Last resort: try to manually extract subjects and content
            console.log("Attempting manual extraction of subjects and content...");
            exams = manuallyExtractExams(aiResponse, subjects);
            
            if (!exams || exams.length === 0) {
              throw parseError; // Rethrow the original error if manual extraction fails
            }
          }
        } else {
          // Try manual extraction as a last resort
          console.log("No JSON array found. Attempting manual extraction...");
          exams = manuallyExtractExams(aiResponse, subjects);
          
          if (!exams || exams.length === 0) {
            throw parseError; // Rethrow the original error if manual extraction fails
          }
        }
      }

      // Validate the parsed exams
      if (!Array.isArray(exams)) {
        throw new Error("Parsed result is not an array");
      }
      
      // Ensure each exam has the required properties
      exams = exams.filter(exam => exam && typeof exam === 'object' && exam.subject && exam.content);
      
      if (exams.length === 0) {
        throw new Error("No valid exams found in the parsed result");
      }

      writeFileSync(parsedFilePath, JSON.stringify(exams, null, 2));
      console.log(`Saved parsed exams to ${parsedFilePath}`);
    } catch (error) {
      console.error(`Error parsing exams: ${error.message}`);
      throw new Error(`Failed to parse exams: ${error.message}`);
    }
  }

  console.log(`Found ${exams.length} exams to generate`);

  // Get the grade number from the grade name
  const gradeNum = Object.keys(grades).find(key => grades[key] === g);
  const outputDir = `./files/output/g${gradeNum}`;
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  for (const { subject: s, content: t } of exams) {
    console.log(`Generating quiz for ${s}...`);

    // First get the quiz content
    const quiz = await createSingleQuiz({ t });
    let quizContent;
    try {
      quizContent = JSON.parse(quiz);
    } catch (error) {
      console.error(`Error parsing quiz content: ${error.message}`);
      quizContent = [quiz];
    }
    
    if (!Array.isArray(quizContent)) {
      quizContent = [quizContent];
    }

    // Save the quiz JSON data
    const jsonPath = `${jsonDir}/${s}.json`;
    writeFileSync(jsonPath, JSON.stringify(quizContent, null, 2));
    console.log(`Saved quiz JSON to: ${jsonPath}`);

    // Generate Word document
    const doc = await generateDoc({ g, t, s });
    const outputPath = `${outputDir}/${s}.docx`;
    writeFileSync(outputPath, doc);
    console.log(`Generated: ${outputPath}`);
    
    // Update todolist-data.json after generating each quiz
    updateTodolistData(s, g);
    
    // Run git commands after each quiz
    try {
      await runGitCommands();
    } catch (error) {
      console.error("Failed to run git commands:", error);
    }
    
    await new Promise((r) => setTimeout(r, 27000));
  }
}

// Helper function to display a menu and get user selection
async function displayMenu(items, prompt) {
  return new Promise((resolve) => {
    console.log(prompt);
    items.forEach((item, index) => {
      console.log(`${index + 1}. ${item}`);
    });
    
    rl.question("Enter your selection (number): ", (answer) => {
      const selection = parseInt(answer);
      if (!isNaN(selection) && selection >= 1 && selection <= items.length) {
        resolve(items[selection - 1]);
      } else {
        console.log("Invalid selection. Please try again.");
        resolve(displayMenu(items, prompt));
      }
    });
  });
}

async function main() {
  try {
    const mode = await new Promise((resolve) => {
      rl.question(
        "Generate (1) single quiz or (2) multiple quizzes? [1/2]: ",
        (answer) => resolve(answer),
      );
    });

    if (mode === "1") {
      const file = await new Promise((resolve) => {
        rl.question("What file? (e.g., grade1.txt): ", (answer) =>
          resolve(answer),
        );
      });
      const text = readFileSync(`./files/input/${file}`, "utf8");

      // Grade selection as a menu of numbers
      const gradeSelection = await new Promise((resolve) => {
        console.log("Which grade?");
        Object.keys(grades).forEach(key => {
          console.log(`${key}. Grade ${grades[key]}`);
        });
        
        rl.question("Enter grade number (1-5): ", (answer) => {
          const gradeNum = parseInt(answer);
          if (!isNaN(gradeNum) && grades[gradeNum]) {
            resolve(grades[gradeNum]);
          } else if (Object.values(grades).includes(answer.toUpperCase())) {
            // Allow direct input of grade name for backward compatibility
            resolve(answer.toUpperCase());
          } else {
            console.log("Invalid grade. Please try again.");
            rl.question("Enter grade number (1-5): ", (retryAnswer) => {
              const retryGradeNum = parseInt(retryAnswer);
              if (!isNaN(retryGradeNum) && grades[retryGradeNum]) {
                resolve(grades[retryGradeNum]);
              } else {
                console.log("Invalid grade again. Defaulting to Grade ONE.");
                resolve("ONE");
              }
            });
          }
        });
      });

      // Subject selection as a menu
      const subject = await displayMenu(subjects, "Select a subject:");

      console.log("Generating single quiz...");
      await generateSingleQuiz({
        g: gradeSelection,
        t: text,
        s: subject,
      });
    } else if (mode === "2") {
      const file = await new Promise((resolve) => {
        rl.question("What file? (e.g., grade1.txt): ", (answer) =>
          resolve(answer),
        );
      });
      const content = readFileSync(`./files/input/${file}`, "utf8");

      // Grade selection as a menu of numbers
      const gradeSelection = await new Promise((resolve) => {
        console.log("Which grade?");
        Object.keys(grades).forEach(key => {
          console.log(`${key}. Grade ${grades[key]}`);
        });
        
        rl.question("Enter grade number (1-5): ", (answer) => {
          const gradeNum = parseInt(answer);
          if (!isNaN(gradeNum) && grades[gradeNum]) {
            resolve(grades[gradeNum]);
          } else if (Object.values(grades).includes(answer.toUpperCase())) {
            // Allow direct input of grade name for backward compatibility
            resolve(answer.toUpperCase());
          } else {
            console.log("Invalid grade. Please try again.");
            rl.question("Enter grade number (1-5): ", (retryAnswer) => {
              const retryGradeNum = parseInt(retryAnswer);
              if (!isNaN(retryGradeNum) && grades[retryGradeNum]) {
                resolve(grades[retryGradeNum]);
              } else {
                console.log("Invalid grade again. Defaulting to Grade ONE.");
                resolve("ONE");
              }
            });
          }
        });
      });

      console.log("Generating multiple quizzes...");
      await generateMultipleQuizzes({
        c: content,
        g: gradeSelection,
        file: file.split(".")[0],
      });
    } else {
      throw new Error("Invalid mode selection");
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    rl.close();
  }
}

main();