
const fs = require("fs");
const path = require("path");
const { gradeToSectionMap } = require("./constants");

/**
 * Updates the todolist-data.json file to mark a subject/grade as done.
 * @param {string} subject - The subject name (e.g., "Math").
 * @param {string} grade - The grade name (e.g., "ONE").
 */
function updateTodolistData(subject, grade) {
  const todolistDataPath = path.join(__dirname, "./todolist-data.json");

  // Check if todolist-data.json exists
  if (!fs.existsSync(todolistDataPath)) {
    console.log("todolist-data.json not found. No update performed.");
    return;
  }

  try {
    // Read the current todolist data
    const todoData = JSON.parse(fs.readFileSync(todolistDataPath, "utf8"));

    // Map the grade to the corresponding section
    const section = gradeToSectionMap[grade];

    // If the section is not mapped, log a warning and return
    if (!section) {
      console.log(
        `Warning: Grade ${grade} does not map to a known section. No update performed.`,
      );
      return;
    }

    // Check if the subject exists in the todolist data
    if (todoData[subject] && todoData[subject][section]) {
      // Update the 'done' status to true
      todoData[subject][section].done = true;

      // Write the updated data back to the file
      fs.writeFileSync(todolistDataPath, JSON.stringify(todoData, null, 2));
      console.log(
        `Updated todolist-data.json: Marked ${subject} (${section}) as done.`,
      );
    } else {
      console.log(
        `Warning: Subject ${subject} or section ${section} not found in todolist data.`,
      );
    }
  } catch (error) {
    console.error("Error updating todolist-data.json:", error.message);
  }
}

module.exports = updateTodolistData;
