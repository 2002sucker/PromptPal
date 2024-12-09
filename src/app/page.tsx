import PromptManager from '@/components/Prompt';

export default function Home() {
  return (
    <div className="container mx-auto flex justify-center items-center min-h-screen p-4">
      <div className="max-w-4xl w-full">
        <PromptManager />
      </div>
    </div>
  );
}
