'use client';
import { PromptCard } from '@/components/PromptCard';
import { PromptForm } from '@/components/PromptForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  deletePrompt,
  getPrompts,
  incrementUsage,
  savePrompt,
  updatePrompt,
} from '@/lib/storage';
import { Prompt, PromptFormData } from '@/types/prompt';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { Toaster, toast } from 'sonner'; // Import Toaster and toast from sonner

const PromptManager = () => {
  const [prompts, setPrompts] = useState<Prompt[]>(getPrompts());
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null);

  const handleSave = (data: PromptFormData) => {
    try {
      if (selectedPrompt) {
        updatePrompt(selectedPrompt.id, data);
        setPrompts(getPrompts());
        toast.success('Prompt updated successfully.'); // Use toast.success
      } else {
        savePrompt(data);
        setPrompts(getPrompts());
        toast.success('Prompt saved successfully.'); // Use toast.success
      }
      setIsDialogOpen(false);
      setSelectedPrompt(null);
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast.error('Error saving prompt.'); // Use toast.error
    }
  };

  const handleEdit = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPromptToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (promptToDelete) {
      deletePrompt(promptToDelete);
      setPrompts(getPrompts());
      setIsDeleteDialogOpen(false);
      setPromptToDelete(null);
      toast.success('Prompt deleted successfully.'); // Use toast.success
    }
  };

  const handleUse = (id: string) => {
    try {
      incrementUsage(id);
      setPrompts(getPrompts());
      // Find the prompt and copy its content to clipboard
      const promptToCopy = prompts.find((p) => p.id === id);
      if (promptToCopy) {
        navigator.clipboard.writeText(promptToCopy.content);
        toast.success('Prompt copied to clipboard.'); // Use toast.success
      } else {
        toast.error('Prompt not found.'); // Use toast.error if prompt is not found
      }
    } catch (error) {
      console.error('Error incrementing usage or copying:', error);
      toast.error('Error copying prompt.'); // Use toast.error
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-right" richColors />
      <div className="container py-8 space-y-8">
        <div className="text-center">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">AI Prompt Saver</h1>
              <p className="text-xl text-gray-600">
                Start building your amazing project here!
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
              onDelete={handleDelete}
              onUse={handleUse}
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
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This prompt will be permanently
                deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setPromptToDelete(null);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default PromptManager;
