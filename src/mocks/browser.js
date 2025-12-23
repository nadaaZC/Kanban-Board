import { setupWorker } from "msw";
import { handlers } from "./handlers.js"; // always include .js extension in Vite

export const worker = setupWorker(...handlers);
