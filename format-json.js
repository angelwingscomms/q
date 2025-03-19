const fs = require('fs');

// Read the file as raw text first
const jsonPath = '/home/x/z/angelwingscomms/q/files/input/parsed/3/a.json';
const rawText = fs.readFileSync(jsonPath, 'utf8');

// Fix Unicode escape sequences
const fixedText = rawText
  .replace(/\\\U/g, '\\u') // Fix uppercase U escapes
  .replace(/\\u([0-9a-fA-F]{8})/g, (_, p1) => { // Handle 8-digit codes
    return String.fromCodePoint(parseInt(p1, 16));
  });

// Add the missing array wrapper if needed
const textToProcess = fixedText.startsWith('[') ? fixedText : '[' + fixedText + ']';

try {
  // Parse and re-stringify to format
  const data = JSON.parse(textToProcess);
  const formatted = JSON.stringify(data, null, 2);
  
  // Write back to the file
  fs.writeFileSync(jsonPath, formatted);
  console.log('JSON file has been formatted and saved');
} catch (err) {
  console.error('Error processing JSON:', err.message);
  // Log the problematic character position
  if (err instanceof SyntaxError) {
    const position = parseInt(err.message.match(/position (\d+)/)?.[1]);
    if (!isNaN(position)) {
      console.log('Problem area:', textToProcess.substring(position - 50, position + 50));
    }
  }
}