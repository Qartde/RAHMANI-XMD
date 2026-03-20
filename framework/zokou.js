var tabCmds = [];
let cm = [];

// Store event handlers
let eventHandlers = [];

function zokou(obj, fonctions) {
    let infoComs = obj;
    if (!obj.categorie) {
        infoComs.categorie = "General";
    }
    if (!obj.reaction) {
        infoComs.reaction = "🌎";
    }
    infoComs.fonction = fonctions;
    cm.push(infoComs);
    // console.log('chargement...')
    return infoComs;
}

// Function to register event handlers (always running)
function onEvent(handler) {
    eventHandlers.push(handler);
}

// Function to handle incoming messages (called from index.js)
async function handleMessage(zk, message) {
    try {
        // Execute all registered event handlers
        for (const handler of eventHandlers) {
            try {
                await handler(zk, message);
            } catch (e) {
                console.error("Event handler error:", e);
            }
        }
    } catch (e) {
        console.error("Handle message error:", e);
    }
}

module.exports = { 
    zokou, 
    Module: zokou, 
    cm,
    onEvent,
    handleMessage
};
