// src/components/Toolbar.jsx
import React, { useState } from "react"; 
import useBoardState from "../hooks/useBoardState";

export default function Toolbar() {
  const {
    state,
    addList,
    undo,
    redo,
    canUndo,
    canRedo,
    restoreList,
  } = useBoardState();

  const [newListTitle, setNewListTitle] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const handleAdd = () => {
    if (!newListTitle.trim()) return;
    addList(newListTitle.trim());
    setNewListTitle("");
  };

  return (
    <div className="p-4 bg-pink-100 flex flex-col gap-2">
      {/* Top row: add list + undo/redo + show/hide archived */}
      <div className="flex gap-2 items-center">
        <input
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          placeholder="New list title"
          className="border border-pink-300 rounded px-2 py-1 flex-1"
        />
        <button
          onClick={handleAdd}
          className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600"
        >
          Add List
        </button>
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`px-3 py-1 rounded ${
            canUndo
              ? "bg-pink-300 text-white hover:bg-pink-400"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Undo
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`px-3 py-1 rounded ${
            canRedo
              ? "bg-pink-300 text-white hover:bg-pink-400"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Redo
        </button>
        <button
          onClick={() => setShowArchived((s) => !s)}
          className="ml-2 px-3 py-1 rounded bg-pink-400 text-white hover:bg-pink-500"
        >
          {showArchived ? "Hide Archived" : "Show Archived"}
        </button>
      </div>

      {/* Archived lists */}
      {showArchived && state.archivedLists?.length > 0 && (
        <div className="mt-2 p-2 border border-pink-300 rounded bg-pink-50">
          <h3 className="font-bold mb-1">Archived Lists</h3>
          <ul className="flex gap-2 flex-wrap">
            {state.archivedLists.map((list) => (
              <li
                key={list.id}
                className="flex items-center gap-2 bg-pink-200 px-2 py-1 rounded"
              >
                <span>{list.title}</span>
                <button
                  onClick={() => restoreList(list.id)}
                  className="bg-pink-500 text-white px-2 py-0.5 rounded hover:bg-pink-600"
                >
                  Restore
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
