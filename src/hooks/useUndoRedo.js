import { useCallback, useContext } from "react";
import { BoardContext } from "../context/BoardProvider";

export default function useUndoRedo() {
  const { state, dispatch } = useContext(BoardContext);

  const undo = useCallback(() => {
    if (state.past.length > 0) dispatch({ type: "UNDO" });
  }, [state.past.length, dispatch]);

  const redo = useCallback(() => {
    if (state.future.length > 0) dispatch({ type: "REDO" });
  }, [state.future.length, dispatch]);

  return {
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
