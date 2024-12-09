export interface Prompt {
  id: string;

  title: string;

  content: string;

  tags: string[];

  usageCount: number;

  createdAt: string;

  updatedAt: string;
}

export interface PromptFormData {
  title: string;

  content: string;

  tags: string[];
}
