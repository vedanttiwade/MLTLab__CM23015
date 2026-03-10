// A1: Small Dataset for Training
const dataset = [
    { text: "i love this work", label: 1 },
    { text: "this is amazing and great", label: 1 },
    { text: "the best experience ever", label: 1 },
    { text: "excellent help and happy", label: 1 },
    { text: "i am happy today", label: 1 },
    { text: "i hate this service", label: -1 },
    { text: "this is the worst thing", label: -1 },
    { text: "terrible experience bad", label: -1 },
    { text: "i am very sad and angry", label: -1 },
    { text: "dont work here it is awful", label: -1 }
];

let weights = {};

// 1. Train Model (A1)
function trainModel() {
    weights = {}; 
    dataset.forEach(item => {
        const words = item.text.toLowerCase().split(/\s+/);
        words.forEach(word => {
            const clean = word.replace(/[^\w]/g, "");
            if (clean) {
                if (!weights[clean]) weights[clean] = 0;
                weights[clean] += item.label;
            }
        });
    });

    const status = document.getElementById('status');
    status.innerText = "🟢 Model Trained Successfully!";
    status.style.color = "#27ae60";
    document.getElementById('predictBtn').disabled = false;
    alert("Model Trained! Word weights have been established.");
}

// 2. Predict & Interpret Confidence (A2)
function runPrediction() {
    const input = document.getElementById('userInput').value.toLowerCase();
    if (!input.trim()) return alert("Please enter some text.");

    const words = input.split(/\s+/);
    let totalScore = 0;
    let foundWordsCount = 0;
    let isNegated = false;

    words.forEach(word => {
        const clean = word.replace(/[^\w]/g, "");
        
        // Negation Logic
        if (["not", "dont", "no", "never", "didnt"].includes(clean)) {
            isNegated = true;
            totalScore -= 0.5;
            return;
        }

        if (weights[clean]) {
            // A2: Interpret the weight - flip if negation is active
            totalScore += isNegated ? (weights[clean] * -1.5) : weights[clean];
            foundWordsCount++;
            isNegated = false; // Reset negation after applying to one word
        }
    });

    // A2: Confidence Calculation
    // Base 50% + intensity of matches, capped at 99%
    let confidence = foundWordsCount > 0 ? 
        Math.min(50 + (Math.abs(totalScore) * 15), 99) : 50;

    displayResult(totalScore, confidence);
}

function displayResult(score, confidence) {
    const resBox = document.getElementById('resultArea');
    const label = document.getElementById('sentimentLabel');
    const confLabel = document.getElementById('confidenceLabel');
    
    resBox.style.display = "block";
    resBox.className = "result-box"; 
    confLabel.innerText = Math.floor(confidence);

    if (score > 0.1) {
        label.innerText = "POSITIVE";
        resBox.classList.add("positive");
    } else if (score < -0.1) {
        label.innerText = "NEGATIVE";
        resBox.classList.add("negative");
    } else {
        label.innerText = "NEUTRAL";
        resBox.classList.add("neutral");
        confLabel.innerText = "50";
    }
}