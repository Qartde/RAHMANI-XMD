const fs = require('fs');
const path = require('path');

// 1. Tengeneza njia ya folda na faili
const dirPath = path.join(__dirname, './xmd');
const dataFilePath = path.join(dirPath, 'antibot.json');

// 2. Hakikisha folda lipo kabla ya kufanya kitu kingine chochote
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

// Function to read data from JSON file
function readDataFromFile() {
  try {
    if (!fs.existsSync(dataFilePath)) {
        return {};
    }
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data from file:', error);
    return {};
  }
}

// Function to write data to JSON file
function writeDataToFile(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing data to file:', error);
  }
}

// Function to create initial structure if file does not exist
function initializeDataFile() {
  if (!fs.existsSync(dataFilePath)) {
    writeDataToFile({});
  }
}

// Initialize data file if not present
initializeDataFile();

// Function to add or update a JID with a given state
function addOrUpdateJidState(jid, etat) {
  const data = readDataFromFile();
  
  data[jid] = data[jid] || {};
  data[jid].etat = etat;
  data[jid].action = data[jid].action || 'supp'; 

  writeDataToFile(data);
  console.log(`JID ${jid} successfully added or updated.`);
}

// Function to update the action for a given JID
function updateJidAction(jid, action) {
  const data = readDataFromFile();
  
  data[jid] = data[jid] || {};
  data[jid].etat = data[jid].etat || 'non'; 
  data[jid].action = action;

  writeDataToFile(data);
  console.log(`Action successfully updated for JID ${jid}.`);
}

// Function to verify the state of a JID
function checkJidState(jid) {
  const data = readDataFromFile();
  return data[jid]?.etat === 'oui'; 
}

// Function to retrieve the action of a JID
function getJidAction(jid) {
  const data = readFromFile();
  return data[jid]?.action || 'supp'; 
}

// Export the functions for external use
module.exports = {
  updateJidAction,
  addOrUpdateJidState,
  checkJidState,
  getJidAction,
};
