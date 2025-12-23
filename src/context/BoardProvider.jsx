// src/context/BoardProvider.jsx
import React, { createContext, useReducer, useEffect } from "react";
import { boardReducer, initialBoardState } from "./boardReducer";

export const BoardContext = createContext(null);

const STORAGE_KEY = "kanban_board_state";

function loadInitialState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialBoardState;

    const parsed = JSON.parse(stored);

    return {
      ...initialBoardState,
      present: {
        ...initialBoardState.present,
        ...parsed,
        archivedLists: parsed.archivedLists ?? [],
      },
    };
  } catch {
    return initialBoardState;
  }
}

export function BoardProvider({ children }) {
  const [state, dispatch] = useReducer(
    boardReducer,
    initialBoardState,
    loadInitialState
  );

  // Persist ONLY the present state (important for undo/redo correctness)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.present));
    } catch {
      // ignore write errors
    }
  }, [state.present]);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
}
