import { v4 as uuidv4 } from "uuid";
import { saveBoardState } from "../services/storage";

export function seedDummyCards(listCount = 5, cardsPerList = 100) {
  const lists = [];
  const cards = {};

  for (let i = 0; i < listCount; i++) {
    const listId = uuidv4();
    const cardIds = [];

    for (let j = 0; j < cardsPerList; j++) {
      const cardId = uuidv4();
      cardIds.push(cardId);

      cards[cardId] = {
        id: cardId,
        listId,
        title: `Card ${j + 1} of List ${i + 1}`,
        description: `Description for card ${j + 1}`,
        tags: [],
        version: 1,
        lastModifiedAt: new Date().toISOString(),
      };
    }

    lists.push({
      id: listId,
      title: `List ${i + 1}`,
      cardIds,
      version: 1,
      lastModifiedAt: new Date().toISOString(),
      archived: false,
    });
  }

  const boardState = { lists, cards, archivedLists: [], meta: { lastSyncedAt: null } };

  saveBoardState(boardState);
  console.log(`✅ Seeded ${listCount} lists with ${cardsPerList} cards each.`);
  return boardState;
}
