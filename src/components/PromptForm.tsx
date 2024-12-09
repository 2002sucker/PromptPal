'use client';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

import { Textarea } from '@/components/ui/textarea';

import { Label } from '@/components/ui/label';

import { useState } from 'react';

import { PromptFormData } from '@/types/prompt';

interface PromptFormProps {
  initialData?: PromptFormData;

  onSubmit: (data: PromptFormData) => void;

  onCancel: () => void;
}

export function PromptForm({
  initialData,
  onSubmit,
  onCancel,
}: PromptFormProps) {
  const [formData, setFormData] = useState<PromptFormData>(
    initialData || {
      title: '',

      content: '',

      tags: [],
    }
  );

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    onSubmit(formData);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,

        tags: [...formData.tags, tagInput.trim()],
      });

      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,

      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>

        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter prompt title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Prompt</Label>

        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          placeholder="Enter your prompt here"
          className="min-h-[150px]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>

        <div className="flex gap-2">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add tags"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();

                handleAddTag();
              }
            }}
          />

          <Button type="button" onClick={handleAddTag}>
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1"
            >
              {tag}

              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-secondary-foreground/70 hover:text-secondary-foreground"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
