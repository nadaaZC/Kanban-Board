import React, { useContext, useCallback } from "react";
import { BoardContext } from "../context/BoardProvider";


export default function useBoardState() {
  const { state, dispatch } = useContext(BoardContext);
  const present = state.present;

  /* ===== LISTS ===== */
  const addList = useCallback(
    (title) => dispatch({ type: "ADD_LIST", payload: { title } }),
    [dispatch]
  );

  const renameList = useCallback(
    (id, title) => dispatch({ type: "RENAME_LIST", payload: { id, title } }),
    [dispatch]
  );

  const archiveList = useCallback(
    (id) => dispatch({ type: "ARCHIVE_LIST", payload: { id } }),
    [dispatch]
  );

  const restoreList = useCallback(
    (id) => dispatch({ type: "RESTORE_LIST", payload: { id } }),
    [dispatch]
  );

  const reorderLists = useCallback(
    (lists) => dispatch({ type: "REORDER_LISTS", payload: { lists } }),
    [dispatch]
  );

  /* ===== CARDS ===== */
  const addCard = useCallback(
    (listId, title, description = "", tags = []) =>
      dispatch({ type: "ADD_CARD", payload: { listId, title, description, tags } }),
    [dispatch]
  );

  const updateCard = useCallback(
    (id, updates) => dispatch({ type: "UPDATE_CARD", payload: { id, updates } }),
    [dispatch]
  );

  const deleteCard = useCallback(
    (id) => dispatch({ type: "DELETE_CARD", payload: { id } }),
    [dispatch]
  );

  const moveCard = useCallback(
    (cardId, sourceListId, destListId, destIndex) =>
      dispatch({
        type: "MOVE_CARD",
        payload: { cardId, sourceListId, destListId, destIndex },
      }),
    [dispatch]
  );

  const reorderCards = useCallback(
    (listId, newCardIds) =>
      dispatch({ type: "REORDER_CARDS", payload: { listId, newCardIds } }),
    [dispatch]
  );

  /* ===== UNDO / REDO ===== */
  const undo = useCallback(() => dispatch({ type: "UNDO" }), [dispatch]);
  const redo = useCallback(() => dispatch({ type: "REDO" }), [dispatch]);

  return {
    state: present, // for UI rendering (lists/cards)

    addList,
    renameList,
    archiveList,
    restoreList,
    reorderLists,

    addCard,
    updateCard,
    deleteCard,
    moveCard,
    reorderCards,

    undo,
    redo,
    // **Use original state for undo/redo availability**
    canUndo: state.past?.length > 0,
    canRedo: state.future?.length > 0,
  };
}
