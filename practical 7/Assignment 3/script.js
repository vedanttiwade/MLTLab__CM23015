// 1. Export Model to Local Files (Requirement A3)
async function exportModel() {
    try {
        // Load the model from LocalStorage (created in A1)
        const model = await tf.loadLayersModel('localstorage://my-model');
        
        // This triggers a browser download for model.json and model.weights.bin
        await model.save('downloads://my-model');
        alert("Check your downloads folder for 'my-model.json' and 'my-model.weights.bin'");
    } catch (err) {
        alert("No saved model found! Run A1 training first.");
    }
}

// 2. Re-Import from Files and Test (Requirement A3)
async function importAndTest() {
    const fileInput = document.getElementById('fileSelector');
    if (fileInput.files.length < 2) {
        return alert("Please select BOTH the .json and the .bin files.");
    }

    try {
        // Use tf.io.browserFiles to load from the user's selection
        const model = await tf.loadLayersModel(tf.io.browserFiles(
            [fileInput.files[0], fileInput.files[1]]
        ));

        // Run a test prediction for X = 5 (Expected Y is approx 9)
        const testX = 5;
        const output = model.predict(tf.tensor2d([testX], [1, 1]));
        const prediction = (await output.data())[0];

        // Update UI
        document.getElementById('resultBox').style.display = "block";
        document.getElementById('predictionVal').innerText = prediction.toFixed(2);

    } catch (err) {
        alert("Error loading files. Ensure you selected the correct model files.");
        console.error(err);
    }
}