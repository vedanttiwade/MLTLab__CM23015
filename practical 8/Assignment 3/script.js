let net;
const classifier = knnClassifier.create();
const video = document.getElementById('webcam');
const categories = [];

async function init() {
    net = await mobilenet.load();
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    predictLoop();
}

function addNewCategory() {
    const name = document.getElementById('catName').value;
    if (!name) return;
    
    const id = categories.length;
    categories.push(name);
    
    const div = document.createElement('div');
    div.className = 'cat-item';
    div.innerHTML = `
        <span>${name}</span>
        <button class="train-btn" onmousedown="train(${id})">Hold to Train</button>
    `;
    document.getElementById('categoryList').appendChild(div);
    document.getElementById('catName').value = "";
    document.getElementById('classCount').innerText = categories.length;
}

async function train(id) {
    const activation = net.infer(video, 'conv_preds');
    classifier.addExample(activation, id);
}

async function predictLoop() {
    while (true) {
        const start = performance.now();
        if (classifier.getNumClasses() > 0) {
            const activation = net.infer(video, 'conv_preds');
            const result = await classifier.predictClass(activation);
            
            document.getElementById('predictionDisplay').innerText = 
                `${categories[result.label]} (${Math.round(result.confidences[result.label] * 100)}%)`;
        }
        
        const end = performance.now();
        document.getElementById('latency').innerText = (end - start).toFixed(1);
        await tf.nextFrame();
    }
}

init();