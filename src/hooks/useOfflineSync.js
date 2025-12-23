// src/hooks/useOfflineSync.js
import { useEffect } from "react";
import { getBoardState, saveBoardState, syncWithServer } from "../services/storage";

export default function useOfflineSync(state, dispatch) {
  // Load persisted state
  useEffect(() => {
    const persisted = getBoardState();
    if (persisted) {
      dispatch({ type: "LOAD_PERSISTED_STATE", payload: persisted });
    }
  }, [dispatch]);

  // Save on state change
  useEffect(() => {
    saveBoardState(state.present);
  }, [state]);

  // Sync when online
  useEffect(() => {
    const handleOnline = () => syncWithServer(state.present);
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [state]);
}
