#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const inquirer = require('inquirer');
const { format } = require('date-fns');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.G);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const TEMP_DIR = path.join(os.tmpdir(), 'voice-recordings');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

async function listRecordings() {
    const files = fs.readdirSync(TEMP_DIR)
        .filter(file => file.endsWith('.wav'))
        .map(file => {
            const filePath = path.join(TEMP_DIR, file);
            const stats = fs.statSync(filePath);
            return {
                name: file,
                path: filePath,
                mtime: stats.mtime
            };
        })
        .sort((a, b) => b.mtime - a.mtime); // Sort by most recent first

    return files.map(file => ({
        name: `${format(file.mtime, 'yyyy-MM-dd HH:mm:ss')} - ${file.name}`,
        value: file.path
    }));
}

async function record() {
    const timestamp = format(new Date(), 'yyyyMMdd-HHmmss');
    const outputPath = path.join(TEMP_DIR, `recording-${timestamp}.wav`);

    console.log('Recording... Press Enter to stop.');

    // Set raw mode to handle Enter key properly
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    const recorder = spawn('pw-record', [outputPath]);

    await new Promise((resolve, reject) => {
        process.stdin.on('data', (key) => {
            // ctrl-c or Enter
            if (key === '\u0003' || key === '\r' || key === '\n') {
                recorder.kill();
                // Reset stdin
                process.stdin.setRawMode(false);
                process.stdin.pause();
                process.stdin.removeAllListeners('data');
                resolve();
            }
        });

        recorder.on('error', (err) => {
            process.stdin.setRawMode(false);
            process.stdin.pause();
            reject(err);
        });
    });

    console.log('\nRecording stopped.');
    return outputPath;
}

async function transcribe(audioPath) {
    if (!process.env.GROQ) {
        throw new Error('GROQ environment variable is not set');
    }

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.GROQ}`
        },
        body: new FormData({
            file: fs.createReadStream(audioPath),
            model: 'whisper-large-v3',
            temperature: 0,
            response_format: 'json',
            language: 'en'
        })
    });

    const data = await response.json();

    if (!data.text) {
        throw new Error('Failed to get transcription: ' + JSON.stringify(data));
    }

    return data.text;
}

async function chat(text) {
    if (!process.env.G) {
        throw new Error('G environment variable (Gemini API key) is not set');
    }
    try {
        const result = await model.generateContent(text);
        const response = await result.response;
        return response.text();
    } catch (error) {
        throw new Error('Failed to get chat response: ' + error.message);
    }
}

async function copyToClipboard(text) {
    execSync('xclip -selection clipboard', { input: text });
}

async function main() {
    // Check required commands
    try {
        execSync('which pw-record xclip');
    } catch (error) {
        console.error('Error: Required commands (pw-record, xclip) are not installed');
        process.exit(1);
    }

    // Check for required API keys
    if (!process.env.GROQ || !process.env.G) {
        console.error('Error: Required environment variables (GROQ and G) are not set');
        process.exit(1);
    }

    const { action } = await inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            { name: 'New Recording', value: 'new' },
            { name: 'Use Existing Recording', value: 'existing' }
        ]
    }]);

    let audioPath;
    if (action === 'new') {
        audioPath = await record();
    } else {
        const recordings = await listRecordings();
        if (recordings.length === 0) {
            console.log('No existing recordings found.');
            process.exit(0);
        }

        const { selectedFile } = await inquirer.prompt([{
            type: 'list',
            name: 'selectedFile',
            message: 'Select a recording:',
            choices: recordings
        }]);

        audioPath = selectedFile;
    }

    console.log('Transcribing audio...');
    try {
        const text = await transcribe(audioPath);
        console.log('Transcribed text:', text);
        
        console.log('\nGetting response from Gemini...');
        const chatResponse = await chat(text);
        console.log('\nGemini response:', chatResponse);
        
        // Copy the chat response to clipboard instead of the transcription
        await copyToClipboard(chatResponse);
        console.log('\nResponse copied to clipboard!');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main().catch(console.error);