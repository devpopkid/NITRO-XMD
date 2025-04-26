// ... other imports

import { antidelete, toggleantidelete } from './nitrox/antidelete.js'; // Adjust the path

const handleMessage = async (sock, m, store) => {
  // ... other message handling logic

  await antidelete(m, sock, store); // Call the antidelete function for every message

  await toggleantidelete(m, sock); // Call the toggle function to listen for the command

  // ... more message handling
};

// ... your connection and event listener setup
