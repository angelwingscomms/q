
const fs = require("fs");
const path = require("path");
const singleQuizModel = require("./singleQuizModel");
const { grades } = require("./constants");

/**
 * Generates a midterm quiz using the Gemini model.
 * @param {Object} params
 * @param {string} params.t - The source text/content for the quiz.
 * @param {string} params.subject - The subject name.
 * @param {string} params.grade - The grade name (e.g., "ONE").
 * @returns {Promise<string>} The generated quiz as a JSON string.
 */
async function createMidtermQuiz({ t, subject, grade }) {
  try {
    const gradeNum = Object.keys(grades).find((key) => grades[key] === grade);
    const examplePath = path.join(__dirname, `./files/examples/${gradeNum}.json`);

    let exampleQuizPrompt = "";
    if (fs.existsSync(examplePath)) {
      const exampleQuizJson = fs.readFileSync(examplePath, "utf8");
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

        For Math quizzes specifically:
        - Always use perfect Unicode for any math sums, fractions, or symbols (e.g., ½, ¾, ², ³, ×, ÷, ±, ≤, ≥, π, ∞)
        - Let all fractions always use Unicode creatively in the best way possible (prefer ½, ⅓, ¼, ⅕, ⅙, ⅛, ⅔, ¾, ⅖, ⅗, ⅘, ⅚, ⅝, ⅞ over 1/2, 1/3, etc.)
        - For math questions that are sum gaps (e.g., 6 times what equals 18), write as: 6 × _ = 18
        - Use × as multiplication symbol instead of * in displayed questions
        - Think deeply about math questions and math sums when making math quizzes
        - Let the questions be coherent and moderately challenging for 10 year olds
        - Use proper mathematical notation and Unicode symbols throughout

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

    fs.writeFileSync(path.join(__dirname, "./files/final_prompt.md"), final_prompt);
    const result = await singleQuizModel.generateContent(final_prompt);

    const responseText = result.response.text();
    return responseText;
  } catch (error) {
    console.error(`Error in createMidtermQuiz: ${error.message}`);
    throw error;
  }
}

module.exports = createMidtermQuiz;
