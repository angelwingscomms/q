
Create a quiz with:
Section A, Section B, and Section C.

Each section should be an array of strings containing the questions for that section.

Section A should contain objective questions (multiple choice).
Section B should contain short answer questions.
Section C should contain essay/theory questions.
IMPORTANT: Provide answers for all questions in each section in the corresponding answers_A, answers_B, and answers_C arrays.

Format requirements:

# For Section A (objective questions):
- Never end with a full stop
- Use 1 underscore (_) for blanks
- Never end a question with a blank
- Use brackets for options (e.g., (a)...(b)...(c)...) and place questions and options on same line
- Fix bad questions by removing or replacing options to ensure one correct answer
- Questions may end with question marks
- For answers_A, provide only the letter of the correct option (a, b, c, etc.) or the word that fills the blank

- 
Each question must:
– Be closed-ended (True/False or Multiple Choice)
– Ask for a very simple fact or basic concept
– Use extremely simple words and grammar
– Require one-word or short-phrase answers


# For Section B (short answer questions):
- Use 9 underscores (_________) for blanks
- For answers_B, provide concise answers

- 
Each question should:
– Ask for a specific fact (e.g. person, name, object, place, event)
– Require a short answer (1–3 words)
– Be written in plain language (avoid complex phrasing)
– Avoid “why”, “how”, or any question that needs explanation or opinion
– Focus on basic recall, not reasoning or values

Do not include:
– Definitions
– Moral judgments
– Personal views or behavior-based questions
– Multi-part questions


# For Section C (essay questions):
- Make questions clear and concise
- Maintain academic language level
- For answers_C, provide brief model answers or key points

- Create simple questions. Each question should ask for a basic fact and require a short, direct answer (like one word or a short phrase). Use only clear, simple language. Avoid explanation or reasoning.

let the questions be numbered.
refrain from mentioning or referencing the source text that the quiz is made from. Never say something like "according to the text" or "from the text"
sections may have subsections, with headings, instructions for the questions that follow perhaps, or passages, or just such parts that are not really questions in themselves, e.g "Write the short form of the following words". Add such parts as unnumbered questions, except for mainsections A, B and C.
Let section A contain exactly 30 objective questions. Let section B contain exactly 5 short-answer questions. Let section C contain exactly 5 essay/theory questions.

Text to create quiz from:
  """
  ### Mathematics

**Time**
*(Image of a clock face)*

The clock face shows 12-hour clock times. The long hand on the clock face is called minute hand. It tells the number of minutes past or to the hour. The short hand on the clock face is called the hour hand.

*(Images of clocks showing 4 o'clock and 8 o'clock)*
- 4 o'clock
- 8 o'clock

**Classwork**
Write the following time
*(Images of clocks for classwork)*

**Homework**
Write the following time
*(Images of clocks for homework)*

---

### Math

**Analogue and digital time**

*(Image of a clock at 5:00)*
- Analogue time: 5 o'clock
- Digital time: 5:00

*(Image of a clock at 5:30)*
- Analogue time: half past 5
- Digital time: 5:30
 """
  