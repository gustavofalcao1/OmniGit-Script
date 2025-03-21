"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWatching = void 0;
const child_process_1 = require("child_process");
const chokidar_1 = __importDefault(require("chokidar"));
const openai_1 = __importDefault(require("openai"));
const MAX_CHANGES = 1; // Para facilitar o teste, vamos reduzir para 1
let changeCount = 0;
let changedFiles = [];
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
const generateCommitMessage = async (files) => {
    const prompt = `Generate a commit message for the following changes:\n${files.join('\n')}`;
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 50,
        });
        const commitMessage = response.choices[0]?.message?.content?.trim() || 'Auto commit';
        return commitMessage;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error generating commit message: ${error.message}`);
        }
        else {
            console.error(`Unknown error generating commit message: ${error}`);
        }
        return 'Auto commit';
    }
};
const commitChanges = async () => {
    const commitMessage = await generateCommitMessage(changedFiles);
    (0, child_process_1.exec)(`git add . && git commit -m '${commitMessage}'`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error committing changes: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Commit stderr: ${stderr}`);
            return;
        }
        changeCount = 0; // Reset change count after commit
        changedFiles = []; // Reset changed files after commit
    });
};
const startWatching = () => {
    const watcher = chokidar_1.default.watch('.', {
        ignored: /node_modules|\.git/,
        persistent: true,
    });
    watcher.on('change', (path) => {
        changeCount += 1;
        changedFiles.push(path);
        if (changeCount >= MAX_CHANGES) {
            commitChanges();
        }
    });
};
exports.startWatching = startWatching;
