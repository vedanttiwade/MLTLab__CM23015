async function verifyModel() {
    const inputVal = parseFloat(document.getElementById('testInput').value);
    if (isNaN(inputVal)) return alert("Please enter a number!");

    const resultCard = document.getElementById('resultCard');
    const valX = document.getElementById('valX');
    const valY = document.getElementById('valY');
    const matchStatus = document.getElementById('matchStatus');

    try {
        // 1. RELOAD the model from LocalStorage (Requirement A2)
        const model = await tf.loadLayersModel('localstorage://my-model');
        
        // 2. RUN Prediction
        // We wrap the input in a tensor [1, 1]
        const output = model.predict(tf.tensor2d([inputVal], [1, 1]));
        const prediction = (await output.data())[0];

        // 3. UI Update
        resultCard.style.display = "block";
        valX.innerText = inputVal;
        valY.innerText = prediction.toFixed(4);

        // 4. VERIFY logic (y = 2x - 1)
        const expected = (2 * inputVal) - 1;
        const difference = Math.abs(prediction - expected);

        if (difference < 0.5) {
            matchStatus.innerText = "✅ Verification Passed: Matches original logic!";
            matchStatus.style.color = "#10b981";
        } else {
            matchStatus.innerText = "⚠️ Verification Warning: Accuracy is low. (Did you finish A1?)";
            matchStatus.style.color = "#f59e0b";
        }

    } catch (err) {
        alert("Model not found! Run the training in A1 first.");
        console.error(err);
    }
}