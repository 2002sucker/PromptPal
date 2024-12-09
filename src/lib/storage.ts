import { Prompt, PromptFormData } from '@/types/prompt';

const STORAGE_KEY = 'ai-prompts';

export const savePrompt = (promptData: PromptFormData): Prompt => {
  const prompts = getPrompts();

  const newPrompt: Prompt = {
    id: crypto.randomUUID(),

    ...promptData,

    usageCount: 0,

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString(),
  };

  prompts.push(newPrompt);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));

  console.log('Saved prompt:', newPrompt);

  return newPrompt;
};

export const getPrompts = (): Prompt[] => {
  const data = localStorage.getItem(STORAGE_KEY);

  console.log('Retrieved prompts from storage');

  return data ? JSON.parse(data) : [];
};

export const updatePrompt = (
  id: string,
  promptData: PromptFormData
): Prompt => {
  const prompts = getPrompts();

  const index = prompts.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new Error('Prompt not found');
  }

  const updatedPrompt: Prompt = {
    ...prompts[index],

    ...promptData,

    updatedAt: new Date().toISOString(),
  };

  prompts[index] = updatedPrompt;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));

  console.log('Updated prompt:', updatedPrompt);

  return updatedPrompt;
};

export const deletePrompt = (id: string): void => {
  const prompts = getPrompts();

  const filteredPrompts = prompts.filter((p) => p.id !== id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPrompts));

  console.log('Deleted prompt:', id);
};

export const incrementUsage = (id: string): Prompt => {
  const prompts = getPrompts();

  const index = prompts.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new Error('Prompt not found');
  }

  const updatedPrompt = {
    ...prompts[index],

    usageCount: prompts[index].usageCount + 1,

    updatedAt: new Date().toISOString(),
  };

  prompts[index] = updatedPrompt;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));

  console.log('Incremented usage for prompt:', id);

  return updatedPrompt;
};

export const calculateUsagePercentage = (prompt: Prompt): number => {
  const prompts = getPrompts();

  const totalUsage = prompts.reduce((sum, p) => sum + p.usageCount, 0);

  return totalUsage === 0 ? 0 : (prompt.usageCount / totalUsage) * 100;
};
