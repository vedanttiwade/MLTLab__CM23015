let net;
const classifier = knnClassifier.create();
const video = document.getElementById('webcam');
const counts = [0, 0, 0];
const classNames = ['Apple', 'Banana', 'Orange'];

async function setupApp() {
    document.getElementById('initBtn').innerText = "Loading MobileNet...";
    
    // 1. Load the pre-trained MobileNet
    net = await mobilenet.load();
    
    // 2. Setup Webcam
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    
    document.getElementById('initBtn').style.display = 'none';
    predictLoop();
}

// A1: Capture intermediate features and add to custom classifier
async function addExample(classId) {
    // Extract internal 'features' from the video frame
    const activation = net.infer(video, 'conv_preds');
    
    // Add these features to our 3-category classifier
    classifier.addExample(activation, classId);
    
    // Update UI count
    counts[classId]++;
    document.getElementById(`count${classId}`).innerText = counts[classId];
}

async function predictLoop() {
    while (true) {
        if (classifier.getNumClasses() > 0) {
            const activation = net.infer(video, 'conv_preds');
            const result = await classifier.predictClass(activation);

            const label = classNames[result.label];
            const prob = Math.round(result.confidences[result.label] * 100);
            
            document.getElementById('predictionBar').innerText = 
                `Detected: ${label} (${prob}%)`;
        }
        await tf.nextFrame();
    }
}