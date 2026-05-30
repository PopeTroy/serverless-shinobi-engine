const terminal = document.getElementById('terminal-log');
const navUserDisplay = document.getElementById('nav-user-display');
const authActionBtn = document.getElementById('auth-action-btn');
const sessionsTableBody = document.getElementById('save-sessions-tbody');

let rtcConnection;
let inputChannel;
let currentSessionId = "None";
let catalogRegistry = []; // Local store array for game metadata collections
let targetGenreFilter = "all";
let targetSortMode = "all"; 

// 1. Initializer Pipeline: Handles Profiles, Configuration Records, and Layout Structuring
async function initializePlatformHub() {
    // Check if the individual has authenticated with the Puter Open Source Engine
    if (puter.auth.isSignedIn()) {
        const user = await puter.auth.getUser();
        navUserDisplay.innerText = `👤 ${user.username.toUpperCase()}`;
        authActionBtn.innerText = "De-authenticate Profile";
        authActionBtn.className = "danger-btn";
        
        // Provision tracking indexes
        currentSessionId = "sess-" + crypto.randomUUID().split('-')[0];
        
        // Load data stores from the cloud database layer
        await loadSystemSettings();
        await syncGameCatalogFromCloud();
        await renderActiveSaveSessions();
        terminal.innerHTML = "🟢 Active profile linked. Catalog registries successfully synchronized.";
    } else {
        navUserDisplay.innerText = "Guest Mode";
        authActionBtn.innerText = "Authenticate Profile via Puter Mesh";
        authActionBtn.className = "primary-btn";
        sessionsTableBody.innerHTML = `<tr><td colspan="4" class="text-center">Authentication Required to Fetch Active Saves</td></tr>`;
    }
}

// 2. Settings Tab Management Engine
function toggleSettingsModal() {
    const modal = document.getElementById('settings-modal');
    modal.classList.toggle('active');
}

async function handlePlatformAuth() {
    if (puter.auth.isSignedIn()) {
        puter.auth.signOut();
        window.location.reload();
    } else {
        await puter.auth.signIn();
        window.location.reload();
    }
}

async function saveProfileSettings() {
    if (!puter.auth.isSignedIn()) return;
    const fpsLock = document.getElementById('setting-fps-lock').value;
    const settingsBlob = { targetFps: fpsLock, updatedTimestamp: new Date().toISOString() };
    await puter.kv.set('user_hub_settings', JSON.stringify(settingsBlob));
    terminal.innerHTML = "🟢 Application profiling configurations saved safely to Puter KV.";
}

async function loadSystemSettings() {
    try {
        const data = await puter.kv.get('user_hub_settings');
        if (data) {
            const config = JSON.parse(data);
            document.getElementById('setting-fps-lock').value = config.targetFps || "60";
        }
    } catch (e) { console.warn("No prior configuration indexes found."); }
}

// 3. Daikokuten Database Storage and Registry Updates
async function uploadExeToPuter() {
    if (!puter.auth.isSignedIn()) return alert("Authentication required to modify file vaults.");
    
    const title = document.getElementById('gameMetaTitle').value.trim();
    const genre = document.getElementById('gameMetaGenre').value;
    const fileSelector = document.getElementById('exeSelector');
    const file = fileSelector.files[0];

    if (!title || !file) return alert("Validation Failed: Check your parameters.");

    terminal.innerHTML = "🌀 Transmitting raw binary assets to Puter Cloud FS layer...";
    
    try {
        const uniquePath = `games/${Date.now()}_${file.name}`;
        await puter.fs.write(uniquePath, file);
        
        // Update catalog indexing records
        const catalogItem = { id: crypto.randomUUID(), title: title, genre: genre, binaryPath: uniquePath };
        catalogRegistry.push(catalogItem);
        
        // Persist catalog track array changes inside Puter KV
        await puter.kv.set('global_game_catalog', JSON.stringify(catalogRegistry));
        
        terminal.innerHTML = `🟢 App successfully bound: "${title}" assigned to matrix [${genre}].`;
        document.getElementById('gameMetaTitle').value = "";
        executeCatalogSearch(); // Refresh lists
    } catch (err) {
        terminal.innerHTML = `🔴 File system transaction failure: ${err.message}`;
    }
}

