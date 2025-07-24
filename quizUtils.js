const { existsSync, readFileSync } = require("fs");
const path = require("path");
const { ext, grades } = require("./constants");

/**
 * Get the number of objective questions for a given class.
 * @param {string} selectedClass
 * @returns {number}
 */
function getObjectiveCount(selectedClass) {
  switch (selectedClass) {
    case "ONE":
    case "TWO":
      return 20;
    case "THREE":
      return 30;
    case "FOUR":
      return 40;
    case "FIVE":
      return 50;
    default:
      return 0;
  }
}

/**
 * Get the extension prompt for a grade, if available.
 * @param {string} grade
 * @returns {string}
 */
function getExtPrompt(grade) {
  const gradeNum = Object.keys(grades).find((key) => grades[key] === grade);
  const extpath = path.join(__dirname, `./files/ext-prompt/${gradeNum}.md`);
  if (existsSync(extpath)) {
    return readFileSync(extpath, "utf8");
  }
  return "";
}

/**
 * Get the example quiz prompt for a grade, if available.
 * @param {string} grade
 * @returns {string}
 */
function getExampleQuizPrompt(grade) {
  const gradeNum = Object.keys(grades).find((key) => grades[key] === grade);
  const examplePath = path.join(__dirname, `./files/examples/${gradeNum}.json`);
  if (existsSync(examplePath)) {
    const exampleQuizJson = readFileSync(examplePath, "utf8");
    return `Here's an example quiz for Religious Studies for year ${grade}:\n\`\`\`json\n${exampleQuizJson}\n\`\`\`\n`;
  }
  return "";
}

/**
 * Build a quiz prompt for the LLM.
 * @param {Object} options
 * @param {string} options.t - Source text/content for the quiz.
 * @param {string} options.selectedClass - The grade name (e.g., "ONE").
 * @param {string} options.grade - The grade name (e.g., "ONE").
 * @param {string} [options.extprompt] - Extra prompt content for the grade.
 * @param {string} [options.extraInstructions] - Additional instructions for the quiz.
 * @param {Object} options.sectionRequirements - Section and critical requirements.
 * @param {string[]} options.sectionRequirements.sections - Section names (e.g., ["Section A", "Section B", "Section C"])
 * @param {string} options.sectionRequirements.critical - Critical requirements text.
 * @param {boolean} [options.isMath] - If true, include math-specific instructions.
 * @param {string} [options.exampleQuizPrompt] - Example quiz prompt (for midterm).
 * @returns {string}
 */
function buildQuizPrompt({
  t,
  selectedClass,
  grade,
  extprompt = "",
  extraInstructions = "",
  sectionRequirements,
  isMath = false,
  exampleQuizPrompt = "",
}) {
  const obj = getObjectiveCount(selectedClass);
  const sa = 5;
  const essay = 5;

  let mathBlock = isMath
    ? `
For Math quizzes specifically:
- Always use perfect Unicode for any math sums, fractions, or symbols (e.g., ½, ¾, ², ³, ×, ÷, ±, ≤, ≥, π, ∞)
- Let all fractions always use Unicode creatively in the best way possible (prefer ½, ⅓, ¼, ⅕, ⅙, ⅛, ⅔, ¾, ⅖, ⅗, ⅘, ⅚, ⅝, ⅞ over 1/2, 1/3, etc.)
- For math questions that are sum gaps (e.g., 6 times what equals 18), write as: 6 × _ = 18
- Use × as multiplication symbol instead of * in displayed questions
- Think deeply about math questions and math sums when making math quizzes
- Let the questions be very very easy, using very simple, easy language, for 6 year olds
- Use proper mathematical notation and Unicode symbols throughout
`
    : "";
  
  const gradeNum = Object.keys(grades).find((key) => grades[key] === grade);
  let ex = gradeNum < 4 ? ext[1] : ext[5]; 
  

  return `
${exampleQuizPrompt}
Create a quiz with:
${sectionRequirements.sections.join(", ")}.

${sectionRequirements.critical}

Each section should be an array of strings containing the questions for that section.

Section A should contain objective questions (multiple choice).
${sectionRequirements.sections.includes("Section B") ? "Section B should contain short answer questions." : ""}
${sectionRequirements.sections.includes("Section C") ? "Section C should contain essay/theory questions." : ""}
IMPORTANT: Provide answers for all questions in each section in the corresponding answers_A${sectionRequirements.sections.includes("Section B") ? ", answers_B" : ""}${sectionRequirements.sections.includes("Section C") ? ", and answers_C" : ""} arrays.

Format requirements:

# For Section A (objective questions):
- Never end a question with a full stop
- A question may end with question mark
- Use 1 underscore (_) for blanks
- Never end a question with a blank
- If you make a question that would have ended with a blank e.g. "The capital of France is _ (a) Paris (b) London (c) Berlin", then write the question without the blank, e.g. "The capital of France is (a) Paris (b) London (c) Berlin"
- Use brackets for options (e.g., (a)...(b)...(c)...) and place questions and options on same line
- For answers_A, provide only the letter of the correct option (a, b, c, etc.) or the word that fills the blank

${ex.a}

${sectionRequirements.sections.includes("Section B") ? `
# For Section B (short answer questions):
- Use 9 underscores (_________) for blanks
- For answers_B, provide concise answers

${ex.b}
` : ""}

${sectionRequirements.sections.includes("Section C") ? `
# For Section C (essay questions):
- Maintain academic language level
- For answers_C, provide brief model answers or key points

${ex.c}
` : ""}

${mathBlock}

make all questions clear and short
let the questions be numbered.
refrain from mentioning or referencing the source text that the quiz is made from. Never say something like "according to the text" or "from the text"
A section may have subsections, which may have headings, stories or instructions for the questions that follow perhaps, or passages, or just such parts that are not really questions in themselves, e.g "Write the short form of the following words" or "<a story required for the questions in this section to be answered>". Add such parts or subheadings or stories or instruction as unnumbered questions.
${extraInstructions}

Text to create the quiz with:
  """
  ${t}
 """
`;
}

module.exports = {
  getObjectiveCount,
  getExtPrompt,
  getExampleQuizPrompt,
  buildQuizPrompt,
};
