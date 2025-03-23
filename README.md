# OmniGit-Script

**OmniGit-Script** is a tool developed to automate the commit process in Git repositories, streamlining the developer workflow.

## Features

- **Automatic Commit:** Performs automated commits at defined intervals, ensuring your changes are consistently saved.

## Project Structure

- `src/autoCommit.ts`: Main script that handles the automatic commit process.
- `src/index.ts`: Entry point of the application.
- `dist/`: Directory containing the compiled JavaScript files.
- `package.json`: Contains project dependencies and scripts.
- `tsconfig.json`: TypeScript configuration file.
- `.env.example`: Example of the required environment configuration.
- `.gitignore`: Specifies files and directories to be ignored by Git.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **TypeScript**: A statically typed superset of JavaScript.
- **Git**: Distributed version control system.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/gustavofalcao1/OmniGit-Script.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd OmniGit-Script
   ```

3. **Install dependencies:**

   Using `npm`:

   ```bash
   npm install
   ```

   Or, using `yarn`:

   ```bash
   yarn install
   ```

4. **Configure environment variables:**

   - Rename `.env.example` to `.env`.
   - Edit `.env` and provide the required configuration.

5. **Build the project:**

   ```bash
   yarn build
   ```

   This will compile the TypeScript code and output it to the `dist/` folder.

## Usage

After building the project, run the script with Node.js from the root of the project:

```bash
node dist/index.js
```

Make sure the `.env` file is present in the root directory of the project that is running the `dist/index.js` file.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

