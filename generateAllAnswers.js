
const fs = require("fs");
const path = require("path");
const { grades } = require("./constants");
const runGitCommands = require("./runGitCommands");

/**
 * Generates answers for all quizzes in a given grade.
 * @param {Object} params
 * @param {string|number} params.gradeNum - The grade number (e.g., 1, 2, 3, 4, 5).
 * @param {boolean} [params.redoExisting=false] - Whether to overwrite existing answer files.
 */
async function generateAllAnswers({ gradeNum, redoExisting = false }) {
  const jsonDir = path.join(__dirname, `./files/output/g${gradeNum}/json`);
  const answersDir = path.join(__dirname, `./files/output/g${gradeNum}/answers`);

  // Ensure directories exist
  if (!fs.existsSync(jsonDir)) {
    throw new Error(`JSON directory not found: ${jsonDir}`);
  }
  if (!fs.existsSync(answersDir)) {
    fs.mkdirSync(answersDir, { recursive: true });
  }

  // Get all JSON files
  const files = fs.readdirSync(jsonDir).filter((file) => file.endsWith(".json"));
  console.log(`Found ${files.length} quiz files in grade ${gradeNum}`);

  // Lazy-load Gemini model
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const { G } = require("./constants");
  const genAI = new GoogleGenerativeAI(G);
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
    const answerPath = path.join(answersDir, `${subjectAbbr}.txt`);

    // Skip if answer exists and we're not redoing
    if (!redoExisting && fs.existsSync(answerPath)) {
      console.log(`Skipping ${subjectAbbr} - answer file already exists`);
      continue;
    }

    console.log(`Processing ${subjectAbbr}...`);

    try {
      // Read quiz JSON
      const quiz = JSON.parse(fs.readFileSync(path.join(jsonDir, file), "utf8"));

      // Create prompt for answers
      let prompt = "Answer these questions accurately and concisely:\n\n";

      // Add Section A questions
      prompt += "Section A:\n";
      (quiz.A || []).forEach((q, i) => {
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
      fs.writeFileSync(answerPath, responseText);
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

module.exports = generateAllAnswers;
