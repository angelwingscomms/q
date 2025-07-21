const { GoogleGenerativeAI } = require("@google/generative-ai");
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

// Constants
const G = process.env.GEMINI || "AIzaSyDTEmZHoCBO8QQ_zk3ecByY31waTm9srsQ";
const genAI = new GoogleGenerativeAI(G);

const GRADES = {
  1: "ONE",
  2: "TWO",
  3: "THREE",
  4: "FOUR",
  5: "FIVE",
};

const SUBJECT_ABBREVIATIONS = {
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

const SUBJECTS = Object.keys(SUBJECT_ABBREVIATIONS);

const GRADE_TO_SECTION_MAP = {
  ONE: "g1",
  TWO: "g2",
  THREE: "g3",
  FOUR: "g4",
  FIVE: "g5",
};

const QUIZ_CONFIGS = {
  Midterm: {
    sections: ["A"],
    objectiveQuestions: { ONE: 0, TWO: 0, THREE: 0, FOUR: 0, FIVE: 0 },
    shortAnswerQuestions: 0,
    essayQuestions: 0,
    promptTemplate: (content) => `
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
  ${content}
  """
  `,
  },
  "End of Term": {
    sections: ["A", "B", "C"],
    objectiveQuestions: { ONE: 20, TWO: 20, THREE: 30, FOUR: 40, FIVE: 50 },
    shortAnswerQuestions: 5,
    essayQuestions: 5,
    promptTemplate: (content, grade) => {
      const obj = QUIZ_CONFIGS["End of Term"].objectiveQuestions[grade] || 0;
      const sa = QUIZ_CONFIGS["End of Term"].shortAnswerQuestions;
      const essay = QUIZ_CONFIGS["End of Term"].essayQuestions;

      return `
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
A section may have subsections, which may have headings, stories or instructions for the questions that follow perhaps, or passages, or just such parts that are not really questions in themselves, e.g "Write the short form of the following words" or "<a story required for the questions in this section to be answered>". Add such parts or subheadings or stories or instruction as unnumbered questions.
Let section A contain exactly ${obj} objective questions. Let section B contain exactly ${sa} short-answer questions. Let section C contain exactly ${essay} essay/theory questions.

Text to create the quiz with:
  """
  ${content}
 """
  `;
    },
  },
};

const RESPONSE_SCHEMA = {
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
};

// Utility Functions
class FileManager {
  static ensureDirectoryExists(dirPath) {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
  }

  static readJsonFile(filePath) {
    try {
      return JSON.parse(readFileSync(filePath, "utf8"));
    } catch (error) {
      throw new Error(`Error reading JSON file ${filePath}: ${error.message}`);
    }
  }

  static writeJsonFile(filePath, data) {
    this.ensureDirectoryExists(path.dirname(filePath));
    writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  static writeTextFile(filePath, content) {
    this.ensureDirectoryExists(path.dirname(filePath));
    writeFileSync(filePath, content);
  }

  static readTextFile(filePath) {
    return readFileSync(filePath, "utf8");
  }

  static fileExists(filePath) {
    return existsSync(filePath);
  }

  static getFilesInDirectory(dirPath, extension = null) {
    if (!existsSync(dirPath)) return [];
    const files = readdirSync(dirPath);
    return extension ? files.filter((f) => f.endsWith(extension)) : files;
  }
}

class PathBuilder {
  static getGradeNumber(gradeName) {
    return Object.keys(GRADES).find((key) => GRADES[key] === gradeName);
  }

  static getSubjectAbbreviation(subject) {
    return SUBJECT_ABBREVIATIONS[subject] || subject.toLowerCase();
  }

  static getSubjectFromAbbreviation(abbr) {
    abbr = abbr.toLowerCase();
    for (const [subject, abbreviation] of Object.entries(
      SUBJECT_ABBREVIATIONS,
    )) {
      if (abbreviation === abbr) {
        return subject;
      }
    }
    return null;
  }

  static getInputPaths(gradeNum) {
    return {
      json: `./files/input/${gradeNum}.json`,
      folder: `./files/input/${gradeNum}`,
    };
  }

  static getOutputPaths(gradeNum, subjectAbbr) {
    const baseDir = `./files/output/g${gradeNum}`;
    return {
      baseDir,
      jsonDir: `${baseDir}/json`,
      answersDir: `${baseDir}/answers`,
      docx: `${baseDir}/${subjectAbbr}.docx`,
      json: `${baseDir}/json/${subjectAbbr}.json`,
      answers: `${baseDir}/answers/${subjectAbbr}.txt`,
    };
  }

  static getTemplatePath(grade) {
    return `./files/template${grade === "ONE" || grade === "TWO" ? "-cc" : ""}.docx`;
  }

  static getExamplePath(gradeNum) {
    return `./files/examples/${gradeNum}.json`;
  }

  static getExtPromptPath(gradeNum) {
    return `./files/ext-prompt/${gradeNum}.md`;
  }
}

class QuizGenerator {
  constructor() {
    this.model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-05-20",
      generationConfig: {
        temperature: 0,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 999999,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });
  }

  async generateQuiz({ content, subject, grade, examType }) {
    try {
      const config = QUIZ_CONFIGS[examType];
      if (!config) {
        throw new Error(`Unknown exam type: ${examType}`);
      }

      const gradeNum = PathBuilder.getGradeNumber(grade);
      const examplePath = PathBuilder.getExamplePath(gradeNum);

      let exampleQuizPrompt = "";
      if (FileManager.fileExists(examplePath)) {
        const exampleQuizJson = FileManager.readTextFile(examplePath);
        exampleQuizPrompt = `Here's an example quiz for Religious Studies for year ${grade}:\n\`\`\`json\n${exampleQuizJson}\n\`\`\`\n`;
      }

      const prompt =
        typeof config.promptTemplate === "function"
          ? config.promptTemplate(content, grade)
          : config.promptTemplate(content);

      const finalPrompt = exampleQuizPrompt + prompt;

      FileManager.writeTextFile("./files/final_prompt.md", finalPrompt);

      const result = await this.model.generateContent(finalPrompt);
      return result.response.text();
    } catch (error) {
      console.error(`Error generating ${examType} quiz: ${error.message}`);
      throw error;
    }
  }
}

class ContentLoader {
  static loadContent({ grade, subject, providedContent = null }) {
    if (providedContent) return providedContent;

    const gradeNum = PathBuilder.getGradeNumber(grade);
    const abbreviatedSubject = PathBuilder.getSubjectAbbreviation(subject);
    const inputPaths = PathBuilder.getInputPaths(gradeNum);

    // Try JSON file first
    if (FileManager.fileExists(inputPaths.json)) {
      try {
        const jsonData = FileManager.readJsonFile(inputPaths.json);
        const subjectData = jsonData.find((exam) => exam.subject === subject);
        if (subjectData) {
          return subjectData.content;
        }
      } catch (error) {
        console.log(`Warning: Error reading JSON data: ${error.message}`);
      }
    }

    // Try subject-specific file
    const subjectFilePath = `${inputPaths.folder}/${abbreviatedSubject}.md`;
    if (FileManager.fileExists(subjectFilePath)) {
      try {
        console.log(`Found quiz content in: ${subjectFilePath}`);
        return FileManager.readTextFile(subjectFilePath);
      } catch (error) {
        throw new Error(`Error reading subject file: ${error.message}`);
      }
    }

    throw new Error(
      `No content found for subject ${subject} in grade ${gradeNum}. Checked:\n- ${inputPaths.json}\n- ${subjectFilePath}`,
    );
  }
}

class QuizValidator {
  static validateAndFixQuizContent(quizContent) {
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
    const sections = ["B", "C"];
    const answerSections = ["answers_B", "answers_C"];

    sections.forEach((section) => {
      if (!quizContent[section] || !Array.isArray(quizContent[section])) {
        console.log(
          `Section ${section} is not present in the response, initializing as empty array`,
        );
        quizContent[section] = [];
      }
    });

    answerSections.forEach((answerSection) => {
      if (
        !quizContent[answerSection] ||
        !Array.isArray(quizContent[answerSection])
      ) {
        console.log(
          `${answerSection} are not present in the response, initializing as empty array`,
        );
        quizContent[answerSection] = [];
      }
    });

    return quizContent;
  }
}

class AnswerGenerator {
  static formatAnswersContent(quizContent) {
    const sections = [
      { key: "answers_A", label: "Section A (Objective) Answers" },
      { key: "answers_B", label: "Section B (Short Answer) Answers" },
      { key: "answers_C", label: "Section C (Theory) Answers" },
    ];

    return sections
      .filter(
        (section) =>
          quizContent[section.key] && quizContent[section.key].length > 0,
      )
      .map((section) => [
        section.label + ":",
        ...quizContent[section.key].map((answer, i) => `${i + 1}. ${answer}`),
      ])
      .reduce((acc, curr) => acc.concat("", ...curr), [])
      .slice(1) // Remove first empty string
      .join("\n");
  }

  static async generateAnswersWithAI(quiz) {
    const answerModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-05-20",
      generationConfig: {
        temperature: 0,
        topP: 1,
        topK: 1,
        maxOutputTokens: 2048,
      },
    });

    let prompt = "Answer these questions accurately and concisely:\n\n";

    prompt += "Section A:\n";
    quiz.A.forEach((q, i) => {
      prompt += `${i + 1}. ${q}\n`;
    });

    if (quiz.B && quiz.B.length > 0) {
      prompt += "\nSection B:\n";
      quiz.B.forEach((q, i) => {
        prompt += `${i + 1}. ${q}\n`;
      });
    }

    const result = await answerModel.generateContent(prompt);
    return result.response.text();
  }
}

