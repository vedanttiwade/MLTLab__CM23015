let net;
const video = document.getElementById('webcam');
const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');
const modeSelect = document.getElementById('poseMode');

async function init() {
    net = await posenet.load();
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.onloadedmetadata = () => {
        canvas.width = 640;
        canvas.height = 480;
        runDetection();
    };
}

async function runDetection() {
    const startTime = performance.now();
    let poses = [];

    if (modeSelect.value === "single") {
        const pose = await net.estimateSinglePose(video);
        poses.push(pose);
    } else {
        // Multi-pose detection (max 5 people)
        poses = await net.estimateMultiplePoses(video, {
            maxDetections: 5,
            scoreThreshold: 0.5
        });
    }

    const endTime = performance.now();
    document.getElementById('latency').innerText = (endTime - startTime).toFixed(1);
    document.getElementById('count').innerText = poses.length;

    draw(poses);
    requestAnimationFrame(runDetection);
}

function draw(poses) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    poses.forEach(pose => {
        if (pose.score > 0.2) {
            // Draw Keypoints
            pose.keypoints.forEach(kp => {
                if (kp.score > 0.5) {
                    ctx.beginPath();
                    ctx.arc(kp.position.x, kp.position.y, 5, 0, 2*Math.PI);
                    ctx.fillStyle = modeSelect.value === "single" ? "#38bdf8" : "#fbbf24";
                    ctx.fill();
                }
            });
        }
    });
}