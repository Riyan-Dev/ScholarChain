import { Progress } from "@/components/ui/progress";

interface ProcessingIndicatorProps {
  isProcessing: boolean;
  progress: number;
  processingTitle: string;
  processingItems: string[];
  completeTitle: string;
  completeItems: string[];
}

export function ProcessingIndicator({
  isProcessing,
  progress,
  processingTitle,
  processingItems,
  completeTitle,
  completeItems,
}: ProcessingIndicatorProps) {
  if (isProcessing) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/20" />
        </div>

        <div className="rounded-lg bg-black/10 p-4">
          <h4 className="mb-2 font-medium">{processingTitle}</h4>
          <ul className="space-y-2 text-sm">
            {processingItems.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="size-2 animate-pulse rounded-full bg-white/80"></div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (progress === 100) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
        <h4 className="mb-2 font-medium text-green-800 dark:text-green-300">
          {completeTitle}
        </h4>
        <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
          {completeItems.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-500"></div>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
}
