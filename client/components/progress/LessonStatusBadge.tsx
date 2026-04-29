interface LessonStatusBadgeProps {
  completed: boolean;
}

export function LessonStatusBadge({ completed }: LessonStatusBadgeProps) {
  if (completed) {
    return (
      <span className="inline-block w-5 h-5 text-center text-xs leading-5 bg-[#1a4030] text-[#70a888] rounded-full">
        ✓
      </span>
    );
  }

  return (
    <span className="inline-block w-5 h-5 text-center text-xs leading-5 bg-[#1e2a38] text-[#3a4858] rounded-full">
      ○
    </span>
  );
}
