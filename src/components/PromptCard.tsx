import { deletePrompt } from '@/actions/promptAction'; // Import Server Actions from the correct path (e.g., lib/actions)
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Prompt } from '@/types/prompt';
import { Copy, Edit, MoreVertical, Trash } from 'lucide-react';
import { toast } from 'sonner';

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: number) => void;
  onUse: (id: number) => void;
  onPromptDeleted: () => void; // Function to call after successful deletion
}

export function PromptCard({
  prompt,
  onEdit,
  onUse,
  onPromptDeleted,
}: PromptCardProps) {
  const calculateUsagePercentage = (prompt: Prompt) => {
    const maxUsage = 100; // You can adjust this based on your needs
    return Math.min((prompt.usageCount / maxUsage) * 100, 100);
  };

  const usagePercentage = calculateUsagePercentage(prompt);

  const handleDelete = async () => {
    try {
      await deletePrompt(prompt.id);
      toast.success('Prompt deleted successfully.');
      onPromptDeleted(); // Call onPromptDeleted to refresh the data
    } catch (error) {
      toast.error('Failed to delete prompt.');
      console.error('Error deleting prompt:', error);
    }
  };

  return (
    <Card className="w-full animate-fadeIn hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <CardTitle className="text-xl font-bold line-clamp-1">
          {prompt.title}
        </CardTitle>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(prompt)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDelete}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground whitespace-pre-wrap line-clamp-3">
          {prompt.content}
        </p>

        <div className="flex flex-wrap gap-2">
          {prompt.tags.map((tag) => (
            <span
              key={tag}
              className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Used: {prompt.usageCount}</span>
            <Progress value={usagePercentage} className="w-20" />
          </div>
        </div>

        <Button variant="secondary" size="sm" onClick={() => onUse(prompt.id)}>
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </Button>
      </CardFooter>
    </Card>
  );
}
