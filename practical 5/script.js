let model;
const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');

// 1. Load the pre-trained COCO-SSD model
async function loadModel() {
    status.innerText = "Model loading... please wait.";
    model = await cocoSsd.load();
    status.innerText = "Model Loaded! Click 'Start Webcam' to begin.";
}

// 2. Access the Webcam
async function setupWebcam() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });
        video.srcObject = stream;
        video.addEventListener('loadeddata', predictFrame);
        status.innerText = "Detecting objects in real-time...";
    } else {
        alert("Webcam not supported in this browser.");
    }
}

// 3. Perform Detection on each frame
async function predictFrame() {
    // Perform detection
    const predictions = await model.detect(video);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw bounding boxes
    predictions.forEach(prediction => {
        const [x, y, width, height] = prediction.bbox;
        
        // Style for the box
        ctx.strokeStyle = "#00e676";
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);

        // Style for the label
        ctx.fillStyle = "#00e676";
        ctx.font = "18px Arial";
        const label = `${prediction.class} (${Math.round(prediction.score * 100)}%)`;
        ctx.fillText(label, x, y > 20 ? y - 10 : 20);
    });

    // Loop the detection
    window.requestAnimationFrame(predictFrame);
}

// Initialize on page load
loadModel();