const { GoogleGenerativeAI } = require("@google/generative-ai");
//const { SchemaType } = require("@google/generative-ai/server");
//const { patchDocument, PatchType, TextRun } = require("docx");
const {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
} = require("fs");
const readline = require("readline");
const path = require("path");
const { exec } = require("child_process");
require("dotenv").config();

const { ext } = require("./ext.mjs");

const G = process.env.GEMINI || "AIzaSyDTEmZHoCBO8QQ_zk3ecByY31waTm9srsQ";
const genAI = new GoogleGenerativeAI(G);
const grades = {
  1: "ONE",
  2: "TWO",
  3: "THREE",
  4: "FOUR",
  5: "FIVE",
};

const subjectAbbreviations = {
  Math: "m",
  "English Language": "e",
  "Basic Science and Technology": "bst",
  Computer: "c",
  History: "h",
  "Physical and Health Education": "phe",
  "National Values": "nv",
  "Cultural and Creative Arts": "cca",
  "PreVocational Studies": "pvs",
  French: "f",
  "Religious Studies": "rs",
  Music: "ms",
  "Civic Education": "ce",
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
  "Religious Studies",
  "Music",
];

// Map subjects to their abbreviations
5;

// Map grade names to todolist section names
const gradeToSectionMap = {
  ONE: "g1",
  TWO: "g2",
  THREE: "g3",
  FOUR: "g4",
  FIVE: "g5",
};

// Function to update todolist-data.json
function updateTodolistData(subject, grade) {
  const todolistDataPath = path.join(__dirname, "todolist-data.json");

  // Check if todolist-data.json exists
  if (!existsSync(todolistDataPath)) {
    console.log("todolist-data.json not found. No update performed.");
    return;
  }

  try {
    // Read the current todolist data
    const todoData = JSON.parse(readFileSync(todolistDataPath, "utf8"));

    // Map the grade to the corresponding section
    const section = gradeToSectionMap[grade];

    // If the section is not mapped, log a warning and return
    if (!section) {
      console.log(
        `Warning: Grade ${grade} does not map to a known section. No update performed.`,
      );
      return;
    }

    // Check if the subject exists in the todolist data
    if (todoData[subject] && todoData[subject][section]) {
      // Update the 'done' status to true
      todoData[subject][section].done = true;

      // Write the updated data back to the file
      writeFileSync(todolistDataPath, JSON.stringify(todoData, null, 2));
      console.log(
        `Updated todolist-data.json: Marked ${subject} (${section}) as done.`,
      );
    } else {
      console.log(
        `Warning: Subject ${subject} or section ${section} not found in todolist data.`,
      );
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
  model: "gemini-2.5-flash-preview-05-20",
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
          description: "Section A: Objective questions",
        },
        B: {
          type: "ARRAY",
          items: { type: "STRING" },
          description:
            "Section B: Short answer questions (if a Section B is specified in the source text)",
        },
        C: {
          type: "ARRAY",
          items: { type: "STRING" },
          description:
            "Section C: Theory questions (if a Section C is specified in the source text)",
        },
        answers_A: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Answers for Section A objective questions",
        },
        answers_B: {
          type: "ARRAY",
          items: { type: "STRING" },
          description:
            "Answers for Section B short answer questions (if a Section B is specified in the source text)",
        },
        answers_C: {
          type: "ARRAY",
          items: { type: "STRING" },
          description:
            "Answers for Section C theory questions (if a Section C is specified in the source text)",
        },
      },
      required: ["A", "answers_A"],
    },
  },
});

