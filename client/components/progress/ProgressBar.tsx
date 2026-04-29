interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-[#8890a0] mb-1">
        <span>{completed}/{total} lessons</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-[#141a22] rounded-full h-2">
        <div
          className="bg-[#3580c0] h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
