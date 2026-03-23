let model;
const video = document.getElementById('webcam');
const predictionText = document.getElementById('predictionText');
const probabilityText = document.getElementById('probabilityText');
const loadingOverlay = document.getElementById('loadingOverlay');

// Step 1: Initialize Camera and Model
async function init() {
    try {
        // Start Webcam
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        // Load MobileNet Model
        loadingOverlay.innerText = "Loading MobileNet...";
        model = await mobilenet.load();
        
        loadingOverlay.style.display = 'none';
        classifyFrame(); // Start the loop
    } catch (err) {
        alert("Please allow camera access and use a local server (Live Server).");
        console.error(err);
    }
}

// Step 2: Classify current webcam frame
async function classifyFrame() {
    if (model && video.readyState === 4) {
        const predictions = await model.classify(video);
        
        if (predictions.length > 0) {
            // Get the top result
            const topResult = predictions[0];
            
            // Update UI
            predictionText.innerText = topResult.className.split(',')[0];
            probabilityText.innerText = Math.round(topResult.probability * 100) + "%";
        }
    }
    
    // Call the function again for the next frame
    requestAnimationFrame(classifyFrame);
}