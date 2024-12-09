'use client';

import {
  deletePrompt,
  getPrompts,
  incrementUsage,
  savePrompt,
  updatePrompt,
} from '@/actions/promptAction';
import { PromptCard } from '@/components/PromptCard';
import { PromptForm } from '@/components/PromptForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Prompt, PromptFormData } from '@/types/prompt';
import { Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

export default function PromptManager() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [promptToDelete, setPromptToDelete] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    setIsLoading(true);
    const fetchedPrompts = await getPrompts();
    setPrompts(fetchedPrompts);
    setIsLoading(false);
  };

  const handleSave = async (data: PromptFormData) => {
    try {
      if (selectedPrompt) {
        await updatePrompt(selectedPrompt.id, data);
        toast.success('Prompt updated successfully.');
      } else {
        await savePrompt(data);
        toast.success('Prompt saved successfully.');
      }
      fetchPrompts();
      setIsDialogOpen(false);
      setSelectedPrompt(null);
    } catch (error) {
      toast.error('Error saving prompt.');
    }
  };

  const handleEdit = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    // Directly call deletePrompt, no need for confirmation dialog state
    try {
      await deletePrompt(id);
      await fetchPrompts(); // Refetch prompts after deletion
      toast.success('Prompt deleted successfully.');
    } catch (error) {
      toast.error('Error deleting prompt.');
    }
  };

  const handleUse = async (id: number) => {
    try {
      await incrementUsage(id);
      const promptToCopy = prompts.find((p) => p.id === id);
      if (promptToCopy) {
        await navigator.clipboard.writeText(promptToCopy.content);
        toast.success('Prompt copied to clipboard.');
        fetchPrompts();
      }
    } catch (error) {
      toast.error('Error copying prompt.');
    }
  };

  const filteredPrompts = prompts.filter(
    (prompt) =>
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Toaster position="top-right" richColors />
      <div className="container py-8 space-y-8">
        <div className="text-center">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">Prompt Pal</h1>
              <p className="text-xl text-gray-600">
                Manage your AI prompts efficiently
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Save Prompt
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {selectedPrompt ? 'Edit Prompt' : 'Save New Prompt'}
                  </DialogTitle>
                </DialogHeader>
                <PromptForm
                  initialData={
                    selectedPrompt
                      ? {
                          title: selectedPrompt.title,
                          content: selectedPrompt.content,
                          tags: selectedPrompt.tags,
                        }
                      : undefined
                  }
                  onSubmit={handleSave}
                  onCancel={() => {
                    setIsDialogOpen(false);
                    setSelectedPrompt(null);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onEdit={handleEdit}
              onDelete={() => handleDelete(prompt.id)} // Pass a function that calls handleDelete with prompt.id
              onUse={handleUse}
              onPromptDeleted={fetchPrompts} // Pass fetchPrompts for refreshing data
            />
          ))}
          {filteredPrompts.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              {searchTerm
                ? 'No prompts found matching your search.'
                : "No prompts saved yet. Click 'Save Prompt' to get started!"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
