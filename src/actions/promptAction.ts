'use server';

import { db } from '@/db/db';
import { prompts } from '@/db/schema';
import { Prompt, PromptFormData } from '@/types/prompt';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getPrompts(): Promise<Prompt[]> {
  try {
    const result = await db.select().from(prompts);
    return result;
  } catch (error) {
    console.error('Error fetching prompts:', error);
    throw new Error('Failed to fetch prompts.');
  }
}

export async function savePrompt(data: PromptFormData) {
  try {
    await db.insert(prompts).values(data);
  } catch (error) {
    console.error('Error saving prompt:', error);
    throw new Error('Failed to save prompt.');
  }
  revalidatePath('/prompts');
}

export async function updatePrompt(id: number, data: PromptFormData) {
  try {
    await db.update(prompts).set(data).where(eq(prompts.id, id));
  } catch (error) {
    console.error('Error updating prompt:', error);
    throw new Error('Failed to update prompt.');
  }
  revalidatePath('/prompts');
}

export async function deletePrompt(id: number) {
  try {
    const result = await db
      .delete(prompts)
      .where(eq(prompts.id, id))
      .returning(); // Add .returning()

    // Check if any rows were deleted
    if (result.length === 0) {
      throw new Error(`Prompt with ID ${id} not found.`);
    }
  } catch (error) {
    console.error('Error deleting prompt:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to delete prompt: ${error.message}`);
    } else {
      throw new Error('Failed to delete prompt.');
    }
  }
  revalidatePath('/prompts');
}

export async function incrementUsage(id: number) {
  try {
    const currentPrompt = await db
      .select()
      .from(prompts)
      .where(eq(prompts.id, id));
    if (currentPrompt.length > 0) {
      await db
        .update(prompts)
        .set({ usageCount: currentPrompt[0].usageCount + 1 })
        .where(eq(prompts.id, id));
    }
  } catch (error) {
    console.error('Error incrementing usage:', error);
    throw new Error('Failed to increment usage.');
  }
  revalidatePath('/prompts');
}
