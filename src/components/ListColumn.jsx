import React, { useState, useCallback, useEffect } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import Card from "./Card";
import useBoardState from "../hooks/useBoardState";

export default function ListColumn({ list }) {
  const { state, renameList, archiveList, addCard } = useBoardState();

  const { setNodeRef } = useDroppable({
    id: list.id,
  });

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(list.title);
  const [newCardTitle, setNewCardTitle] = useState("");

  useEffect(() => setTitleInput(list.title), [list.title]);

  const handleRename = useCallback(() => {
    if (!titleInput.trim()) return;
    renameList(list.id, titleInput.trim());
    setEditingTitle(false);
  }, [titleInput, list.id, renameList]);

  const handleAddCard = useCallback(() => {
    if (!newCardTitle.trim()) return;
    addCard(list.id, newCardTitle.trim());
    setNewCardTitle("");
  }, [addCard, list.id, newCardTitle]);

  return (
    <div
      ref={setNodeRef}
      className="bg-pink-200 rounded-lg p-2 min-w-[260px] flex flex-col max-h-[500px]"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-1">
        {editingTitle ? (
          <input
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            className="border px-1 py-0.5 rounded flex-1 text-sm"
            autoFocus
          />
        ) : (
          <h2
            className="font-bold text-md cursor-pointer flex-1 truncate"
            onClick={() => setEditingTitle(true)}
          >
            {list.title}
          </h2>
        )}

        <button
          onClick={() => archiveList(list.id)}
          className="text-white bg-pink-500 px-2 py-0.5 rounded hover:bg-pink-600 text-sm"
        >
          Archive
        </button>
      </div>

      {/* Cards container */}
      <SortableContext
        items={list.cardIds}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-1 items-stretch overflow-y-auto pr-1">
          {list.cardIds.map((cardId) => {
            const card = state.cards[cardId];
            if (!card) return null;
            return <Card key={cardId} card={card} />;
          })}
        </div>
      </SortableContext>

      {/* Add card */}
      <div className="mt-1">
        <input
          type="text"
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          placeholder="New card"
          className="border rounded px-2 py-0.5 w-full mb-1 text-sm"
          onKeyDown={(e) => e.key === "Enter" && handleAddCard()}
        />
        <button
          onClick={handleAddCard}
          className="bg-pink-500 text-white px-2 py-0.5 rounded w-full hover:bg-pink-600 text-sm"
        >
          Add Card
        </button>
      </div>
    </div>
  );
}
