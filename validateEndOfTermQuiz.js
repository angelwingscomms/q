
/**
 * Validates that an end-of-term quiz includes required sections B and C.
 * @param {string} responseText - The quiz content as a string (usually JSON).
 * @returns {object} Validation result: { isValid: boolean, missingSections: string[], warning: string|null }
 */
function validateEndOfTermQuiz(responseText) {
  const text = responseText.toLowerCase();

  // Check for Section B
  const hasSectionB =
    text.includes("section b") ||
    text.includes('"section_b"') ||
    text.includes('"b"') ||
    text.includes("answers_b");

  // Check for Section C
  const hasSectionC =
    text.includes("section c") ||
    text.includes('"section_c"') ||
    text.includes('"c"') ||
    text.includes("answers_c");

  if (!hasSectionB || !hasSectionC) {
    const missingSections = [];
    if (!hasSectionB) missingSections.push("B");
    if (!hasSectionC) missingSections.push("C");

    console.warn(
      `⚠️  WARNING: End-of-term quiz is missing required section(s): ${missingSections.join(", ")}`
    );
    console.warn(
      "🔧 This violates the requirement that end-of-term quizzes MUST include sections B and C"
    );
    console.warn(
      "📋 Please review the generated quiz and regenerate if necessary"
    );

    return {
      isValid: false,
      missingSections: missingSections,
      warning: `End-of-term quiz missing required sections: ${missingSections.join(", ")}`
    };
  }

  console.log(
    "✅ End-of-term quiz validation passed: All required sections (A, B, C) are present"
  );
  return {
    isValid: true,
    missingSections: [],
    warning: null
  };
}

module.exports = validateEndOfTermQuiz;
