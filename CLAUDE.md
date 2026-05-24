# Overview
This project is the ramen album. It is posible to create memory for ramen.

# Getting Started

Run these commands to get started

Before each command, `cd app`. Because Deno app is in app directory.

# Run the server
deno run --allow-net main.ts

# Run the server and watch for file changes
deno task dev

# Run the tests
deno test

# Check the current directory/module
deno check

# Check a specific TypeScript file
deno check module.ts

# Include remote modules and npm packages in the check
deno check --all module.ts

# Check code snippets in JSDoc comments
deno check --doc module.ts

# Check code snippets in markdown files
deno check --doc-only markdown.md

