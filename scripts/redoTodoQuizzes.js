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
        
        for (const todoFile of todoFiles) {
            // Extract subject from filename (assuming format TODO_subject.json or similar)
            const subject = todoFile.replace('TODO - ', '').replace('.json', '');
            
            // Read the corresponding input file
            const inputPath = path.join(__dirname, '../files/input/g2', `${subject}.txt`);
            const inputContent = await fs.readFile(inputPath, 'utf-8');
            
            // Generate new quiz
            const newQuiz = await generateSingleQuiz(inputContent, subject);
            
            // Write the new quiz, replacing the TODO file
            const outputPath = path.join(outputDir, todoFile.replace('TODO_', ''));
            await fs.writeFile(outputPath, JSON.stringify(newQuiz, null, 2));
            
            // Delete the TODO file
            await fs.unlink(path.join(outputDir, todoFile));
            
            console.log(`Processed ${todoFile}`);
        }
        
        console.log('Completed processing all TODO files');
    } catch (error) {
        console.error('Error processing TODO files:', error);
    }
}

// Run the script
redoTodoQuizzes();
