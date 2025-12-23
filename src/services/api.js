export async function syncWithServer(state) {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Synced with server", state);
      resolve(state);
    }, 500);
  });
}
