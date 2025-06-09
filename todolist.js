#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const readline = require('readline');

// Define the subjects array (copied from index.js)
const subjects = [
 "Math",
 "English Language",
 "Basic Science and Technology",
 "Computer Science",
 "History",
 "Physical and Health Education",
 "National Values",
 "Cultural and Creative Arts",
 "PreVocational Studies",
 "French",
 "Religious Studies",
 "Music",
];

// Define sections
const SECTIONS = ['n1', 'n2', 'g1', 'g2', 'g3', 'g4', 'g5'];

// File to store the todo list data
const DATA_FILE = path.join(__dirname, 'todolist-data.json');

// Initialize or load the todo list data
function loadTodoData() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (error) {
      console.error('Error reading todo data:', error);
      return createInitialTodoData();
    }
  } else {
    return createInitialTodoData();
  }
}

// Create the initial todo list data structure
function createInitialTodoData() {
  const todoData = {};
  
  subjects.forEach(subject => {
    todoData[subject] = {};
    
    SECTIONS.forEach(section => {
      todoData[subject][section] = {
        done: false,
        printed: false
      };
    });
  });
  
  return todoData;
}

// Save the todo list data to the file
function saveTodoData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving todo data:', error);
  }
}

// Interactive grid-based todo list
class InteractiveTodoList {
  constructor(todoData) {
    this.todoData = todoData;
    this.currentRow = 0;
    this.currentCol = 0;
    this.currentType = 'done'; // 'done' or 'printed'
    this.maxRows = subjects.length;
    this.maxCols = SECTIONS.length;
    this.running = false;
    
    // Set up readline interface
    this.rl = readline.createInterface({
      input: process.stdin,
      output: null,
    });
    
    // Set up raw mode
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
  }
  
  // Start the interactive interface
  start() {
    this.running = true;
    this.render();
    
    // Handle keypress events
    process.stdin.on('keypress', (str, key) => {
      if (!this.running) return;
      
      if (key.ctrl && key.name === 'c') {
        this.exit();
        return;
      }
      
      switch (key.name) {
        case 'up':
          this.moveUp();
          break;
        case 'down':
          this.moveDown();
          break;
        case 'left':
          this.moveLeft();
          break;
        case 'right':
          this.moveRight();
          break;
        case 'tab':
          this.toggleType();
          break;
        case 'space':
        case 'return':
          this.toggleStatus();
          break;
        case 'r':
          this.resetAll();
          break;
        case 'q':
        case 'escape':
          this.exit();
          break;
      }
      
      this.render();
    });
  }
  
  // Move cursor up
  moveUp() {
    this.currentRow = (this.currentRow - 1 + this.maxRows) % this.maxRows;
  }
  
  // Move cursor down
  moveDown() {
    this.currentRow = (this.currentRow + 1) % this.maxRows;
  }
  
  // Move cursor left
  moveLeft() {
    if (this.currentType === 'printed') {
      this.currentType = 'done';
    } else {
      this.currentType = 'printed';
      this.currentCol = (this.currentCol - 1 + this.maxCols) % this.maxCols;
    }
  }
  
  // Move cursor right
  moveRight() {
    if (this.currentType === 'done') {
      this.currentType = 'printed';
    } else {
      this.currentType = 'done';
      this.currentCol = (this.currentCol + 1) % this.maxCols;
    }
  }
  
  // Toggle between 'done' and 'printed'
  toggleType() {
    this.currentType = this.currentType === 'done' ? 'printed' : 'done';
  }
  
  // Toggle the status of the current cell
  toggleStatus() {
    const subject = subjects[this.currentRow];
    const section = SECTIONS[this.currentCol];
    this.todoData[subject][section][this.currentType] = !this.todoData[subject][section][this.currentType];
    saveTodoData(this.todoData);
  }
  
  // Reset all statuses
  resetAll() {
    const confirm = this.confirmAction('Are you sure you want to reset all statuses? (y/n)');
    if (confirm) {
      this.todoData = createInitialTodoData();
      saveTodoData(this.todoData);
    }
  }
  
  // Confirm an action
  confirmAction(message) {
    console.clear();
    console.log(message);
    // This is a simple synchronous confirmation
    // In a real app, you'd want to handle this asynchronously
    return true;
  }
  
  // Exit the application
  exit() {
    this.running = false;
    process.stdin.setRawMode(false);
    this.rl.close();
    console.clear();
    console.log(chalk.blue('Goodbye!'));
    process.exit(0);
  }
  
  // Render the todo list grid
  render() {
    console.clear();
    
    // Print header
    console.log(chalk.bold.blue('===== SUBJECT TODO LIST =====\n'));
    console.log(chalk.bold.blue('Use arrow keys to navigate, Space/Enter to toggle status, Tab to switch between Done/Printed'));
    console.log(chalk.bold.blue('Press R to reset all, Q or Esc to exit\n'));
    
    // Increase subject column width to 30 characters
    const subjectWidth = 30;
    
    // Print column headers
    let header = ' '.repeat(subjectWidth);
    SECTIONS.forEach(section => {
      header += section.padStart(5).padEnd(10);
    });
    console.log(chalk.cyan(header));
    console.log('-'.repeat(subjectWidth + SECTIONS.length * 10));
    
    // Print rows
    subjects.forEach((subject, rowIndex) => {
      // Pad and truncate subject name if necessary, with ellipsis for long names
      let displaySubject = subject;
      if (subject.length > subjectWidth - 2) {
        displaySubject = subject.substring(0, subjectWidth - 5) + '...';
      }
      
      // Print the subject name
      console.log(chalk.yellow.bold(displaySubject.padEnd(subjectWidth)));
      
      // Print "Done" row
      let doneRow = '  Done'.padEnd(subjectWidth);
      SECTIONS.forEach((section, colIndex) => {
        const status = this.todoData[subject][section];
        const doneStatus = status.done ? '✓' : '✗';
        
        // Highlight the current cell
        const isDoneSelected = rowIndex === this.currentRow && colIndex === this.currentCol && this.currentType === 'done';
        
        let cellText = ` ${doneStatus} `.padEnd(10);
        if (isDoneSelected) {
          doneRow += chalk.bgWhite.black(cellText);
        } else {
          doneRow += cellText;
        }
      });
      console.log(chalk.cyan(doneRow));
      
      // Print "Printed" row
      let printedRow = '  Printed'.padEnd(subjectWidth);
      SECTIONS.forEach((section, colIndex) => {
        const status = this.todoData[subject][section];
        const printedStatus = status.printed ? '✓' : '✗';
        
        // Highlight the current cell
        const isPrintedSelected = rowIndex === this.currentRow && colIndex === this.currentCol && this.currentType === 'printed';
        
        let cellText = ` ${printedStatus} `.padEnd(10);
        if (isPrintedSelected) {
          printedRow += chalk.bgWhite.black(cellText);
        } else {
          printedRow += cellText;
        }
      });
      console.log(chalk.cyan(printedRow));
      
      // Add a separator line between subjects
      console.log('-'.repeat(subjectWidth + SECTIONS.length * 10));
    });
  }
}

// Start the application
async function start() {
  const todoData = loadTodoData();
  const interactiveTodoList = new InteractiveTodoList(todoData);
  interactiveTodoList.start();
}

// Run the application
start().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
}); 