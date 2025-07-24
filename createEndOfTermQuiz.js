
const { existsSync, readFileSync, writeFileSync } = require("fs");
const { ext, grades, subjectAbbreviations } = require("./constants");
const singleQuizModel = require("./singleQuizModel");

/**
 * Validates that the generated end-of-term quiz contains required sections B and C.
 * @param {string} responseText - The generated quiz JSON as a string.
 * @returns {{isValid: boolean, missingSections: string[], warning: string|null}}
 */
function validateEndOfTermQuiz(responseText) {
  const text = responseText.toLowerCase();

  // Check for Section B
  const hasSectionB =
    text.includes("section b") ||
    text.includes('"section_b"') ||
    text.includes('"b"') ||
    text.includes("answers_b");

  // Check for Section C
  const hasSectionC =
    text.includes("section c") ||
    text.includes('"section_c"') ||
    text.includes('"c"') ||
    text.includes("answers_c");

  if (!hasSectionB || !hasSectionC) {
    const missingSections = [];
    if (!hasSectionB) missingSections.push("B");
    if (!hasSectionC) missingSections.push("C");

    console.warn(
      `⚠️  WARNING: End-of-term quiz is missing required section(s): ${missingSections.join(", ")}`
    );
    console.warn(
      "🔧 This violates the requirement that end-of-term quizzes MUST include sections B and C"
    );
    console.warn(
      "📋 Please review the generated quiz and regenerate if necessary"
    );

    return {
      isValid: false,
      missingSections: missingSections,
      warning: `End-of-term quiz missing required sections: ${missingSections.join(", ")}`
    };
  }

  console.log(
    "✅ End-of-term quiz validation passed: All required sections (A, B, C) are present"
  );
  return {
    isValid: true,
    missingSections: [],
    warning: null
  };
}

/**
 * Generates an end-of-term quiz using the Gemini model.
 * @param {Object} params
 * @param {string} params.t - The source text/content for the quiz.
 * @param {string} params.selectedClass - The grade name (e.g., "ONE").
 * @param {string} params.subject - The subject name.
 * @param {string} params.grade - The grade name (e.g., "ONE").
 * @returns {Promise<string>} - The generated quiz JSON as a string.
 */
async function createEndOfTermQuiz({ t, selectedClass, subject, grade }) {
  try {
    const gradeNum = Object.keys(grades).find((key) => grades[key] === grade);
    const extpath = `./files/ext-prompt/${gradeNum}.md`;

    let extprompt = "";
    if (existsSync(extpath)) {
      extprompt = readFileSync(extpath, "utf8");
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

    let extra_instructions = `MANDATORY: Let section A contain exactly ${obj} objective questions. Let section B contain exactly ${sa} short-answer questions. Let section C contain exactly ${essay} essay/theory questions.

CRITICAL: For END OF TERM quizzes, sections B and C are REQUIRED and must ALWAYS be included regardless of grade level or any other factors.

CRITICAL: Make the word problems in the objective section to be only 7 in number`;

    const final_prompt = `
Create a quiz with:
Section A, Section B, and Section C.

*** CRITICAL REQUIREMENT FOR END OF TERM QUIZ ***
This is an END OF TERM quiz, which means ALL THREE SECTIONS (A, B, AND C) are MANDATORY and MUST be included.
DO NOT skip Section B or Section C under any circumstances.
*** END OF CRITICAL REQUIREMENT ***

Each section should be an array of strings containing the questions for that section.

Section A should contain objective questions (multiple choice).
Section B should contain short answer questions.
Section C should contain essay/theory questions.
IMPORTANT: Provide answers for all questions in each section in the corresponding answers_A, answers_B, and answers_C arrays.

Format requirements:

# For Section A (objective questions):
- Never end a question with a full stop
- A question may end with question mark
- Use 1 underscore (_) for blanks
- Never end a question with a blank
- Use brackets for options (e.g., (a)...(b)...(c)...) and place questions and options on same line
- Fix bad questions by removing or replacing options to ensure one correct answer
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

# For Math quizzes specifically:
- Always use perfect Unicode for any math sums, fractions, or symbols (e.g., ½, ¾, ², ³, ×, ÷, ±, ≤, ≥, π, ∞)
- Let all fractions always use Unicode creatively in the best way possible (prefer ½, ⅓, ¼, ⅕, ⅙, ⅛, ⅔, ¾, ⅖, ⅗, ⅘, ⅚, ⅝, ⅞ over 1/2, 1/3, etc.)
- For math questions that are sum gaps (e.g., 6 times what equals 18), write as: 6 × _ = 18
- Use × as multiplication symbol instead of * in displayed questions
- Think deeply about math questions and math sums when making math quizzes
- Let the questions be very very easy, using very simple, easy language, for 6 year olds
- Use proper mathematical notation and Unicode symbols throughout

let the questions be numbered.
refrain from mentioning or referencing the source text that the quiz is made from. Never say something like "according to the text" or "from the text"
A section may have subsections, which may have headings, stories or instructions for the questions that follow perhaps, or passages, or just such parts that are not really questions in themselves, e.g "Write the short form of the following words" or "<a story required for the questions in this section to be answered>". Add such parts or subheadings or stories or instruction as unnumbered questions.
${extra_instructions}

Text to create the quiz with:
  """
  ${t}
 """
`;

    writeFileSync("./files/final_prompt.md", final_prompt);
    const result = await singleQuizModel.generateContent(final_prompt);

    const responseText = result.response.text();

    // Validate that end-of-term quiz includes required sections B and C
    const validation = validateEndOfTermQuiz(responseText);
    if (!validation.isValid) {
      console.warn(`End-of-term quiz validation failed: ${validation.warning}`);
      // Still return the response but with warning logged
    }

    return responseText;
  } catch (error) {
    console.error(`Error in createEndOfTermQuiz: ${error.message}`);
    throw error;
  }
}

module.exports = createEndOfTermQuiz;
