const fs = require("fs");
const singleQuizModel = require("./singleQuizModel");
const {
  buildQuizPrompt,
  getExampleQuizPrompt,
  getObjectiveCount,
} = require("./quizUtils");

/**
 * Generates a midterm quiz using the Gemini model.
 * @param {Object} params
 * @param {string} params.t - The source text/content for the quiz.
 * @param {string} params.subject - The subject name.
 * @param {string} params.grade - The grade name (e.g., "ONE").
 * @param {string} params.selectedClass - The grade/class name (e.g., "ONE").
 * @returns {Promise<string>} The generated quiz as a JSON string.
 */
async function createMidtermQuiz({ t, subject, grade, selectedClass }) {
  try {
    const exampleQuizPrompt = getExampleQuizPrompt(grade);

    const objCount = getObjectiveCount(selectedClass || grade);

    const extraInstructions = `MANDATORY: Let section A contain exactly ${objCount} objective questions.`;

    const sectionRequirements = {
      sections: ["Section A"],
      critical: `
*** CRITICAL REQUIREMENT FOR MIDTERM QUIZ ***
This is a MIDTERM quiz, which means ONLY SECTION A is required.
DO NOT include Section B or Section C.
*** END OF CRITICAL REQUIREMENT ***
`,
    };

    const final_prompt = buildQuizPrompt({
      t,
      selectedClass: selectedClass || grade,
      grade,
      extraInstructions,
      sectionRequirements,
      isMath: subject && subject.toLowerCase().includes("math"),
      exampleQuizPrompt,
    });

    fs.writeFileSync("./files/final_prompt.md", final_prompt);
    const result = await singleQuizModel.generateContent(final_prompt);

    const responseText = result.response.text();
    return responseText;
  } catch (error) {
    console.error(`Error in createMidtermQuiz: ${error.message}`);
    throw error;
  }
}

module.exports = createMidtermQuiz;