class DocumentGenerator {
  static async generateWordDocument({ grade, content, subject, examType }) {
    const quizGenerator = new QuizGenerator();
    const quizJson = await quizGenerator.generateQuiz({
      content,
      subject,
      grade,
      examType,
    });

    let quizContent;
    try {
      quizContent = JSON.parse(quizJson);
      quizContent = QuizValidator.validateAndFixQuizContent(quizContent);
    } catch (error) {
      console.error(`Error parsing quiz content: ${error.message}`);
      throw error;
    }

    const gradeNum = PathBuilder.getGradeNumber(grade);
    const abbreviatedSubject = PathBuilder.getSubjectAbbreviation(subject);
    const outputPaths = PathBuilder.getOutputPaths(
      gradeNum,
      abbreviatedSubject,
    );

    // Create directories
    [outputPaths.jsonDir, outputPaths.answersDir].forEach((dir) =>
      FileManager.ensureDirectoryExists(dir),
    );

    // Save quiz JSON data
    FileManager.writeJsonFile(outputPaths.json, quizContent);
    console.log(`Saved quiz JSON to: ${outputPaths.json}`);

    // Save answers to text file
    const answersContent = AnswerGenerator.formatAnswersContent(quizContent);
    FileManager.writeTextFile(outputPaths.answers, answersContent);
    console.log(`Saved answers to: ${outputPaths.answers}`);

    // Generate Word document
    const { patchDocument, PatchType, TextRun, Paragraph } = require("docx");

    const doc = await patchDocument({
      data: FileManager.readTextFile(PathBuilder.getTemplatePath(grade)),
      outputType: "nodebuffer",
      keepOriginalStyles: true,
      patches: {
        s: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun(subject)],
        },
        g: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun(grade)],
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
}

class TodolistManager {
  static updateTodolistData(subject, grade) {
    const todolistDataPath = path.join(__dirname, "todolist-data.json");

    if (!FileManager.fileExists(todolistDataPath)) {
      console.log("todolist-data.json not found. No update performed.");
      return;
    }

    try {
      const todoData = FileManager.readJsonFile(todolistDataPath);
      const section = GRADE_TO_SECTION_MAP[grade];

      if (!section) {
        console.log(
          `Warning: Grade ${grade} does not map to a known section. No update performed.`,
        );
        return;
      }

      if (todoData[subject] && todoData[subject][section]) {
        todoData[subject][section].done = true;
        FileManager.writeJsonFile(todolistDataPath, todoData);
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
}

class GitManager {
  static runGitCommands(subject = null, grade = null) {
    let commitMsg = "Add new quiz";
    if (subject && grade) {
      commitMsg = `Add quiz for ${subject} (${grade})`;
    }
    return new Promise((resolve, reject) => {
      console.log("Running git commands...");
      exec(
        `git add .; git commit --allow-empty -m "${commitMsg}"; git push`,
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
}

class UserInterface {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async displayMenu(items, prompt) {
    return new Promise((resolve) => {
      console.log(prompt);
      items.forEach((item, index) => {
        console.log(`${index + 1}. ${item}`);
      });

      this.rl.question("Enter your selection (number): ", (answer) => {
        const selection = parseInt(answer);
        if (!isNaN(selection) && selection >= 1 && selection <= items.length) {
          resolve(items[selection - 1]);
        } else {
          console.log("Invalid selection. Please try again.");
          resolve(this.displayMenu(items, prompt));
        }
      });
    });
  }

  async askQuestion(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }

  async selectGrade() {
    const gradeSelection = await this.askQuestion(
      "Which grade?\n" +
        Object.keys(GRADES)
          .map((key) => `${key}. Grade ${GRADES[key]}`)
          .join("\n") +
        "\nEnter grade number (1-5): ",
    );

    const gradeNum = parseInt(gradeSelection);
    if (!isNaN(gradeNum) && GRADES[gradeNum]) {
      return GRADES[gradeNum];
    } else if (Object.values(GRADES).includes(gradeSelection.toUpperCase())) {
      return gradeSelection.toUpperCase();
    } else {
      console.log("Invalid grade. Please try again.");
      const retryAnswer = await this.askQuestion("Enter grade number (1-5): ");
      const retryGradeNum = parseInt(retryAnswer);
      if (!isNaN(retryGradeNum) && GRADES[retryGradeNum]) {
        return GRADES[retryGradeNum];
      } else {
        console.log("Invalid grade again. Defaulting to Grade ONE.");
        return "ONE";
      }
    }
  }

  async selectSubject() {
    console.log("\nAvailable subjects (use abbreviation to select):");
    Object.entries(SUBJECT_ABBREVIATIONS).forEach(([subject, abbr]) => {
      console.log(`${abbr}: ${subject}`);
    });

    const promptForSubject = async () => {
      const answer = await this.askQuestion("\nEnter subject abbreviation: ");
      const trimmedAnswer = answer.trim().toLowerCase();

      if (!trimmedAnswer) {
        console.log("Subject abbreviation cannot be empty. Please try again.");
        return promptForSubject();
      }

      if (!Object.values(SUBJECT_ABBREVIATIONS).includes(trimmedAnswer)) {
        console.log("Invalid subject abbreviation. Please try again.");
        return promptForSubject();
      }

      return PathBuilder.getSubjectFromAbbreviation(trimmedAnswer);
    };

    return promptForSubject();
  }

  async askYesNo(question, defaultNo = true) {
    const answer = await this.askQuestion(question);
    return answer.toLowerCase() === "y";
  }

  close() {
    if (!this.rl.closed) {
      this.rl.close();
    }
  }
}

// Main Application Logic
class QuizApplication {
  constructor() {
    this.ui = new UserInterface();
  }

  async generateSingleQuiz({ grade, content, subject, examType }) {
    const gradeNum = PathBuilder.getGradeNumber(grade);
    const abbreviatedSubject = PathBuilder.getSubjectAbbreviation(subject);
    const outputPaths = PathBuilder.getOutputPaths(
      gradeNum,
      abbreviatedSubject,
    );

    const actualContent = ContentLoader.loadContent({
      grade,
      subject,
      providedContent: content,
    });
    const doc = await DocumentGenerator.generateWordDocument({
      grade,
      content: actualContent,
      subject,
      examType,
    });

    FileManager.ensureDirectoryExists(path.dirname(outputPaths.docx));
    FileManager.writeTextFile(outputPaths.docx, doc);
    console.log(`Quiz generated: ${outputPaths.docx}`);

    TodolistManager.updateTodolistData(subject, grade);

    try {
      await GitManager.runGitCommands();
    } catch (error) {
      console.error("Failed to run git commands:", error);
    }
  }

  async generateMultipleQuizzes({ grade, skipExisting = false, examType }) {
    const gradeNum = PathBuilder.getGradeNumber(grade);
    const inputPaths = PathBuilder.getInputPaths(gradeNum);
    const outputPaths = PathBuilder.getOutputPaths(gradeNum, "");

    // Ensure directories exist
    [outputPaths.baseDir, outputPaths.jsonDir, outputPaths.answersDir].forEach(
      (dir) => FileManager.ensureDirectoryExists(dir),
    );

    let examSources = [];

    // Check if JSON file exists
    if (FileManager.fileExists(inputPaths.json)) {
      try {
        const exams = FileManager.readJsonFile(inputPaths.json);
        examSources = exams.map((exam) => ({
          subject: exam.subject,
          content: exam.content,
          abbreviation: PathBuilder.getSubjectAbbreviation(exam.subject),
        }));
        console.log(
          `Found ${examSources.length} exams to generate from JSON file`,
        );
      } catch (error) {
        throw new Error(`Error processing JSON file: ${error.message}`);
      }
    }
    // Check for folder with individual files
    else if (FileManager.fileExists(inputPaths.folder)) {
      const files = FileManager.getFilesInDirectory(inputPaths.folder);
      examSources = files.map((file) => {
        const subjectCode = file;
        const subject =
          PathBuilder.getSubjectFromAbbreviation(subjectCode) || subjectCode;
        const content = FileManager.readTextFile(
          path.join(inputPaths.folder, file),
        );

        return {
          subject,
          content,
          abbreviation: subjectCode,
        };
      });
      console.log(
        `Found ${examSources.length} files in folder ${inputPaths.folder}`,
      );
    } else {
      throw new Error(
        `No data found for grade ${gradeNum}. Looked in:\n- ${inputPaths.json}\n- ${inputPaths.folder}`,
      );
    }

    // Process each exam
    for (const examSource of examSources) {
      console.log(`Processing quiz for ${examSource.subject}...`);

      const currentOutputPaths = PathBuilder.getOutputPaths(
        gradeNum,
        examSource.abbreviation,
      );

      // Skip if files exist and skipExisting is true
      if (
        skipExisting &&
        FileManager.fileExists(currentOutputPaths.docx) &&
        FileManager.fileExists(currentOutputPaths.json)
      ) {
        console.log(
          `Skipping ${examSource.subject} - output files already exist`,
        );
        continue;
      }

      console.log(`Generating quiz for ${examSource.subject}...`);

      try {
        const quizGenerator = new QuizGenerator();
        const quiz = await quizGenerator.generateQuiz({
          content: examSource.content,
          subject: examSource.subject,
          grade,
          examType,
        });

        let quizContent = JSON.parse(quiz);
        quizContent = QuizValidator.validateAndFixQuizContent(quizContent);

        // Save quiz JSON data
        FileManager.writeJsonFile(currentOutputPaths.json, quizContent);
        console.log(`Saved quiz JSON to: ${currentOutputPaths.json}`);

        // Save answers to text file
        const answersContent =
          AnswerGenerator.formatAnswersContent(quizContent);
        FileManager.writeTextFile(currentOutputPaths.answers, answersContent);
        console.log(`Saved answers to: ${currentOutputPaths.answers}`);

        // Generate Word document
        const doc = await DocumentGenerator.generateWordDocument({
          grade,
          content: examSource.content,
          subject: examSource.subject,
          examType,
        });

        FileManager.writeTextFile(currentOutputPaths.docx, doc);
        console.log(`Generated: ${currentOutputPaths.docx}`);

        TodolistManager.updateTodolistData(examSource.subject, grade);

        await new Promise((r) => setTimeout(r, 27000));
      } catch (error) {
        console.error(
          `Error processing ${examSource.subject}: ${error.message}`,
        );
        continue;
      }
    }

    try {
      for (const examSource of examSources) {
        await GitManager.runGitCommands(examSource.subject, grade);
      }
    } catch (error) {
      console.error("Failed to run git commands:", error);
    }
  }

  async generateAllAnswers({ gradeNum, redoExisting = false }) {
    const outputPaths = PathBuilder.getOutputPaths(gradeNum, "");

    if (!FileManager.fileExists(outputPaths.jsonDir)) {
      throw new Error(`JSON directory not found: ${outputPaths.jsonDir}`);
    }

    FileManager.ensureDirectoryExists(outputPaths.answersDir);

    const files = FileManager.getFilesInDirectory(outputPaths.jsonDir, ".json");
    console.log(`Found ${files.length} quiz files in grade ${gradeNum}`);

    for (const file of files) {
      const subjectAbbr = file.replace(".json", "");
      const answerPath = `${outputPaths.answersDir}/${subjectAbbr}.txt`;

      if (!redoExisting && FileManager.fileExists(answerPath)) {
        console.log(`Skipping ${subjectAbbr} - answer file already exists`);
        continue;
      }

      console.log(`Processing ${subjectAbbr}...`);

      try {
        const quiz = FileManager.readJsonFile(`${outputPaths.jsonDir}/${file}`);
        const responseText = await AnswerGenerator.generateAnswersWithAI(quiz);

        FileManager.writeTextFile(answerPath, responseText);
        console.log(`Answers saved to: ${answerPath}`);

        await new Promise((r) => setTimeout(r, 2000));
      } catch (error) {
        console.error(`Error processing ${subjectAbbr}: ${error.message}`);
        continue;
      }
    }

    try {
      await GitManager.runGitCommands();
    } catch (error) {
      console.error("Failed to run git commands:", error);
    }
  }

  async generateAnswersForAllGrades(redoExisting = false) {
    for (const [gradeNum, gradeName] of Object.entries(GRADES)) {
      console.log(`\nProcessing Grade ${gradeName}...`);

      const outputPaths = PathBuilder.getOutputPaths(gradeNum, "");

      if (!FileManager.fileExists(outputPaths.jsonDir)) {
        console.log(`Skipping Grade ${gradeName} - no JSON directory found`);
        continue;
      }

      FileManager.ensureDirectoryExists(outputPaths.answersDir);

      const files = FileManager.getFilesInDirectory(
        outputPaths.jsonDir,
        ".json",
      );
      console.log(`Found ${files.length} quiz files in Grade ${gradeName}`);

      for (const file of files) {
        const subjectAbbr = file.replace(".json", "");
        const answerPath = `${outputPaths.answersDir}/${subjectAbbr}.txt`;

        if (!redoExisting && FileManager.fileExists(answerPath)) {
          console.log(`Skipping ${subjectAbbr} - answer file already exists`);
          continue;
        }

        console.log(`Processing ${subjectAbbr}...`);

        try {
          const quiz = FileManager.readJsonFile(
            `${outputPaths.jsonDir}/${file}`,
          );
          const responseText =
            await AnswerGenerator.generateAnswersWithAI(quiz);

          FileManager.writeTextFile(answerPath, responseText);
          console.log(`Answers saved to: ${answerPath}`);

          await new Promise((r) => setTimeout(r, 2000));
        } catch (error) {
          console.error(`Error processing ${subjectAbbr}: ${error.message}`);
          continue;
        }
      }
    }

    try {
      await GitManager.runGitCommands();
    } catch (error) {
      console.error("Failed to run git commands:", error);
    }
  }

  async generateAllQuizzesAllGrades({ examType, skipExisting = false }) {
    console.log(`Starting to generate ${examType} quizzes for all grades...`);

    if (skipExisting) {
      console.log("\nScanning for existing quizzes...");
      let totalExisting = 0;

      for (const gradeNum of Object.keys(GRADES)) {
        const gradeName = GRADES[gradeNum];
        const outputPaths = PathBuilder.getOutputPaths(gradeNum, "");

        if (FileManager.fileExists(outputPaths.jsonDir)) {
          const existingFiles = FileManager.getFilesInDirectory(
            outputPaths.jsonDir,
            ".json",
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

    const gradeKeys = Object.keys(GRADES);
    const totalGrades = gradeKeys.length;
    let processedGrades = 0;

    for (const gradeNum of gradeKeys) {
      const gradeName = GRADES[gradeNum];
      processedGrades++;

      console.log(
        `\n=== Processing Grade ${gradeName} (${gradeNum}) [${processedGrades}/${totalGrades}] ===`,
      );

      const inputPaths = PathBuilder.getInputPaths(gradeNum);
      let subjectCount = 0;

      if (FileManager.fileExists(inputPaths.json)) {
        try {
          const exams = FileManager.readJsonFile(inputPaths.json);
          subjectCount = exams.length;
          console.log(
            `Found ${subjectCount} subjects in JSON file for Grade ${gradeName}`,
          );
        } catch (error) {
          console.log(
            `Could not read JSON file for Grade ${gradeName}: ${error.message}`,
          );
        }
      } else if (FileManager.fileExists(inputPaths.folder)) {
        const files = FileManager.getFilesInDirectory(inputPaths.folder);
        subjectCount = files.length;
        console.log(
          `Found ${subjectCount} subject files in folder for Grade ${gradeName}`,
        );
      } else {
        console.log(`No input data found for Grade ${gradeName}`);
      }

      try {
        await this.generateMultipleQuizzes({
          grade: gradeName,
          skipExisting: skipExisting,
          examType: examType,
        });
        console.log(
          `✓ Completed Grade ${gradeName} (${processedGrades}/${totalGrades})`,
        );
      } catch (error) {
        console.error(
          `✗ Error processing Grade ${gradeName}: ${error.message}`,
        );
      }
    }

    console.log("\n=== All grades processing complete ===");
    console.log(`Processed ${totalGrades} grades total.`);
  }

  async run() {
    try {
      const mode = await this.ui.askQuestion(
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
      );

      const examTypes = ["Midterm", "End of Term"];
      let selectedExamType = null;

      if (["1", "2", "6", "7", "8"].includes(mode)) {
        selectedExamType = await this.ui.displayMenu(
          examTypes,
          "Select exam type:",
        );
      }

      switch (mode) {
        case "8":
          console.log(
            "Generating ALL quizzes for ALL grades (skipping existing)...",
          );
          await this.generateAllQuizzesAllGrades({
            examType: selectedExamType,
            skipExisting: true,
          });
          break;

        case "7":
          console.log(
            "Generating ALL quizzes for ALL grades (overwriting existing)...",
          );
          await this.generateAllQuizzesAllGrades({
            examType: selectedExamType,
            skipExisting: false,
          });
          break;

        case "6":
          const gradeSelection6 = await this.ui.selectGrade();
          console.log("Generating multiple quizzes (skipping existing)...");
          await this.generateMultipleQuizzes({
            grade: gradeSelection6,
            skipExisting: true,
            examType: selectedExamType,
          });
          break;

        case "5":
          const redoExisting5 = await this.ui.askYesNo(
            "Redo existing answers? (y/N): ",
          );
          console.log("Generating answers for all grades and subjects...");
          await this.generateAnswersForAllGrades(redoExisting5);
          break;

        case "4":
          const gradeSelection4 = await this.ui.selectGrade();
          const gradeNum4 = PathBuilder.getGradeNumber(gradeSelection4);
          const redoExisting4 = await this.ui.askYesNo(
            "Redo existing answers? (y/N): ",
          );
          await this.generateAllAnswers({
            gradeNum: gradeNum4,
            redoExisting: redoExisting4,
          });
          break;

        case "3":
          const gradeSelection3 = await this.ui.selectGrade();
          const gradeNum3 = PathBuilder.getGradeNumber(gradeSelection3);
          const subjectAbbr = await this.ui.selectSubject();

          const jsonPath = `./files/output/g${gradeNum3}/json/${PathBuilder.getSubjectAbbreviation(subjectAbbr)}.json`;
          if (!FileManager.fileExists(jsonPath)) {
            throw new Error(`Quiz JSON not found: ${jsonPath}`);
          }

          const quiz = FileManager.readJsonFile(jsonPath);

          try {
            const responseText =
              await AnswerGenerator.generateAnswersWithAI(quiz);
            const answersPath = `./files/output/g${gradeNum3}/answers/${PathBuilder.getSubjectAbbreviation(subjectAbbr)}.txt`;
            FileManager.writeTextFile(answersPath, responseText);
            console.log(`Answers saved to: ${answersPath}`);

            await GitManager.runGitCommands(subjectAbbr, GRADES[gradeNum3]);
          } catch (error) {
            console.error(`Error generating answers: ${error.message}`);
            throw error;
          }
          break;

        case "2":
          const gradeSelection2 = await this.ui.selectGrade();
          console.log("Generating multiple quizzes...");
          await this.generateMultipleQuizzes({
            grade: gradeSelection2,
            skipExisting: false,
            examType: selectedExamType,
          });
          break;

        case "1":
          const gradeSelection1 = await this.ui.selectGrade();
          const subject = await this.ui.selectSubject();

          console.log("Generating single quiz...");
          await this.generateSingleQuiz({
            grade: gradeSelection1,
            content: null,
            subject: subject,
            examType: selectedExamType,
          });
          break;

        default:
          throw new Error("Invalid mode selection");
      }
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      this.ui.close();
    }
  }
}

// Start the application
const app = new QuizApplication();
app.run();
