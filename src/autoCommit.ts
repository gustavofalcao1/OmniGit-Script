import { exec } from 'child_process';
import chokidar from 'chokidar';
import OpenAI from 'openai';

const MAX_CHANGES = 10;
let changeCount = 0;
let changedFiles: string[] = [];

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateCommitMessage = async (files: string[]): Promise<string> => {
  const prompt = `Generate a commit message for the following changes:\n${files.join('\n')}`;
  try {
    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 50,
    });
    console.log('Generated commit message:', response.choices[0].text.trim());
    return response.choices[0].text.trim();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error generating commit message: ${error.message}`);
    } else {
      console.error(`Unknown error generating commit message: ${error}`);
    }
    return 'Auto commit';
  }
};

const commitChanges = async () => {
  const commitMessage = await generateCommitMessage(changedFiles);
  console.log('Committing changes with message:', commitMessage);
  exec(`git add . && git commit -m "${commitMessage}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error committing changes: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Commit stderr: ${stderr}`);
      return;
    }
    console.log(`Commit stdout: ${stdout}`);
    changeCount = 0; // Reset change count after commit
    changedFiles = []; // Reset changed files after commit
  });
};

export const startWatching = () => {
  const watcher = chokidar.watch('.', {
    ignored: /node_modules|\.git/,
    persistent: true,
  });

  watcher.on('change', (path) => {
    console.log(`File ${path} has been changed`);
    changeCount += 1;
    changedFiles.push(path);

    if (changeCount >= MAX_CHANGES) {
      commitChanges();
    }
  });

  console.log('Watching for file changes...');
};
