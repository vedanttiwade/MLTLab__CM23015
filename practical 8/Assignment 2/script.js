let net;
const classifier = knnClassifier.create();
const video = document.getElementById('webcam');
const validationData = []; // Stores {activation, label}

async function setup() {
    net = await mobilenet.load();
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
}

// A2 Logic: Split data into Training and Validation
async function addExample(classId) {
    const activation = net.infer(video, 'conv_preds');
    
    // 80% go to Classifier (Training), 20% go to Validation list
    if (Math.random() > 0.2) {
        classifier.addExample(activation, classId);
    } else {
        // Keep a reference to the tensor data for validation
        validationData.push({feat: tf.keep(activation), label: classId});
    }
    console.log(`Added sample. Validation set size: ${validationData.length}`);
}

async function runValidation() {
    if (validationData.length === 0) return alert("Train more samples first!");

    let correct = 0;
    const matrix = [[0, 0], [0, 0]]; // [Actual][Predicted]
    const classNames = ["Apple", "Banana"];

    for (const item of validationData) {
        const result = await classifier.predictClass(item.feat);
        const predicted = parseInt(result.label);
        const actual = item.label;

        matrix[actual][predicted]++;
        if (predicted === actual) correct++;
    }

    // Update UI
    document.getElementById('results').style.display = "block";
    document.getElementById('accuracyText').innerText = ((correct / validationData.length) * 100).toFixed(1) + "%";
    
    renderMatrix(matrix);
}

function renderMatrix(matrix) {
    const body = document.getElementById('matrixBody');
    body.innerHTML = "";
    matrix.forEach((row, i) => {
        let tr = `<tr><td><strong>${i === 0 ? 'Apple' : 'Banana'}</strong></td>`;
        row.forEach((cell, j) => {
            const type = (i === j) ? 'hit' : 'miss';
            tr += `<td class="${type}">${cell}</td>`;
        });
        tr += "</tr>";
        body.innerHTML += tr;
    });
}

setup();