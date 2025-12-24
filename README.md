Kanban Board React App
Project Overview

This is a collaborative Kanban board single-page application built using React, Tailwind CSS, and Vite. The app allows users to create, edit, archive, and manage lists and cards, with offline persistence and optimistic updates. State is managed centrally using useReducer and Context (BoardProvider.jsx), and all changes are persisted to localStorage.

Project Setup

Clone the repository

git clone <https://github.com/nadaaZC/Kanban-Board.git>
cd <kanban-board>


Install dependencies

npm install


Run the development server

npm run dev


Build for production

npm run build


Lint the code

npm run lint


Format code using Prettier

npm run format

Testing

Run unit and integration tests

npm run test


Check test coverage

npm run test:coverage


Run end-to-end tests (Playwright/Cypress)

npm run e2e


Architectural Summary

This Kanban board is built using React with a clean, component-based structure. At the top, App.jsx renders the Board component, which then handles all the main parts like the Toolbar, ListColumns, and Cards. All lists and cards are stored in a global state managed by useReducer and the BoardProvider.jsx context. Actions like adding, archiving, or moving cards are handled in boardReducer.js to make sure the state updates are predictable and don’t directly mutate anything.

To make working with the state easier, I created a custom hook, useBoardState.js, which wraps all the common actions (like addList, archiveList, moveCard) so the components don’t have to deal with dispatch directly. Offline support is handled through useOfflineSync.js, which saves the current state to localStorage every time something changes, and automatically syncs with a mock server when the user goes back online. Undo/redo works by keeping track of past and future states, while the UI always shows the current present state.

For performance, I used React.memo and useCallback to prevent unnecessary re-renders, which is especially important when we have hundreds of cards on the board. The folder structure is organized logically: components/ for UI pieces, context/ for state, hooks/ for reusable logic, services/ for storage and server syncing, and utils/ for helper functions. Overall, this setup keeps things maintainable, scalable, and smooth, while also supporting offline use and fast interactions.
