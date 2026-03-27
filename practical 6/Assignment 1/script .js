// 1. SMALL DATASET (Requirement A1)
const trainingData = [
    { text: "i love this work", label: 1 },
    { text: "this is amazing and great", label: 1 },
    { text: "the best experience ever", label: 1 },
    { text: "excellent help and happy", label: 1 },
    { text: "i hate this service", label: -1 },
    { text: "this is the worst thing", label: -1 },
    { text: "terrible experience bad", label: -1 },
    { text: "i am very sad and angry", label: -1 },
    { text: "dont work here it is awful", label: -1 }
];

let weights = {};

// 2. TRAINING PHASE
function trainModel() {
    weights = {}; // Reset model
    
    trainingData.forEach(item => {
        const words = item.text.toLowerCase().split(/\s+/);
        words.forEach(word => {
            const clean = word.replace(/[^\w]/g, ""); // Remove punctuation
            if (!weights[clean]) weights[clean] = 0;
            
            // Words in positive sentences get +1, negative get -1
            weights[clean] += item.label;
        });
    });

    // Update UI Status
    const status = document.getElementById('status');
    status.innerText = "🟢 Model Trained Successfully!";
    status.style.color = "#27ae60";
    document.getElementById('predictBtn').disabled = false;
    alert("Training Complete!");
}

// 3. PREDICTION PHASE
function runPrediction() {
    const input = document.getElementById('userInput').value.toLowerCase();
    if (!input.trim()) return alert("Please enter text!");

    const words = input.split(/\s+/);
    let totalScore = 0;
    let isNegated = false;

    words.forEach(word => {
        const clean = word.replace(/[^\w]/g, "");
        
        // Sequence Logic (Negation Handling)
        // If we see "not", "dont", "no", we flip the score of the next word
        if (["not", "dont", "no", "never"].includes(clean)) {
            isNegated = true;
            totalScore -= 0.5; // Neutral-negative starting weight for 'no'
            return;
        }

        if (weights[clean]) {
            // Apply learned weight, flip it if negation is active
            totalScore += isNegated ? (weights[clean] * -1.2) : weights[clean];
            isNegated = false; // Reset negation
        }
    });

    displayResult(totalScore);
}

// 4. DISPLAY RESULT
function displayResult(score) {
    const resBox = document.getElementById('resultArea');
    const label = document.getElementById('sentimentLabel');
    
    resBox.style.display = "block";
    resBox.className = "result-box"; // Reset classes

    if (score > 0.3) {
        label.innerText = "POSITIVE";
        resBox.classList.add("positive");
    } else if (score < -0.3) {
        label.innerText = "NEGATIVE";
        resBox.classList.add("negative");
    } else {
        label.innerText = "NEUTRAL";
        resBox.classList.add("neutral");
    }
}