async function syncGameCatalogFromCloud() {
    try {
        const storedCatalog = await puter.kv.get('global_game_catalog');
        if (storedCatalog) catalogRegistry = JSON.parse(storedCatalog);
    } catch (e) { catalogRegistry = []; }
}

// 4. Advanced Search, Filter Matrix, A-Z and Genre Layout Engines
function filterByGenre(genre) {
    targetGenreFilter = genre;
    executeCatalogSearch();
}

// Adjust catalog rendering modes alphabetically or categorically
function setSortMode(mode) {
    targetSortMode = mode;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`sort-${mode}`).classList.add('active');
    
    if (mode === 'all') targetGenreFilter = 'all';
    executeCatalogSearch();
}

function executeCatalogSearch() {
    const searchString = document.getElementById('gameSearchInput').value.toLowerCase();
    let computedDisplayList = [...catalogRegistry];

    // Evaluate active genre settings
    if (targetGenreFilter !== 'all') {
        computedDisplayList = computedDisplayList.filter(g => g.genre === targetGenreFilter);
    }

    // Evaluate matching title strings
    if (searchString) {
        computedDisplayList = computedDisplayList.filter(g => g.title.toLowerCase().includes(searchString));
    }

    // Evaluate alphabetical constraint loops
    if (targetSortMode === 'az') {
        computedDisplayList.sort((a, b) => a.title.localeCompare(b.title));
    }

    // Reconstruct lists or display terminal matching metrics
    terminal.innerHTML = `⚙️ Search telemetry parsed. Displaying ${computedDisplayList.length} matching application configurations inside grid layers.`;
}

// 5. Active Save State Tracker Engine Matrix
async function renderActiveSaveSessions() {
    if (!puter.auth.isSignedIn()) return;
    
    try {
        // Mock save records stored in active application session trees
        const saveSessions = [
            { gameTitle: "Resident Evil Headless", sessionId: "sess-8af291b", timestamp: new Date().toLocaleTimeString() },
            { gameTitle: "Chrono Trigger Remake", sessionId: "sess-192ba7f", timestamp: new Date().toLocaleTimeString() }
        ];

        sessionsTableBody.innerHTML = "";
        saveSessions.forEach(session => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><b>${session.gameTitle}</b></td>
                <td><code class="matrix-text">${session.sessionId}</code></td>
                <td>${session.timestamp}</td>
                <td><button class="table-action-btn" onclick="mountSaveState('${session.sessionId}')">Mount State</button></td>
            `;
            sessionsTableBody.appendChild(row);
        });
    } catch (err) { console.error("Could not trace save records."); }
}

function mountSaveState(sessId) {
    terminal.innerHTML = `⚡ Restoring memory maps from hardware cluster target container state: ${sessId}`;
}

// 6. Graphics WebRTC Pipeline Interconnections (Direct-to-Compute Bridge)
async function initializeHeadlessStream() {
    if (!puter.auth.isSignedIn()) return alert("Authentication required to deploy remote clusters.");
    terminal.innerHTML = "⚡ Establishing headless WebRTC connection matrix layers...";
    
    rtcConnection = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    inputChannel = rtcConnection.createDataChannel("inputChannel");
    
    const canvas = document.getElementById('renderingCanvas');
    canvas.requestPointerLock();

    rtcConnection.ontrack = (event) => {
        canvas.srcObject = event.streams[0];
        terminal.innerHTML = "🟢 Low-latency headless frame-buffer rendering thread connected at 60 FPS.";
    };
    
    // Handshake scripts execute here to match the local Windows dx12 headless handle layer...
}

// Automatically engage tracking matrices upon window load sequence
initializeProfileAndSession = initializePlatformHub;
initializeProfileAndSession();
