import type { ReactNode, MouseEvent } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  const handleBackdrop = (e: MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdrop}
    >
      <div className="bg-[#141a22] p-6 rounded-xl shadow-xl max-w-md w-full border border-[#1e2a38]">
        {children}
      </div>
    </div>
  );
}
