interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-[#9b8fb5] mb-1">
        <span>{completed}/{total} lessons</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-[#2a2240] rounded-full h-2">
        <div
          className="bg-[#c4638e] h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
