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
import { calculateUsagePercentage } from '@/lib/storage';
import { Prompt } from '@/types/prompt';
import { Copy, Edit, MoreVertical, Trash } from 'lucide-react';

interface PromptCardProps {
  prompt: Prompt;

  onEdit: (prompt: Prompt) => void;

  onDelete: (id: string) => void;

  onUse: (id: string) => void;
}

export function PromptCard({
  prompt,
  onEdit,
  onDelete,
  onUse,
}: PromptCardProps) {
  const usagePercentage = calculateUsagePercentage(prompt);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content);

    onUse(prompt.id);
  };

  return (
    <Card className="w-full animate-fadeIn hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <CardTitle className="text-xl font-bold">{prompt.title}</CardTitle>

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
              onClick={() => onDelete(prompt.id)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground whitespace-pre-wrap">
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

        <Button variant="secondary" size="sm" onClick={handleCopy}>
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </Button>
      </CardFooter>
    </Card>
  );
}
