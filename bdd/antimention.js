const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../xmd/antimention.json');

function loadData() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

function saveData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

const antimentionData = loadData();

async function amAjouterOuMettreAJourJid(jid, etat) {
  antimentionData[jid] = { etat, action: antimentionData[jid]?.action || 'supp' };
  saveData(antimentionData);
}

async function amMettreAJourAction(jid, action) {
  if (antimentionData[jid]) {
    antimentionData[jid].action = action;
  } else {
    antimentionData[jid] = { etat: 'non', action };
  }
  saveData(antimentionData);
}

async function amVerifierEtatJid(jid) {
  return antimentionData[jid]?.etat === 'oui';
}

async function amRecupererActionJid(jid) {
  return antimentionData[jid]?.action || 'supp';
}

module.exports = {
  amAjouterOuMettreAJourJid,
  amMettreAJourAction,
  amVerifierEtatJid,
  amRecupererActionJid,
};
