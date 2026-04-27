interface LessonStatusBadgeProps {
  completed: boolean;
}

export function LessonStatusBadge({ completed }: LessonStatusBadgeProps) {
  if (completed) {
    return (
      <span className="inline-block w-5 h-5 text-center text-xs leading-5 bg-[#5a8a6b] text-[#c8e0d0] rounded-full">
        ✓
      </span>
    );
  }

  return (
    <span className="inline-block w-5 h-5 text-center text-xs leading-5 bg-[#3d3458] text-[#6b5a8a] rounded-full">
      ○
    </span>
  );
}
