const fs = require("fs");
const path = require("path");
const { grades, subjectAbbreviations } = require("./constants");
const generateDoc = require("./generateDoc");
const updateTodolistData = require("./updateTodolistData");
const runGitCommands = require("./runGitCommands");

/**
 * Generates a single quiz for a given grade and subject.
 * @param {Object} params
 * @param {string} params.g - Grade name (e.g., "ONE").
 * @param {string|null} params.t - Content for the quiz (if null, will attempt to load from file).
 * @param {string} params.s - Subject name (e.g., "Math").
 * @param {string} [params.examType] - Exam type (e.g., "Single Quiz").
 */
async function generateSingleQuiz({ g, t, s, examType = "Single Quiz" }) {
  // Get the grade number from the grade name
  const gradeNum = Object.keys(grades).find((key) => grades[key] === g);
  const abbreviatedSubject = subjectAbbreviations[s] || s.toLowerCase();

  if (!t) {
    // If no content was provided, try to find it
    // Check for existing JSON data first
    const jsonPath = path.join(__dirname, `./files/input/${gradeNum}.json`);
    if (fs.existsSync(jsonPath)) {
      try {
        const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
        // Access content directly using subject abbreviation as key
        if (jsonData[abbreviatedSubject]) {
          t = jsonData[abbreviatedSubject];
        }
      } catch (error) {
        console.log(`Warning: Error reading JSON data: ${error.message}`);
      }
    }

    // If still no content, check the subject-specific file
    if (!t) {
      const subjectFilePath = path.join(
        __dirname,
        `./files/input/${gradeNum}/${abbreviatedSubject}.md`,
      );
      if (fs.existsSync(subjectFilePath)) {
        try {
          t = fs.readFileSync(subjectFilePath, "utf8");
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

  const doc = await generateDoc({ g, t, s, examType });
  const outputPath = path.join(
    __dirname,
    `./files/output/g${gradeNum}/${abbreviatedSubject}.docx`,
  );

  // Ensure the directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, doc);
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

module.exports = generateSingleQuiz;
