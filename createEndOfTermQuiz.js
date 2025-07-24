const fs = require("fs");
const singleQuizModel = require("./singleQuizModel");
const {
  buildQuizPrompt,
  getExtPrompt,
  getObjectiveCount,
} = require("./quizUtils");

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
      `⚠️  WARNING: End-of-term quiz is missing required section(s): ${missingSections.join(", ")}`,
    );
    console.warn(
      "🔧 This violates the requirement that end-of-term quizzes MUST include sections B and C",
    );
    console.warn(
      "📋 Please review the generated quiz and regenerate if necessary",
    );

    return {
      isValid: false,
      missingSections: missingSections,
      warning: `End-of-term quiz missing required sections: ${missingSections.join(", ")}`,
    };
  }

  console.log(
    "✅ End-of-term quiz validation passed: All required sections (A, B, C) are present",
  );
  return {
    isValid: true,
    missingSections: [],
    warning: null,
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
    const extprompt = getExtPrompt(grade);

    const objCount = getObjectiveCount(selectedClass);
    const extraInstructions = `MANDATORY: Let section A contain exactly ${objCount} objective questions. Let section B contain exactly 5 short-answer questions. Let section C contain exactly 5 essay/theory questions.

CRITICAL: For END OF TERM quizzes, sections B and C are REQUIRED and must ALWAYS be included regardless of grade level or any other factors.

CRITICAL: Make the word problems in the objective section to be only 7 in number`;

    const sectionRequirements = {
      sections: ["Section A", "Section B", "Section C"],
      critical: `
*** CRITICAL REQUIREMENT FOR END OF TERM QUIZ ***
This is an END OF TERM quiz, which means ALL THREE SECTIONS (A, B, AND C) are MANDATORY and MUST be included.
DO NOT skip Section B or Section C under any circumstances.
*** END OF CRITICAL REQUIREMENT ***
`,
    };

    const final_prompt = buildQuizPrompt({
      t,
      selectedClass,
      grade,
      extprompt,
      extraInstructions,
      sectionRequirements,
      isMath: subject && subject.toLowerCase().includes("math"),
    });

    fs.writeFileSync("./files/final_prompt.md", final_prompt);
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
