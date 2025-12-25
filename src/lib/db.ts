import fs from 'fs';
import path from 'path';
import { Prompt } from '@/types/prompt';

const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'prompts.json');

// Ensure data directory and file exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([]), 'utf-8');
}

export const getPrompts = (): Prompt[] => {
  const fileContent = fs.readFileSync(dataFile, 'utf-8');
  try {
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
};

export const savePrompts = (prompts: Prompt[]) => {
  fs.writeFileSync(dataFile, JSON.stringify(prompts, null, 2), 'utf-8');
};

export const addPrompt = (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Prompt => {
  const prompts = getPrompts();
  const newPrompt: Prompt = {
    ...prompt,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  prompts.push(newPrompt);
  savePrompts(prompts);
  return newPrompt;
};

export const updatePrompt = (id: string, data: Partial<Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>>): Prompt | null => {
  const prompts = getPrompts();
  const index = prompts.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updatedPrompt = {
    ...prompts[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  prompts[index] = updatedPrompt;
  savePrompts(prompts);
  return updatedPrompt;
};

export const deletePrompt = (id: string): boolean => {
  const prompts = getPrompts();
  const filteredPrompts = prompts.filter((p) => p.id !== id);
  if (filteredPrompts.length === prompts.length) return false;
  
  savePrompts(filteredPrompts);
  return true;
};
