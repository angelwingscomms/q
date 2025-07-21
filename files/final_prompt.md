
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

# For Math quizzes specifically:
- Always use perfect Unicode for any math sums, fractions, or symbols (e.g., ½, ¾, ², ³, ×, ÷, ±, ≤, ≥, π, ∞)
- Let all fractions always use Unicode creatively in the best way possible (prefer ½, ⅓, ¼, ⅕, ⅙, ⅛, ⅔, ¾, ⅖, ⅗, ⅘, ⅚, ⅝, ⅞ over 1/2, 1/3, etc.)
- For math questions that are sum gaps (e.g., 6 times what equals 18), write as: 6 × _ = 18
- Use × as multiplication symbol instead of * in displayed questions
- Think deeply about math questions and math sums when making math quizzes
- Let the questions be coherent and moderately challenging for 10 year olds
- Use proper mathematical notation and Unicode symbols throughout

let the questions be numbered.
refrain from mentioning or referencing the source text that the quiz is made from. Never say something like "according to the text" or "from the text"
A section may have subsections, which may have headings, stories or instructions for the questions that follow perhaps, or passages, or just such parts that are not really questions in themselves, e.g "Write the short form of the following words" or "<a story required for the questions in this section to be answered>". Add such parts or subheadings or stories or instruction as unnumbered questions.
Let section A contain exactly 50 objective questions. Let section B contain exactly 5 short-answer questions. Let section C contain exactly 5 essay/theory questions.

