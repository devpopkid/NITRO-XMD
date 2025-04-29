import fs from 'fs';
import path from 'path';

// Define the file path
const filePath = path.resolve('./lib/antidelete_data.json');

// Default data structure
const defaultData = {
  gc: false,  // Group Chats AntiDelete (default off)
  dm: false   // Direct Messages AntiDelete (default off)
};

// Make sure the data file exists, if not create it
const ensureFileExists = () => {
  if (!fs.existsSync(filePath)) {
    saveData(defaultData);
  }
};

// Load the current settings
const loadData = () => {
  ensureFileExists();
  try {
    const raw = fs.readFileSync(filePath);
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading antidelete data:', e);
    return { ...defaultData };
  }
};

// Save settings
const saveData = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error saving antidelete data:', e);
  }
};

// Public function: set anti-delete status
export const setAnti = async (type, status) => {
  if (!['gc', 'dm'].includes(type)) {
    throw new Error('Invalid type. Use "gc" or "dm".');
  }
  const data = loadData();
  data[type] = status;
  saveData(data);
};

// Public function: get anti-delete status
export const getAnti = async (type) => {
  if (!['gc', 'dm'].includes(type)) {
    throw new Error('Invalid type. Use "gc" or "dm".');
  }
  const data = loadData();
  return data[type];
};
