const { GoogleGenerativeAI } = require('@google/generative-ai');
const { SchemaType } = require('@google/generative-ai/server');
const { patchDocument, PatchType, TextRun } = require('docx');
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const readline = require('readline');
require('dotenv').config();

const G = process.env.G || 'YOUR_API_KEY_HERE';
const genAI = new GoogleGenerativeAI(G);
const grades = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'];
const subjects = ['Mathematics', 'English', 'Science', 'History', 'Geography'];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const singleQuizModel = genAI.getGenerativeModel({
    model: 'gemini-2.0-pro-exp-02-05',
    generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 65536,
        responseMimeType: 'application/json',
        responseSchema: {
            description: 'Array of questions',
            type: 'ARRAY',
            items: {
                type: 'STRING'
            }
        }
    }
});

const multiQuizModel = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 999999,
        responseMimeType: 'application/json',
        responseSchema: {
            description: 'list of exams',
            type: SchemaType.ARRAY,
            items: {
                description: 'an exam object',
                type: SchemaType.OBJECT,
                properties: {
                    subject: {
                        type: SchemaType.STRING,
                        description: "this exam's subject",
                        nullable: false
                    },
                    content: {
                        type: SchemaType.STRING,
                        description: "this exam's content",
                        nullable: false
                    }
                },
                required: ['subject', 'content']
            }
        }
    }
});

async function createSingleQuiz({ t, n, ns, ne }) {
    const result = await singleQuizModel.generateContent(`Perfectly following the format of the first quiz, edit the second quiz while retaining all questions.
Rephrase each question to maintain the same meaning, tone, and English language level as the original, but improve grammar and clarity.
Within each section (objective, Section B, Section C), randomize the order of questions while keeping them within their respective sections.
Make all concise.

For objective questions:
- Replace multiple blanks (e.g., "_____") with a single underscore (e.g., "_")
- Never end with a full stop
- Use brackets for options (e.g., (a)...) and place questions and options on same line
- Fix bad questions by removing or replacing options to ensure one correct answer
- Questions may end with question marks

For Section B and C:
- Keep original blank format (_________)
- Maintain the original simple English level

Respond with ONLY the edited version of the second quiz as plain text

The first quiz:
"""
1. When you take care of your body you will look attractive (a) True (b) False
2. How many noses do you have? (a) 2 (b) 1 (c) 3
3. How many nostrils do you have? (a) 1 (b) 2 (c) 3

Section B: Short answer
1. How many sides does a hexagon have? _________
2. Sum of angles in a triangle. _________
3. 5 + 4 = _________

Section C: Essay
1. Write the theory of relative posterity.
2. Describe the relationship of astronomy and sacred geometry
3. What did the wind tell the sun?
"""

Text to create quiz from:
"""
${t}
"""
`);
    return result.response.text();
}

async function generateDoc({ g, t, s, n, ns, ne }) {
    const q = await createSingleQuiz({ t, n, ns, ne });
    const doc = await patchDocument({
        data: readFileSync(`./files/template${g === 'ONE' ? '-cc' : ''}.docx`),
        outputType: 'nodebuffer', // Changed from 'buffer' to 'nodebuffer'
        keepOriginalStyles: true,
        patches: {
            s: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun(s)]
            },
            g: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun(g)]
            },
            q: {
                type: PatchType.PARAGRAPH,
                children: (JSON.parse(q)).reduce((acc, e) => {
                    acc.push(new TextRun(e));
                    acc.push(new TextRun({ break: 1 }));
                    acc.push(new TextRun({ break: 1 }));
                    return acc;
                }, [])
            }
        }
    });
    return doc;
}

async function generateSingleQuiz({ g, t, s, n, ns, ne }) {
    const doc = await generateDoc({ g, t, s, n, ns, ne });
    const outputPath = `./files/output/${s}_grade${grades.indexOf(g) + 1}.docx`;
    writeFileSync(outputPath, doc);
    console.log(`Quiz generated: ${outputPath}`);
}

