let model;
const video = document.getElementById('webcam');
const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');

// Stats Elements
const fpsVal = document.getElementById('fpsVal');
const msVal = document.getElementById('msVal');
const analysisText = document.getElementById('analysis');

let lastFrameTime = 0;
let frameCount = 0;
let fps = 0;

async function startPerformanceTest() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        
        analysisText.innerText = "Loading MobileNet Model...";
        model = await mobilenet.load();
        
        canvas.width = 640;
        canvas.height = 480;
        
        renderLoop();
    } catch (e) {
        alert("Webcam access required.");
    }
}

async function renderLoop() {
    const startTime = performance.now(); // Start timing inference

    if (model && video.readyState === 4) {
        // 1. Run AI Inference
        const predictions = await model.classify(video);
        
        // 2. Calculate Latency (Time taken for AI to think)
        const endTime = performance.now();
        const latency = endTime - startTime;
        msVal.innerText = latency.toFixed(1);

        // 3. Draw UI Overlay
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (predictions.length > 0) {
            ctx.fillStyle = "#38bdf8";
            ctx.font = "bold 20px Arial";
            ctx.fillText(`Object: ${predictions[0].className.split(',')[0]}`, 20, 40);
        }

        // 4. Calculate FPS
        frameCount++;
        const now = performance.now();
        if (now >= lastFrameTime + 1000) {
            fps = frameCount;
            frameCount = 0;
            lastFrameTime = now;
            fpsVal.innerText = fps;
            updateAnalysis(fps, latency);
        }
    }

    requestAnimationFrame(renderLoop);
}

function updateAnalysis(fps, ms) {
    if (fps > 24) {
        analysisText.innerText = "Analysis: Smooth performance (Cinematic FPS).";
    } else if (fps > 10) {
        analysisText.innerText = "Analysis: Noticeable lag. Browser is working hard.";
    } else {
        analysisText.innerText = "Analysis: Low performance. Inference is bottlenecking the main thread.";
    }
}