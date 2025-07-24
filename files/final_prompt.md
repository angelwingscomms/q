

Create a quiz with:
Section A, Section B, Section C.


*** CRITICAL REQUIREMENT FOR END OF TERM QUIZ ***
This is an END OF TERM quiz, which means ALL THREE SECTIONS (A, B, AND C) are MANDATORY and MUST be included.
DO NOT skip Section B or Section C under any circumstances.
*** END OF CRITICAL REQUIREMENT ***


Each section should be an array of strings containing the questions for that section.

Section A should contain objective questions (multiple choice).
Section B should contain short answer questions.
Section C should contain essay/theory questions.
IMPORTANT: Provide answers for all questions in each section in the corresponding answers_A, answers_B, and answers_C arrays.

Format requirements:

# For Section A (objective questions):
- Never end a question with a full stop
- A question may end with question mark
- Use 1 underscore (_) for blanks
- Never end a question with a blank
- Use brackets for options (e.g., (a)...(b)...(c)...) and place questions and options on same line
- Fix bad questions by removing or replacing options to ensure one correct answer
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
- Maintain academic language level
- For answers_C, provide brief model answers or key points

- Create simple questions. Each question should ask for a basic fact and require a short, direct answer (like one word or a short phrase). Use only clear, simple language. Avoid explanation or reasoning.




make all questions clear and short
let the questions be numbered.
refrain from mentioning or referencing the source text that the quiz is made from. Never say something like "according to the text" or "from the text"
A section may have subsections, which may have headings, stories or instructions for the questions that follow perhaps, or passages, or just such parts that are not really questions in themselves, e.g "Write the short form of the following words" or "<a story required for the questions in this section to be answered>". Add such parts or subheadings or stories or instruction as unnumbered questions.
MANDATORY: Let section A contain exactly 20 objective questions. Let section B contain exactly 5 short-answer questions. Let section C contain exactly 5 essay/theory questions.

CRITICAL: For END OF TERM quizzes, sections B and C are REQUIRED and must ALWAYS be included regardless of grade level or any other factors.

Text to create the quiz with:
  """
  PVS
The Home
A home is a place where members of a family live. Home is different from house because house is a building which is the home for a family. A home may be for nuclear or extended families. Home is a place of shelter for a family.
Items found in different parts of a home are:
Television
Radio
Table fan
Gas cooker
Ceiling fan

P.V.S.
Different part of a home and their Uses
1. Living room or sitting room: This is a place where we entertain visitors, where we relax and watch television.
2. Dining room: This is a room where we eat.
3. Bedroom: This is a room where we sleep.
4. Kitchen: This is where foods are prepared.
5. Toilet: We use the toilet to urinate or defecate.
6. Bathroom: This is where we take our bath.
Part of a home and items found in them
Dining room: Dining chairs, Dining table spread and cover, glass cup, mugs, forks, spoon etc.
Bedroom: Bed, Bed sheet, mattress, wardrobes, Dressing mirror, pillow.
Kitchen: Gas cooker, electric cooker, cupboard, kitchen utensils, fridge and freezer.
Bathroom and toilet: Sink, water bucket, buckets, sponge, soap, toothpaste, toothbrush, wash basin etc.

PVS
Toilet Hygiene
A toilet is a place where we pass urine, pass faeces or defecate. Toilet is one of the parts of a home. In Nigeria, people make use of different types of toilets.

PVS
Types of toilet
Below are the types of toilets used in the olden days and at present
1. Hole toilet
2. pit latrine
3. Sink and Water closet
4. Bucket toilet

PVS
Items in a toilet
A toilet must have the following items:
1. Bucket and water
2. Soap and detergents
3. Broom
4. Towel
5. Disinfectant - liquids
6. Tissue paper
7. Hand wash basin
8. Scrubbing stick
Proper use of the Toilet
The following are proper ways to use toilets.
a. Sit properly on water closet
b. flush the toilet after use
c. clean properly with water or tissue paper after using the toilet.
d. Wash your hands with soap and water after using the toilet.

PVS
Types of Dirt
Dirt are pieces of refuse which litter our surroundings. The following are the types of dirt:
1. pieces of paper and card
2. leaves and flowers
3. Rags
4. Dust
5. Cobwebs
6. Nylon of sachet water
7. Empty packs, boxes and cartons
8. polythene bags
9. food remnants
10. Broken bottles

PVS
Good feeding habits
Good feeding habits mean what you are allowed to do before, during and after eating. The following are good feeding habits:
1. Eat in a clean place.
2. Wash your hands before and after eating.
3. Do not put too much food into your mouth.
4. Use your right hand to eat.
5. Do not talk while eating.
6. Chew the food in your mouth before swallowing it.

PVS
Land and its uses
Land is the part of the earth's surface covered with soil. It is an area of ground.
Types of land
1. Rocky land: This is a land with rocks.
2. Swampy land: This is a land that has so much water where plants grow.
3. Dry land: This is a land that has little water.
Uses of land
1. We plant crops on land.
2. Farm animals move on land.
3. Road is constructed on land.
4. We build houses on land.
5. Human beings live on land.
Activities
Make a list of different things found on the land.

PVS
The Sun and its uses
The Sun is an object that is far away from the earth and shines above the earth. The sun rises in the morning to provide light. The sun sets in the evening to usher in night. The energy from the sun is called solar energy.
Uses of the Sun
The sun is use for the following purposes:
1. It provides daylight.
2. It is used to dry crops like maize, beans, pepper etc.
3. It makes plants to grow well.
4. It warm our body.
Evaluation
1. When does the sun rise?
2. When does the sun set?
3. Energy from the sun is called __
 """
