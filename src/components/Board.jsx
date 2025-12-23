// src/components/Board.jsx
import React from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import Toolbar from "./Toolbar";
import ListColumn from "./ListColumn";
import useBoardState from "../hooks/useBoardState";

export default function Board() {
  const { state, reorderCards, moveCard } = useBoardState();

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const cardId = active.id;

    // Find source list
    const sourceList = state.lists.find((l) =>
      l.cardIds.includes(cardId)
    );
    if (!sourceList) return;

    // Dropped on a CARD
    const destListFromCard = state.lists.find((l) =>
      l.cardIds.includes(over.id)
    );

    // Dropped on a LIST
    const destListFromList = state.lists.find(
      (l) => l.id === over.id
    );

    const destList = destListFromCard || destListFromList;
    if (!destList) return;

    // Same list reorder
    if (sourceList.id === destList.id && destListFromCard) {
      const oldIndex = sourceList.cardIds.indexOf(cardId);
      const newIndex = sourceList.cardIds.indexOf(over.id);

      const newOrder = [...sourceList.cardIds];
      newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, cardId);

      reorderCards(sourceList.id, newOrder);
    }

    // Move to another list
    if (sourceList.id !== destList.id) {
      const destIndex = destListFromCard
        ? destList.cardIds.indexOf(over.id)
        : destList.cardIds.length; // 👈 drop into empty space

      moveCard(cardId, sourceList.id, destList.id, destIndex);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-pink-50">
      <Toolbar />

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 p-4 overflow-x-auto flex-1">
          {state.lists.map((list) => (
            <ListColumn key={list.id} list={list} />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
