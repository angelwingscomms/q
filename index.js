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
  const result =
    await singleQuizModel.generateContent(`Perfectly following the format of the first quiz, edit the second quiz while retaining all questions.
Rephrase each question to maintain the same meaning, tone, and English language level as the original, but improve grammar and clarity.
Within each section (objective, Section B, Section C), randomize the order of questions while keeping them within their respective sections.
Make all concise.

For objective questions:
- Replace multiple blanks (e.g., "_____") with a single underscore (e.g., "_")
- Never end with a full stop
- Use brackets for options (e.g., (a)...) and place questions and options on same line
- Fix bad questions by removing or replacing options to ensure one correct answer
- Questions may end with question marks

For Section B and C:
- Keep original blank format (_________)
- Maintain the original simple English level

Respond with ONLY the edited version of the second quiz as plain text

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
  return result.response.text();
}

async function generateDoc({ g, t, s }) {
  const q = await createSingleQuiz({ t });
  const { patchDocument, PatchType, TextRun } = require("docx");
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
        type: PatchType.PARAGRAPH,
        children: JSON.parse(q).reduce((acc, e) => {
          acc.push(new TextRun(e));
          acc.push(new TextRun({ break: 1 }));
          acc.push(new TextRun({ break: 1 }));
          return acc;
        }, []),
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

  const parsedFilePath = `./files/input/parsed/${file}.json`;
  let exams;

  if (existsSync(parsedFilePath)) {
    console.log(`Using cached parsed data from ${parsedFilePath}`);
    exams = JSON.parse(readFileSync(parsedFilePath, "utf8"));
  } else {
    console.log("Parsing exams...");
    exams = JSON.parse(
      (
        await multiQuizModel.generateContent(
          `return a JSON array of EACH AND EVERY exam given, where each exam object has 'subject' and 'content', the subject being that exam's subject, and the content being the exam's content as a string. Use exactly these subjects were relevant: ${JSON.stringify(subjects)}
                Include EVERY subject.
                The exams:
                ${c}
                `,
        )
      ).response.text(),
    );

    writeFileSync(parsedFilePath, JSON.stringify(exams, null, 2));
    console.log(`Saved parsed exams to ${parsedFilePath}`);
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
    
    await new Promise((r) => setTimeout(r, 54000));
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