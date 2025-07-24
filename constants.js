
// All constants and configuration objects used throughout the quiz generator

require("dotenv").config();

const { ext } = require("./ext.mjs");

// API Key and Model Config
const G = process.env.GEMINI || "AIzaSyDTEmZHoCBO8QQ_zk3ecByY31waTm9srsQ";

// Grade mappings
const grades = {
  1: "ONE",
  2: "TWO",
  3: "THREE",
  4: "FOUR",
  5: "FIVE",
};

// Subject abbreviations
const subjectAbbreviations = {
  Math: "m",
  "English Language": "e",
  "Basic Science and Technology": "bst",
  Computer: "c",
  History: "h",
  "Physical and Health Education": "phe",
  "National Values": "nv",
  "Cultural and Creative Arts": "cca",
  "PreVocational Studies": "pvs",
  French: "f",
  "Religious Studies": "rs",
  Music: "ms",
  "Civic Education": "ce",
};

// List of subjects
const subjects = [
  "Math",
  "English Language",
  "Basic Science and Technology",
  "Computer",
  "History",
  "Physical and Health Education",
  "National Values",
  "Cultural and Creative Arts",
  "PreVocational Studies",
  "French",
  "Religious Studies",
  "Music",
];

// Grade to todolist section mapping
const gradeToSectionMap = {
  ONE: "g1",
  TWO: "g2",
  THREE: "g3",
  FOUR: "g4",
  FIVE: "g5",
};

module.exports = {
  G,
  ext,
  grades,
  subjectAbbreviations,
  subjects,
  gradeToSectionMap,
};
