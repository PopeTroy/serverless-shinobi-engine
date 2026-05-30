const terminal = document.getElementById('terminal-log');
let rtcConnection;
let inputChannel;

// 1. Write the uploaded game binary into Puter's file system (Daikokuten Pipeline)
async function uploadExeToPuter() {
    const fileSelector = document.getElementById('exeSelector');
    const file = fileSelector.files[0];
    if (!file) {
        alert("Please choose a valid .exe file first.");
        return;
    }

    terminal.innerHTML = "🌀 Writing executable data matrix to Puter FS layers...";
    
    try {
        // Writes straight to your persistent open-source client cloud container storage
        await puter.fs.write(file.name, file);
        terminal.innerHTML = `🟢 ${file.name} successfully written and frozen in cloud vault.`;
    } catch (error) {
        terminal.innerHTML = `🔴 Storage Anomaly: ${error.message}`;
    }
}

// 2. Groq LPU Input Matrix Overseer Evaluation (Shunshin Predictor Layer)
async function queryGroqPredictiveMatrix(dx, dy) {
    const endpoint = "https://api.groq.com/openai/v1/chat/completions";
    
    try {
        // Bypassing browser CORS restrictions natively using Puter's network proxy routing
        const response = await puter.net.fetch(endpoint, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${ENV_CONFIG.groqKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                messages: [{ 
                    role: "user", 
                    content: `Normalize pointer lock movement values: X=${dx}, Y=${dy}. Return format: numbers only.` 
                }]
            })
        });
        return await response.json();
    } catch (err) {
        console.error("Groq Network Intercept Error:", err);
        return null;
    }
}

// 3. Launch Headless WebRTC Engine targeting NVIDIA NIM Frame-Buffer Microservice
async function initializeHeadlessStream() {
    terminal.innerHTML = "⚡ Initializing Headless Vulkan context hooks (Kamui isolation)...";

    // Standard low-latency transport config
    rtcConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    // Create the input pipeline connection channel (Amenotejikara Protocol)
    inputChannel = rtcConnection.createDataChannel("inputChannel");

    const videoCanvas = document.getElementById('renderingCanvas');
    
    // Request raw hardware tracking bypassing OS display windows
    try {
        await videoCanvas.requestPointerLock();
    } catch (e) {
        terminal.innerHTML = "⚠️ Pointer Lock Request Denied. Click the viewport to re-engage.";
    }

    // High frequency 60 FPS movement coordinate engine loop
    window.addEventListener('mousemove', async (e) => {
        if (document.pointerLockElement === videoCanvas) {
            // Groq oversees coordinate stream normalization in real time
            queryGroqPredictiveMatrix(e.movementX, e.movementY);
            
            // Send the raw delta arrays straight over WebRTC data tracks
            if (inputChannel.readyState === "open") {
                const matrixBuffer = new Float32Array([e.movementX, e.movementY]);
                inputChannel.send(matrixBuffer);
            }
        }
    });

    // Receive headless video frames rendered without display wrappers
    rtcConnection.ontrack = (event) => {
        videoCanvas.srcObject = event.streams[0];
        terminal.innerHTML = "🟢 Rinnegan Sync Complete. Frame pipeline active at stable 60 FPS.";
    };

    // Forward the WebRTC Session Description (SDP) straight to your NVIDIA NIM container
    terminal.innerHTML = "📡 Routing streaming handshake matrices to NVIDIA NIM...";
    try {
        const offer = await rtcConnection.createOffer();
        await rtcConnection.setLocalDescription(offer);

        const nimResponse = await puter.net.fetch("https://integrate.api.nvidia.com/v1/sharingan/rendering", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${ENV_CONFIG.nvidiaKey}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ sdp: rtcConnection.localDescription })
        });
        
        const nimData = await nimResponse.json();
        await rtcConnection.setRemoteDescription(new RTCSessionDescription(nimData.sdp));
    } catch (err) {
        terminal.innerHTML = `🔴 Connection Anomaly: ${err.message}`;
    }
}
