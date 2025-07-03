# Agent Guidelines for angelwingscomms/q

This document outlines guidelines for agentic coding agents operating in this repository.

## 1. Build/Lint/Test Commands

*   **Build**: No explicit build command. The project runs with `node index.js` or `node todolist.js`.
*   **Lint**: No explicit linting command. Adhere to standard JavaScript best practices.
*   **Test**: The `package.json` defines `"test": "echo \"Error: no test specified\" && exit 1"`. There are no automated tests. When adding new features or fixing bugs, manual verification is required.

## 2. Code Style Guidelines

*   **Imports**: Use `require()` for module imports as this is a CommonJS project.
*   **Formatting**: Follow consistent indentation (2 spaces preferred if not already established, otherwise match existing). Use semicolons.
*   **Types**: JavaScript is dynamically typed. Prioritize clear variable and function naming.
*   **Naming Conventions**:
    *   Variables and functions: `camelCase`
    *   Constants: `UPPER_SNAKE_CASE`
    *   Files: `kebab-case` or `snake_case` (match existing)
*   **Error Handling**: Use `try...catch` blocks for synchronous errors and handle asynchronous errors with callbacks or `.catch()` for Promises. Log errors appropriately.