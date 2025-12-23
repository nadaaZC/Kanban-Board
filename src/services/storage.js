// src/services/storage.js

const STORAGE_KEY = "kanban_board_state";

// Get board state from localStorage
export function getBoardState() {
  const json = localStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : null;
}

// Save board state to localStorage
export function saveBoardState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Mock server sync
export async function syncWithServer(state) {
  try {
    const res = await fetch("/api/board", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
    return await res.json();
  } catch (err) {
    console.error("Sync failed", err);
  }
}
