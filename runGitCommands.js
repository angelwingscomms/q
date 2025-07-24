
const { exec } = require("child_process");

/**
 * Runs git add, commit, and push commands in sequence.
 * @returns {Promise<void>} Resolves when git commands complete.
 */
function runGitCommands() {
  return new Promise((resolve, reject) => {
    console.log("Running git commands...");
    exec(
      'git add .; git commit --allow-empty -m "Add new quiz"; git push',
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Git command error: ${error.message}`);
          reject(error);
          return;
        }
        if (stderr) {
          console.log(`Git stderr: ${stderr}`);
        }
        console.log(`Git commands executed: ${stdout}`);
        resolve();
      }
    );
  });
}

module.exports = runGitCommands;
