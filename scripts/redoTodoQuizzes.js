const fs = require('fs').promises;
const path = require('path');
const { generateSingleQuiz } = require('../index.js');

async function redoTodoQuizzes() {
    try {
        // Read all files in the output/g2 directory
        const outputDir = path.join(__dirname, '../files/output/g2');
        const files = await fs.readdir(outputDir);
        
        // Filter for TODO files
        const todoFiles = files.filter(file => file.startsWith('TODO'));
        
        // Read the parsed g2.json file
        const parsedDataPath = path.join(__dirname, '../files/input/parsed/g2.json');
        const parsedData = JSON.parse(await fs.readFile(parsedDataPath, 'utf-8'));
        
        // Create a map of subject to content for quick lookup
        const subjectContentMap = {};
        parsedData.forEach(item => {
            if (item.subject && item.content) {
                subjectContentMap[item.subject] = item.content;
            }
        });
        
        for (const todoFile of todoFiles) {
            // Extract subject from filename (assuming format TODO - subject.json or similar)
            const subject = todoFile.replace('TODO - ', '').replace('.json', '');
            
            // Get content from the parsed data
            const inputContent = subjectContentMap[subject];
            
            if (!inputContent) {
                console.log(`No content found for subject: ${subject}`);
                continue;
            }
            
            // Generate new quiz
            const newQuiz = await generateSingleQuiz({ g: 2, t: inputContent, s: subject });
            
            // Write the new quiz, replacing the TODO file
            const outputPath = path.join(outputDir, todoFile);
            await fs.writeFile(outputPath, JSON.stringify(newQuiz, null, 2));
            
            console.log(`Processed ${todoFile}`);
        }
        
        console.log('Completed processing all TODO files');
    } catch (error) {
        console.error('Error processing TODO files:', error);
    }
}

// Run the script
redoTodoQuizzes();
