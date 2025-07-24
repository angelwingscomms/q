
const fs = require("fs");
const path = require("path");
const { grades, subjectAbbreviations } = require("./constants");
const createMidtermQuiz = require("./createMidtermQuiz");
const createEndOfTermQuiz = require("./createEndOfTermQuiz");
const generateDoc = require("./generateDoc");
const updateTodolistData = require("./updateTodolistData");
const getSubjectFromAbbreviation = require("./getSubjectFromAbbreviation");
const runGitCommands = require("./runGitCommands");

/**
 * Generates multiple quizzes for a given grade, either from JSON or folder input.
 * @param {Object} params
 * @param {string} params.g - Grade name (e.g., "ONE").
 * @param {boolean} [params.skipExisting=false] - Whether to skip existing output files.
 * @param {string} params.examType - "Midterm" or "End of Term".
 */
async function generateMultipleQuizzes({ g, skipExisting = false, examType }) {
  // Get grade number for paths
  const gradeNum = Object.keys(grades).find((key) => grades[key] === g);
  const jsonPath = path.join(__dirname, `./files/input/${gradeNum}.json`);
  const folderPath = path.join(__dirname, `./files/input/${gradeNum}`);
  const outputDir = path.join(__dirname, `./files/output/g${gradeNum}`);
  const jsonDir = path.join(outputDir, "json");
  const answersDir = path.join(outputDir, "answers");

  // Ensure directories exist
  [outputDir, jsonDir, answersDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Check if the JSON file exists
  if (fs.existsSync(jsonPath)) {
    // Process the JSON file
    try {
      const exams = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
      console.log(`Found ${exams.length} exams to generate from JSON file`);

      for (const { subject: s, content: t } of exams) {
        console.log(`Processing quiz for ${s}...`);

        // Check if output files already exist
        const abbreviatedSubject = subjectAbbreviations[s] || s.toLowerCase();
        const outputPath = path.join(outputDir, `${abbreviatedSubject}.docx`);
        const jsonOutputPath = path.join(jsonDir, `${abbreviatedSubject}.json`);

        // Skip if files exist and skipExisting is true
        if (
          skipExisting &&
          fs.existsSync(outputPath) &&
          fs.existsSync(jsonOutputPath)
        ) {
          console.log(`Skipping ${s} - output files already exist`);
          continue;
        }

        console.log(`Generating quiz for ${s}...`);

        // Generate the quiz
        const quiz =
          examType === "Midterm"
            ? await createMidtermQuiz({ t, subject: s, grade: g })
            : await createEndOfTermQuiz({ t, selectedClass: g, subject: s, grade: g });
        const quizContent = JSON.parse(quiz);

        // Save the quiz JSON data
        fs.writeFileSync(jsonOutputPath, JSON.stringify(quizContent, null, 2));
        console.log(`Saved quiz JSON to: ${jsonOutputPath}`);

        // Save answers to text file
        const answersPath = path.join(answersDir, `${abbreviatedSubject}.txt`);
        const answersContent = [
          "Section A (Objective) Answers:",
          ...(quizContent.answers_A || []).map((answer, i) => `${i + 1}. ${answer}`),
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
        fs.writeFileSync(answersPath, answersContent);
        console.log(`Saved answers to: ${answersPath}`);

        // Generate Word document
        const doc = await generateDoc({ g, t, s, examType });
        fs.writeFileSync(outputPath, doc);
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
  else if (fs.existsSync(folderPath) && fs.readdirSync(folderPath).length > 0) {
    const files = fs.readdirSync(folderPath);
    console.log(`Found ${files.length} files in folder ${folderPath}`);

    for (const file of files) {
      // Use the filename as the subject code
      const subjectCode = file.replace(/\.md$/, "");

      // Look up the full subject name from the abbreviation
      let subject = getSubjectFromAbbreviation(subjectCode);

      // If no match found, use the subject code as is
      if (!subject) {
        console.log(
          `Warning: No matching subject found for code '${subjectCode}'. Using code as subject name.`
        );
        subject = subjectCode;
      }

      console.log(`Processing quiz for ${subject} (code: ${subjectCode})...`);

      // Check if output files already exist
      const outputPath = path.join(outputDir, `${subjectCode}.docx`);
      const jsonOutputPath = path.join(jsonDir, `${subjectCode}.json`);

      // Skip if files exist and skipExisting is true
      if (
        skipExisting &&
        fs.existsSync(outputPath) &&
        fs.existsSync(jsonOutputPath)
      ) {
        console.log(
          `Skipping ${subject} (code: ${subjectCode}) - output files already exist`
        );
        continue;
      }

      console.log(`Generating quiz for ${subject} (code: ${subjectCode})...`);

      try {
        // Read the file content
        const filePath = path.join(folderPath, file);
        const content = fs.readFileSync(filePath, "utf8");

        // Generate the quiz
        const quiz =
          examType === "Midterm"
            ? await createMidtermQuiz({ t: content, subject, grade: g })
            : await createEndOfTermQuiz({ t: content, selectedClass: g, subject, grade: g });
        const quizContent = JSON.parse(quiz);

        // Save the quiz JSON data
        fs.writeFileSync(jsonOutputPath, JSON.stringify(quizContent, null, 2));
        console.log(`Saved quiz JSON to: ${jsonOutputPath}`);

        // Save answers to text file
        const answersPath = path.join(answersDir, `${subjectCode}.txt`);
        const answersContent = [
          "Section A (Objective) Answers:",
          ...(quizContent.answers_A || []).map((answer, i) => `${i + 1}. ${answer}`),
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
        fs.writeFileSync(answersPath, answersContent);
        console.log(`Saved answers to: ${answersPath}`);

        // Generate Word document
        const doc = await generateDoc({ g, t: content, s: subject, examType });
        fs.writeFileSync(outputPath, doc);
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
      `No data found for grade ${gradeNum}. Looked in:\n- ${jsonPath}\n- ${folderPath}`
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

module.exports = generateMultipleQuizzes;
