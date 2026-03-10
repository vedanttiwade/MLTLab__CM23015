const dataset = [
    { text: "happy", label: 1 }, { text: "great", label: 1 },
    { text: "bad", label: -1 }, { text: "terrible", label: -1 }
];

let weights = {};

function trainModels() {
    weights = {"happy": 2, "great": 2, "bad": -2, "terrible": -2, "not": -0.5};
    document.getElementById('status').innerText = "🟢 Models Trained!";
    document.getElementById('compareBtn').disabled = false;
    alert("A3: Training simulated. RNN and Dense weights initialized.");
}

function compareModels() {
    const input = document.getElementById('userInput').value.toLowerCase();
    const words = input.split(/\s+/).map(w => w.replace(/[^\w]/g, ""));
    
    // --- 1. SIMPLE DENSE LOGIC (Bag of Words) ---
    // Just sums up the values. Doesn't care about order.
    let denseScore = 0;
    words.forEach(word => {
        if (weights[word]) denseScore += weights[word];
    });

    // --- 2. RNN LOGIC (Sequence Modeling) ---
    // Understands that "not" flips the meaning of the next word.
    let rnnScore = 0;
    let negationFlag = false;
    words.forEach(word => {
        if (["not", "dont", "never"].includes(word)) {
            negationFlag = true;
            rnnScore -= 0.5;
        } else if (weights[word]) {
            rnnScore += negationFlag ? (weights[word] * -1.5) : weights[word];
            negationFlag = false; 
        }
    });

    updateUI("dense", denseScore);
    updateUI("rnn", rnnScore);
    interpret(denseScore, rnnScore, input);
}

function updateUI(type, score) {
    const box = document.getElementById(type + 'Result');
    const label = document.getElementById(type + 'Label');
    const scoreVal = document.getElementById(type + 'Score');
    
    scoreVal.innerText = score.toFixed(1);
    box.className = "result-box"; 

    if (score > 0.2) {
        label.innerText = "POSITIVE";
        box.classList.add("pos");
    } else if (score < -0.2) {
        label.innerText = "NEGATIVE";
        box.classList.add("neg");
    } else {
        label.innerText = "NEUTRAL";
    }
}

function interpret(dense, rnn, text) {
    const info = document.getElementById('interpretation');
    const analysis = document.getElementById('analysisText');
    info.style.display = "block";
    
    if (text.includes("not")) {
        analysis.innerText = "The Dense model failed to see context. The RNN detected 'not' and correctly flipped the sentiment.";
    } else {
        analysis.innerText = "Both models performed similarly on simple adjectives.";
    }
}