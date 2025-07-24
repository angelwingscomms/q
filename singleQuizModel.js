
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { G } = require("./constants");

const genAI = new GoogleGenerativeAI(G);

const singleQuizModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-05-20",
  generationConfig: {
    temperature: 0,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 999999,
    responseMimeType: "application/json",
    responseSchema: {
      type: "OBJECT",
      properties: {
        A: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Section A: Objective questions",
        },
        B: {
          type: "ARRAY",
          items: { type: "STRING" },
          description:
            "Section B: Short answer questions (if a Section B is specified in the source text)",
        },
        C: {
          type: "ARRAY",
          items: { type: "STRING" },
          description:
            "Section C: Theory questions (if a Section C is specified in the source text)",
        },
        answers_A: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Answers for Section A objective questions",
        },
        answers_B: {
          type: "ARRAY",
          items: { type: "STRING" },
          description:
            "Answers for Section B short answer questions (if a Section B is specified in the source text)",
        },
        answers_C: {
          type: "ARRAY",
          items: { type: "STRING" },
          description:
            "Answers for Section C theory questions (if a Section C is specified in the source text)",
        },
      },
      required: ["A", "answers_A"],
    },
  },
});

module.exports = singleQuizModel;
