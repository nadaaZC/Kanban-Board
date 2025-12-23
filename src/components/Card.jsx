import React, { useState, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import useBoardState from "../hooks/useBoardState";
import CardDetailModal from "./CardDetailModal";

const Card = React.memo(function Card({ card }) {
  const { updateCard, deleteCard } = useBoardState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = useCallback(
    (updates) => updateCard(card.id, updates),
    [updateCard, card.id]
  );

  const handleDelete = useCallback(() => deleteCard(card.id), [deleteCard, card.id]);

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="bg-pink-50 border border-pink-300 rounded p-2 shadow-sm flex flex-col items-stretch"
      >
        {/* Drag handle */}
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing mb-1">
          <span className="text-sm font-medium">{card.title}</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-1 mb-1">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="text-l px-1"
          >
            ✎
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDelete();
            }}
            className="text-l px-1"
          >
            🗑
          </button>
        </div>

        {/* Tags */}
        {card.tags.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {card.tags.map((tag, i) => (
              <span key={i} className="bg-pink-200 px-1 text-xs rounded whitespace-nowrap">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <CardDetailModal card={card} onSave={handleSave} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
});

export default Card;
