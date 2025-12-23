import { rest } from "msw";

let serverBoardState = null;

export const handlers = [
  rest.get("/api/board", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(serverBoardState || {}));
  }),

  rest.post("/api/board", async (req, res, ctx) => {
    const updatedState = await req.json();
    serverBoardState = updatedState;
    return res(ctx.status(200), ctx.json(serverBoardState));
  }),
];
