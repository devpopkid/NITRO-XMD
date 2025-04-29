let antiDeleteState = {
  gc: false, // Default state for group chats (disabled)
  dm: false, // Default state for direct messages (disabled)
};

export const setAnti = async (chatType, enabled) => {
  antiDeleteState[chatType] = enabled;
  // In a more persistent solution, you would write this to a database or file here.
  return Promise.resolve(); // Return a Promise to match the async/await in the command
};

export const getAnti = async (chatType) => {
  // In a more persistent solution, you would read this from a database or file here.
  return Promise.resolve(antiDeleteState[chatType] || false); // Default to false if chatType is invalid
};
