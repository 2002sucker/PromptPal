// lib/api.ts
import { Prompt, PromptFormData } from '@/types/prompt';

export async function getPrompts(): Promise<Prompt[]> {
  const response = await fetch('/api/prompts');
  if (!response.ok) {
    throw new Error('Failed to fetch prompts');
  }
  return response.json();
}

export async function savePrompt(data: PromptFormData): Promise<Prompt> {
  const response = await fetch('/api/prompts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to save prompt');
  }
  return response.json();
}

export async function updatePrompt(
  id: number,
  data: PromptFormData
): Promise<Prompt> {
  const response = await fetch(`/api/prompts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update prompt');
  }
  return response.json();
}

export async function deletePrompt(id: number): Promise<void> {
  const response = await fetch(`/api/prompts/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete prompt');
  }
}

export async function incrementUsage(id: number): Promise<Prompt> {
  const response = await fetch(`/api/prompts/${id}/increment`, {
    method: 'PUT', // Change method to PUT
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to increment usage');
  }
  return response.json();
}