async function generateMultipleQuizzes({ c, g, n, ns, ne, file }) {
    if (!existsSync('./files/input/parsed')) {
        mkdirSync('./files/input/parsed', { recursive: true });
    }

    const parsedFilePath = `./files/input/parsed/${file}.json`;
    let exams;

    if (existsSync(parsedFilePath)) {
        console.log(`Using cached parsed data from ${parsedFilePath}`);
        exams = JSON.parse(readFileSync(parsedFilePath, 'utf8'));
    } else {
        console.log('Parsing exams...');
        exams = JSON.parse(
            (await multiQuizModel.generateContent(
                `return a JSON array of EACH AND EVERY exam given, where each exam object has 'subject' and 'content', the subject being that exam's subject, and the content being the exam's content as a string. Use exactly these subjects were relevant: ${JSON.stringify(subjects)}
                Include EVERY subject.
                The exams:
                ${c}
                `
            )).response.text()
        );
        
        writeFileSync(parsedFilePath, JSON.stringify(exams, null, 2));
        console.log(`Saved parsed exams to ${parsedFilePath}`);
    }

    console.log(`Found ${exams.length} exams to generate`);
    
    const outputDir = `./files/output/g${grades.indexOf(g) + 1}`;
    if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
    }

    for (const { subject: s, content: t } of exams) {
        console.log(`Generating quiz for ${s}...`);
        const doc = await generateDoc({ g, t, s, n, ns, ne });
        const outputPath = `${outputDir}/${s}.docx`;
        writeFileSync(outputPath, doc);
        console.log(`Generated: ${outputPath}`);
        await new Promise(r => setTimeout(r, 54000));
    }
}

async function main() {
    try {
        const mode = await new Promise((resolve) => {
            rl.question('Generate (1) single quiz or (2) multiple quizzes? [1/2]: ', (answer) => resolve(answer));
        });

        if (mode === '1') {
            const file = await new Promise((resolve) => {
                rl.question('What file? (e.g., grade1.txt): ', (answer) => resolve(answer));
            });
            const text = readFileSync(`./files/input/${file}`, 'utf8');

            const grade = await new Promise((resolve) => {
                rl.question('Which grade? (ONE/TWO/THREE/FOUR/FIVE): ', (answer) => resolve(answer.toUpperCase()));
            });

            if (!grades.includes(grade)) throw new Error('Invalid grade');

            const subject = await new Promise((resolve) => {
                rl.question('Subject: ', (answer) => resolve(answer));
            });

            const n = await new Promise((resolve) => {
                rl.question('How many objective questions? ', (answer) => resolve(parseInt(answer)));
            });

            const ns = await new Promise((resolve) => {
                rl.question('How many short answer questions? ', (answer) => resolve(parseInt(answer)));
            });

            const ne = await new Promise((resolve) => {
                rl.question('How many essay questions? ', (answer) => resolve(parseInt(answer)));
            });

            console.log('Generating single quiz...');
            await generateSingleQuiz({
                g: grade,
                t: text,
                s: subject,
                n: n || 1,
                ns: ns || 0,
                ne: ne || 0
            });

        } else if (mode === '2') {
            const file = await new Promise((resolve) => {
                rl.question('What file? (e.g., grade1.txt): ', (answer) => resolve(answer));
            });
            const content = readFileSync(`./files/input/${file}`, 'utf8');

            const grade = await new Promise((resolve) => {
                rl.question('Which grade? (ONE/TWO/THREE/FOUR/FIVE): ', (answer) => resolve(answer.toUpperCase()));
            });

            if (!grades.includes(grade)) throw new Error('Invalid grade');

            const n = await new Promise((resolve) => {
                rl.question('How many objective questions per quiz? ', (answer) => resolve(parseInt(answer)));
            });

            const ns = await new Promise((resolve) => {
                rl.question('How many short answer questions per quiz? ', (answer) => resolve(parseInt(answer)));
            });

            const ne = await new Promise((resolve) => {
                rl.question('How many essay questions per quiz? ', (answer) => resolve(parseInt(answer)));
            });

            console.log('Generating multiple quizzes...');
            await generateMultipleQuizzes({
                c: content,
                g: grade,
                n: n || 1,
                ns: ns || 0,
                ne: ne || 0,
                file: file.split('.')[0]
            });

        } else {
            throw new Error('Invalid mode selection');
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        rl.close();
    }
}

main();