async function createMidtermQuiz({ t, subject, grade }) {
  try {
    const gradeNum = Object.keys(grades).find((key) => grades[key] === grade);
    const examplePath = `./files/examples/${gradeNum}.json`;

    let exampleQuizPrompt = "";
    if (existsSync(examplePath)) {
      const exampleQuizJson = readFileSync(examplePath, "utf8");
      exampleQuizPrompt = `Here's an example quiz for Religious Studies for year ${grade}:\n\`\`\`json\n${exampleQuizJson}\n\`\`\`\n`;
    }

    let final_prompt = `
        Create a quiz with:
 Section A.

        Each section should be an array of strings containing the questions for that section.

        Section A should contain objective questions (multiple choice).

 IMPORTANT: Provide answers for all questions in Section A in the corresponding answers_A array.

        Format requirements:

        For Section A (objective questions):
        - Never end with a full stop
        - Use 1 underscore (_) for blanks
        - Never end a question with a blank
        - Use brackets for options (e.g., (a)...(b)...(c)...) and place questions and options on same line
        - Fix bad questions by removing or replacing options to ensure one correct answer
        - Questions may end with question marks
        - For answers_A, provide only the letter of the correct option (a, b, c, etc.) or the word that fills the blank

        examples:
        """
        1. When you take care of your body you will look attractive (a) True (b) False

        2. How many noses do you have? (a) 2 (b) 1 (c) 3

        3. How many nostrils do you have? (a) 1 (b) 2 (c) 3

        4. The two holes in your nose are called (a) Nose holes (b) Nostrils (c) Nose cover

        5. _ is used for breathing (a) Ear (b) Eyes (c) Nose

        6. How many eyes do you have? (a) 4 (b) 1 (c) 2
        """

 make sure the questions are very easy to answer, and for the essay part, make sure the questions are so easy they would require easy to write, brief answers
 let the questions be numbered.
 A section may have subsections, with headings, instructions for the questions that follow perhaps, or passages, or just such parts that are not really questions in themselves, e.g "Write the short form of the following words". Add such part or subheading or instruction as unnumbered questions, except for main Section A.

        Text to create quiz from:
  """
  ${t}
  """
  `;

    writeFileSync("./files/final_prompt.md", final_prompt);
    const result = await singleQuizModel.generateContent(final_prompt);

    const responseText = result.response.text();
    return responseText;
  } catch (error) {
    console.error(`Error in createMidtermQuiz: ${error.message}`);
    throw error;
  }
}

async function createEndOfTermQuiz({ t, selectedClass, subject, grade }) {
  try {
    const gradeNum = Object.keys(grades).find((key) => grades[key] === grade);
    const extpath = `./files/ext-prompt/${gradeNum}.md`;

    let extprompt = "";
    if (existsSync(extpath)) {
      extprompt = readFileSync(extpath, "utf8");
      // exampleQuizPrompt = `Here's an example quiz for ${subject} for year ${grade}:\n\`\`\`json\n${exampleQuizJson}\n\`\`\`\n`;
    }

    let obj = 0;
    const sa = 5;
    const essay = 5;

    if (selectedClass === "ONE" || selectedClass === "TWO") {
      obj = 20;
    } else if (selectedClass === "THREE") {
      obj = 30;
    } else if (selectedClass === "FOUR") {
      obj = 40;
    } else if (selectedClass === "FIVE") {
      obj = 50;
    } else {
      obj = 0; // For Pre-Nursery, Nursery 1/2, Foundation
    }

    let extra_instructions = `Let section A contain exactly ${obj} objective questions. Let section B contain exactly ${sa} short-answer questions. Let section C contain exactly ${essay} essay/theory questions.`;

    const final_prompt = `
Create a quiz with:
Section A, Section B, and Section C.

Each section should be an array of strings containing the questions for that section.

Section A should contain objective questions (multiple choice).
Section B should contain short answer questions.
Section C should contain essay/theory questions.
IMPORTANT: Provide answers for all questions in each section in the corresponding answers_A, answers_B, and answers_C arrays.

Format requirements:

# For Section A (objective questions):
- Never end with a full stop
- Use 1 underscore (_) for blanks
- Never end a question with a blank
- Use brackets for options (e.g., (a)...(b)...(c)...) and place questions and options on same line
- Fix bad questions by removing or replacing options to ensure one correct answer
- Questions may end with question marks
- For answers_A, provide only the letter of the correct option (a, b, c, etc.) or the word that fills the blank

- ${ext[1].a}

# For Section B (short answer questions):
- Use 9 underscores (_________) for blanks
- For answers_B, provide concise answers

- ${ext[1].b}

# For Section C (essay questions):
- Make questions clear and concise
- Maintain academic language level
- For answers_C, provide brief model answers or key points

- ${ext[1].c}

let the questions be numbered.
refrain from mentioning or referencing the source text that the quiz is made from. Never say something like "according to the text" or "from the text"
A section may have subsections, with headings, instructions for the questions that follow perhaps, or passages, or just such parts that are not really questions in themselves, e.g "Write the short form of the following words". Add such part or subheading or instruction as unnumbered questions, except for main Section A.
${extra_instructions}

Text to create quiz from:
  """
  ${t}
 """
  `;
    writeFileSync("./files/final_prompt.md", final_prompt);
    const result = await singleQuizModel.generateContent(final_prompt);

    const responseText = result.response.text();
    return responseText;
  } catch (error) {
    console.error(`Error in createSingleQuiz: ${error.message}`);
    throw error;
  }
}

