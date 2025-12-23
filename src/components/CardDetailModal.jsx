import React, { useState, useEffect, useRef } from "react";

export default function CardDetailModal({ card, onClose, onSave }) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [tags, setTags] = useState(card.tags || []);
  const [tagInput, setTagInput] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    ref.current?.focus();
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const save = () => {
    onSave({ title, description, tags });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div
        ref={ref}
        tabIndex={-1}
        className="bg-pink-50 p-4 rounded"
        onClick={(e) => e.stopPropagation()}
      >
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setTags([...tags, tagInput.trim()])}
        />
        <div className="flex gap-2 mt-2">
          <button onClick={onClose}>Cancel</button>
          <button onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
}
