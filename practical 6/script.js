let net;
const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');

// 1. Load PoseNet Model
async function loadPoseNet() {
    status.innerText = "Status: Downloading Model...";
    net = await posenet.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: { width: 640, height: 480 },
        multiplier: 0.75
    });
    status.innerText = "Status: Model Ready! Please start webcam.";
}

// 2. Start Camera
async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            detectPose();
        };
        status.innerText = "Status: Detecting Pose...";
    } catch (err) {
        alert("Webcam access denied. Please use a local server and allow camera.");
    }
}

// 3. Detect Pose and Draw
async function detectPose() {
    const pose = await net.estimateSinglePose(video, {
        flipHorizontal: false
    });

    drawPose(pose);
    requestAnimationFrame(detectPose);
}

// 4. Drawing Logic
function drawPose(pose) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw keypoints (Eyes, Shoulders, etc.)
    pose.keypoints.forEach(keypoint => {
        if (keypoint.score > 0.5) {
            ctx.beginPath();
            ctx.arc(keypoint.position.x, keypoint.position.y, 6, 0, 2 * Math.PI);
            ctx.fillStyle = "#e94560"; // Keypoint color
            ctx.fill();
        }
    });

    // Draw Skeleton Lines (Simplified)
    drawAdjacentKeypoints(pose.keypoints);
}

function drawAdjacentKeypoints(keypoints) {
    const adjacentPairs = posenet.getAdjacentKeyPoints(keypoints, 0.5);

    adjacentPairs.forEach(pair => {
        ctx.beginPath();
        ctx.moveTo(pair[0].position.x, pair[0].position.y);
        ctx.lineTo(pair[1].position.x, pair[1].position.y);
        ctx.strokeStyle = "#4ecca3"; // Skeleton line color
        ctx.lineWidth = 3;
        ctx.stroke();
    });
}

// Start loading process
loadPoseNet();