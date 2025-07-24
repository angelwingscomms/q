const fs = require("fs");
const path = require("path");
const { grades } = require("./constants");
const generateMultipleQuizzes = require("./generateMultipleQuizzes");

/**
 * Generates all quizzes for all grades, optionally skipping existing files.
 * @param {Object} params
 * @param {string} params.examType - "Midterm" or "End of Term"
 * @param {boolean} [params.skipExisting=false] - Whether to skip existing output files.
 */
async function generateAllQuizzesAllGrades({ examType, skipExisting = false }) {
  console.log(`Starting to generate ${examType} quizzes for all grades...`);

  // First, scan all grades for existing quizzes
  if (skipExisting) {
    console.log("\nScanning for existing quizzes...");
    let totalExisting = 0;

    for (const gradeNum of Object.keys(grades)) {
      const gradeName = grades[gradeNum];
      const jsonDir = path.join(__dirname, `./files/output/g${gradeNum}/json`);

      if (fs.existsSync(jsonDir)) {
        const existingFiles = fs
          .readdirSync(jsonDir)
          .filter((f) => f.endsWith(".json"));
        if (existingFiles.length > 0) {
          console.log(
            `  Grade ${gradeName}: ${existingFiles.length} existing quizzes (${existingFiles.join(", ")})`,
          );
          totalExisting += existingFiles.length;
        } else {
          console.log(`  Grade ${gradeName}: no existing quizzes`);
        }
      } else {
        console.log(`  Grade ${gradeName}: no output directory yet`);
      }
    }

    console.log(`\nTotal existing quizzes found: ${totalExisting}`);
    console.log(
      skipExisting
        ? "Will skip existing files.\n"
        : "Will overwrite existing files.\n",
    );
  }

  const gradeKeys = Object.keys(grades);
  const totalGrades = gradeKeys.length;
  let processedGrades = 0;

  for (const gradeNum of gradeKeys) {
    const gradeName = grades[gradeNum];
    processedGrades++;

    console.log(
      `\n=== Processing Grade ${gradeName} (${gradeNum}) [${processedGrades}/${totalGrades}] ===`,
    );

    // Check what subjects are available for this grade
    const jsonPath = path.join(__dirname, `./files/input/${gradeNum}.json`);
    const folderPath = path.join(__dirname, `./files/input/${gradeNum}`);

    let subjectCount = 0;
    if (fs.existsSync(jsonPath)) {
      try {
        const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
        subjectCount = Object.keys(jsonData).length;
        console.log(
          `Found ${subjectCount} subjects in JSON file for Grade ${gradeName}`,
        );
      } catch (error) {
        console.log(
          `Could not read JSON file for Grade ${gradeName}: ${error.message}`,
        );
      }
    } else if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath);
      subjectCount = files.length;
      console.log(
        `Found ${subjectCount} subject files in folder for Grade ${gradeName}`,
      );
    } else {
      console.log(`No input data found for Grade ${gradeName}`);
    }

    try {
      await generateMultipleQuizzes({
        g: gradeName,
        skipExisting: skipExisting,
        examType: examType,
      });
      console.log(
        `✓ Completed Grade ${gradeName} (${processedGrades}/${totalGrades})`,
      );
    } catch (error) {
      console.error(`✗ Error processing Grade ${gradeName}: ${error.message}`);
      // Continue with next grade even if this one fails
    }
  }

  console.log("\n=== All grades processing complete ===");
  console.log(`Processed ${totalGrades} grades total.`);
}

module.exports = generateAllQuizzesAllGrades;
