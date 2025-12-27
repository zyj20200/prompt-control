import fs from 'fs';
import path from 'path';
import { Prompt, Folder } from '@/types/prompt';

const dataDir = path.join(process.cwd(), 'data');
const promptsFile = path.join(dataDir, 'prompts.json');
const foldersFile = path.join(dataDir, 'folders.json');

// Ensure data directory and files exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(promptsFile)) {
  fs.writeFileSync(promptsFile, JSON.stringify([]), 'utf-8');
}

if (!fs.existsSync(foldersFile)) {
  fs.writeFileSync(foldersFile, JSON.stringify([]), 'utf-8');
}

// Prompt functions
export const getPrompts = (): Prompt[] => {
  const fileContent = fs.readFileSync(promptsFile, 'utf-8');
  try {
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
};

export const savePrompts = (prompts: Prompt[]) => {
  fs.writeFileSync(promptsFile, JSON.stringify(prompts, null, 2), 'utf-8');
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

// Folder functions
export const getFolders = (): Folder[] => {
  const fileContent = fs.readFileSync(foldersFile, 'utf-8');
  try {
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
};

export const saveFolders = (folders: Folder[]) => {
  fs.writeFileSync(foldersFile, JSON.stringify(folders, null, 2), 'utf-8');
};

export const addFolder = (name: string): Folder => {
  const folders = getFolders();
  const newFolder: Folder = {
    id: Date.now().toString(),
    name,
    createdAt: new Date().toISOString(),
  };
  folders.push(newFolder);
  saveFolders(folders);
  return newFolder;
};

export const updateFolder = (id: string, name: string): Folder | null => {
  const folders = getFolders();
  const index = folders.findIndex((f) => f.id === id);
  if (index === -1) return null;

  const updatedFolder = { ...folders[index], name };
  folders[index] = updatedFolder;
  saveFolders(folders);
  return updatedFolder;
};

export const deleteFolder = (id: string): boolean => {
  const folders = getFolders();
  const filteredFolders = folders.filter((f) => f.id !== id);
  if (filteredFolders.length === folders.length) return false;
  
  saveFolders(filteredFolders);
  
  // Also update prompts to remove folderId (move to root)
  const prompts = getPrompts();
  let promptsChanged = false;
  const updatedPrompts = prompts.map(p => {
    if (p.folderId === id) {
      promptsChanged = true;
      const { folderId, ...rest } = p;
      return rest as Prompt;
    }
    return p;
  });
  
  if (promptsChanged) {
    savePrompts(updatedPrompts);
  }
  
  return true;
};