Text to create the quiz with:
  """
  ==Start of OCR for page 1==
WEEK 1
TOPIC: VOLUME
- Volume of prism, cylinder, Sphere
Objectives:
@ To Calculate the volume of prism, Cylinder and sphere using their respective formulas.

Definition:
Volume is the amount of space inside a 3D object. It's like measuring how much water or air can fit inside a Container.

Volume of Prism:
The Volume of a prism is the capacity of the prism. The volume of a prism is the amount of space a prism occupies. A prism is a solid 3-D Shape that has two same faces and other faces that resemble a parallelogram. Its name is influenced by the different shapes of the bases. Every prism has a different base, triangular prism (triangular base), Square prism (square base), rectangular prism (rectangular base) e.t.c.
==End of OCR for page 1==

==Start of OCR for page 2==
UNITS
Volume is usually measured in Units like:
Cubic centimeters (cm³), Cubic meters (m³) and Litres (L)

Formula of volume of prism

[Image of a triangular prism with "Height" labeled along its length.]
Triangular prism.

[Image of a square prism (cuboid) with "Height" labeled.]
Square prism

[Image of a rectangular prism with "Height" labeled.]
Rectangular prism

① Triangular prism:
Base: Triangular
Volume: Base area x height
(Area of triangle x height of the prism)

② Square prism:
Base: Square
Volume: Area of square x height of the prism
==End of OCR for page 2==

==Start of OCR for page 3==
③ Rectangular prism
Base: Rectangle
Volume: Area of Rectangle x height of the prism.

Examples:
① Find the volume of a prism whose base area is 3cm² and height 5cm.
Solution
Volume = base area x height
= 3cm² x 5cm = 15cm³

② What is the base area of the prism if the Volume of the prism is 324m³ and the height of the prism is 9m.
Solution
V = B x H => B = V/H
B = 324/9 = 36m²

③ Work out the volume of the triangular prism;
[Image of a triangular prism with a triangular base of height 3cm and base 8cm. The length/depth of the prism is 10cm.]
3cm
10cm
8cm
==End of OCR for page 3==

==Start of OCR for page 4==
Solution
Volume of prism = Area of cross section x depth
Area of triangle: 1/2 x b x h
A = 1/2 x 8 x 3 = 12cm²

The depth = 10cm
∴ Volume of prism = A x H = (12 x 10)cm² x cm
= 120 cm³

④ Calculate the volume of the L-shaped prism
[Image of an L-shaped prism. The front L-shape has outer dimensions of 7cm (height) and 10cm (width). The inner corner has dimensions of 5cm (from the bottom up) and 6cm (from the left in). The depth of the prism is 12cm.]
6cm
7cm
5cm
12cm
10cm

Solution
- Volume of prism = Area of cross section x depth
- Calculate the area of the cross section
* To Calculate the area of the cross section we need to split it into two rectangles and
==End of OCR for page 4==

==Start of OCR for page 5==
Work out the missing side lengths.
[Image of the L-shaped cross-section divided into two rectangles, A and B.]
10 - 6 = 4cm
7 - 5 = 2cm
7cm A
B
5cm
6cm
10cm

For rectangle A:
Area = (7 x 4)cm = 28cm²

For rectangle B:
Area = (6 x 5)cm = 30cm²

Total Area (A+B) =
28 + 30 = 58cm²

Volume of the prism:
Area x depth (height)
= 58 x 12
= 696cm³
==End of OCR for page 5==

==Start of OCR for page 6==
Class Fun
① A triangular prism has a Volume of 60cm³ and a base area of 12cm². Find its height.
Solution
V = A x H => H = V/A = 60cm³/12cm² = 5cm

② The Volume of a triangular prism is 120m³ and its height is 5m. Calculate the area of its triangular base.
Solution
V = A x H => A = V/H = 120m³/5m = 24m²

③ A triangular prism has a base with sides 3cm and 4cm (forming the base and height of the triangle). If the prism's height is 6cm, what is its Volume?
Solution
Find the area of the triangular base
A = 1/2 b x h = (3x4)/2 = 6cm²

The volume of the prism:
V = A x H = 6 x 6 = 36cm³
==End of OCR for page 6==

==Start of OCR for page 7==
④ A rectangular prism has a Volume of 240cm³, length 8cm and width 5cm. Find its height.
Solution
V = A x H => H = V/A = 240/(8x5) = 240/40 = 6cm

⑤ A square prism has a Volume of 125cm³ and a height of 5cm. Find the side length of its base.
Solution
V = A x H => A = V/H = 125cm³/5 = 25cm²
Since its a square:
A = L² => L = √A = √25 = 5cm

Home Fun
① Find the volume of a square prism with side length 3cm and height 7cm.
Solution
V = A x H = 3x3x7 = 63cm³

② Find the volume of a rectangular prism with length 6cm, width 4cm and height 3cm.
Solution
V = L x w x h = 6x4x3 = 72cm³
==End of OCR for page 7==

==Start of OCR for page 8==
③ The area of a triangular prism's base is 9m² and its volume is 54m³. Calculate the height of the prism.
Solution
V = A x H => H = V/A = 54m³/9m² = 6m

④ A square prism has a Volume of 64cm³. If its height is 4cm, find the side length of its base.
Solution
V = A x H => A = V/H = 64/4 = 16cm²
Area of a square = L x L = L²
L² = 16 => L = √16 = 4cm

Volume of Cylinder
Formula = πr²h (base area x height)
[Image of a cylinder with height 'h' labeled.]
h
==End of OCR for page 8==

==Start of OCR for page 9==
Example:
① 
[Image of a cylinder with height labeled as 16cm.]
16cm

The radius of the base area of the cylinder above is 7cm and the height is 16cm. Find its volume (π= 22/7)
Solution
V = base area x height
= πr² x h => (22/7) x 7² x 16 = 22 x 7 x 16
V = 2464 cm³

② A cylinder has a volume of 300cm³ and a radius of 5cm. Find its height.
Solution
V = A x H
H = V/A
H = 300 / (πr²) = 300 / (22/7 x 5²) = 300 / 78.571
H = 3.818cm
==End of OCR for page 9==

==Start of OCR for page 10==
Class Fun
① Calculate the area of the base of a cylinder with radius 3cm. (π= 22/7)
Solution
A = πr² = (22 x 3 x 3)/7 = 198/7 = 28.29 cm²

② A cylinder's Volume is 200 cm³, and its height is 8cm. Find the radius. Leaving your answer in terms of Pi.
Solution
V = πr²h
200 = πr²(8)
πr² = 200/8 = 25

[A small table is drawn]
| πr² = 25 | r = 5/√π cm |
|---|---|
| r² = 25/π | |
| r = √25/π | |

③ Find the height of a cylinder with Volume 500cm³ and base area 50cm²
Solution
V = A x H => H = V/A = 500/50 = 10cm
==End of OCR for page 10==

==Start of OCR for page 11==
Home Fun (π=22/7)
① Calculate the volume of a Cylinder with radius 6cm and height 4cm.
Solution
V = πr²h => 22/7 x 6² x 4 = 3168/7 = 452.57cm³

② A cylinder has a base area of 25cm² and a Volume of 200 cm³. Find its height.
Solution
V = A x H => H = V/A = 200/25 = 8cm

③ Find the height of a cylinder with Volume 600 cm³ and base area 60cm²
Solution
V = A x H => H = V/A = 600/60 = 10cm

(Pg 210)
Volume of a Sphere: Shape of the earth
The earth is spherical in shape, this means that the earth can be described as a sphere.
The Volume of a sphere is 4/3 πr³, where r = radius of the sphere. Half of a sphere is called a hemisphere.
Therefore, the volume of a hemisphere = 1/2 x 4/3 πr³ = 2/3 πr³
==End of OCR for page 11==

==Start of OCR for page 12==
Example:
Calculate the volume of a sphere of radius 7cm
Solution
V = 4/3 πr³ = 4/3 x 22/7 x 7cm x 7cm x 7cm
V = 4312/3 cm³ = 1437.3 cm³

Class Fun [pg 210, Ex, 1-3]
① r = 2cm; V = 4/3 πr³ = 4/3 x 22/7 x 2³ = 704/21 = 33.52 to 2dp

② r = 5.1cm; V = 4/3 πr³ = 4/3 x 22/7 x 5.1³ = (132.651 x 88)/21
V = 11673.288 / 21 = 555.87 cm³ to 2dp

③ r = 1.1cm; V = 4/3 πr³ = 4/3 x 22/7 x 1.1³ = (88 x 1.331)/21
V = 117.128 / 21 = 5.58 cm³ (to 2 d.p)

Home Fun [Pg 211, Ex, 13-17]
==End of OCR for page 12==

==Start of OCR for page 13==
Solution (Leave your answers to 2 d.p)
⑬ D = 7km, r = D/2 = 7/2 = 3.5km
V = 4/3 πr³ = 4/3 x 22/7 x 3.5³ = (88 x 42.875)/21 = 179.67 km³

⑭ D = 8km, r = D/2 = 8/2 = 4km
V = 4/3 πr³ = 4/3 x 22/7 x 4³ = 5632/21 = 268.19 km³

⑮ D = 12cm, r = 12/2 = 6cm
V = 4/3 πr³ = 4/3 x 22/7 x 6³ = 19008/21 = 905.14 cm³

⑯ D = 6.3cm, r = 6.3/2 = 3.15
[Boxed calculation: 3.15³ = 31.256]
V = 4/3 πr³ = 4/3 x 22/7 x 3.15³ = 2750.517/21 = 130.977
V = 130.98 cm³

⑰ D = 3m, r = 3/2 = 1.5
V = 4/3 πr³ = 4/3 x 22/7 x 1.5³ = (3.375 x 88)/21 = 297/21
V = 14.14 m³
==End of OCR for page 13==

==Start of OCR for page 14==
CLASS FUN [Pg 211, Ex, 25-28]
㉕ r = 8m, V_H = 2/3 πr³ = 2/3 x 22/7 x 8³ = 22528/21 = 1072.76 m³

㉖ d = 8.4km, r = 4.2km, V_H = 2/3 πr³ = 2/3 x 22/7 x 4.2³ = 3259.872/21
V_H = 155.232 ≈ 155.23m³

㉗ d = 12.6cm, r = 6.3cm, V_H = 2/3 πr³ = 2/3 x 22/7 x 6.3³
V_H = 11002.068 / 21 = 523.91cm³

㉘ r = 20km, V_H = 2/3 πr³ = 2/3 x 22/7 x 20³ = 352000/21
V_H = 16761.90 cm³

HOME FUN [pg 211, Ex, 29-32]
r = 3.2m
㉙ d = 6.4m, V_H = 2/3 πr³ = 2/3 x 22/7 x 3.2³ = 1441.792/21
V_H = 68.66m³
==End of OCR for page 14==

==Start of OCR for page 15==
30. d = 15.4km, r = 7.7km, V_H = 2/3 πr³ = 2/3 x 22/7 x 7.7³
V_H = 20087.452 / 21 = 956.55 km³

31. r = 6.6m, V_H = 2/3 πr³ = 2/3 x 22/7 x 6.6³ = 12649.824/21
V_H = 602.37m³

32. r = 7.7m, V_H = 2/3 πr³ = 2/3 x 22/7 x 7.7³ = 20087.452/21
V_H = 956.55m³

TOPIC
CAPACITY [Relationship between litre and cubic centimetre]
The capacity of a container is the ability to hold or receive. It measures (liquid) is in litres.
1 litre = 1000 cubic centimetres [1L = 1000cm³]
The amount of space that a solid occupies is called Volume. The unit of volume is a Cube.
The relationship between litres and cubic centimetres is that litre refers to the volume of liquid in a container, while cubic centimetres is the space of the container.
==End of OCR for page 15==

==Start of OCR for page 16==
Examples:
① Convert 4 litres to Cubic Centimetres.
Solution: 1L = 1000 cm³
4L = 4000cm³

② Convert 7503cm³ to litres.
Solution
1 litre = 1000 cm³
x litre = 7503cm³
Cross multiply
1000x = 7503
x = 7.503L

Note: 1 litre = 1000 millilitres (mL).
1/2 L = 500ml, 1/4 L = 250ml, 1/10 L = 100ml

Also, 1 litre (L) = 100 centilitres (cl), 1/2 L = 50cl
1/2 L = 50cl, 1/4 L = 25cl

Class Fun [pg 215, Ex.2, 1-5]
① 3 litres = 3000ml ② 5L = 5000ml
③ 2 1/2 litres = 2500ml ④ 3.4L = 3400ml ⑤ 1.25L = 1250ml
==End of OCR for page 16==

==Start of OCR for page 17==
Home Fun [Pg 215, Ex. 3, 1-5]
① 2 litres = 200 cl ② 6 litres = 600 cl ③ 4.5 litres = 450 cl
④ 5 litres = 500 cl ⑤ 7 1/2 litres (7.5) = 750 cl

(Additional Class fun)
CLASS FUN [Pg 216, Revision exercise 25 (1-3)]
① A water tank suspended with 4 poles has the following dimension; 30cm, 80cm and 20cm.
a) What is its volume in Cubic centimetres?
b) How many litres of water will it hold when full?
c) If a quarter of the water in the full tank is used, how many litres will remain?
Solution
a) Volume of the water tank = Length x Breadth x Height
= 30cm x 80cm x 20cm = 48000cm³
b) When it is full, it will hold = 48000/1000 litres = 48 litres
c) Volume of Water used = 1/4 x 48 litres = 12 litres
Hence, the remaining amount of water
= 48 litres - 12 litres
= 36 litres
==End of OCR for page 17==

==Start of OCR for page 18==
Solution [PG 216, R.E 25 (1-3)]
① 1 drum = 562 litres of water.
36 drums = x
x = 36 x 562 = 20,232 litres

② L = 0.6m, W = 0.8m, Volume = 72L
1 litre = 1,000cm³
L = 60cm, W = 80cm
V = LBH
H = V / LB = 72,000 / (60 x 80) = 720 / 48 = 15cm

③ Capacity of car petrol tank = 62 litres
1 litre of petrol = N65
Total amount spent to fill = 62 x N65 = N4030
the tank

Home Fun [Pg 216, R.E 25 (4-6)]
④ Capacity of a bucket = 10.274 litres
Capacity of 12 such buckets = 12 x 10.274
= 123.288 litres
==End of OCR for page 18==

==Start of OCR for page 19==
⑤ Capacity of the big tanker:
2640
+ 1750
4,390 litres

⑥ In 1 day = 108 litres of petrol
In 20 days = x
x = 20 x 108
= 2160 litres of petrol

Topic: Speed (pg 199)
- Average Speed, time, distance
Remember the following:
| Units of time | Note: |
| :--- | :--- |
| 60 seconds = 1 minute | a.m (ante meridian) describe the time from midnight to Midday. |
| 60 minutes = 1 hour | p.m (post meridian) describe the time from midday to midnight. |
| 24 hours = 1 day | |
| 7 days = 1 week | |
| 4 weeks = 1 lunar month | |
| 12 Calendar months = 1 year | |
| 13 lunar months + 1 day = 365 days = 1 year | |
==End of OCR for page 19==

==Start of OCR for page 20==
Examples:
① What does quarter to 6 in the evening mean?
Solution
Quarter to, means 15 minutes before (less).
Therefore, the time is:
  hr  mins
  6   00
-     15
  5   45
Ans: 5:45pm

② What does quarter after 9 in the morning mean?
Solution
Quarter after, means 15 minutes past (added to)
Therefore the time is:
  hr  mins
  9   00
+     15
  9   15
Ans: 9:15 a.m
Note: 15 minutes out of 60mins (1 hour) is 15/60 = 1/4 (a quarter).
Thus, a quarter of an hour is 15 minutes, A half an hour is 30 minutes.
==End of OCR for page 20==

==Start of OCR for page 21==
③ Jedidiah starts from home at 7:15am and arrives at school at 8:05am. How long does he take to get to School?
Solution
  hr  min
Finishing time  8   05
Starting "  7   15
Time taken      50
Ans: It takes her 50 mins

④ Isabelle spent 3 hours to travel 216 km. What was her average speed?
Solution
Average speed means total distance travelled divided by the total time taken.
The units of average speed are:
a) km/hr or kmh⁻¹ b) metres/seconds (m/s or ms⁻¹)
Hence:
Average speed = Total distance (km or m) / Total time taken (hours or seconds)
= 216 km / 3hr = 72km/hr
==End of OCR for page 21==

==Start of OCR for page 22==
Class Fun [Pg 181, Ex1, ① a-e]
Home Fun [Pg 181, Ex1, ② a-e]
Solution
Class Fun
① a) Given data:
D = 4800 km, t = 5 hours
Average speed = 4800 km / 5 hrs = 960 km/hr

b) D = 4800 km, t = 6 hours
Average speed = 4800 km / 6 hr = 800 km/hr

c) D = 4800 km, t = 8 hours
Average speed = 4800 km / 8 hr = 600 km/hr

d) D = 4800 km, t = 10 hours
Average speed = 4800 / 10 = 480 km/hr

e) D = 4800 km, t = 12 hrs,
A.S = 4800 / 12 = 400 km/hr
==End of OCR for page 22==

==Start of OCR for page 23==
Home Fun
② * Given data:
a) D = 24km, t = 2hrs
A.S = d/t = 24/2 = 12km/hr

b) D = 24km, t = 3hrs
A.S = d/t = 24/3 = 8km/hr

c) t = 4hrs
A.S = 24/4 = 6km/hr

d) t = 6
A.S = d/t = 24km/6hr = 4km/hr

e) t = 8hrs
A.S = d/t = 24/8 = 3km/hr

Examples:
① A car is driven for 1 hour and travels 86km.
In the next two hours, it travels a further 196km.
Calculate the following:
a) Total distance covered b) Total time taken
c) Average Speed
Solution
Distance covered in 1 hour = 86km
" " " the next 2 hours = 196km
==End of OCR for page 23==

==Start of OCR for page 24==
a) Total distance covered = 86km + 196km = 282km
b) Total time taken = 1hr + 2hrs = 3hrs
c) Average speed = Total distance covered / Total time taken = 282km / 3hr
= 94km/hr

Lagos and Maiduguri is
② The distance between 1680km. A train left Lagos at 9:00 a.m. and reached Maiduguri at 3:00 p.m. the following day. What was the average speed of the train?
Solution
Given data:
Distance covered by the train = 1680km
Total time taken = (24+6)hrs = 30hrs
Average speed = 1680km / 30hr = 56km/hr

③ The average speed of a cyclist is 15km/hr. How far does he cycle in 4hrs?
Solution
Average speed = Total distance covered / Total time taken
==End of OCR for page 24==

==Start of OCR for page 25==
Therefore, total distance covered
= average speed x total time taken
= 15km/hr x 4hr = 60km

Class Fun [Pg 182, Ex. 2, 1-3]
① Average Speed = Total distance Covered / Total time taken = 36km / 4hr
= 9km/hr

② Total distance covered = Average speed x Total time taken
= 60km/hr x 1 1/4 => 60 x 5/4 => 15 x 5 = 75
∴ Total distance covered = 75km

③ Total distance covered = Average speed x Total time taken
= 80km/hr x 5hr = 400km

Home Fun [pg 182, Ex.2, 4-7]
④ Total time taken = Total distance covered / Average speed = 810 km / 54 = 15hr

⑤ Total time taken = 480 / 16 = 30hr
==End of OCR for page 25==

==Start of OCR for page 26==
⑥ Average speed = 196m / 4s = 49m/s

⑦ Average speed = 75 / (5/3) = (75x3)/5 = 45km/hr

Examples
① A boy runs a distance of 400 metres in 80 seconds. What is his average speed?
Solution
Average speed = 400 metres / 80 second = 5m/s

② A sprinter runs a distance of 100 metres in 12.5 seconds. What is his average speed?
Solution
His average speed is:
100m/s / 12.5 = 1000m/s / 125 = 8m/s

Class Fun [Pg 183, Ex.4, 1-3]
① Average speed = Distance / Time = 400m / 100s = 4m/s
==End of OCR for page 26==

==Start of OCR for page 27==
② Average speed = 80m / 25s = 16/5 = 3 1/5 m/s or 3.2m/s

③ Average speed = 1500m / 300s = 5m/s

Home Fun [pg 183, Ex. 4, 4-6]
④ Average speed = 1500m / 250s = 6m/s

⑤ Average speed = 200m / 20s = 10m/s

⑥ Average speed = 200m / 25s = 8m/s

Class Fun [Pg 184, Ex.5, 1-4]
① A.S = 1350km / 15hrs = 90km/hr
② A.S = 303km / 3hrs = 101km/hr
③ d = A.S x t = 120 x 4 = 480km
④ Speed = 64km/hr, time = 1hr 15mins
d = A.S x t = 64 x 1 1/4
d = (64 x 5)/4 = 320/4 = 80km
==End of OCR for page 27==

==Start of OCR for page 28==
Home Fun [Pg 184, Ex. 5, 5-8]
⑤ S = d/t => t = d/S = 5700/1900 = 3hrs

⑥ D = 210km, t = 3 hours
S = d/t = 210/3 = 70km/hr
d = ? t = 15hrs
S = d/t => d = S x t = 70 x 15 = 1050km

⑦ D = 400km, t = 5hours
S = D/T = 400/5 = 80km/hr

⑧ D = 60km/hr, t = 4 1/2 hours
S = D/T => D = S x T = 60 x 9/2 = 270km
==End of OCR for page 28==

==Start of OCR for page 29==
Topic: Plane Shapes (pg 226)
Definition:
Plane shapes are two-dimensional shapes that lie flat on a surface.
They have length and width, but no thickness.
Examples:
Squares, Rectangles, Triangles, Circles, and Polygons (e.g. Pentagons, hexagons)

Characteristics:
They can be described by their:
① Number of sides, angles and symmetry.

TRIANGLES
A two-dimensional shape that has three sides and three angles is a triangle.
The corners of the triangle are called VERTICES.
The vertices of the triangle are A, B and C.
(Capital letters are used to label Vertices.)
Thus, the triangle below can be named triangle ABC or ΔABC.
==End of OCR for page 29==

==Start of OCR for page 30==
[Image of a triangle with vertices labeled A, B, C.]
A
B
C

The side between A and B is called AB
" " " A and C " " AC
" " " B " C " " BC

The angle at:
- Corner A is called angle A or ∠A
- " B " " angle B or ∠B
- " C " " angle C or ∠C

Oral exercise
1. Write down the name of the side or angle which is:
a) 2cm b) 4cm c) 5cm d) 70°
[Image of a triangle PQR. Side PR is 2cm, side PQ is 4cm, side QR is 5cm. The angle at vertex R is 70°.]
R 70° Q
5cm
2cm P 4cm

a) 2cm = PR b) 4cm = PQ c) QR = 5cm d) 70° = ∠R
or angle 70°
==End of OCR for page 30==

==Start of OCR for page 31==
Types of triangles
① Isosceles triangle:
[Image of an isosceles triangle ABC with a dashed line of symmetry from vertex A to the base BC. Tick marks indicate that sides AB and AC are equal, and angles B and C are equal.]
A
B C
- ΔABC is an isosceles triangle.
- Two sides are equal. [AB = AC]
- Angle B = Angle C
* It has one line of symmetry.
Note: A line of symmetry is an imaginary line that divides a shape into two identical parts. If you fold the shape along this line, both parts would match perfectly.
Examples:
① A square has 4 lines of symmetry (2 diagonal, 1 vertical, 1 horizontal).
② A rectangle has 2 lines of symmetry: (1 vertical, 1 horizontal)
③ A circle has many lines of symmetry: (Any line through its center).
==End of OCR for page 31==

==Start of OCR for page 32==
② Equilateral triangle:
[Image of an equilateral triangle XYZ with three dashed lines of symmetry. Tick marks indicate all sides are equal and all angles are equal.]
X
Y Z
- ΔXYZ is an equilateral triangle.
- All sides are equal. [XY = YZ = XZ]
- All the angles are equal.
[∠X = ∠Y = ∠Z]
- It has three lines of symmetry.

③ Scalene triangle:
[Image of a scalene triangle LMN.]
L
M N
- ΔLMN is a scalene triangle.
- All the three sides are not equal.
- All the three angles are not equal.
- It has no line of symmetry.

Basic properties of triangles are:
① Triangles have three sides.
② Triangles have three angles whose sum equals 180°.
==End of OCR for page 32==

==Start of OCR for page 33==
③ The sum of two sides in a triangles is greater than the third side.

Class Fun [Pg 228, Ex.1, A 1-5]
Solution
① AB=1.3cm, BC=2.4cm, AC=2.7cm
② Angle a=60°, b=90°, c=30°
③ The longest side: AC
④ 90°
⑤ KJ=2.1km KL=2.4km and LJ=2.1cm

Home Fun [Pg 228, Ex.1, B 1-5]
[Answers seem to be classifications of triangles]
| ① right angled isosceles | ⑤ acute angled equilateral |
| :--- | :--- |
| ② acute angled scalene | |
| ③ Obtuse angled isosceles | |
| ④ acute angled isosceles | |
==End of OCR for page 33==

==Start of OCR for page 34==
Note: Definitions
① Acute Angle: An angle less than 90 degrees. E.g 45°, 65°
② Obtuse Angle: An angle greater than 90 degrees but less than 180 degrees. E.g 120°, 150°
③ Reflex Angle: An angle greater than 180 degrees but less than 360 degrees.

Examples:
① Calculate the size of angle A:
[Image of a triangle with base angles 54° at B and 46° at C. The top vertex is A.]
A
B 54° 46° C
Â + B̂ + Ĉ = 180°
i.e Â + 54° + 46° = 180°
Therefore, Â = 180° - 100° = 80°

② Calculate the size of angle B:
[Image of a triangle with base angles 23° and 37°. The top vertex is B.]
B
23° 37°
Â + B̂ + Ĉ = 180°
23° + B̂ + 37° = 180°
B̂ = 180° - 60° = 120°
==End of OCR for page 34==

==Start of OCR for page 35==
Class Fun [Pg 229, Ex 2, A 1-5]
Solution
180-(50+20)
① A=180-(12+95°) ② 110° ③ 90°
A=180-107°
A=73°
④ 180°-(102+25)=53° ⑤ x+x+42°=180°
2x = 180-42° = 138°
x = 69°

Home [Pg 229, Ex 2, A 6-10]
⑥ A=4.8°, B=8.4° ⑦ C=180-(75+45) => 180-120=60°
⑧ B=180-(22°+43°)= 180°-65°=115°
⑨ B=180°-(90+35)=55° ⑩ 180°-(55+25) = 180-80=100°

QUADRILATERALS
A two-dimensional shape that has four sides is called a quadrilateral. Examples of quadrilaterals
[Image of three different quadrilaterals: a kite, a general quadrilateral, and a trapezium.]
Note:
* Basic properties of any type of quadrilateral are:
① 4 sides ② Sum of angles equals 360°.
==End of OCR for page 35==

==Start of OCR for page 36==
Special quadrilaterals
1
[Image of a square ABCD with its two diagonals and two lines of symmetry parallel to the sides drawn as dashed lines.]
A D
B C
- ABCD is a square
- All the sides are equal.
[AB=BC=CD=DA]
- Each angle equals 90°.
(The angles are equal)
- It has 4 lines of symmetry.

2
[Image of a rectangle EFGH with its two lines of symmetry drawn as dashed lines.]
E H
F G
- EFGH is a rectangle.
- Opposite sides are equal.
(EH=FG, EF=HG)
- Each angle equals 90°
(The angles are equal).
- It has 2 lines of symmetry.
==End of OCR for page 36==

==Start of OCR for page 37==
③ 
[Image of a parallelogram PQRS with arrows indicating parallel sides.]
P S
Q R
- PQRS is a parallelogram
- Opposite sides are equal and parallel.
[PQ=SR, PS=QR]

⑤ 
[Image of a trapezium ABCD with arrows indicating that sides AD and BC are parallel.]
A D
B C
- ABCD is a trapezium.
- It has one pair of parallel sides.
- The sides are not equal.
- The angles " " "

④
[Image of a rhombus IJKL with its two diagonals drawn as dashed lines.]
I
J L
K
- IJKL is a rhombus.
- All the sides are equal.
[IJ=JK=KL=LI]
- Opposite sides are parallel.
- The angles opposite each other are equal.
- It has two lines of symmetry.
- The lines of symmetry meet at a right angle (i.e the lines are perpendicular).
==End of OCR for page 37==

==Start of OCR for page 38==
CLASS FUN [Pg 232, Ex 1, 1-8]
Solution: ① Trapezium ② Square ③ Trapezium ④ Trapezium
⑤ Rectangle ⑥ Rhombus ⑦ Rectangle ⑧ Parallelogram

Examples:
① Calculate the value of the marked angle:
[Image of a trapezium with angles 49°, 134°, x, and 73°.]
134° x
49° 73°
Solution
Sum of angles of a quadrilateral equals 360°
49° + 134° + x° + 73 = 360°
x° + 256° = 360°
x° = 360 - 256
x° = 104°

② Calculate the value of the unknown angle:
[Image of a kite with angles 70°, 110°, m, and 100°.]
110°
70° m
100°
==End of OCR for page 38==

==Start of OCR for page 39==
70° + 110° + m° + 100° = 360°
m° + 280° = 360°
m° = 360° - 280°
= 80°

Class Fun [Pg 233, Ex.2, 1-3] *1,2,4,5
| --- | --- |
| ① b + 90° + 98° + 125° = 360° | ③ m + 99° + 90° + 121° = 360° |
| b + 305° = 360° | m + 310° = 360° |
| b = 360° - 305° | m = 360° - 310° |
| b = 55° | m = 50° |
| ② f + 98° + 62° + 70° = 360° | |
| f + 230° = 360° => F = 360° - 230° | |
| f = 130° | |

Home Fun [pg 233, Ex:2, 4-6] *3,4,6
| --- | --- |
| ④ a + 100° + 80° + 60° = 360° | ⑤ x + 100° = 180° => y = 180 - 100° = 80° |
| a + 240° = 360° | ∴ y = 80° |
| a = 360° - 240° | |
| a = 120° | x + 162° + 80° + 48° = 360° |
| | x + 290° = 360° |
| | x = 360° - 290° = 70° |
| | x = 70° |
==End of OCR for page 39==

==Start of OCR for page 40==
⑥ n + 70° + 110° + 70° = 360°
n + 250° = 360°
n = 110°

Weekend Home Fun [pg 233, Ex.2, B, 1-5]
① x + 106° + 107° + 112° = 360° => x + 325° = 360° => x = 35°
② Y + 60° + 119° + 120° = 360° => Y + 299° = 360° => Y = 61°
③ z + 89° + 62° + 89° = 360° => z + 240° = 360° => z = 120°
④ P + 108° + 73° + 108° = 360° => P + 289° = 360° => P = 71°
⑤ Q + 90° + 110° + 83° = 360° => Q + 283° = 360° => Q = 77°

Circle
Definition: A Circle is a path traced from a fixed point such that the same distance from that point is maintained.
==End of OCR for page 40==

==Start of OCR for page 41==
[Image of a circle with multiple radii drawn from the center O to the circumference, all labeled "Same distance".]
This is a circle
The fixed point O is called the centre of the circle.

Parts of a circle
[Image of a large circle with all its parts labeled.]
- Arc (a portion of the circumference)
- Sector (a region bounded by two radii and an arc)
- Tangent (a line touching the circumference at one point)
- Radius (a line from the center to the circumference)
- Diameter (a chord passing through the center)
- Centre (the central point of the circle)
- Chord (a line segment connecting two points on the circumference)
- Segment (a region bounded by a chord and an arc)
- Circumference (the perimeter of the circle)
==End of OCR for page 41==

==Start of OCR for page 42==
There are special words to describe different parts of a circle as shown in the diagram of the circle:
① The distance round the circle is called the CIRCUMFERENCE or PERIMETER.
② A straight line from the centre of a circle to any part of the circumference is called a RADIUS.
③ A straight line across a circle which starts and ends at two points on the circumference is called a CHORD. It divides the circle into two UN-EQUAL PARTS.
④ A Chord which passes through the centre of a circle is called a DIAMETER. It divides the circle into two EQUAL PARTS.
⑤ An arc is part of the circumference of a circle.
⑥ The area enclosed by two radii and an arc is called a SECTOR.
⑦ The area enclosed by an arc and a chord is called a SEGMENT.
⑧ A straight line which touches the circumference of a circle is called a TANGENT.
==End of OCR for page 42==

==Start of OCR for page 43==
Drawing Circles
The instrument used in drawing a circle is the compass or pair of compasses. It has a pointer and a pencil hole. The pointer represents the fixed point when the pencil is moved round.
Example:
Draw a circle with a radius of 2.8cm.
Solution
Step 1: Adjust the pointer and the pencil tip such that they are 2.8cm apart.
" 2: Fix the pointer and move the pencil tip round until it is back to its starting position.
" 3: Measure the diameter of the circle.

Class Fun [Pg 235], D, a-d
Draw circles of the following radii
a) 3cm b) 4cm c) 4.5cm d) 2.6cm

Home Fun [Pg 235, ② a-d]
* From the activity, you will discover that diameter is twice the radius.
i.e D=2r, or r=D/2
②
| Circle | Radius | Diameter |
| :--- | :--- | :--- |
| a. 3cm | 1.5cm | 3cm |
| b. 4cm | 2cm | 4cm |
| c. 4.5cm | 2.25/2.3cm | 4.5cm |
| d. 2.6cm | 1.3cm | 2.6cm |
==End of OCR for page 43==

==Start of OCR for page 44==
Topic: Angles (pg 217)
Objectives:
- Describe angle
- Types of angles and symbol for angle
- Measure angle in degrees

Angle
Definition: An angle is the amount of turning or rotation from a fixed point (Vertex). It is formed when two lines or rays meet at a common point called the Vertex.
A protractor is used in measuring and drawing angles and these angles are recorded in units called DEGREE.

[Image showing a line segment BA and a ray BC originating from point B to form an angle.]
C B A
A B C
The fixed point or Vertex B
The angle is between lines BA and BC.

Types of angles
① Acute angle: Measured to be less than 90°
② Obtuse angle: Measured to be more than 90° but less than 180°
==End of OCR for page 44==

==Start of OCR for page 45==
(iii) Reflex angle: Measured to be more than 180° but less than 360°.
(iv) Right angle: 90° (Angle between perpendicular lines).
(v) Straight lines angle: 180° (that is 2 right angles).
(vi) Complementary angles: Adjacent or close angles which sum up to 90°.
(vii) Supplementary angles: Adjacent or close angles which sum up to 180°.
(viii) A revolution: 360° (Angle of a complete circle).

Class Fun [Progressive Maths pg 253, 1-10]
① An acute angle ② b+56+90 = 180° => b=180°-146°=34°
③ An equilateral triangle ④ Obtuse angle
⑤ x+56°=180° => x=180°-56°=124°
⑥ y+91°+85°+89°=360° => y+265=360° => y=360-265=95°
⑦ x+110°=180° => x=180-110=70° ⑧ Z+90+45°=180°
Z=180°-135°=45° ⑨ X=180°-50°=130° ⑩ AB=5cm
==End of OCR for page 45==

==Start of OCR for page 46==
Home Fun [Progressive Maths pg, 255, 13-19]
⑬ X = 80° ⑭ x+50°+40°+30°+70°+100°=360°
x=360°-290°=70°
⑮ 180-(35+65°)=80°, y+80°=180° => y=180°-80°=100°
⑯ x+30°+90°=180° => x=180°-120°=60°
⑰ 1/3 of a right angle => 1/3 x 90° = 30°
⑱ 90° ⑲ x°+x°+80°=180° => 2x=180°-80° => 2x=100°
x = 100/2 = 50°

Measuring angles
To measure the size of any given angle, first check whether it is acute or obtuse.
[Image of an acute angle ABC.]
A
B C
Angle ABC is less than 90°, so it is an acute angle. The arm BC is on the base line.
The vertex B of the angle is at the centre of the base line.
==End of OCR for page 46==

==Start of OCR for page 47==
(New method maths)
Example: [pg 220]
* Show the pupils, how the value of angles marked on the protractor have been found.

Class Fun [Pg 220, Ex 1, A & 2] (10 questions)
① PÔQ=75°, PÔS=145°, TÔS=35°, TÔR=90°,
TÔQ=105°
② FÔG=60°, KÔJ=15°, KÔG=120°, EÔI=115°, EÔJ=165°

Home Fun [pg 220, Ex.1, 1-3, pg22, 4-8]
① 120° ② 37° ③ 90° ④ 36° ⑤ 135° ⑥ 20° ⑦ 50° ⑧ 108°

Drawing angles
Example:
Draw an angle that measures 60°
Solution
Step 1: Draw one arm of the angle and mark. The point is the vertex of the angle.
2: Place the centre mark of the protractor at marked vertex.
3: Start at 0° and move until it reaches 60° scale and mark.
4: Remove the protractor and use a ruler to join the mark to the vertex.
==End of OCR for page 47==

==Start of OCR for page 48==
Class Fun [pg 221, Ex.2, 1-5] (Drawing of angles)
Home Fun [pg 221, Ex.2, 6-10]

Complementary angles
When two angles add up to 90°, they are called COMPLEMENTARY ANGLES.
[Image shows a right angle divided into two angles, 31° and 59°.]
31°
59°
31° and 59° are Complements of each other
(i.e 31° + 59° = 90°).

Supplementary angles
When two angles add-up to 180°, they are called SUPPLEMENTARY ANGLES.
[Image shows a straight angle (180°) divided into two angles, 155° and 25°.]
155°
25°
155° and 25° are supplements of each other.
(i.e 155° + 25° = 180°)

Class Fun [pg 222, A 1-7]
① 51° = 39° (Complement) ② 13° = 77° (Complement) ③ 46° = 44°
==End of OCR for page 48==

==Start of OCR for page 49==
④ 65° = 25°(c) ⑤ 53° = 37°(c) ⑥ 48° = 42°(c) ⑦ 40° = 50°(c)

Home Fun [Pg 222, B 1-10]
① 87° = 93°(s) ② 35° = 145°(s) ③ 61° = 119°(s)
④ 70° = 110°(s) ⑤ 48° = 132°(s) ⑥ 45° = 135° ⑦ 133° = 47°(s)
⑧ 161° = 19°(s) ⑨ 17° = 163°(s) ⑩ 59° = 121°(s)

Topic: Polygon
- Definition
- Types of polygon
- Properties of polygon

Definition:
In geometry, a polygon can be defined as a flat or plane, two-dimensional closed shape with straight sides.
==End of OCR for page 49==

==Start of OCR for page 50==
④ 65°=25°(c) ⑤ 53°=37°(c) ⑥ 48°=42°(c) ⑦ 40°=50°(c)
Home Fun [pg 222, B 1-10]
① 87° = 93°(s) ② 35°=145°(s) ③ 61°=119°(s)
④ 70°=110°(s) ⑤ 48°=132°(s) ⑥ 45°=135° ⑦ 133°=47°(s)
⑧ 161°=19°(s) ⑨ 17=163°(s) ⑩ 59°=121°(s)

Topic: Polygon [net]
- Definition
- Types of polygon
- Properties of polygon

Definition:
In geometry, a polygon can be defined as a flat or plane, two-dimensional closed shape with straight sides. It does not have curved sides.
It's derived from a Greek word in which 'poly' means 'many' and 'gon' means 'angle'.
Types of Polygons:
Depending on the sides and angles, the polygons are classified into different types, namely:
a) Regular polygon
b) Irregular "
c) Convex polygon
d) Concave "
==End of OCR for page 50==

==Start of OCR for page 51==
Regular Polygon:
If all the sides and interior angles of the Polygon are equal, then it is known as a regular polygon. Examples of regular polygons are: square, rhombus, equilateral triangle e.t.c

Irregular Polygon:
If all the sides and the interior angles of the polygon are of different measure, then it is known as an irregular polygon, for example, a scalene triangle, a rectangle, a kite e.t.c.
Types of Polygons: There are different types of polygons and they have different names depending on the number of sides that they have.

| Polygon | No. of sides | Angle | No. of vertices |
| :--- | :--- | :--- | :--- |
| Triangle | 3 | 60° | 3 |
| Square | 4 | 90° | 4 |
| Pentagon | 5 | 108° | 5 |
| Hexagon | 6 | 120° | 6 |
| Heptagon | 7 | 128.6° | 7 |
| Octagon | 8 | 135° | 8 |
| Nonagon | 9 | 140° | 9 |
| Decagon | 10 | 144° | 10 |
| n-gon | n | (n-2)x180/n | n |
==End of OCR for page 51==

==Start of OCR for page 52==
Properties of Polygons
The properties of polygons help us identify them easily. In other words, the following characteristics of a polygon help us to easily check whether a given shape is a polygon or not.
① A polygon is a closed shape, that is there is no end that is left open in the shape. It ends and begins at the same point.
② It is a plane shape, that is, the shape is made of line segments or straight lines.
③ It is a two-dimensional figure, that is, it has only two dimensions length and width. There is no depth or height to it.
④ It has three or more sides in it.
⑤ The angles in the polygon may or may not be the same.
⑥ The length of the sides of a polygon may or may not be the same.
==End of OCR for page 52==

==Start of OCR for page 53==
Everyday Statistics (Pg 246)
- Meaning of data presentation
- Interpretation of pictograms and bar graphs

Definition:
Statistics is a way of collecting, organizing and understanding data (information) to answer questions or solve problems.
It involves:
① Gathering data (Collecting information).
② Organizing data (Using pictograms, tables, charts, graphs e.t.c)
③ Analyzing data (finding patterns, averages)

Pictograms and bar graphs
Pictorial diagrams are ways of giving information through pictorial figures or designs.
Simply put, using pictures to present information.
There are many forms of pictorial diagrams which can be used. Some of these are pictograms and bar graphs.
==End of OCR for page 53==

==Start of OCR for page 54==
Key: 🧍 = Stick man

Pictograms
Example:
The pictogram below shows the favourite fruits of class 5 pupils.

| Fruits | Pupils |
| :--- | :--- |
| Oranges | 🧍🧍🧍🧍🧍 |
| Water-melons | 🧍🧍🧍🧍 |
| Bananas | 🧍🧍 |
| Apple | 🧍🧍🧍🧍🧍 |
| Cucumbers | 🧍 |
| Guavas | 🧍🧍🧍 |
| Pine-apples | 🧍🧍🧍🧍🧍🧍🧍🧍 |
| Mangoes | 🧍🧍🧍🧍🧍🧍 |

Question
① How many pupils like:
a) bananas b) apples c) mangoes d) pineapples
② What is the most favourite fruit?
③ What is the least favourite fruit?
④ What is the mode of the information? Why?
==End of OCR for page 54==

==Start of OCR for page 55==
⑤ How many pupils are in the class?
Solution
① a) 2 pupils b) 5 pupils c) 6 pupils d) 8 pupils
② Pineapples ③ Cucumber ④ Pineapples: This is because it is the most favourite fruit. It has the highest frequency.
⑤ 35 pupils

Bar graph
It is a way of representing information pictorially. Rectangular bars of equal widths are used. The space between the bars must be the same. The height of the bar represents the number of times the event occurs. A bar graph can be horizontal or vertical.
==End of OCR for page 55==

==Start of OCR for page 56==
[Image of a horizontal bar graph. The y-axis is labeled "Fruits" and lists Oranges, Water melons, Bananas, Apples, Cucumber, Guavas, Pineapples, Mangoes. The x-axis is labeled "Number of pupils" and has a scale from 0 to 10. The bars correspond to the data in the pictogram: Oranges=5, Water melons=4, Bananas=2, Apples=5, Cucumber=1, Guavas=3, Pineapples=8, Mangoes=6.]
Fruits
Oranges
Water melons
Bananas
Apples
Cucumber
Guavas
Pineapples
Mangoes
Number of pupils

Above is the horizontal bar graph of number of pupils who like different fruits.
* Check the text book pg 247 for the vertical bar graph.

Class Fun [pg 248, Ex, 1-4]
① Malaria ② Ebola ③ 40 people ④ 160

Home Fun
Represent the information given in the class fun using horizontal bar-graphs.
==End of OCR for page 56====Start of OCR for page 1==
WEEK 1
TOPIC: VOLUME
- Volume of prism, cylinder, Sphere
Objectives:
@ To Calculate the volume of prism, Cylinder and sphere using their respective formulas.

Definition:
Volume is the amount of space inside a 3D object. It's like measuring how much water or air can fit inside a Container.

Volume of Prism:
The Volume of a prism is the capacity of the prism. The volume of a prism is the amount of space a prism occupies. A prism is a solid 3-D Shape that has two same faces and other faces that resemble a parallelogram. Its name is influenced by the different shapes of the bases. Every prism has a different base, triangular prism (triangular base), Square prism (square base), rectangular prism (rectangular base) e.t.c.
==End of OCR for page 1==

==Start of OCR for page 2==
UNITS
Volume is usually measured in Units like:
Cubic centimeters (cm³), Cubic meters (m³) and Litres (L)

Formula of volume of prism

[Image of a triangular prism with "Height" labeled along its length.]
Triangular prism.

[Image of a square prism (cuboid) with "Height" labeled.]
Square prism

[Image of a rectangular prism with "Height" labeled.]
Rectangular prism

① Triangular prism:
Base: Triangular
Volume: Base area x height
(Area of triangle x height of the prism)

② Square prism:
Base: Square
Volume: Area of square x height of the prism
==End of OCR for page 2==

==Start of OCR for page 3==
③ Rectangular prism
Base: Rectangle
Volume: Area of Rectangle x height of the prism.

Examples:
① Find the volume of a prism whose base area is 3cm² and height 5cm.
Solution
Volume = base area x height
= 3cm² x 5cm = 15cm³

② What is the base area of the prism if the Volume of the prism is 324m³ and the height of the prism is 9m.
Solution
V = B x H => B = V/H
B = 324/9 = 36m²

③ Work out the volume of the triangular prism;
[Image of a triangular prism with a triangular base of height 3cm and base 8cm. The length/depth of the prism is 10cm.]
3cm
10cm
8cm
==End of OCR for page 3==

==Start of OCR for page 4==
Solution
Volume of prism = Area of cross section x depth
Area of triangle: 1/2 x b x h
A = 1/2 x 8 x 3 = 12cm²

The depth = 10cm
∴ Volume of prism = A x H = (12 x 10)cm² x cm
= 120 cm³

④ Calculate the volume of the L-shaped prism
[Image of an L-shaped prism. The front L-shape has outer dimensions of 7cm (height) and 10cm (width). The inner corner has dimensions of 5cm (from the bottom up) and 6cm (from the left in). The depth of the prism is 12cm.]
6cm
7cm
5cm
12cm
10cm

Solution
- Volume of prism = Area of cross section x depth
- Calculate the area of the cross section
* To Calculate the area of the cross section we need to split it into two rectangles and
==End of OCR for page 4==

==Start of OCR for page 5==
Work out the missing side lengths.
[Image of the L-shaped cross-section divided into two rectangles, A and B.]
10 - 6 = 4cm
7 - 5 = 2cm
7cm A
B
5cm
6cm
10cm

For rectangle A:
Area = (7 x 4)cm = 28cm²

For rectangle B:
Area = (6 x 5)cm = 30cm²

Total Area (A+B) =
28 + 30 = 58cm²

Volume of the prism:
Area x depth (height)
= 58 x 12
= 696cm³
==End of OCR for page 5==

==Start of OCR for page 6==
Class Fun
① A triangular prism has a Volume of 60cm³ and a base area of 12cm². Find its height.
Solution
V = A x H => H = V/A = 60cm³/12cm² = 5cm

② The Volume of a triangular prism is 120m³ and its height is 5m. Calculate the area of its triangular base.
Solution
V = A x H => A = V/H = 120m³/5m = 24m²

③ A triangular prism has a base with sides 3cm and 4cm (forming the base and height of the triangle). If the prism's height is 6cm, what is its Volume?
Solution
Find the area of the triangular base
A = 1/2 b x h = (3x4)/2 = 6cm²

The volume of the prism:
V = A x H = 6 x 6 = 36cm³
==End of OCR for page 6==

==Start of OCR for page 7==
④ A rectangular prism has a Volume of 240cm³, length 8cm and width 5cm. Find its height.
Solution
V = A x H => H = V/A = 240/(8x5) = 240/40 = 6cm

⑤ A square prism has a Volume of 125cm³ and a height of 5cm. Find the side length of its base.
Solution
V = A x H => A = V/H = 125cm³/5 = 25cm²
Since its a square:
A = L² => L = √A = √25 = 5cm

Home Fun
① Find the volume of a square prism with side length 3cm and height 7cm.
Solution
V = A x H = 3x3x7 = 63cm³

② Find the volume of a rectangular prism with length 6cm, width 4cm and height 3cm.
Solution
V = L x w x h = 6x4x3 = 72cm³
==End of OCR for page 7==

==Start of OCR for page 8==
③ The area of a triangular prism's base is 9m² and its volume is 54m³. Calculate the height of the prism.
Solution
V = A x H => H = V/A = 54m³/9m² = 6m

④ A square prism has a Volume of 64cm³. If its height is 4cm, find the side length of its base.
Solution
V = A x H => A = V/H = 64/4 = 16cm²
Area of a square = L x L = L²
L² = 16 => L = √16 = 4cm

Volume of Cylinder
Formula = πr²h (base area x height)
[Image of a cylinder with height 'h' labeled.]
h
==End of OCR for page 8==

==Start of OCR for page 9==
Example:
① 
[Image of a cylinder with height labeled as 16cm.]
16cm

The radius of the base area of the cylinder above is 7cm and the height is 16cm. Find its volume (π= 22/7)
Solution
V = base area x height
= πr² x h => (22/7) x 7² x 16 = 22 x 7 x 16
V = 2464 cm³

② A cylinder has a volume of 300cm³ and a radius of 5cm. Find its height.
Solution
V = A x H
H = V/A
H = 300 / (πr²) = 300 / (22/7 x 5²) = 300 / 78.571
H = 3.818cm
==End of OCR for page 9==

==Start of OCR for page 10==
Class Fun
① Calculate the area of the base of a cylinder with radius 3cm. (π= 22/7)
Solution
A = πr² = (22 x 3 x 3)/7 = 198/7 = 28.29 cm²

② A cylinder's Volume is 200 cm³, and its height is 8cm. Find the radius. Leaving your answer in terms of Pi.
Solution
V = πr²h
200 = πr²(8)
πr² = 200/8 = 25

[A small table is drawn]
| πr² = 25 | r = 5/√π cm |
|---|---|
| r² = 25/π | |
| r = √25/π | |

③ Find the height of a cylinder with Volume 500cm³ and base area 50cm²
Solution
V = A x H => H = V/A = 500/50 = 10cm
==End of OCR for page 10==

==Start of OCR for page 11==
Home Fun (π=22/7)
① Calculate the volume of a Cylinder with radius 6cm and height 4cm.
Solution
V = πr²h => 22/7 x 6² x 4 = 3168/7 = 452.57cm³

② A cylinder has a base area of 25cm² and a Volume of 200 cm³. Find its height.
Solution
V = A x H => H = V/A = 200/25 = 8cm

③ Find the height of a cylinder with Volume 600 cm³ and base area 60cm²
Solution
V = A x H => H = V/A = 600/60 = 10cm

(Pg 210)
Volume of a Sphere: Shape of the earth
The earth is spherical in shape, this means that the earth can be described as a sphere.
The Volume of a sphere is 4/3 πr³, where r = radius of the sphere. Half of a sphere is called a hemisphere.
Therefore, the volume of a hemisphere = 1/2 x 4/3 πr³ = 2/3 πr³
==End of OCR for page 11==

==Start of OCR for page 12==
Example:
Calculate the volume of a sphere of radius 7cm
Solution
V = 4/3 πr³ = 4/3 x 22/7 x 7cm x 7cm x 7cm
V = 4312/3 cm³ = 1437.3 cm³

Class Fun [pg 210, Ex, 1-3]
① r = 2cm; V = 4/3 πr³ = 4/3 x 22/7 x 2³ = 704/21 = 33.52 to 2dp

② r = 5.1cm; V = 4/3 πr³ = 4/3 x 22/7 x 5.1³ = (132.651 x 88)/21
V = 11673.288 / 21 = 555.87 cm³ to 2dp

③ r = 1.1cm; V = 4/3 πr³ = 4/3 x 22/7 x 1.1³ = (88 x 1.331)/21
V = 117.128 / 21 = 5.58 cm³ (to 2 d.p)

Home Fun [Pg 211, Ex, 13-17]
==End of OCR for page 12==

==Start of OCR for page 13==
Solution (Leave your answers to 2 d.p)
⑬ D = 7km, r = D/2 = 7/2 = 3.5km
V = 4/3 πr³ = 4/3 x 22/7 x 3.5³ = (88 x 42.875)/21 = 179.67 km³

⑭ D = 8km, r = D/2 = 8/2 = 4km
V = 4/3 πr³ = 4/3 x 22/7 x 4³ = 5632/21 = 268.19 km³

⑮ D = 12cm, r = 12/2 = 6cm
V = 4/3 πr³ = 4/3 x 22/7 x 6³ = 19008/21 = 905.14 cm³

⑯ D = 6.3cm, r = 6.3/2 = 3.15
[Boxed calculation: 3.15³ = 31.256]
V = 4/3 πr³ = 4/3 x 22/7 x 3.15³ = 2750.517/21 = 130.977
V = 130.98 cm³

⑰ D = 3m, r = 3/2 = 1.5
V = 4/3 πr³ = 4/3 x 22/7 x 1.5³ = (3.375 x 88)/21 = 297/21
V = 14.14 m³
==End of OCR for page 13==

==Start of OCR for page 14==
CLASS FUN [Pg 211, Ex, 25-28]
㉕ r = 8m, V_H = 2/3 πr³ = 2/3 x 22/7 x 8³ = 22528/21 = 1072.76 m³

㉖ d = 8.4km, r = 4.2km, V_H = 2/3 πr³ = 2/3 x 22/7 x 4.2³ = 3259.872/21
V_H = 155.232 ≈ 155.23m³

㉗ d = 12.6cm, r = 6.3cm, V_H = 2/3 πr³ = 2/3 x 22/7 x 6.3³
V_H = 11002.068 / 21 = 523.91cm³

㉘ r = 20km, V_H = 2/3 πr³ = 2/3 x 22/7 x 20³ = 352000/21
V_H = 16761.90 cm³

HOME FUN [pg 211, Ex, 29-32]
r = 3.2m
㉙ d = 6.4m, V_H = 2/3 πr³ = 2/3 x 22/7 x 3.2³ = 1441.792/21
V_H = 68.66m³
==End of OCR for page 14==

==Start of OCR for page 15==
30. d = 15.4km, r = 7.7km, V_H = 2/3 πr³ = 2/3 x 22/7 x 7.7³
V_H = 20087.452 / 21 = 956.55 km³

31. r = 6.6m, V_H = 2/3 πr³ = 2/3 x 22/7 x 6.6³ = 12649.824/21
V_H = 602.37m³

32. r = 7.7m, V_H = 2/3 πr³ = 2/3 x 22/7 x 7.7³ = 20087.452/21
V_H = 956.55m³

TOPIC
CAPACITY [Relationship between litre and cubic centimetre]
The capacity of a container is the ability to hold or receive. It measures (liquid) is in litres.
1 litre = 1000 cubic centimetres [1L = 1000cm³]
The amount of space that a solid occupies is called Volume. The unit of volume is a Cube.
The relationship between litres and cubic centimetres is that litre refers to the volume of liquid in a container, while cubic centimetres is the space of the container.
==End of OCR for page 15==

==Start of OCR for page 16==
Examples:
① Convert 4 litres to Cubic Centimetres.
Solution: 1L = 1000 cm³
4L = 4000cm³

② Convert 7503cm³ to litres.
Solution
1 litre = 1000 cm³
x litre = 7503cm³
Cross multiply
1000x = 7503
x = 7.503L

Note: 1 litre = 1000 millilitres (mL).
1/2 L = 500ml, 1/4 L = 250ml, 1/10 L = 100ml

Also, 1 litre (L) = 100 centilitres (cl), 1/2 L = 50cl
1/2 L = 50cl, 1/4 L = 25cl

Class Fun [pg 215, Ex.2, 1-5]
① 3 litres = 3000ml ② 5L = 5000ml
③ 2 1/2 litres = 2500ml ④ 3.4L = 3400ml ⑤ 1.25L = 1250ml
==End of OCR for page 16==

==Start of OCR for page 17==
Home Fun [Pg 215, Ex. 3, 1-5]
① 2 litres = 200 cl ② 6 litres = 600 cl ③ 4.5 litres = 450 cl
④ 5 litres = 500 cl ⑤ 7 1/2 litres (7.5) = 750 cl

(Additional Class fun)
CLASS FUN [Pg 216, Revision exercise 25 (1-3)]
① A water tank suspended with 4 poles has the following dimension; 30cm, 80cm and 20cm.
a) What is its volume in Cubic centimetres?
b) How many litres of water will it hold when full?
c) If a quarter of the water in the full tank is used, how many litres will remain?
Solution
a) Volume of the water tank = Length x Breadth x Height
= 30cm x 80cm x 20cm = 48000cm³
b) When it is full, it will hold = 48000/1000 litres = 48 litres
c) Volume of Water used = 1/4 x 48 litres = 12 litres
Hence, the remaining amount of water
= 48 litres - 12 litres
= 36 litres
==End of OCR for page 17==

==Start of OCR for page 18==
Solution [PG 216, R.E 25 (1-3)]
① 1 drum = 562 litres of water.
36 drums = x
x = 36 x 562 = 20,232 litres

② L = 0.6m, W = 0.8m, Volume = 72L
1 litre = 1,000cm³
L = 60cm, W = 80cm
V = LBH
H = V / LB = 72,000 / (60 x 80) = 720 / 48 = 15cm

③ Capacity of car petrol tank = 62 litres
1 litre of petrol = N65
Total amount spent to fill = 62 x N65 = N4030
the tank

Home Fun [Pg 216, R.E 25 (4-6)]
④ Capacity of a bucket = 10.274 litres
Capacity of 12 such buckets = 12 x 10.274
= 123.288 litres
==End of OCR for page 18==

==Start of OCR for page 19==
⑤ Capacity of the big tanker:
2640
+ 1750
4,390 litres

⑥ In 1 day = 108 litres of petrol
In 20 days = x
x = 20 x 108
= 2160 litres of petrol

Topic: Speed (pg 199)
- Average Speed, time, distance
Remember the following:
| Units of time | Note: |
| :--- | :--- |
| 60 seconds = 1 minute | a.m (ante meridian) describe the time from midnight to Midday. |
| 60 minutes = 1 hour | p.m (post meridian) describe the time from midday to midnight. |
| 24 hours = 1 day | |
| 7 days = 1 week | |
| 4 weeks = 1 lunar month | |
| 12 Calendar months = 1 year | |
| 13 lunar months + 1 day = 365 days = 1 year | |
==End of OCR for page 19==

==Start of OCR for page 20==
Examples:
① What does quarter to 6 in the evening mean?
Solution
Quarter to, means 15 minutes before (less).
Therefore, the time is:
  hr  mins
  6   00
-     15
  5   45
Ans: 5:45pm

② What does quarter after 9 in the morning mean?
Solution
Quarter after, means 15 minutes past (added to)
Therefore the time is:
  hr  mins
  9   00
+     15
  9   15
Ans: 9:15 a.m
Note: 15 minutes out of 60mins (1 hour) is 15/60 = 1/4 (a quarter).
Thus, a quarter of an hour is 15 minutes, A half an hour is 30 minutes.
==End of OCR for page 20==

==Start of OCR for page 21==
③ Jedidiah starts from home at 7:15am and arrives at school at 8:05am. How long does he take to get to School?
Solution
  hr  min
Finishing time  8   05
Starting "  7   15
Time taken      50
Ans: It takes her 50 mins

④ Isabelle spent 3 hours to travel 216 km. What was her average speed?
Solution
Average speed means total distance travelled divided by the total time taken.
The units of average speed are:
a) km/hr or kmh⁻¹ b) metres/seconds (m/s or ms⁻¹)
Hence:
Average speed = Total distance (km or m) / Total time taken (hours or seconds)
= 216 km / 3hr = 72km/hr
==End of OCR for page 21==

==Start of OCR for page 22==
Class Fun [Pg 181, Ex1, ① a-e]
Home Fun [Pg 181, Ex1, ② a-e]
Solution
Class Fun
① a) Given data:
D = 4800 km, t = 5 hours
Average speed = 4800 km / 5 hrs = 960 km/hr

b) D = 4800 km, t = 6 hours
Average speed = 4800 km / 6 hr = 800 km/hr

c) D = 4800 km, t = 8 hours
Average speed = 4800 km / 8 hr = 600 km/hr

d) D = 4800 km, t = 10 hours
Average speed = 4800 / 10 = 480 km/hr

e) D = 4800 km, t = 12 hrs,
A.S = 4800 / 12 = 400 km/hr
==End of OCR for page 22==

==Start of OCR for page 23==
Home Fun
② * Given data:
a) D = 24km, t = 2hrs
A.S = d/t = 24/2 = 12km/hr

b) D = 24km, t = 3hrs
A.S = d/t = 24/3 = 8km/hr

c) t = 4hrs
A.S = 24/4 = 6km/hr

d) t = 6
A.S = d/t = 24km/6hr = 4km/hr

e) t = 8hrs
A.S = d/t = 24/8 = 3km/hr

Examples:
① A car is driven for 1 hour and travels 86km.
In the next two hours, it travels a further 196km.
Calculate the following:
a) Total distance covered b) Total time taken
c) Average Speed
Solution
Distance covered in 1 hour = 86km
" " " the next 2 hours = 196km
==End of OCR for page 23==

==Start of OCR for page 24==
a) Total distance covered = 86km + 196km = 282km
b) Total time taken = 1hr + 2hrs = 3hrs
c) Average speed = Total distance covered / Total time taken = 282km / 3hr
= 94km/hr

Lagos and Maiduguri is
② The distance between 1680km. A train left Lagos at 9:00 a.m. and reached Maiduguri at 3:00 p.m. the following day. What was the average speed of the train?
Solution
Given data:
Distance covered by the train = 1680km
Total time taken = (24+6)hrs = 30hrs
Average speed = 1680km / 30hr = 56km/hr

③ The average speed of a cyclist is 15km/hr. How far does he cycle in 4hrs?
Solution
Average speed = Total distance covered / Total time taken
==End of OCR for page 24==

==Start of OCR for page 25==
Therefore, total distance covered
= average speed x total time taken
= 15km/hr x 4hr = 60km

Class Fun [Pg 182, Ex. 2, 1-3]
① Average Speed = Total distance Covered / Total time taken = 36km / 4hr
= 9km/hr

② Total distance covered = Average speed x Total time taken
= 60km/hr x 1 1/4 => 60 x 5/4 => 15 x 5 = 75
∴ Total distance covered = 75km

③ Total distance covered = Average speed x Total time taken
= 80km/hr x 5hr = 400km

Home Fun [pg 182, Ex.2, 4-7]
④ Total time taken = Total distance covered / Average speed = 810 km / 54 = 15hr

⑤ Total time taken = 480 / 16 = 30hr
==End of OCR for page 25==

==Start of OCR for page 26==
⑥ Average speed = 196m / 4s = 49m/s

⑦ Average speed = 75 / (5/3) = (75x3)/5 = 45km/hr

Examples
① A boy runs a distance of 400 metres in 80 seconds. What is his average speed?
Solution
Average speed = 400 metres / 80 second = 5m/s

② A sprinter runs a distance of 100 metres in 12.5 seconds. What is his average speed?
Solution
His average speed is:
100m/s / 12.5 = 1000m/s / 125 = 8m/s

Class Fun [Pg 183, Ex.4, 1-3]
① Average speed = Distance / Time = 400m / 100s = 4m/s
==End of OCR for page 26==

==Start of OCR for page 27==
② Average speed = 80m / 25s = 16/5 = 3 1/5 m/s or 3.2m/s

③ Average speed = 1500m / 300s = 5m/s

Home Fun [pg 183, Ex. 4, 4-6]
④ Average speed = 1500m / 250s = 6m/s

⑤ Average speed = 200m / 20s = 10m/s

⑥ Average speed = 200m / 25s = 8m/s

Class Fun [Pg 184, Ex.5, 1-4]
① A.S = 1350km / 15hrs = 90km/hr
② A.S = 303km / 3hrs = 101km/hr
③ d = A.S x t = 120 x 4 = 480km
④ Speed = 64km/hr, time = 1hr 15mins
d = A.S x t = 64 x 1 1/4
d = (64 x 5)/4 = 320/4 = 80km
==End of OCR for page 27==

==Start of OCR for page 28==
Home Fun [Pg 184, Ex. 5, 5-8]
⑤ S = d/t => t = d/S = 5700/1900 = 3hrs

⑥ D = 210km, t = 3 hours
S = d/t = 210/3 = 70km/hr
d = ? t = 15hrs
S = d/t => d = S x t = 70 x 15 = 1050km

⑦ D = 400km, t = 5hours
S = D/T = 400/5 = 80km/hr

⑧ D = 60km/hr, t = 4 1/2 hours
S = D/T => D = S x T = 60 x 9/2 = 270km
==End of OCR for page 28==

==Start of OCR for page 29==
Topic: Plane Shapes (pg 226)
Definition:
Plane shapes are two-dimensional shapes that lie flat on a surface.
They have length and width, but no thickness.
Examples:
Squares, Rectangles, Triangles, Circles, and Polygons (e.g. Pentagons, hexagons)

Characteristics:
They can be described by their:
① Number of sides, angles and symmetry.

TRIANGLES
A two-dimensional shape that has three sides and three angles is a triangle.
The corners of the triangle are called VERTICES.
The vertices of the triangle are A, B and C.
(Capital letters are used to label Vertices.)
Thus, the triangle below can be named triangle ABC or ΔABC.
==End of OCR for page 29==

==Start of OCR for page 30==
[Image of a triangle with vertices labeled A, B, C.]
A
B
C

The side between A and B is called AB
" " " A and C " " AC
" " " B " C " " BC

The angle at:
- Corner A is called angle A or ∠A
- " B " " angle B or ∠B
- " C " " angle C or ∠C

Oral exercise
1. Write down the name of the side or angle which is:
a) 2cm b) 4cm c) 5cm d) 70°
[Image of a triangle PQR. Side PR is 2cm, side PQ is 4cm, side QR is 5cm. The angle at vertex R is 70°.]
R 70° Q
5cm
2cm P 4cm

a) 2cm = PR b) 4cm = PQ c) QR = 5cm d) 70° = ∠R
or angle 70°
==End of OCR for page 30==

==Start of OCR for page 31==
Types of triangles
① Isosceles triangle:
[Image of an isosceles triangle ABC with a dashed line of symmetry from vertex A to the base BC. Tick marks indicate that sides AB and AC are equal, and angles B and C are equal.]
A
B C
- ΔABC is an isosceles triangle.
- Two sides are equal. [AB = AC]
- Angle B = Angle C
* It has one line of symmetry.
Note: A line of symmetry is an imaginary line that divides a shape into two identical parts. If you fold the shape along this line, both parts would match perfectly.
Examples:
① A square has 4 lines of symmetry (2 diagonal, 1 vertical, 1 horizontal).
② A rectangle has 2 lines of symmetry: (1 vertical, 1 horizontal)
③ A circle has many lines of symmetry: (Any line through its center).
==End of OCR for page 31==

==Start of OCR for page 32==
② Equilateral triangle:
[Image of an equilateral triangle XYZ with three dashed lines of symmetry. Tick marks indicate all sides are equal and all angles are equal.]
X
Y Z
- ΔXYZ is an equilateral triangle.
- All sides are equal. [XY = YZ = XZ]
- All the angles are equal.
[∠X = ∠Y = ∠Z]
- It has three lines of symmetry.

③ Scalene triangle:
[Image of a scalene triangle LMN.]
L
M N
- ΔLMN is a scalene triangle.
- All the three sides are not equal.
- All the three angles are not equal.
- It has no line of symmetry.

Basic properties of triangles are:
① Triangles have three sides.
② Triangles have three angles whose sum equals 180°.
==End of OCR for page 32==

==Start of OCR for page 33==
③ The sum of two sides in a triangles is greater than the third side.

Class Fun [Pg 228, Ex.1, A 1-5]
Solution
① AB=1.3cm, BC=2.4cm, AC=2.7cm
② Angle a=60°, b=90°, c=30°
③ The longest side: AC
④ 90°
⑤ KJ=2.1km KL=2.4km and LJ=2.1cm

Home Fun [Pg 228, Ex.1, B 1-5]
[Answers seem to be classifications of triangles]
| ① right angled isosceles | ⑤ acute angled equilateral |
| :--- | :--- |
| ② acute angled scalene | |
| ③ Obtuse angled isosceles | |
| ④ acute angled isosceles | |
==End of OCR for page 33==

==Start of OCR for page 34==
Note: Definitions
① Acute Angle: An angle less than 90 degrees. E.g 45°, 65°
② Obtuse Angle: An angle greater than 90 degrees but less than 180 degrees. E.g 120°, 150°
③ Reflex Angle: An angle greater than 180 degrees but less than 360 degrees.

Examples:
① Calculate the size of angle A:
[Image of a triangle with base angles 54° at B and 46° at C. The top vertex is A.]
A
B 54° 46° C
Â + B̂ + Ĉ = 180°
i.e Â + 54° + 46° = 180°
Therefore, Â = 180° - 100° = 80°

② Calculate the size of angle B:
[Image of a triangle with base angles 23° and 37°. The top vertex is B.]
B
23° 37°
Â + B̂ + Ĉ = 180°
23° + B̂ + 37° = 180°
B̂ = 180° - 60° = 120°
==End of OCR for page 34==

==Start of OCR for page 35==
Class Fun [Pg 229, Ex 2, A 1-5]
Solution
180-(50+20)
① A=180-(12+95°) ② 110° ③ 90°
A=180-107°
A=73°
④ 180°-(102+25)=53° ⑤ x+x+42°=180°
2x = 180-42° = 138°
x = 69°

Home [Pg 229, Ex 2, A 6-10]
⑥ A=4.8°, B=8.4° ⑦ C=180-(75+45) => 180-120=60°
⑧ B=180-(22°+43°)= 180°-65°=115°
⑨ B=180°-(90+35)=55° ⑩ 180°-(55+25) = 180-80=100°

QUADRILATERALS
A two-dimensional shape that has four sides is called a quadrilateral. Examples of quadrilaterals
[Image of three different quadrilaterals: a kite, a general quadrilateral, and a trapezium.]
Note:
* Basic properties of any type of quadrilateral are:
① 4 sides ② Sum of angles equals 360°.
==End of OCR for page 35==

==Start of OCR for page 36==
Special quadrilaterals
1
[Image of a square ABCD with its two diagonals and two lines of symmetry parallel to the sides drawn as dashed lines.]
A D
B C
- ABCD is a square
- All the sides are equal.
[AB=BC=CD=DA]
- Each angle equals 90°.
(The angles are equal)
- It has 4 lines of symmetry.

2
[Image of a rectangle EFGH with its two lines of symmetry drawn as dashed lines.]
E H
F G
- EFGH is a rectangle.
- Opposite sides are equal.
(EH=FG, EF=HG)
- Each angle equals 90°
(The angles are equal).
- It has 2 lines of symmetry.
==End of OCR for page 36==

==Start of OCR for page 37==
③ 
[Image of a parallelogram PQRS with arrows indicating parallel sides.]
P S
Q R
- PQRS is a parallelogram
- Opposite sides are equal and parallel.
[PQ=SR, PS=QR]

⑤ 
[Image of a trapezium ABCD with arrows indicating that sides AD and BC are parallel.]
A D
B C
- ABCD is a trapezium.
- It has one pair of parallel sides.
- The sides are not equal.
- The angles " " "

④
[Image of a rhombus IJKL with its two diagonals drawn as dashed lines.]
I
J L
K
- IJKL is a rhombus.
- All the sides are equal.
[IJ=JK=KL=LI]
- Opposite sides are parallel.
- The angles opposite each other are equal.
- It has two lines of symmetry.
- The lines of symmetry meet at a right angle (i.e the lines are perpendicular).
==End of OCR for page 37==

==Start of OCR for page 38==
CLASS FUN [Pg 232, Ex 1, 1-8]
Solution: ① Trapezium ② Square ③ Trapezium ④ Trapezium
⑤ Rectangle ⑥ Rhombus ⑦ Rectangle ⑧ Parallelogram

Examples:
① Calculate the value of the marked angle:
[Image of a trapezium with angles 49°, 134°, x, and 73°.]
134° x
49° 73°
Solution
Sum of angles of a quadrilateral equals 360°
49° + 134° + x° + 73 = 360°
x° + 256° = 360°
x° = 360 - 256
x° = 104°

② Calculate the value of the unknown angle:
[Image of a kite with angles 70°, 110°, m, and 100°.]
110°
70° m
100°
==End of OCR for page 38==

==Start of OCR for page 39==
70° + 110° + m° + 100° = 360°
m° + 280° = 360°
m° = 360° - 280°
= 80°

Class Fun [Pg 233, Ex.2, 1-3] *1,2,4,5
| --- | --- |
| ① b + 90° + 98° + 125° = 360° | ③ m + 99° + 90° + 121° = 360° |
| b + 305° = 360° | m + 310° = 360° |
| b = 360° - 305° | m = 360° - 310° |
| b = 55° | m = 50° |
| ② f + 98° + 62° + 70° = 360° | |
| f + 230° = 360° => F = 360° - 230° | |
| f = 130° | |

Home Fun [pg 233, Ex:2, 4-6] *3,4,6
| --- | --- |
| ④ a + 100° + 80° + 60° = 360° | ⑤ x + 100° = 180° => y = 180 - 100° = 80° |
| a + 240° = 360° | ∴ y = 80° |
| a = 360° - 240° | |
| a = 120° | x + 162° + 80° + 48° = 360° |
| | x + 290° = 360° |
| | x = 360° - 290° = 70° |
| | x = 70° |
==End of OCR for page 39==

==Start of OCR for page 40==
⑥ n + 70° + 110° + 70° = 360°
n + 250° = 360°
n = 110°

Weekend Home Fun [pg 233, Ex.2, B, 1-5]
① x + 106° + 107° + 112° = 360° => x + 325° = 360° => x = 35°
② Y + 60° + 119° + 120° = 360° => Y + 299° = 360° => Y = 61°
③ z + 89° + 62° + 89° = 360° => z + 240° = 360° => z = 120°
④ P + 108° + 73° + 108° = 360° => P + 289° = 360° => P = 71°
⑤ Q + 90° + 110° + 83° = 360° => Q + 283° = 360° => Q = 77°

Circle
Definition: A Circle is a path traced from a fixed point such that the same distance from that point is maintained.
==End of OCR for page 40==

==Start of OCR for page 41==
[Image of a circle with multiple radii drawn from the center O to the circumference, all labeled "Same distance".]
This is a circle
The fixed point O is called the centre of the circle.

Parts of a circle
[Image of a large circle with all its parts labeled.]
- Arc (a portion of the circumference)
- Sector (a region bounded by two radii and an arc)
- Tangent (a line touching the circumference at one point)
- Radius (a line from the center to the circumference)
- Diameter (a chord passing through the center)
- Centre (the central point of the circle)
- Chord (a line segment connecting two points on the circumference)
- Segment (a region bounded by a chord and an arc)
- Circumference (the perimeter of the circle)
==End of OCR for page 41==

==Start of OCR for page 42==
There are special words to describe different parts of a circle as shown in the diagram of the circle:
① The distance round the circle is called the CIRCUMFERENCE or PERIMETER.
② A straight line from the centre of a circle to any part of the circumference is called a RADIUS.
③ A straight line across a circle which starts and ends at two points on the circumference is called a CHORD. It divides the circle into two UN-EQUAL PARTS.
④ A Chord which passes through the centre of a circle is called a DIAMETER. It divides the circle into two EQUAL PARTS.
⑤ An arc is part of the circumference of a circle.
⑥ The area enclosed by two radii and an arc is called a SECTOR.
⑦ The area enclosed by an arc and a chord is called a SEGMENT.
⑧ A straight line which touches the circumference of a circle is called a TANGENT.
==End of OCR for page 42==

==Start of OCR for page 43==
Drawing Circles
The instrument used in drawing a circle is the compass or pair of compasses. It has a pointer and a pencil hole. The pointer represents the fixed point when the pencil is moved round.
Example:
Draw a circle with a radius of 2.8cm.
Solution
Step 1: Adjust the pointer and the pencil tip such that they are 2.8cm apart.
" 2: Fix the pointer and move the pencil tip round until it is back to its starting position.
" 3: Measure the diameter of the circle.

Class Fun [Pg 235], D, a-d
Draw circles of the following radii
a) 3cm b) 4cm c) 4.5cm d) 2.6cm

Home Fun [Pg 235, ② a-d]
* From the activity, you will discover that diameter is twice the radius.
i.e D=2r, or r=D/2
②
| Circle | Radius | Diameter |
| :--- | :--- | :--- |
| a. 3cm | 1.5cm | 3cm |
| b. 4cm | 2cm | 4cm |
| c. 4.5cm | 2.25/2.3cm | 4.5cm |
| d. 2.6cm | 1.3cm | 2.6cm |
==End of OCR for page 43==

==Start of OCR for page 44==
Topic: Angles (pg 217)
Objectives:
- Describe angle
- Types of angles and symbol for angle
- Measure angle in degrees

Angle
Definition: An angle is the amount of turning or rotation from a fixed point (Vertex). It is formed when two lines or rays meet at a common point called the Vertex.
A protractor is used in measuring and drawing angles and these angles are recorded in units called DEGREE.

[Image showing a line segment BA and a ray BC originating from point B to form an angle.]
C B A
A B C
The fixed point or Vertex B
The angle is between lines BA and BC.

Types of angles
① Acute angle: Measured to be less than 90°
② Obtuse angle: Measured to be more than 90° but less than 180°
==End of OCR for page 44==

==Start of OCR for page 45==
(iii) Reflex angle: Measured to be more than 180° but less than 360°.
(iv) Right angle: 90° (Angle between perpendicular lines).
(v) Straight lines angle: 180° (that is 2 right angles).
(vi) Complementary angles: Adjacent or close angles which sum up to 90°.
(vii) Supplementary angles: Adjacent or close angles which sum up to 180°.
(viii) A revolution: 360° (Angle of a complete circle).

Class Fun [Progressive Maths pg 253, 1-10]
① An acute angle ② b+56+90 = 180° => b=180°-146°=34°
③ An equilateral triangle ④ Obtuse angle
⑤ x+56°=180° => x=180°-56°=124°
⑥ y+91°+85°+89°=360° => y+265=360° => y=360-265=95°
⑦ x+110°=180° => x=180-110=70° ⑧ Z+90+45°=180°
Z=180°-135°=45° ⑨ X=180°-50°=130° ⑩ AB=5cm
==End of OCR for page 45==

==Start of OCR for page 46==
Home Fun [Progressive Maths pg, 255, 13-19]
⑬ X = 80° ⑭ x+50°+40°+30°+70°+100°=360°
x=360°-290°=70°
⑮ 180-(35+65°)=80°, y+80°=180° => y=180°-80°=100°
⑯ x+30°+90°=180° => x=180°-120°=60°
⑰ 1/3 of a right angle => 1/3 x 90° = 30°
⑱ 90° ⑲ x°+x°+80°=180° => 2x=180°-80° => 2x=100°
x = 100/2 = 50°

Measuring angles
To measure the size of any given angle, first check whether it is acute or obtuse.
[Image of an acute angle ABC.]
A
B C
Angle ABC is less than 90°, so it is an acute angle. The arm BC is on the base line.
The vertex B of the angle is at the centre of the base line.
==End of OCR for page 46==

==Start of OCR for page 47==
(New method maths)
Example: [pg 220]
* Show the pupils, how the value of angles marked on the protractor have been found.

Class Fun [Pg 220, Ex 1, A & 2] (10 questions)
① PÔQ=75°, PÔS=145°, TÔS=35°, TÔR=90°,
TÔQ=105°
② FÔG=60°, KÔJ=15°, KÔG=120°, EÔI=115°, EÔJ=165°

Home Fun [pg 220, Ex.1, 1-3, pg22, 4-8]
① 120° ② 37° ③ 90° ④ 36° ⑤ 135° ⑥ 20° ⑦ 50° ⑧ 108°

Drawing angles
Example:
Draw an angle that measures 60°
Solution
Step 1: Draw one arm of the angle and mark. The point is the vertex of the angle.
2: Place the centre mark of the protractor at marked vertex.
3: Start at 0° and move until it reaches 60° scale and mark.
4: Remove the protractor and use a ruler to join the mark to the vertex.
==End of OCR for page 47==

==Start of OCR for page 48==
Class Fun [pg 221, Ex.2, 1-5] (Drawing of angles)
Home Fun [pg 221, Ex.2, 6-10]

Complementary angles
When two angles add up to 90°, they are called COMPLEMENTARY ANGLES.
[Image shows a right angle divided into two angles, 31° and 59°.]
31°
59°
31° and 59° are Complements of each other
(i.e 31° + 59° = 90°).

Supplementary angles
When two angles add-up to 180°, they are called SUPPLEMENTARY ANGLES.
[Image shows a straight angle (180°) divided into two angles, 155° and 25°.]
155°
25°
155° and 25° are supplements of each other.
(i.e 155° + 25° = 180°)

Class Fun [pg 222, A 1-7]
① 51° = 39° (Complement) ② 13° = 77° (Complement) ③ 46° = 44°
==End of OCR for page 48==

==Start of OCR for page 49==
④ 65° = 25°(c) ⑤ 53° = 37°(c) ⑥ 48° = 42°(c) ⑦ 40° = 50°(c)

Home Fun [Pg 222, B 1-10]
① 87° = 93°(s) ② 35° = 145°(s) ③ 61° = 119°(s)
④ 70° = 110°(s) ⑤ 48° = 132°(s) ⑥ 45° = 135° ⑦ 133° = 47°(s)
⑧ 161° = 19°(s) ⑨ 17° = 163°(s) ⑩ 59° = 121°(s)

Topic: Polygon
- Definition
- Types of polygon
- Properties of polygon

Definition:
In geometry, a polygon can be defined as a flat or plane, two-dimensional closed shape with straight sides.
==End of OCR for page 49==

==Start of OCR for page 50==
④ 65°=25°(c) ⑤ 53°=37°(c) ⑥ 48°=42°(c) ⑦ 40°=50°(c)
Home Fun [pg 222, B 1-10]
① 87° = 93°(s) ② 35°=145°(s) ③ 61°=119°(s)
④ 70°=110°(s) ⑤ 48°=132°(s) ⑥ 45°=135° ⑦ 133°=47°(s)
⑧ 161°=19°(s) ⑨ 17=163°(s) ⑩ 59°=121°(s)

Topic: Polygon [net]
- Definition
- Types of polygon
- Properties of polygon

Definition:
In geometry, a polygon can be defined as a flat or plane, two-dimensional closed shape with straight sides. It does not have curved sides.
It's derived from a Greek word in which 'poly' means 'many' and 'gon' means 'angle'.
Types of Polygons:
Depending on the sides and angles, the polygons are classified into different types, namely:
a) Regular polygon
b) Irregular "
c) Convex polygon
d) Concave "
==End of OCR for page 50==

==Start of OCR for page 51==
Regular Polygon:
If all the sides and interior angles of the Polygon are equal, then it is known as a regular polygon. Examples of regular polygons are: square, rhombus, equilateral triangle e.t.c

Irregular Polygon:
If all the sides and the interior angles of the polygon are of different measure, then it is known as an irregular polygon, for example, a scalene triangle, a rectangle, a kite e.t.c.
Types of Polygons: There are different types of polygons and they have different names depending on the number of sides that they have.

| Polygon | No. of sides | Angle | No. of vertices |
| :--- | :--- | :--- | :--- |
| Triangle | 3 | 60° | 3 |
| Square | 4 | 90° | 4 |
| Pentagon | 5 | 108° | 5 |
| Hexagon | 6 | 120° | 6 |
| Heptagon | 7 | 128.6° | 7 |
| Octagon | 8 | 135° | 8 |
| Nonagon | 9 | 140° | 9 |
| Decagon | 10 | 144° | 10 |
| n-gon | n | (n-2)x180/n | n |
==End of OCR for page 51==

==Start of OCR for page 52==
Properties of Polygons
The properties of polygons help us identify them easily. In other words, the following characteristics of a polygon help us to easily check whether a given shape is a polygon or not.
① A polygon is a closed shape, that is there is no end that is left open in the shape. It ends and begins at the same point.
② It is a plane shape, that is, the shape is made of line segments or straight lines.
③ It is a two-dimensional figure, that is, it has only two dimensions length and width. There is no depth or height to it.
④ It has three or more sides in it.
⑤ The angles in the polygon may or may not be the same.
⑥ The length of the sides of a polygon may or may not be the same.
==End of OCR for page 52==

==Start of OCR for page 53==
Everyday Statistics (Pg 246)
- Meaning of data presentation
- Interpretation of pictograms and bar graphs

Definition:
Statistics is a way of collecting, organizing and understanding data (information) to answer questions or solve problems.
It involves:
① Gathering data (Collecting information).
② Organizing data (Using pictograms, tables, charts, graphs e.t.c)
③ Analyzing data (finding patterns, averages)

Pictograms and bar graphs
Pictorial diagrams are ways of giving information through pictorial figures or designs.
Simply put, using pictures to present information.
There are many forms of pictorial diagrams which can be used. Some of these are pictograms and bar graphs.
==End of OCR for page 53==

==Start of OCR for page 54==
Key: 🧍 = Stick man

Pictograms
Example:
The pictogram below shows the favourite fruits of class 5 pupils.

| Fruits | Pupils |
| :--- | :--- |
| Oranges | 🧍🧍🧍🧍🧍 |
| Water-melons | 🧍🧍🧍🧍 |
| Bananas | 🧍🧍 |
| Apple | 🧍🧍🧍🧍🧍 |
| Cucumbers | 🧍 |
| Guavas | 🧍🧍🧍 |
| Pine-apples | 🧍🧍🧍🧍🧍🧍🧍🧍 |
| Mangoes | 🧍🧍🧍🧍🧍🧍 |

Question
① How many pupils like:
a) bananas b) apples c) mangoes d) pineapples
② What is the most favourite fruit?
③ What is the least favourite fruit?
④ What is the mode of the information? Why?
==End of OCR for page 54==

==Start of OCR for page 55==
⑤ How many pupils are in the class?
Solution
① a) 2 pupils b) 5 pupils c) 6 pupils d) 8 pupils
② Pineapples ③ Cucumber ④ Pineapples: This is because it is the most favourite fruit. It has the highest frequency.
⑤ 35 pupils

Bar graph
It is a way of representing information pictorially. Rectangular bars of equal widths are used. The space between the bars must be the same. The height of the bar represents the number of times the event occurs. A bar graph can be horizontal or vertical.
==End of OCR for page 55==

==Start of OCR for page 56==
[Image of a horizontal bar graph. The y-axis is labeled "Fruits" and lists Oranges, Water melons, Bananas, Apples, Cucumber, Guavas, Pineapples, Mangoes. The x-axis is labeled "Number of pupils" and has a scale from 0 to 10. The bars correspond to the data in the pictogram: Oranges=5, Water melons=4, Bananas=2, Apples=5, Cucumber=1, Guavas=3, Pineapples=8, Mangoes=6.]
Fruits
Oranges
Water melons
Bananas
Apples
Cucumber
Guavas
Pineapples
Mangoes
Number of pupils

Above is the horizontal bar graph of number of pupils who like different fruits.
* Check the text book pg 247 for the vertical bar graph.

Class Fun [pg 248, Ex, 1-4]
① Malaria ② Ebola ③ 40 people ④ 160

Home Fun
Represent the information given in the class fun using horizontal bar-graphs.
==End of OCR for page 56==
 """
  