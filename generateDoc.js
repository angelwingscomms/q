const { readFileSync, writeFileSync, existsSync, mkdirSync } = require("fs");
const path = require("path");
const { grades, subjectAbbreviations } = require("./constants");
const createMidtermQuiz = require("./createMidtermQuiz");
const createEndOfTermQuiz = require("./createEndOfTermQuiz");

/**
 * Generates a Word document for a quiz, saves JSON and answers, and returns the doc buffer.
 * @param {Object} params
 * @param {string} params.g - Grade name (e.g., "ONE").
 * @param {string} params.t - Source text/content for the quiz.
 * @param {string} params.s - Subject name.
 * @param {string} params.examType - "Midterm" or "End of Term" or "Single Quiz".
 * @returns {Promise<Buffer>} The generated Word document buffer.
 */
async function generateDoc({ g, t, s, examType }) {
  // Generate quiz JSON using the appropriate quiz generator
  const q =
    examType === "Midterm"
      ? await createMidtermQuiz({ t, subject: s, grade: g })
      : await createEndOfTermQuiz({
          t,
          selectedClass: g,
          subject: s,
          grade: g,
        });

  // Lazy-load docx only when needed
  const {
    patchDocument,
    PatchType,
    TextRun,
    Paragraph
  } = require("docx");

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

    // For End of Term quizzes and Single Quizzes, sections B and C are MANDATORY
    if (examType !== "Midterm" && examType !== "midterm") {
      if (
        !quizContent.B ||
        !Array.isArray(quizContent.B) ||
        quizContent.B.length === 0
      ) {
        throw new Error(
          `CRITICAL ERROR: ${examType} quiz is missing Section B or Section B is empty. This violates the mandatory requirement that end-of-term and single quizzes MUST include sections B and C with content.`,
        );
      }

      if (
        !quizContent.C ||
        !Array.isArray(quizContent.C) ||
        quizContent.C.length === 0
      ) {
        throw new Error(
          `CRITICAL ERROR: ${examType} quiz is missing Section C or Section C is empty. This violates the mandatory requirement that end-of-term and single quizzes MUST include sections B and C with content.`,
        );
      }
    }

    // Initialize empty arrays for missing sections (only for midterm quizzes)
    if (!quizContent.B || !Array.isArray(quizContent.B)) {
      if (examType === "Midterm" || examType === "midterm") {
        console.log(
          "Section B is not present in the response, initializing as empty array",
        );
        quizContent.B = [];
      }
    }

    if (!quizContent.C || !Array.isArray(quizContent.C)) {
      if (examType === "Midterm" || examType === "midterm") {
        console.log(
          "Section C is not present in the response, initializing as empty array",
        );
        quizContent.C = [];
      }
    }

    // For End of Term and Single quizzes, answers for B and C are also required
    if (examType !== "Midterm" && examType !== "midterm") {
      if (!quizContent.answers_B || !Array.isArray(quizContent.answers_B)) {
        console.warn(
          `WARNING: ${examType} quiz is missing answers for Section B, initializing as empty array but this should be addressed`,
        );
        quizContent.answers_B = [];
      }

      if (!quizContent.answers_C || !Array.isArray(quizContent.answers_C)) {
        console.warn(
          `WARNING: ${examType} quiz is missing answers for Section C, initializing as empty array but this should be addressed`,
        );
        quizContent.answers_C = [];
      }
    }

    // Initialize empty arrays for missing answers (for midterm quizzes)
    if (!quizContent.answers_B || !Array.isArray(quizContent.answers_B)) {
      if (examType === "Midterm" || examType === "midterm") {
        console.log(
          "Section B answers are not present in the response, initializing as empty array",
        );
        quizContent.answers_B = [];
      }
    }

    if (!quizContent.answers_C || !Array.isArray(quizContent.answers_C)) {
      if (examType === "Midterm" || examType === "midterm") {
        console.log(
          "Section C answers are not present in the response, initializing as empty array",
        );
        quizContent.answers_C = [];
      }
    }

    // Log success message for end-of-term quiz validation
    if (examType !== "Midterm" && examType !== "midterm") {
      console.log(
        `✅ ${examType} quiz validation passed: All required sections (A, B, C) are present with content`,
      );
    }
  } catch (error) {
    console.error(`Error parsing quiz content: ${error.message}`);
    throw error;
  }

  // Get grade number and create json folder path
  const gradeNum = Object.keys(grades).find((key) => grades[key] === g);
  const jsonDir = path.join(__dirname, `./files/output/g${gradeNum}/json`);
  const answersDir = path.join(
    __dirname,
    `./files/output/g${gradeNum}/answers`,
  );

  // Create directories if they don't exist
  [jsonDir, answersDir].forEach((dir) => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  });

  // Use abbreviated filename
  const abbreviatedSubject = subjectAbbreviations[s] || s.toLowerCase();

  // Save the quiz JSON data
  const jsonPath = path.join(jsonDir, `${abbreviatedSubject}.json`);
  writeFileSync(jsonPath, JSON.stringify(quizContent, null, 2));
  console.log(`Saved quiz JSON to: ${jsonPath}`);

  // Save answers to text file
  const answersPath = path.join(answersDir, `${abbreviatedSubject}.txt`);
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

  // Prepare template path
  const templateSuffix = g === "ONE" || g === "TWO" ? "-cc" : "";
  const templatePath = path.join(
    __dirname,
    `./files/template${templateSuffix}.docx`,
  );

  // Determine font family based on grade
  const fontFamily = g === "ONE" || g === "TWO" ? "Comic Sans MS" : undefined;

  // Helper function to create TextRun with appropriate font
  const createTextRun = (text, options = {}) => {
    return new TextRun({
      text,
      font: fontFamily,
      ...options,
    });
  };

  // NOTE: Page margins configuration (0.27 inches on all sides)
  // The patchDocument function doesn't support setting page margins directly.
  // To set margins to 0.27 inches on all sides, you need to:
  // 1. Open the template files (template.docx, template-cc.docx, template-n.docx) in Microsoft Word
  // 2. Go to Layout > Margins > Custom Margins
  // 3. Set Top, Bottom, Left, Right margins to 0.27"
  // 4. Save the template files
  // This will ensure all generated documents use the 0.27" margins from the templates.

  // Patch the Word document
  const doc = await patchDocument({
    data: readFileSync(templatePath),
    outputType: "nodebuffer",
    keepOriginalStyles: true,
    patches: {
      s: {
        type: PatchType.PARAGRAPH,
        children: [createTextRun(s)],
      },
      g: {
        type: PatchType.PARAGRAPH,
        children: [createTextRun(g)],
      },
      q: {
        type: PatchType.DOCUMENT,
        children: [
          ...quizContent.A.map(
            (question) =>
              new Paragraph({
                children: [createTextRun(question)],
                spacing: { after: 9 },
              }),
          ),
          // Section B - only include if it has content
          ...(quizContent.B && quizContent.B.length > 0
            ? [
                new Paragraph({
                  children: [createTextRun("Section B", { bold: true })],
                  spacing: { after: 9, before: 54 },
                }),
                ...quizContent.B.map(
                  (question) =>
                    new Paragraph({
                      children: [createTextRun(question)],
                      spacing: { after: 9 },
                    }),
                ),
              ]
            : []),
          // Section C - only include if it has content
          ...(quizContent.C && quizContent.C.length > 0
            ? [
                new Paragraph({
                  children: [createTextRun("Section C", { bold: true })],
                  spacing: { after: 9, before: 54 },
                }),
                ...quizContent.C.map(
                  (question) =>
                    new Paragraph({
                      children: [createTextRun(question)],
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

module.exports = generateDoc;
