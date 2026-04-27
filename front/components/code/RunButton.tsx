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
      className={`px-4 py-2 bg-[#1a2d45]/80 text-[#a8b0bc] font-bold rounded hover:bg-[#253d58]/70 transition shadow-sm shadow-[#0d1117]/40 disabled:opacity-50 ${className}`}
    >
      {isRunning ? "Running..." : "Run Code"}
    </button>
  );
}