async function generateDoc({ g, t, s, examType }) {
  const q =
    examType === "Midterm"
      ? await createMidtermQuiz({ t, subject: s, grade: g })
      : await createEndOfTermQuiz({
          t,
          selectedClass: g,
          subject: s,
          grade: g,
        });
  const { patchDocument, PatchType, TextRun, Paragraph } = require("docx");

  let quizContent;
  try {
    quizContent = JSON.parse(q);

    // Validate that required sections exist
    if (
      !quizContent.A ||
      !Array.isArray(quizContent.A) ||
      quizContent.A.length === 0
    ) {
      throw new Error("Section A is missing or empty in quiz content");
    }

    if (!quizContent.answers_A || !Array.isArray(quizContent.answers_A)) {
      console.warn(
        "Section A answers are missing or not an array. Creating empty array.",
      );
      quizContent.answers_A = [];
    }

    // Initialize empty arrays for missing sections
    if (!quizContent.B || !Array.isArray(quizContent.B)) {
      console.log(
        "Section B is not present in the response, initializing as empty array",
      );
      quizContent.B = [];
    }

    if (!quizContent.C || !Array.isArray(quizContent.C)) {
      console.log(
        "Section C is not present in the response, initializing as empty array",
      );
      quizContent.C = [];
    }

    if (!quizContent.answers_B || !Array.isArray(quizContent.answers_B)) {
      console.log(
        "Section B answers are not present in the response, initializing as empty array",
      );
      quizContent.answers_B = [];
    }

    if (!quizContent.answers_C || !Array.isArray(quizContent.answers_C)) {
      console.log(
        "Section C answers are not present in the response, initializing as empty array",
      );
      quizContent.answers_C = [];
    }
  } catch (error) {
    console.error(`Error parsing quiz content: ${error.message}`);
    throw error;
  }

  // Get grade number and create json folder path
  const gradeNum = Object.keys(grades).find((key) => grades[key] === g);
  const jsonDir = `./files/output/g${gradeNum}/json`;
  const answersDir = `./files/output/g${gradeNum}/answers`;

  // Create directories if they don't exist
  [jsonDir, answersDir].forEach((dir) => {
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
    "Section A (Objective) Answers:",
    ...quizContent.answers_A.map((answer, i) => `${i + 1}. ${answer}`),
    ...(quizContent.answers_B && quizContent.answers_B.length > 0
      ? [
          "",
          "Section B (Short Answer) Answers:",
          ...quizContent.answers_B.map((answer, i) => `${i + 1}. ${answer}`),
        ]
      : []),
    ...(quizContent.answers_C && quizContent.answers_C.length > 0
      ? [
          "",
          "Section C (Theory) Answers:",
          ...quizContent.answers_C.map((answer, i) => `${i + 1}. ${answer}`),
        ]
      : []),
  ].join("\n");
  writeFileSync(answersPath, answersContent);
  console.log(`Saved answers to: ${answersPath}`);

  const doc = await patchDocument({
    data: readFileSync(
      `./files/template${g === "ONE" || "TWO" ? "-cc" : ""}.docx`,
    ),
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
          ...quizContent.A.map(
            (question) =>
              new Paragraph({
                children: [new TextRun(question)],
                spacing: { after: 9 },
              }),
          ),
          // Section B - only include if it has content
          ...(quizContent.B && quizContent.B.length > 0
            ? [
                new Paragraph({
                  children: [new TextRun("Section B")],
                  spacing: { after: 9, before: 54 },
                }),
                ...quizContent.B.map(
                  (question) =>
                    new Paragraph({
                      children: [new TextRun(question)],
                      spacing: { after: 9 },
                    }),
                ),
              ]
            : []),
          // Section C - only include if it has content
          ...(quizContent.C && quizContent.C.length > 0
            ? [
                new Paragraph({
                  children: [new TextRun("Section C")],
                  spacing: { after: 9, before: 54 },
                }),
                ...quizContent.C.map(
                  (question) =>
                    new Paragraph({
                      children: [new TextRun(question)],
                      spacing: { after: 9 },
                    }),
                ),
              ]
            : []),
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
    exec(
      'git add .; git commit --allow-empty -m "Add new quiz"; git push',
      (error, stdout, stderr) => {
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
      },
    );
  });
}

async function generateSingleQuiz({ g, t, s }) {
  // Get the grade number from the grade name
  const gradeNum = Object.keys(grades).find((key) => grades[key] === g);
  const abbreviatedSubject = subjectAbbreviations[s] || s.toLowerCase();

  if (!t) {
    // If no content was provided, try to find it
    // Check for existing JSON data first
    const jsonPath = `./files/input/${gradeNum}.json`;
    if (existsSync(jsonPath)) {
      try {
        const jsonData = JSON.parse(readFileSync(jsonPath, "utf8"));
        const subjectData = jsonData.find((exam) => exam.subject === s);

        if (subjectData) {
          t = subjectData.content;
        }
      } catch (error) {
        console.log(`Warning: Error reading JSON data: ${error.message}`);
      }
    }

    // If still no content, check the subject-specific file
    if (!t) {
      const subjectFilePath = `./files/input/${gradeNum}/${abbreviatedSubject}.md`;
      if (existsSync(subjectFilePath)) {
        try {
          t = readFileSync(subjectFilePath, "utf8");
          console.log(`Found quiz content in: ${subjectFilePath}`);
        } catch (error) {
          throw new Error(`Error reading subject file: ${error.message}`);
        }
      } else {
        throw new Error(
          `No content found for subject ${s} in grade ${gradeNum}. Checked:\n- ${jsonPath}\n- ${subjectFilePath}`,
        );
      }
    }
  }

  const doc = await generateDoc({ g, t, s, examType: "Single Quiz" }); // Assuming single quiz is treated as End of Term for now. Will need clarification.
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
async function generateMultipleQuizzes({ g, skipExisting = false, examType }) {
  // Get grade number for paths
  const gradeNum = Object.keys(grades).find((key) => grades[key] === g);
  const jsonPath = `./files/input/${gradeNum}.json`;
  const folderPath = `./files/input/${gradeNum}`;
  const outputDir = `./files/output/g${gradeNum}`;
  const jsonDir = `${outputDir}/json`;
  const answersDir = `${outputDir}/answers`;

  // Ensure directories exist
  [outputDir, jsonDir, answersDir].forEach((dir) => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  });

  // Check if the JSON file exists
  if (existsSync(jsonPath)) {
    // Process the JSON file
    try {
      const exams = JSON.parse(readFileSync(jsonPath, "utf8"));
      console.log(`Found ${exams.length} exams to generate from JSON file`);

      for (const { subject: s, content: t } of exams) {
        console.log(`Processing quiz for ${s}...`);

        // Check if output files already exist
        const abbreviatedSubject = subjectAbbreviations[s] || s.toLowerCase();
        const outputPath = `${outputDir}/${abbreviatedSubject}.docx`;
        const jsonOutputPath = `${jsonDir}/${abbreviatedSubject}.json`;

        // Skip if files exist and skipExisting is true
        if (
          skipExisting &&
          existsSync(outputPath) &&
          existsSync(jsonOutputPath)
        ) {
          console.log(`Skipping ${s} - output files already exist`);
          continue;
        }

        console.log(`Generating quiz for ${s}...`);

        // Generate the quiz
        const quiz =
          examType === "Midterm"
            ? await createMidtermQuiz({ t })
            : await createEndOfTermQuiz({ t, selectedClass: g });
        const quizContent = JSON.parse(quiz);

        // Save the quiz JSON data
        writeFileSync(jsonOutputPath, JSON.stringify(quizContent, null, 2));
        console.log(`Saved quiz JSON to: ${jsonOutputPath}`);

        // Save answers to text file
        const answersPath = `${answersDir}/${abbreviatedSubject}.txt`;
        const answersContent = [
          "Section A (Objective) Answers:",
          ...quizContent.answers_A.map((answer, i) => `${i + 1}. ${answer}`),
          ...(quizContent.answers_B && quizContent.answers_B.length > 0
            ? [
                "",
                "Section B (Short Answer) Answers:",
                ...quizContent.answers_B.map(
                  (answer, i) => `${i + 1}. ${answer}`,
                ),
              ]
            : []),
          ...(quizContent.answers_C && quizContent.answers_C.length > 0
            ? [
                "",
                "Section C (Theory) Answers:",
                ...quizContent.answers_C.map(
                  (answer, i) => `${i + 1}. ${answer}`,
                ),
              ]
            : []),
        ].join("\n");
        writeFileSync(answersPath, answersContent);
        console.log(`Saved answers to: ${answersPath}`);

        // Generate Word document
        const doc = await generateDoc({ g, t, s, examType });
        writeFileSync(outputPath, doc);
        console.log(`Generated: ${outputPath}`);

        // Update todolist-data.json after generating each quiz
        updateTodolistData(s, g);

        // Removed git commands from here

        await new Promise((r) => setTimeout(r, 27000));
      }
    } catch (error) {
      throw new Error(`Error processing JSON file: ${error.message}`);
    }
  }
  // Check for a folder with the grade number
  else if (existsSync(folderPath) && readdirSync(folderPath).length > 0) {
    const files = readdirSync(folderPath);
    console.log(`Found ${files.length} files in folder ${folderPath}`);

    for (const file of files) {
      // Use the filename as the subject code
      const subjectCode = file;

      // Look up the full subject name from the abbreviation
      let subject = getSubjectFromAbbreviation(subjectCode);

      // If no match found, use the subject code as is
      if (!subject) {
        console.log(
          `Warning: No matching subject found for code '${subjectCode}'. Using code as subject name.`,
        );
        subject = subjectCode;
      }

      console.log(`Processing quiz for ${subject} (code: ${subjectCode})...`);

      // Check if output files already exist
      const outputPath = `${outputDir}/${subjectCode}.docx`;
      const jsonOutputPath = `${jsonDir}/${subjectCode}.json`;

      // Skip if files exist and skipExisting is true
      if (
        skipExisting &&
        existsSync(outputPath) &&
        existsSync(jsonOutputPath)
      ) {
        console.log(
          `Skipping ${subject} (code: ${subjectCode}) - output files already exist`,
        );
        continue;
      }

      console.log(`Generating quiz for ${subject} (code: ${subjectCode})...`);

      try {
        // Read the file content
        const filePath = path.join(folderPath, file);
        const content = readFileSync(filePath, "utf8");

        // Generate the quiz
        const quiz =
          examType === "Midterm"
            ? await createMidtermQuiz({ t: content })
            : await createEndOfTermQuiz({ t: content, selectedClass: g });
        const quizContent = JSON.parse(quiz);

        // Save the quiz JSON data
        writeFileSync(jsonOutputPath, JSON.stringify(quizContent, null, 2));
        console.log(`Saved quiz JSON to: ${jsonOutputPath}`);

        // Save answers to text file
        const answersPath = `${answersDir}/${subjectCode}.txt`;
        const answersContent = [
          "Section A (Objective) Answers:",
          ...quizContent.answers_A.map((answer, i) => `${i + 1}. ${answer}`),
          ...(quizContent.answers_B && quizContent.answers_B.length > 0
            ? [
                "",
                "Section B (Short Answer) Answers:",
                ...quizContent.answers_B.map(
                  (answer, i) => `${i + 1}. ${answer}`,
                ),
              ]
            : []),
          ...(quizContent.answers_C && quizContent.answers_C.length > 0
            ? [
                "",
                "Section C (Theory) Answers:",
                ...quizContent.answers_C.map(
                  (answer, i) => `${i + 1}. ${answer}`,
                ),
              ]
            : []),
        ].join("\n");
        writeFileSync(answersPath, answersContent);
        console.log(`Saved answers to: ${answersPath}`);

        // Generate Word document
        const doc = await generateDoc({ g, t: content, s: subject, examType });
        writeFileSync(outputPath, doc);
        console.log(`Generated: ${outputPath}`);

        // Update todolist-data.json after generating each quiz
        updateTodolistData(subject, g);

        // Removed git commands from here

        await new Promise((r) => setTimeout(r, 27000));
      } catch (error) {
        console.error(`Error processing file ${file}: ${error.message}`);
        continue; // Continue with next file even if this one fails
      }
    }
  } else {
    throw new Error(
      `No data found for grade ${gradeNum}. Looked in:\n- ${jsonPath}\n- ${folderPath}`,
    );
  }

  // Run git commands once after all quizzes have been generated
  try {
    console.log("Running git commands for all generated quizzes...");
    await runGitCommands();
  } catch (error) {
    console.error("Failed to run git commands:", error);
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

async function generateAllAnswers({ gradeNum, redoExisting = false }) {
  const jsonDir = `./files/output/g${gradeNum}/json`;
  const answersDir = `./files/output/g${gradeNum}/answers`;

  // Ensure directories exist
  if (!existsSync(jsonDir)) {
    throw new Error(`JSON directory not found: ${jsonDir}`);
  }
  if (!existsSync(answersDir)) {
    mkdirSync(answersDir, { recursive: true });
  }

  // Get all JSON files
  const files = readdirSync(jsonDir).filter((file) => file.endsWith(".json"));
  console.log(`Found ${files.length} quiz files in grade ${gradeNum}`);

  // Generate answers using Gemini
  const answerModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-preview-05-20", // Updated model name
    generationConfig: {
      temperature: 0,
      topP: 1,
      topK: 1,
      maxOutputTokens: 2048,
    },
  });

  for (const file of files) {
    const subjectAbbr = file.replace(".json", "");
    const answerPath = `${answersDir}/${subjectAbbr}.txt`;

    // Skip if answer exists and we're not redoing
    if (!redoExisting && existsSync(answerPath)) {
      console.log(`Skipping ${subjectAbbr} - answer file already exists`);
      continue;
    }

    console.log(`Processing ${subjectAbbr}...`);

    try {
      // Read quiz JSON
      const quiz = JSON.parse(readFileSync(`${jsonDir}/${file}`, "utf8"));

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

      const result = await answerModel.generateContent(prompt);
      const responseText = result.response.text();

      // Save answers to file
      writeFileSync(answerPath, responseText);
      console.log(`Answers saved to: ${answerPath}`);

      // Wait a bit between requests to avoid rate limiting
      await new Promise((r) => setTimeout(r, 2000));
    } catch (error) {
      console.error(`Error processing ${subjectAbbr}: ${error.message}`);
      continue;
    }
  }

  // Run git commands after all answers are generated
  try {
    await runGitCommands();
  } catch (error) {
    console.error("Failed to run git commands:", error);
  }
}

async function generateAnswersForAllGrades(redoExisting = false) {
  // Process each grade
  for (const [gradeNum, gradeName] of Object.entries(grades)) {
    console.log(`\nProcessing Grade ${gradeName}...`);

    const jsonDir = `./files/output/g${gradeNum}/json`;
    const answersDir = `./files/output/g${gradeNum}/answers`;

    // Skip if JSON directory doesn't exist
    if (!existsSync(jsonDir)) {
      console.log(`Skipping Grade ${gradeName} - no JSON directory found`);
      continue;
    }

    // Ensure answers directory exists
    if (!existsSync(answersDir)) {
      mkdirSync(answersDir, { recursive: true });
    }

    // Get all JSON files
    const files = readdirSync(jsonDir).filter((file) => file.endsWith(".json"));
    console.log(`Found ${files.length} quiz files in Grade ${gradeName}`);

    // Generate answers using Gemini
    const answerModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-05-20",
      generationConfig: {
        temperature: 0,
        topP: 1,
        topK: 1,
        maxOutputTokens: 2048,
      },
    });

    for (const file of files) {
      const subjectAbbr = file.replace(".json", "");
      const answerPath = `${answersDir}/${subjectAbbr}.txt`;

      // Skip if answer exists and we're not redoing
      if (!redoExisting && existsSync(answerPath)) {
        console.log(`Skipping ${subjectAbbr} - answer file already exists`);
        continue;
      }

      console.log(`Processing ${subjectAbbr}...`);

      try {
        // Read quiz JSON
        const quiz = JSON.parse(readFileSync(`${jsonDir}/${file}`, "utf8"));

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

        const result = await answerModel.generateContent(prompt);
        const responseText = result.response.text();

        // Save answers to file
        writeFileSync(answerPath, responseText);
        console.log(`Answers saved to: ${answerPath}`);

        // Wait a bit between requests to avoid rate limiting
        await new Promise((r) => setTimeout(r, 2000));
      } catch (error) {
        console.error(`Error processing ${subjectAbbr}: ${error.message}`);
        continue;
      }
    }
  }

  // Run git commands after all answers are generated
  try {
    await runGitCommands();
  } catch (error) {
    console.error("Failed to run git commands:", error);
  }
}

