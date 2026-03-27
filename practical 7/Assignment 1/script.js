async function runA1() {
    const trainBtn = document.getElementById('trainBtn');
    const status = document.getElementById('status');
    const progressBar = document.getElementById('progressBar');
    const details = document.getElementById('modelDetails');

    trainBtn.disabled = true;
    status.innerText = "Initializing Model...";

    // 1. Create a simple linear model
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 1, inputShape: [1]}));
    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

    // 2. Prepare training data (y = 2x - 1)
    const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
    const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);

    status.innerText = "Training in progress...";

    // 3. Train the model
    await model.fit(xs, ys, {
        epochs: 100,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                progressBar.style.width = (epoch + 1) + "%";
            }
        }
    });

    status.innerText = "Saving to LocalStorage...";

    // 4. SAVE the model (Requirement A1)
    // This saves 'model.json' (structure) and weights to browser storage
    await model.save('localstorage://my-model');

    status.innerText = "Training & Saving Complete!";
    details.style.display = "block";
}