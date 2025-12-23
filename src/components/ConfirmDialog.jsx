import React, { useEffect, useRef } from "react";

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  const ref = useRef(null);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", esc);
    ref.current?.focus();
    return () => document.removeEventListener("keydown", esc);
  }, [onCancel]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div ref={ref} tabIndex={-1} className="bg-white p-4 rounded">
        <p>{message}</p>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
