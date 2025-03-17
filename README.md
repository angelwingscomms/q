# Subject Todo List

A terminal-based todo list application for tracking subjects with Nursery and Primary sections. Each subject-section combination has two status checkboxes: "Done" and "Printed".

## Features

- Track multiple subjects (English, Math, Science, etc.)
- Each subject has both Nursery and Primary sections
- Each section has two status checkboxes: Done and Printed
- Interactive terminal UI with color-coded status indicators
- Persistent storage of todo list data
- Reset all statuses at once

## Installation

1. Make sure you have Node.js installed on your system
2. Clone this repository or download the files
3. Install dependencies:

```bash
npm install
```

## Usage

Run the application:

```bash
npm start
```

Or directly:

```bash
node todolist.js
```

### Navigation

- Use arrow keys to navigate through menus
- Press Enter to select an option

### Main Menu Options

- **Update status**: Change the "Done" or "Printed" status for a subject-section
- **Reset all**: Reset all statuses to "Not Done" and "Not Printed"
- **Exit**: Close the application

## Data Storage

The todo list data is stored in a file named `todolist-data.json` in the same directory as the application. This ensures your data persists between sessions. 