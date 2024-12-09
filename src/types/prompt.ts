// types/prompt.ts
import { prompts } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export type Prompt = InferSelectModel<typeof prompts>;

export type PromptFormData = {
  title: string;
  content: string;
  tags: string[];
};
