// Runtime state extracted from the original inline script.
// Values and names are preserved for compatibility with existing functions.
let allClients = [], allArtists = [], allInventory = [];
let calYear = new Date().getFullYear(), calMonth = new Date().getMonth();
let calSel = null, calApptDates = new Set();
let curCliId = null, curArtId = null, curInvId = null;
let editCitaId = null;
let cliTab = 'todos';
let selEmoji = '🎨';
const EMOJIS = window.INK_CONSTANTS.emojis;