async function generateAllQuizzesAllGrades({ examType, skipExisting = false }) {
  console.log(`Starting to generate ${examType} quizzes for all grades...`);

  // First, scan all grades for existing quizzes
  if (skipExisting) {
    console.log("\nScanning for existing quizzes...");
    let totalExisting = 0;

    for (const gradeNum of Object.keys(grades)) {
      const gradeName = grades[gradeNum];
      const jsonDir = `./files/output/g${gradeNum}/json`;

      if (existsSync(jsonDir)) {
        const existingFiles = readdirSync(jsonDir).filter((f) =>
          f.endsWith(".json"),
        );
        if (existingFiles.length > 0) {
          console.log(
            `  Grade ${gradeName}: ${existingFiles.length} existing quizzes (${existingFiles.join(", ")})`,
          );
          totalExisting += existingFiles.length;
        } else {
          console.log(`  Grade ${gradeName}: no existing quizzes`);
        }
      } else {
        console.log(`  Grade ${gradeName}: no output directory yet`);
      }
    }

    console.log(`\nTotal existing quizzes found: ${totalExisting}`);
    console.log(
      skipExisting
        ? "Will skip existing files.\n"
        : "Will overwrite existing files.\n",
    );
  }

  const gradeKeys = Object.keys(grades);
  const totalGrades = gradeKeys.length;
  let processedGrades = 0;

  for (const gradeNum of gradeKeys) {
    const gradeName = grades[gradeNum];
    processedGrades++;

    console.log(
      `\n=== Processing Grade ${gradeName} (${gradeNum}) [${processedGrades}/${totalGrades}] ===`,
    );

    // Check what subjects are available for this grade
    const jsonPath = `./files/input/${gradeNum}.json`;
    const folderPath = `./files/input/${gradeNum}`;

    let subjectCount = 0;
    if (existsSync(jsonPath)) {
      try {
        const exams = JSON.parse(readFileSync(jsonPath, "utf8"));
        subjectCount = exams.length;
        console.log(
          `Found ${subjectCount} subjects in JSON file for Grade ${gradeName}`,
        );
      } catch (error) {
        console.log(
          `Could not read JSON file for Grade ${gradeName}: ${error.message}`,
        );
      }
    } else if (existsSync(folderPath)) {
      const files = readdirSync(folderPath);
      subjectCount = files.length;
      console.log(
        `Found ${subjectCount} subject files in folder for Grade ${gradeName}`,
      );
    } else {
      console.log(`No input data found for Grade ${gradeName}`);
    }

    try {
      await generateMultipleQuizzes({
        g: gradeName,
        skipExisting: skipExisting,
        examType: examType,
      });
      console.log(
        `✓ Completed Grade ${gradeName} (${processedGrades}/${totalGrades})`,
      );
    } catch (error) {
      console.error(`✗ Error processing Grade ${gradeName}: ${error.message}`);
      // Continue with next grade even if this one fails
    }
  }

  console.log("\n=== All grades processing complete ===");
  console.log(`Processed ${totalGrades} grades total.`);
}

