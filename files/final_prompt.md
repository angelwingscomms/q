
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
Let section A contain exactly 40 objective questions. Let section B contain exactly 5 short-answer questions. Let section C contain exactly 5 essay/theory questions.

Text to create quiz from:
  """
  ### **WEEK 1&2: MEANING OF VALUES**

Value can be defined as the degree of quality or worth of a thing. Value can also be defined as the laid down rules or standard that guide an individual's interactions with people. Value influences our character and attitude towards other people. Value is the acceptable way of life by a group in a particular society.

Value also includes people’s belief, language, arts and ways of life. Culture is the total way of life of the people and this culture cannot be separated from the people. Since the culture of the people cannot be separated from the people, it is then not possible to remove the value, beliefs and custom of a group of people from their culture.

**Types of value**
1.  **Discipline:** it is the ability of an individual to control his or her own behaviors
2.  **Honesty:** It is the ability of being truthful and straight forward at all times.
3.  **Selflessness:** It is the ability to show more interest in the welfare of other people
4.  **Courage:** This is ability to face difficulty, danger or pain without fear.
5.  **Integrity:** It is the ability to stand and stick to sound morals and principle at all times.
6.  **Sincerity:** it is the ability to be open minded and to have clear mind towards issue
7.  **Co-operation:** Ability to work with other people to achieve a common goal.
8.  **Fairness:** It is the ability of been considerate and to avoid cheating
9.  **Justice:** It is the ability of being just, righteous and upright.
10. **Contentment:** It is a means of being happy and satisfied with what one has.

**IMPORTANCE OF VALUE IN ART AND CRAFT AND MUSIC IN THE SOCIETY**
1.  It guides the practice of art by setting rules
2.  It sets standard about how art is to be practiced.
3.  It helps provide solution to problems about the practice of art and craft and music
4.  It shows how knowledge in art and craft, and music is to be transferred from one generation to other generation
5.  It helps art and craft and music to embrace new inventions in the practice, such as improvisation and recycling

---

### **WEEK 3&4: METHOD OF INCULCATING VALUES**

**METHOD OF INCULCATING VALUE**
1.  Improvisation
2.  Recycling
3.  Costume
4.  Make up

**MEANING OF IMPROVISATION**
Improvisation is the activity of making or doing something not planned beforehand, using whatever can be found. Improvisation in the performing arts is a very spontaneous performance without specific or scripted preparation. Improvisation is also known as alternative materials. For example:
1.  **Brush:** Chewed stick, sponge tied to the end of stick, Grass, raffia foam e.t.c
2.  **Pen:** stick with flat end, feather, and strip of hard paper Or board e.t.c.
3.  **Canvas:** printed cloth with emulsion and glue
4.  **Color:** Red mud, color from leaves

**MEANING OF RECYCLING**
Recycling is the changing waste or used materials into new objects or materials. When waste or used Materials reused, it is called recycling. It is also the process of converting waste materials into new materials and object.
Recycling has many benefits such as:
1.  Decoration
2.  Beautification
3.  Design

**COSTUME**
Costumes refer to various attire especially made for the use of an actors in theatrical production. Costumes are clothes worn by actresses or actors, which assist them to assume different forms of character aside their true self.
Examples includes: A pastor, Alfa or imam, Herbalist, Witch.

**MAKE-UP**
Make up on its own is applied on the actor’s body as an enhancement or aid to characterization. For example: Gray hair or beard, Tribal marks.

---

### **WEEK 5&6: CHARACTERISTICS OF VALUE IN CULTURAL AND CREATIVE ART**

**CHARACTERISTICS OF ARTS AND CRAFT IN CULTURAL AND CREATIVE ART**
Value needed in arts and creative work. Arts and craft are very useful for preserving the culture, arts and way of life of the people in a giving society. Values that are needed include the following:
I. Creativity
II. Hard work
III. Honesty
IV. Precision

**Values are needed to:**
1.  it help to sustain the practice of arts and craft in order to bring gain economically
2.  it preserve the art culture
3.  it help to inform the society about the culture practiced in a particular society
4.  it help to inculcate cultural practice
5.  it help to develop an acceptable behavior
6.  it help in the documentation, preservation and promotion of the cultural practice of the society.

---

### **WEEK 7&8 AND WEEK 8&9: MEANING OF IMPROVISATION**

**MEANING OF IMPROVISATION**
Improvisation is the activity of making or doing something not planned beforehand, using whatever can be found. Improvisation in the performing arts is a very spontaneous performance without specific or scripted preparation. Improvisation is also known as alternative materials. For example:
1.  **Brush:** Chewed stick, sponge tied to the end of stick, Grass, raffia foam e.t.c
2.  **Pen:** stick with flat end, feather, and strip of hard paper Or board e.t.c.
3.  **Canvas:** printed cloth with emulsion and glue
4.  **Color:** Red mud, color from leaves

**ARTS MATERIALS AND THEIR IMPROVISED ONES**

| ARTS MATERIALS | IMPROVISED ONES |
| :--- | :--- |
| 1. Brush | chewing stick, sponge tied to the end of a stick, grass etc |
| 2. Pen | stick with flat end, feather and strip of hard paper or board |
| 3. Color | red mud and color from leaves |

---

### **WEEK 11&12: MEANING OF IMPROVISATION**

Art materials and their alternative materials are used in arts for design and decorative or beautification. Sometimes, they are mixed together or used separately for the purposes of arts. The following are the materials and their alternatives:

1.  **color:** leaves, red mud, roots, stems.
2.  **lettering pen:** flat edge stick
3.  **brush:** soft wood with raffia, grass.

**SIMILARITIES AND CHARACTERISTICS OF MATERIALS AND ALTERNATIVES**

**SIMILARITIES**
1.  Both can be used for the same purposes.
2.  Both are reckoned with as materials for making artwork.

**DIFFERENCES**
1.  Improvised materials are cheaper than the original materials
2.  Improvised materials can be easily found in the environment while original or actual objects cannot. They are mostly bought.
3.  Improvised materials are duplicate of the original materials.
4.  Improvised materials cannot represent the original sometimes.
5.  Improvised are used as blueprint for the original materials.
 """
  