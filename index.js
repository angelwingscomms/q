const { GoogleGenerativeAI } = require("@google/generative-ai");
//const { SchemaType } = require("@google/generative-ai/server");
//const { patchDocument, PatchType, TextRun } = require("docx");
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require("fs");
const readline = require("readline");
const path = require("path");
const { exec } = require("child_process");
require("dotenv").config();

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

// Map subjects to their abbreviations
const subjectAbbreviations = {
  "Math": "m",
  "English Language": "e",
  "Basic Science and Technology": "bst",
  "Computer": "c",
  "History": "h",
  "Physical and Health Education": "phe",
  "National Values": "nv",
  "Cultural and Creative Arts": "cca",
  "PreVocational Studies": "pvs",
  "French": "f",
  "Religion Studies": "rs",
  "Music": "ms"
};

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
  model: "gemini-2.0-pro-exp-02-05",
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 999999,
    responseMimeType: "application/json",
    responseSchema: {
      type: "OBJECT",
      properties: {
        A: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Section A: Objective questions"
        },
        B: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Section B: Short answer questions"
        },
        C: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Section C: Theory questions"
        },
        answers_A: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Answers for Section A objective questions"
        },
        answers_B: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Answers for Section B short answer questions"
        }
      },
      required: ["A", "B", "C", "answers_A", "answers_B"]
    },
  },
});

async function createSingleQuiz({ t }) {
  try {
    const result =
      await singleQuizModel.generateContent(`Create a quiz with three sections (A, B, C) in JSON format.
  Each section should be an array of strings containing the questions for that section.

  Section A should contain objective questions (multiple choice).
  Section B should contain short answer questions.
  Section C should contain essay/theory questions.

  Format requirements:

  For Section A (objective questions):
  - Never end with a full stop
  - Use 1 underscore (_) for blanks
  - Use brackets for options (e.g., (a)...) and place questions and options on same line
  - Fix bad questions by removing or replacing options to ensure one correct answer
  - Questions may end with question marks

  For Section B (short answer questions):
  - Use 9 underscores (_________) for blanks

  For Section C (essay questions):
  - Make questions clear and concise
  - Maintain academic language level
  - Each question should require detailed explanation

  rephrase questions to sound different, while preserving their originalcreate-answers.js, input grade-number, input subject-abbreviation, gets quiz from files/output/{grade-number}/json/{subject-abbreviation}.docx, creates answers using Gemini APi (temperature 0), saves answers to files/output/{grade-number}/answers/{grade-abbreviation}.txt

 content and meaning

  edit all questions and options to be short, like this:
  """
  1. When you take care of your body you will look attractive (a) True (b) False

  2. How many noses do you have? (a) 2 (b) 1 (c) 3

  3. How many nostrils do you have? (a) 1 (b) 2 (c) 3

  4. The two holes in your nose are called _ (a) Nose holes (b) Nostrils (c) Nose cover

  5. _ is used for breathing (a) Ear (b) Eyes (c) Nose

  6. How many eyes do you have? (a) 4 (b) 1 (c) 2

  7. The capital of Ameria is _________

  8. The capital of China is _________
  
  9. The capital of Nigeria is _________
  """

  let the questions be numbered
  sections may have subsections, with headings, instructions for the questions that follow perhaps, or passages, or just such parts that are not really questions in themselves, e.g "Write the short form of the following words". Add such parts as unnumbered questions, except for mainsections A, B and C.

  Text to create quiz from:
  """
  ${t}
  """
  `);

    const responseText = result.response.text();
    return responseText;
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
    quizContent = JSON.parse(q);
  } catch (error) {
    console.error(`Error parsing quiz content: ${error.message}`);
    throw error;
  }

  // Get grade number and create json folder path
  const gradeNum = Object.keys(grades).find(key => grades[key] === g);
  const jsonDir = `./files/output/g${gradeNum}/json`;
  const answersDir = `./files/output/g${gradeNum}/answers`;

  // Create directories if they don't exist
  [jsonDir, answersDir].forEach(dir => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  });

  // Use abbreviated filename
  const abbreviatedSubject = subjectAbbreviations[s] || s.toLowerCase();
  
  // Save the quiz JSON data
  const jsonPath = `${jsonDir}/${abbreviatedSubject}.json`;
  writeFileSync(jsonPath, JSON.stringify(quizContent, null, 2));
  console.log(`Saved quiz JSON to: ${jsonPath}`);

  // Save answers to text file
  const answersPath = `${answersDir}/${abbreviatedSubject}.txt`;
  const answersContent = [
    'Section A (Objective) Answers:',
    ...quizContent.answers_A.map((answer, i) => `${i + 1}. ${answer}`),
    '',
    'Section B (Short Answer) Answers:',
    ...quizContent.answers_B.map((answer, i) => `${i + 1}. ${answer}`),
  ].join('\n');
  writeFileSync(answersPath, answersContent);
  console.log(`Saved answers to: ${answersPath}`);

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
        children: [
          ...quizContent.A.map((question) =>
            new Paragraph({
              children: [new TextRun(question)],
              spacing: { after: 9 }
            })
          ),
          // Section B
          new Paragraph({
            children: [new TextRun("Section B")],
            spacing: { after: 9, before: 54 }
          }),
          ...quizContent.B.map((question) =>
            new Paragraph({
              children: [new TextRun(question)],
              spacing: { after: 9 }
            })
          ),
          // Section C
          new Paragraph({
            children: [new TextRun("Section C")],
            spacing: { after: 9, before: 54 }
          }),
          ...quizContent.C.map((question) =>
            new Paragraph({
              children: [new TextRun(question)],
              spacing: { after: 9 }
            })
          )
        ],
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
  // Get the grade number from the grade name
  const gradeNum = Object.keys(grades).find(key => grades[key] === g);
  const abbreviatedSubject = subjectAbbreviations[s] || s.toLowerCase();
  
  if (!t) { // If no content was provided, try to find it
    // Check for existing JSON data first
    const jsonPath = `./files/input/${gradeNum}.json`;
    if (existsSync(jsonPath)) {
      try {
        const jsonData = JSON.parse(readFileSync(jsonPath, "utf8"));
        const subjectData = jsonData.find(exam => exam.subject === s);
        
        if (subjectData) {
          t = subjectData.content;
        }
      } catch (error) {
        console.log(`Warning: Error reading JSON data: ${error.message}`);
      }
    }

    // If still no content, check the subject-specific file
    if (!t) {
      const subjectFilePath = `./files/input/${gradeNum}/${abbreviatedSubject}`;
      if (existsSync(subjectFilePath)) {
        try {
          t = readFileSync(subjectFilePath, "utf8");
          console.log(`Found quiz content in: ${subjectFilePath}`);
        } catch (error) {
          throw new Error(`Error reading subject file: ${error.message}`);
        }
      } else {
        throw new Error(`No content found for subject ${s} in grade ${gradeNum}. Checked:\n- ${jsonPath}\n- ${subjectFilePath}`);
      }
    }
  }

  const doc = await generateDoc({ g, t, s });
  const outputPath = `./files/output/g${gradeNum}/${abbreviatedSubject}.docx`;

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

