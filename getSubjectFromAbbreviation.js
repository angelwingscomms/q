
const { subjectAbbreviations } = require("./constants");

/**
 * Gets the full subject name from its abbreviation.
 * @param {string} abbr - The subject abbreviation (e.g., "m" for Math).
 * @returns {string|null} The full subject name, or null if not found.
 */
function getSubjectFromAbbreviation(abbr) {
  abbr = abbr.toLowerCase();
  for (const [subject, abbreviation] of Object.entries(subjectAbbreviations)) {
    if (abbreviation === abbr) {
      return subject;
    }
  }
  return null;
}

module.exports = getSubjectFromAbbreviation;
