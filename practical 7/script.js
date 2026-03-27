const MODEL_URL = 'localstorage://my-trained-model';

// 1. Train the model and Save it locally
async function trainAndSave() {
    const status = document.getElementById('trainStatus');
    status.innerText = "⏳ Training...";

    // Define a simple linear model: y = 2x - 1
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 1, inputShape: [1]}));
    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

    // Training data
    const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
    const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);

    // Train for 250 epochs
    await model.fit(xs, ys, {epochs: 250});

    // Requirement: Save the model locally
    await model.save(MODEL_URL);

    status.innerText = "🟢 Model Trained & Saved!";
    status.style.color = "#2f855a";
    document.getElementById('predictBtn').disabled = false;
    alert("Model successfully saved to Browser LocalStorage!");
}

// 2. Reload the model and Predict
async function loadAndPredict() {
    const inputVal = parseFloat(document.getElementById('inputValue').value);
    if (isNaN(inputVal)) return alert("Please enter a valid number");

    // Requirement: Reload the model from local storage
    const loadedModel = await tf.loadLayersModel(MODEL_URL);

    // Requirement: Run predictions
    const prediction = loadedModel.predict(tf.tensor2d([inputVal], [1, 1]));
    const result = await prediction.data();

    // Display result
    const resBox = document.getElementById('resultArea');
    const outLabel = document.getElementById('outputValue');
    
    resBox.style.display = "block";
    outLabel.innerText = result[0].toFixed(2);
}