// Change generateMultipleQuizzes function to use simplified paths
async function generateMultipleQuizzes({ g }) {
  // Get grade number for paths
  const gradeNum = Object.keys(grades).find(key => grades[key] === g);
  const jsonPath = `./files/input/${gradeNum}.json`;
  const outputDir = `./files/output/g${gradeNum}`;
  const jsonDir = `${outputDir}/json`;
  const answersDir = `${outputDir}/answers`;

  // Ensure directories exist
  [outputDir, jsonDir, answersDir].forEach(dir => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  });

  // Check if the JSON file exists
  if (!existsSync(jsonPath)) {
    throw new Error(`No JSON file found for grade ${gradeNum} at ${jsonPath}`);
  }

  // Read and parse the JSON file
  try {
    const exams = JSON.parse(readFileSync(jsonPath, "utf8"));
    console.log(`Found ${exams.length} exams to generate`);

    for (const { subject: s, content: t } of exams) {
      console.log(`Generating quiz for ${s}...`);

      // Generate the quiz
      const quiz = await createSingleQuiz({ t });
      const quizContent = JSON.parse(quiz);

      // Save the quiz JSON data
      const abbreviatedSubject = subjectAbbreviations[s] || s.toLowerCase();
      const jsonPath = `${jsonDir}/${abbreviatedSubject}.json`;
      writeFileSync(jsonPath, JSON.stringify(quizContent, null, 2));
      console.log(`Saved quiz JSON to: ${jsonPath}`);

      // Save answers to text file
      const answersPath = `${answersDir}/${abbreviatedSubject}.txt`;
      const answersContent = [
        'Section A (Objective) Answers:',
        ...quizContent.answers_A.map((answer, i) => `${i + 1}. ${answer}`),
        '',
        'Section B (Short Answer) Answers:',
        ...quizContent.answers_B.map((answer, i) => `${i + 1}. ${answer}`),
      ].join('\n');
      writeFileSync(answersPath, answersContent);
      console.log(`Saved answers to: ${answersPath}`);

      // Generate Word document
      const doc = await generateDoc({ g, t, s });
      const outputPath = `${outputDir}/${abbreviatedSubject}.docx`;
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
  } catch (error) {
    throw new Error(`Error processing JSON file: ${error.message}`);
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

// Add helper function to get subject from abbreviation
function getSubjectFromAbbreviation(abbr) {
  abbr = abbr.toLowerCase();
  for (const [subject, abbreviation] of Object.entries(subjectAbbreviations)) {
    if (abbreviation === abbr) {
      return subject;
    }
  }
  return null;
}

async function main() {
  try {
    const mode = await new Promise((resolve) => {
      rl.question(
        "Select mode: (1) single quiz (2) multiple quizzes (3) create answers: ",
        (answer) => resolve(answer),
      );
    });

    if (mode === "3") {
      // Grade selection
      const gradeSelection = await new Promise((resolve) => {
        console.log("Which grade?");
        Object.keys(grades).forEach(key => {
          console.log(`${key}. Grade ${grades[key]}`);
        });

        rl.question("Enter grade number (1-5): ", (answer) => {
          const gradeNum = parseInt(answer);
          if (!isNaN(gradeNum) && grades[gradeNum]) {
            resolve(gradeNum);
          } else {
            console.log("Invalid grade. Defaulting to 1");
            resolve(1);
          }
        });
      });

      // Subject selection by abbreviation
      const subjectAbbr = await new Promise((resolve) => {
        console.log("\nAvailable subjects (use abbreviation to select):");
        Object.entries(subjectAbbreviations).forEach(([subject, abbr]) => {
          console.log(`${abbr}: ${subject}`);
        });

        const promptForSubject = () => {
          rl.question("\nEnter subject abbreviation: ", (answer) => {
            const trimmedAnswer = answer.trim().toLowerCase();
            if (!trimmedAnswer) {
              console.log("Subject abbreviation cannot be empty. Please try again.");
              promptForSubject();
              return;
            }
            if (!Object.values(subjectAbbreviations).includes(trimmedAnswer)) {
              console.log("Invalid subject abbreviation. Please try again.");
              promptForSubject();
              return;
            }
            resolve(trimmedAnswer);
          });
        };
        
        promptForSubject();
      });

      // Read quiz JSON
      const jsonPath = `./files/output/g${gradeSelection}/json/${subjectAbbr}.json`;
      if (!existsSync(jsonPath)) {
        throw new Error(`Quiz JSON not found: ${jsonPath}`);
      }

      const quiz = JSON.parse(readFileSync(jsonPath, 'utf8'));

      // Generate answers using Gemini
      const answerModel = genAI.getGenerativeModel({
        model: "gemini-2.0-pro-exp-02-05",  // Updated to correct model name
        generationConfig: {
          temperature: 0,
          topP: 1,
          topK: 1,
          maxOutputTokens: 2048,
        }
      });

      // Create prompt for answers
      let prompt = "Answer these questions accurately and concisely:\n\n";
      
      // Add Section A questions
      prompt += "Section A:\n";
      quiz.A.forEach((q, i) => {
        prompt += `${i + 1}. ${q}\n`;
      });

      // Add Section B questions if they exist
      if (quiz.B && quiz.B.length > 0) {
        prompt += "\nSection B:\n";
        quiz.B.forEach((q, i) => {
          prompt += `${i + 1}. ${q}\n`;
        });
      }

      try {
        const result = await answerModel.generateContent(prompt);
        const responseText = result.response.text();
        
        // Save answers to file
        const answersPath = `./files/output/g${gradeSelection}/answers/${subjectAbbr}.txt`;
        writeFileSync(answersPath, responseText);
        console.log(`Answers saved to: ${answersPath}`);

        // Run git commands
        await runGitCommands();
      } catch (error) {
        console.error(`Error generating answers: ${error.message}`);
        throw error;
      }

    } else if (mode === "1") {
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

      // Subject selection by abbreviation
      const subject = await new Promise((resolve) => {
        // Show available subjects and their abbreviations
        console.log("\nAvailable subjects (use abbreviation to select):");
        Object.entries(subjectAbbreviations).forEach(([subject, abbr]) => {
          console.log(`${abbr}: ${subject}`);
        });

        rl.question("\nEnter subject abbreviation: ", (answer) => {
          const selectedSubject = getSubjectFromAbbreviation(answer.trim());
          if (selectedSubject) {
            resolve(selectedSubject);
          } else {
            console.log("Invalid subject abbreviation. Please try again.");
            rl.question("Enter subject abbreviation: ", (retryAnswer) => {
              const retrySubject = getSubjectFromAbbreviation(retryAnswer.trim());
              if (retrySubject) {
                resolve(retrySubject);
              } else {
                console.log("Invalid subject abbreviation again. Defaulting to Math.");
                resolve("Math");
              }
            });
          }
        });
      });

      // Check for existing JSON data first
      const gradeNum = Object.keys(grades).find(key => grades[key] === gradeSelection);
      const jsonPath = `./files/input/${gradeNum}.json`;

      console.log("Generating single quiz...");
      await generateSingleQuiz({
        g: gradeSelection,
        t: null,
        s: subject,
      });

    } else if (mode === "2") {
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
      await generateMultipleQuizzes({ g: gradeSelection });
    } else {
      throw new Error("Invalid mode selection");
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    if (!rl.closed) {
      rl.close();
    }
  }
}

main();