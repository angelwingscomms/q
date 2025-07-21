
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
A section may have subsections, which may have headings, stories or instructions for the questions that follow perhaps, or passages, or just such parts that are not really questions in themselves, e.g "Write the short form of the following words" or "<a story required for the questions in this section to be answered>". Add such parts or subheadings or stories or instruction as unnumbered questions.
Let section A contain exactly 50 objective questions. Let section B contain exactly 5 short-answer questions. Let section C contain exactly 5 essay/theory questions.

Text to create the quiz with:
  """
  # multiple choice questions
first, present this exact text and ask 8 comprehension questions based on it:
```plaintext
Every morning, Lily would step into her vibrant garden. Her favorite bloom was a radiant red rose, its petals soft and velvety. Soon, tiny, industrious bees would arrive, buzzing around the rose, diligently gathering sweet nectar. In the cool evenings, Lily often sat on her small porch, observing the colorful sunset paint the sky. The peaceful quiet of her garden always brought her a sense of calm and happiness. Her garden, though not sprawling, was a treasure trove of beauty and tranquility.
```

let the next 12 questions be on lexis and structure

then all in a mix of 20 questions, questions on synonyms, antonyms, past perfect tense and adjectives. for antonyms and synonyms questions, you shouldn't only use the words 'antonym' or 'synonym', but mix with other phrases like 'similar word' or 'opposite word'. Use challenging words.

set 10 questions by writing a short story full of wrongly spelled words and offering the class correct options in parenthesis to select from

For all questions, let's imagine 0% is the lowest possible ease level and 100% is the highest possible ease level. Let the questions have an ease level of 9%. Let the questions' ease be suitable for 10 year olds

# short answer questions
present this exact poem ask 5 simple questions on it:
```plaintext
In meadows green, where daisies gleam,
A gentle stream began to flow.
A tiny fish, a silver dream,
Swam gracefully, swift and low.
The sun shone down, a golden light,
Upon the water, clear and cool.
A buzzing bee took happy flight,
From flower to flower, a busy tool.
The quiet breeze, a soft sigh,
Made willow branches gently sway.
```

For all the questions above, let's imagine 0% is the lowest possible ease level and 100% is the highest possible ease level. Let the questions have an ease level of 9%. Let the questions' ease be suitable for 10 year olds


# essay questions
Give these exact questions:
Instruction: answer 2
1. You are a member of the Young Innovators' club in your school, you would like to see your club engage in more activities related to AI. Write a formal letter to the Head of School suggesting ways this can be done.
2. Write an informal letter to your cousin requesting her to teach you how to play basket ball during the summer holiday.
3. Describe your favourite whole family outing day.
4. Rewrite your favourite story using your own choice of names for the characters, in not less than 30 lines
 """
  