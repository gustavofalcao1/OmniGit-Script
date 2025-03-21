import { exec } from 'child_process';
import chokidar from 'chokidar';
import OpenAI from 'openai';

const MAX_CHANGES = 1; // Para facilitar o teste, vamos reduzir para 1
let changeCount = 0;
let changedFiles: string[] = [];

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateCommitMessage = async (files: string[]): Promise<string> => {
  const prompt = `Generate a commit message for the following changes:\n${files.join('\n')}`;
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 50,
    });
    const commitMessage = response.choices[0]?.message?.content?.trim() || 'Auto commit';
    return commitMessage;
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
  exec(`git add . && git commit -m '${commitMessage}'`, (error, stdout, stderr) => {
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

export const startWatching = () => {
  const watcher = chokidar.watch('.', {
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
