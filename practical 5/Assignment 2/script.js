let model;
const video = document.getElementById('webcam');
const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('statusText');

async function startApp() {
    try {
        // 1. Setup Camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        // 2. Load Model
        statusText.innerText = "Loading MobileNet...";
        model = await mobilenet.load();
        
        statusText.innerText = "Classification Active";
        
        // Match canvas size to video size
        canvas.width = 640;
        canvas.height = 480;

        detectAndDraw();
    } catch (error) {
        statusText.innerText = "Error: Camera access denied.";
        console.error(error);
    }
}

async function detectAndDraw() {
    if (model && video.readyState === 4) {
        // Perform Classification
        const predictions = await model.classify(video);
        
        // Clear previous frame labels
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (predictions.length > 0) {
            const topResult = predictions[0];
            const labelText = topResult.className.split(',')[0].toUpperCase();
            const confidence = Math.round(topResult.probability * 100) + "%";

            // Draw Background Bar for text
            ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            ctx.fillRect(20, 20, 300, 50);

            // Draw Label Text
            ctx.fillStyle = "#4dabf7";
            ctx.font = "bold 24px Arial";
            ctx.fillText(labelText, 40, 55);

            // Draw Confidence Text
            ctx.fillStyle = "white";
            ctx.font = "16px Arial";
            ctx.fillText(`Confidence: ${confidence}`, 220, 53);
        }
    }

    // Loop at 30fps roughly
    requestAnimationFrame(detectAndDraw);
}