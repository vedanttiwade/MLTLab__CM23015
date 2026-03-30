let net;
const video = document.getElementById('webcam');
const canvas = document.getElementById('skeletonCanvas');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');

// 1. Initialize Model and Camera
async function initPoseNet() {
    status.innerText = "Status: Loading PoseNet...";
    
    // Load the model
    net = await posenet.load();
    
    // Request Camera
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        status.innerText = "Status: PoseNet Active";
        detectLoop();
    };
}

// 2. Continuous Detection Loop
async function detectLoop() {
    // Estimate the pose
    const pose = await net.estimateSinglePose(video, {
        flipHorizontal: false
    });

    drawResult(pose);
    requestAnimationFrame(detectLoop);
}

// 3. Visualization Logic (Keypoints + Skeleton)
function drawResult(pose) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the Skeleton (Connections)
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(pose.keypoints, 0.5);
    
    adjacentKeyPoints.forEach((keypoints) => {
        ctx.beginPath();
        ctx.moveTo(keypoints[0].position.x, keypoints[0].position.y);
        ctx.lineTo(keypoints[1].position.x, keypoints[1].position.y);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#00ffcc";
        ctx.stroke();
    });

    // Draw the Keypoints (Joints/Points)
    pose.keypoints.forEach(point => {
        if (point.score > 0.5) {
            ctx.beginPath();
            ctx.arc(point.position.x, point.position.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "white";
            ctx.fill();
        }
    });
}