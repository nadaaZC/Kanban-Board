import React from "react";
import { BoardProvider } from "./context/BoardProvider";
import Header from "./components/Header";
import Board from "./components/Board";

export default function App() {
  return (
    <BoardProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Board />
      </div>
    </BoardProvider>
  );
}