async function main() {
  try {
    const mode = await new Promise((resolve) => {
      rl.question(
        "Select mode:\n" +
          "(1) single quiz\n" +
          "(2) multiple quizzes\n" +
          "(3) create answers\n" +
          "(4) create all answers for one grade\n" +
          "(5) create all answers for all grades\n" +
          "(6) multiple quizzes (skip existing)\n" +
          "(7) generate ALL quizzes for ALL grades (overwrite existing)\n" +
          "(8) generate ALL quizzes for ALL grades (skip existing)\n" +
          "Enter your choice: ",
        (answer) => resolve(answer),
      );
    });

    const examTypes = ["Midterm", "End of Term"];
    let selectedExamType = null;

    if (
      mode === "1" ||
      mode === "2" ||
      mode === "6" ||
      mode === "7" ||
      mode === "8"
    ) {
      selectedExamType = await displayMenu(examTypes, "Select exam type:");
    }

    if (mode === "8") {
      console.log(
        "Generating ALL quizzes for ALL grades (skipping existing)...",
      );
      await generateAllQuizzesAllGrades({
        examType: selectedExamType,
        skipExisting: true,
      });
    } else if (mode === "7") {
      console.log(
        "Generating ALL quizzes for ALL grades (overwriting existing)...",
      );
      await generateAllQuizzesAllGrades({
        examType: selectedExamType,
        skipExisting: false,
      });
    } else if (mode === "6") {
      // Grade selection as a menu of numbers
      const gradeSelection = await new Promise((resolve) => {
        console.log("Which grade?");
        Object.keys(grades).forEach((key) => {
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

      console.log("Generating multiple quizzes (skipping existing)...");
      await generateMultipleQuizzes({
        g: gradeSelection,
        skipExisting: true,
        examType: selectedExamType,
      });
    } else if (mode === "5") {
      // Ask about redoing existing answers
      const redoExisting = await new Promise((resolve) => {
        rl.question("Redo existing answers? (y/N): ", (answer) => {
          resolve(answer.toLowerCase() === "y");
        });
      });

      console.log("Generating answers for all grades and subjects...");
      await generateAnswersForAllGrades(redoExisting);
    } else if (mode === "4") {
      // Grade selection
      const gradeSelection = await new Promise((resolve) => {
        console.log("Which grade?");
        Object.keys(grades).forEach((key) => {
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

      // Ask about redoing existing answers
      const redoExisting = await new Promise((resolve) => {
        rl.question("Redo existing answers? (y/N): ", (answer) => {
          resolve(answer.toLowerCase() === "y");
        });
      });

      await generateAllAnswers({ gradeNum: gradeSelection, redoExisting });
    } else if (mode === "3") {
      // Grade selection
      const gradeSelection = await new Promise((resolve) => {
        console.log("Which grade?");
        Object.keys(grades).forEach((key) => {
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
              console.log(
                "Subject abbreviation cannot be empty. Please try again.",
              );
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

      const quiz = JSON.parse(readFileSync(jsonPath, "utf8"));

      // Generate answers using Gemini
      const answerModel = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-preview-05-20", // Updated to correct model name
        generationConfig: {
          temperature: 0,
          topP: 1,
          topK: 1,
          maxOutputTokens: 2048,
        },
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
    } else if (mode === "2") {
      // Grade selection as a menu of numbers
      const gradeSelection = await new Promise((resolve) => {
        console.log("Which grade?");
        Object.keys(grades).forEach((key) => {
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
        g: gradeSelection,
        skipExisting: false,
        examType: selectedExamType,
      });
    } else if (mode === "1") {
      // Grade selection as a menu of numbers
      const gradeSelection = await new Promise((resolve) => {
        console.log("Which grade?");
        Object.keys(grades).forEach((key) => {
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
              const retrySubject = getSubjectFromAbbreviation(
                retryAnswer.trim(),
              );
              if (retrySubject) {
                resolve(retrySubject);
              } else {
                console.log(
                  "Invalid subject abbreviation again. Defaulting to Math.",
                );
                resolve("Math");
              }
            });
          }
        });
      });

      // Check for existing JSON data first
      const gradeNum = Object.keys(grades).find(
        (key) => grades[key] === gradeSelection,
      );
      const jsonPath = `./files/input/${gradeNum}.json`;

      console.log("Generating single quiz...");
      await generateSingleQuiz({
        g: gradeSelection,
        t: null,
        s: subject,
        examType: selectedExamType,
      });
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
