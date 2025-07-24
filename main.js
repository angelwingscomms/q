
const rl = require("./rl");
const { grades, subjectAbbreviations } = require("./constants");
const displayMenu = require("./displayMenu");
const generateSingleQuiz = require("./generateSingleQuiz");
const generateMultipleQuizzes = require("./generateMultipleQuizzes");
const generateAllAnswers = require("./generateAllAnswers");
const generateAnswersForAllGrades = require("./generateAnswersForAllGrades");
const generateAllQuizzesAllGrades = require("./generateAllQuizzesAllGrades");
const getSubjectFromAbbreviation = require("./getSubjectFromAbbreviation");

/**
 * Entrypoint for the CLI quiz generator.
 */
async function main() {
  try {
    const mode = await new Promise((resolve) => {
      rl.question(
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
        (answer) => resolve(answer)
      );
    });

    const examTypes = ["Midterm", "End of Term"];
    let selectedExamType = null;

    if (
      mode === "1" ||
      mode === "2" ||
      mode === "6" ||
      mode === "7" ||
      mode === "8"
    ) {
      selectedExamType = await displayMenu(examTypes, "Select exam type:");
    }

    if (mode === "8") {
      console.log(
        "Generating ALL quizzes for ALL grades (skipping existing)..."
      );
      await generateAllQuizzesAllGrades({
        examType: selectedExamType,
        skipExisting: true,
      });
    } else if (mode === "7") {
      console.log(
        "Generating ALL quizzes for ALL grades (overwriting existing)..."
      );
      await generateAllQuizzesAllGrades({
        examType: selectedExamType,
        skipExisting: false,
      });
    } else if (mode === "6") {
      // Grade selection as a menu of numbers
      const gradeSelection = await new Promise((resolve) => {
        console.log("Which grade?");
        Object.keys(grades).forEach((key) => {
          console.log(`${key}. Grade ${grades[key]}`);
        });

        rl.question("Enter grade number (1-5): ", (answer) => {
          const gradeNum = parseInt(answer);
          if (!isNaN(gradeNum) && grades[gradeNum]) {
            resolve(grades[gradeNum]);
          } else if (Object.values(grades).includes(answer.toUpperCase())) {
            resolve(answer.toUpperCase());
          } else {
            console.log("Invalid grade. Please try again.");
            rl.question("Enter grade number (1-5): ", (retryAnswer) => {
              const retryGradeNum = parseInt(retryAnswer);
              if (!isNaN(retryGradeNum) && grades[retryGradeNum]) {
                resolve(grades[retryGradeNum]);
              } else {
                console.log("Invalid grade again. Defaulting to Grade ONE.");
                resolve("ONE");
              }
            });
          }
        });
      });

      console.log("Generating multiple quizzes (skipping existing)...");
      await generateMultipleQuizzes({
        g: gradeSelection,
        skipExisting: true,
        examType: selectedExamType,
      });
    } else if (mode === "5") {
      // Ask about redoing existing answers
      const redoExisting = await new Promise((resolve) => {
        rl.question("Redo existing answers? (y/N): ", (answer) => {
          resolve(answer.toLowerCase() === "y");
        });
      });

      console.log("Generating answers for all grades and subjects...");
      await generateAnswersForAllGrades(redoExisting);
    } else if (mode === "4") {
      // Grade selection
      const gradeSelection = await new Promise((resolve) => {
        console.log("Which grade?");
        Object.keys(grades).forEach((key) => {
          console.log(`${key}. Grade ${grades[key]}`);
        });

        rl.question("Enter grade number (1-5): ", (answer) => {
          const gradeNum = parseInt(answer);
          if (!isNaN(gradeNum) && grades[gradeNum]) {
            resolve(gradeNum);
          } else {
            console.log("Invalid grade. Defaulting to 1");
            resolve(1);
          }
        });
      });

      // Ask about redoing existing answers
      const redoExisting = await new Promise((resolve) => {
        rl.question("Redo existing answers? (y/N): ", (answer) => {
          resolve(answer.toLowerCase() === "y");
        });
      });

      await generateAllAnswers({ gradeNum: gradeSelection, redoExisting });
    } else if (mode === "3") {
      // Grade selection
      const gradeSelection = await new Promise((resolve) => {
        console.log("Which grade?");
        Object.keys(grades).forEach((key) => {
          console.log(`${key}. Grade ${grades[key]}`);
        });

        rl.question("Enter grade number (1-5): ", (answer) => {
          const gradeNum = parseInt(answer);
          if (!isNaN(gradeNum) && grades[gradeNum]) {
            resolve(gradeNum);
          } else {
            console.log("Invalid grade. Defaulting to 1");
            resolve(1);
          }
        });
      });

      // Subject selection by abbreviation
      const subjectAbbr = await new Promise((resolve) => {
        console.log("\nAvailable subjects (use abbreviation to select):");
        Object.entries(subjectAbbreviations).forEach(([subject, abbr]) => {
          console.log(`${abbr}: ${subject}`);
        });

        const promptForSubject = () => {
          rl.question("\nEnter subject abbreviation: ", (answer) => {
            const trimmedAnswer = answer.trim().toLowerCase();
            if (!trimmedAnswer) {
              console.log(
                "Subject abbreviation cannot be empty. Please try again."
              );
              promptForSubject();
              return;
            }
            if (!Object.values(subjectAbbreviations).includes(trimmedAnswer)) {
              console.log("Invalid subject abbreviation. Please try again.");
              promptForSubject();
              return;
            }
            resolve(trimmedAnswer);
          });
        };

        promptForSubject();
      });

      // Read quiz JSON
      const jsonPath = `./files/output/g${gradeSelection}/json/${subjectAbbr}.json`;
      const fs = require("fs");
      if (!fs.existsSync(jsonPath)) {
        throw new Error(`Quiz JSON not found: ${jsonPath}`);
      }

      const quiz = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

      // Generate answers using Gemini
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

      // Create prompt for answers
      let prompt = "Answer these questions accurately and concisely:\n\n";

      // Add Section A questions
      prompt += "Section A:\n";
      quiz.A.forEach((q, i) => {
        prompt += `${i + 1}. ${q}\n`;
      });

      // Add Section B questions if they exist
      if (quiz.B && quiz.B.length > 0) {
        prompt += "\nSection B:\n";
        quiz.B.forEach((q, i) => {
          prompt += `${i + 1}. ${q}\n`;
        });
      }

      try {
        answerModel.generateContent(prompt).then((result) => {
          const responseText = result.response.text();

          // Save answers to file
          const answersPath = `./files/output/g${gradeSelection}/answers/${subjectAbbr}.txt`;
          fs.writeFileSync(answersPath, responseText);
          console.log(`Answers saved to: ${answersPath}`);

          // Run git commands
          const runGitCommands = require("./runGitCommands");
          runGitCommands();
        });
      } catch (error) {
        console.error(`Error generating answers: ${error.message}`);
        throw error;
      }
    } else if (mode === "2") {
      // Grade selection as a menu of numbers
      const gradeSelection = await new Promise((resolve) => {
        console.log("Which grade?");
        Object.keys(grades).forEach((key) => {
          console.log(`${key}. Grade ${grades[key]}`);
        });

        rl.question("Enter grade number (1-5): ", (answer) => {
          const gradeNum = parseInt(answer);
          if (!isNaN(gradeNum) && grades[gradeNum]) {
            resolve(grades[gradeNum]);
          } else if (Object.values(grades).includes(answer.toUpperCase())) {
            resolve(answer.toUpperCase());
          } else {
            console.log("Invalid grade. Please try again.");
            rl.question("Enter grade number (1-5): ", (retryAnswer) => {
              const retryGradeNum = parseInt(retryAnswer);
              if (!isNaN(retryGradeNum) && grades[retryGradeNum]) {
                resolve(grades[retryGradeNum]);
              } else {
                console.log("Invalid grade again. Defaulting to Grade ONE.");
                resolve("ONE");
              }
            });
          }
        });
      });

      console.log("Generating multiple quizzes...");
      await generateMultipleQuizzes({
        g: gradeSelection,
        skipExisting: false,
        examType: selectedExamType,
      });
    } else if (mode === "1") {
      // Grade selection as a menu of numbers
      const gradeSelection = await new Promise((resolve) => {
        console.log("Which grade?");
        Object.keys(grades).forEach((key) => {
          console.log(`${key}. Grade ${grades[key]}`);
        });

        rl.question("Enter grade number (1-5): ", (answer) => {
          const gradeNum = parseInt(answer);
          if (!isNaN(gradeNum) && grades[gradeNum]) {
            resolve(grades[gradeNum]);
          } else if (Object.values(grades).includes(answer.toUpperCase())) {
            resolve(answer.toUpperCase());
          } else {
            console.log("Invalid grade. Please try again.");
            rl.question("Enter grade number (1-5): ", (retryAnswer) => {
              const retryGradeNum = parseInt(retryAnswer);
              if (!isNaN(retryGradeNum) && grades[retryGradeNum]) {
                resolve(grades[retryGradeNum]);
              } else {
                console.log("Invalid grade again. Defaulting to Grade ONE.");
                resolve("ONE");
              }
            });
          }
        });
      });

      // Subject selection by abbreviation
      const subject = await new Promise((resolve) => {
        // Show available subjects and their abbreviations
        console.log("\nAvailable subjects (use abbreviation to select):");
        Object.entries(subjectAbbreviations).forEach(([subject, abbr]) => {
          console.log(`${abbr}: ${subject}`);
        });

        rl.question("\nEnter subject abbreviation: ", (answer) => {
          const selectedSubject = getSubjectFromAbbreviation(answer.trim());
          if (selectedSubject) {
            resolve(selectedSubject);
          } else {
            console.log("Invalid subject abbreviation. Please try again.");
            rl.question("Enter subject abbreviation: ", (retryAnswer) => {
              const retrySubject = getSubjectFromAbbreviation(
                retryAnswer.trim()
              );
              if (retrySubject) {
                resolve(retrySubject);
              } else {
                console.log(
                  "Invalid subject abbreviation again. Defaulting to Math."
                );
                resolve("Math");
              }
            });
          }
        });
      });

      // Generate single quiz
      await generateSingleQuiz({
        g: gradeSelection,
        t: null,
        s: subject,
        examType: selectedExamType,
      });
    } else {
      throw new Error("Invalid mode selection");
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    if (!rl.closed) {
      rl.close();
    }
  }
}

module.exports = main;
