
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
Let section A contain exactly 40 objective questions. Let section B contain exactly 5 short-answer questions. Let section C contain exactly 5 essay/theory questions.

Text to create the quiz with:
  """
  # multiple choice questions
first, present the comprehension below text and ask  8 questions based on the text
USE this EXACT comprehension text:
```plaintext
The ancient Iroko tree stood majestically in the village square. Its massive branches spread wide like a chief's welcoming embrace. Weaver birds built their intricate nests in its leaves, their cheerful chirps filling the air all day long. A small stream, 'Odo-Aro', flowed gently nearby, its water cool and clear. Children from the village often gathered under the Iroko, sharing tales and laughter. They etched their names into its rugged bark, marking their childhood memories over many seasons. The Iroko was a silent witness to countless sunny market days and moonlit nights, a true guardian of the community.
```
let the text have a Nigerian flair, 
MAKE SURE THE COMPREHENSION TEXT IS INCLUDED IN THE QUESTIONS AS AN UNNUMBERED PARAGRAPH
and let the questions be challenging

next 12 questions should be on lexis and structure
then all in a mix of 10 questions, questions on past perfect tense, present perfect tense, pronouns, verbs and adverbs.
set 10 questions by writing a short story full of wrongly spelled words and offering the class correct options in parenthesis to select from

# short answer sections questions
present a short poem and ask 5 simple literary questions on the poem, like rhyming, 'provide similar words', 'provide a title', and 2 comprehension questions. 

```plaintext
now consider these questions:
```
1. What did the little bird sing? _________

2. Where was the bird singing? _________

3. What color were its feathers? _________

4. What did the bird have for a home? _________

5. What whispered through the leaves? _________
```

MAKE SURE THE STORY IS INCLUDED IN THE QUESTIONS AS AN UNNUMBERED PARAGRAPH
let the story have a Nigerian flair. Let the questions seem to simple. for the short answer poetry section, upgrade the language to be suitable for 10 year olds, and let the questions be slightly challenging

# essay section questions
instruction: answer 1 out of 2
1. write an informal letter to your cousin requesting her to teach you how to play basket ball during the summer holiday.

2. rewrite your favourite fairy tale story using your own choice of names for the characters
 """
  