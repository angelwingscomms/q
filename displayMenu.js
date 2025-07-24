
const rl = require("./rl");

/**
 * Displays a menu of items and prompts the user to select one.
 * @param {Array<string>} items - The list of items to display.
 * @param {string} prompt - The prompt message to show before the menu.
 * @returns {Promise<string>} The selected item.
 */
async function displayMenu(items, prompt) {
  return new Promise((resolve) => {
    console.log(prompt);
    items.forEach((item, index) => {
      console.log(`${index + 1}. ${item}`);
    });

    rl.question("Enter your selection (number): ", (answer) => {
      const selection = parseInt(answer);
      if (!isNaN(selection) && selection >= 1 && selection <= items.length) {
        resolve(items[selection - 1]);
      } else {
        console.log("Invalid selection. Please try again.");
        resolve(displayMenu(items, prompt));
      }
    });
  });
}

module.exports = displayMenu;
