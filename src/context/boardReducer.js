import { v4 as uuidv4 } from "uuid";

export const initialBoardState = {
  present: {
    lists: [],
    cards: {},
    archivedLists: [],
    meta: { lastSyncedAt: null },
  },
  past: [],
  future: [],
};

function now() {
  return new Date().toISOString();
}

function withHistory(state, newPresent) {
  return {
    past: [...state.past, state.present],
    present: newPresent,
    future: [],
  };
}

export function boardReducer(state, action) {
  const { present } = state;

  switch (action.type) {
    /* ===== LISTS ===== */
    case "ADD_LIST": {
      const newList = {
        id: uuidv4(),
        title: action.payload.title,
        cardIds: [],
        version: 1,
        lastModifiedAt: now(),
        archived: false,
      };
      return withHistory(state, {
        ...present,
        lists: [...present.lists, newList],
      });
    }

    case "RENAME_LIST": {
      const lists = present.lists.map((l) =>
        l.id === action.payload.id
          ? { ...l, title: action.payload.title, version: l.version + 1, lastModifiedAt: now() }
          : l
      );
      return withHistory(state, { ...present, lists });
    }

    case "ARCHIVE_LIST": {
      const list = present.lists.find((l) => l.id === action.payload.id);
      if (!list) return state;

      return withHistory(state, {
        ...present,
        lists: present.lists.filter((l) => l.id !== list.id),
        archivedLists: [
          ...present.archivedLists,
          { ...list, archived: true, version: list.version + 1, lastModifiedAt: now() },
        ],
      });
    }

    case "RESTORE_LIST": {
      const archivedList = present.archivedLists.find(
        (l) => l.id === action.payload.id
      );
      if (!archivedList) return state;

      return withHistory(state, {
        ...present,
        lists: [
          ...present.lists,
          {
            ...archivedList,
            archived: false,
            version: archivedList.version + 1,
            lastModifiedAt: now(),
          },
        ],
        archivedLists: present.archivedLists.filter((l) => l.id !== archivedList.id),
      });
    }

    case "REORDER_LISTS": {
      return withHistory(state, {
        ...present,
        lists: action.payload.lists.map((l) => ({
          ...l,
          version: l.version + 1,
          lastModifiedAt: now(),
        })),
      });
    }

    /* ===== CARDS ===== */
    case "ADD_CARD": {
      const { listId, title } = action.payload;
      const id = uuidv4();

      const newCard = {
        id,
        listId,
        title,
        description: "",
        tags: [],
        version: 1,
        lastModifiedAt: now(),
      };

      const lists = present.lists.map((l) =>
        l.id === listId ? { ...l, cardIds: [...l.cardIds, id] } : l
      );

      return withHistory(state, {
        ...present,
        lists,
        cards: { ...present.cards, [id]: newCard },
      });
    }

    case "UPDATE_CARD": {
      const card = present.cards[action.payload.id];
      if (!card) return state;

      return withHistory(state, {
        ...present,
        cards: {
          ...present.cards,
          [card.id]: {
            ...card,
            ...action.payload.updates,
            version: card.version + 1,
            lastModifiedAt: now(),
          },
        },
      });
    }

    case "DELETE_CARD": {
      const card = present.cards[action.payload.id];
      if (!card) return state;

      const cards = { ...present.cards };
      delete cards[card.id];

      const lists = present.lists.map((l) =>
        l.id === card.listId
          ? { ...l, cardIds: l.cardIds.filter((cid) => cid !== card.id) }
          : l
      );

      return withHistory(state, { ...present, lists, cards });
    }

    case "REORDER_CARDS": {
      const { listId, newCardIds } = action.payload;

      const lists = present.lists.map((l) =>
        l.id === listId
          ? { ...l, cardIds: newCardIds, version: l.version + 1, lastModifiedAt: now() }
          : l
      );

      return withHistory(state, { ...present, lists });
    }

    case "MOVE_CARD": {
      const { cardId, sourceListId, destListId, destIndex } = action.payload;

      const source = present.lists.find((l) => l.id === sourceListId);
      const dest = present.lists.find((l) => l.id === destListId);
      if (!source || !dest) return state;

      const newSourceIds = source.cardIds.filter((id) => id !== cardId);
      const newDestIds = [...dest.cardIds];
      newDestIds.splice(destIndex, 0, cardId);

      const lists = present.lists.map((l) => {
        if (l.id === sourceListId)
          return { ...l, cardIds: newSourceIds, version: l.version + 1, lastModifiedAt: now() };
        if (l.id === destListId)
          return { ...l, cardIds: newDestIds, version: l.version + 1, lastModifiedAt: now() };
        return l;
      });

      return withHistory(state, { ...present, lists });
    }

    /* ===== UNDO / REDO ===== */
    case "UNDO": {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      };
    }

    case "REDO": {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        past: [...state.past, state.present],
        present: next,
        future: state.future.slice(1),
      };
    }

    /* ===== META (NO HISTORY) ===== */
    case "MARK_SYNCED": {
      return {
        ...state,
        present: { ...present, meta: { lastSyncedAt: now() } },
      };
    }

    default:
      return state;
  }
}
