interface RunButtonProps {
  onClick: () => void;
  isRunning: boolean;
  className?: string;
}

export function RunButton({ onClick, isRunning, className = "" }: RunButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isRunning}
      className={`px-4 py-2 bg-[#c4638e]/40 text-[#d4c0ce] font-bold rounded hover:bg-[#7b9ec4]/40 transition shadow-md shadow-[#c4638e]/20 disabled:opacity-50 ${className}`}
    >
      {isRunning ? "Running..." : "Run Code"}
    </button>
  );
}
