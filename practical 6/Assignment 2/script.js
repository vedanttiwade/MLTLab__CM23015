let net;
const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const countLabel = document.getElementById('count');
const feedback = document.getElementById('feedback');

let counter = 0;
let stage = "up"; // Can be "up" or "down"

async function startExercise() {
    net = await posenet.load();
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.onloadedmetadata = () => {
        canvas.width = 640;
        canvas.height = 480;
        detectLoop();
    };
}

// Math function to find the angle between three points
function calculateAngle(p1, p2, p3) {
    const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
}

async function detectLoop() {
    const pose = await net.estimateSinglePose(video);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (pose) {
        // Points needed for a squat (using the right side for example)
        const hip = pose.keypoints[12];
        const knee = pose.keypoints[14];
        const ankle = pose.keypoints[16];

        if (hip.score > 0.5 && knee.score > 0.5 && ankle.score > 0.5) {
            const angle = calculateAngle(hip.position, knee.position, ankle.position);

            // Logic for counting:
            // Squat Down: Knee angle usually < 140 degrees
            // Stand Up: Knee angle usually > 160 degrees
            if (angle < 140) {
                stage = "down";
                feedback.innerText = "Go Up!";
                feedback.style.color = "#3fb950";
            }
            if (angle > 160 && stage === "down") {
                stage = "up";
                counter++;
                countLabel.innerText = counter;
                feedback.innerText = "Squat Down!";
                feedback.style.color = "#58a6ff";
            }

            // Draw current angle on canvas for debugging
            ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            ctx.fillText(`Angle: ${Math.round(angle)}°`, knee.position.x + 20, knee.position.y);
            
            // Highlight the tracking points
            [hip, knee, ankle].forEach(pt => {
                ctx.beginPath();
                ctx.arc(pt.position.x, pt.position.y, 8, 0, 2 * Math.PI);
                ctx.fillStyle = "#f85149";
                ctx.fill();
            });
        }
    }
    requestAnimationFrame(detectLoop);
}