/**
 * Practical No. 3: Sentiment Classifier Logic
 * Optimized for A1 Training and Logic Correction
 */

// 1. DATASET: 5 Positive and 5 Negative examples
const trainingData = [
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

// 2. TRAINING FUNCTION
function trainModel() {
    weights = {}; // Reset model weights
    
    trainingData.forEach(item => {
        const words = item.text.toLowerCase().split(/\s+/);
        words.forEach(word => {
            const clean = word.replace(/[^\w]/g, ""); // Remove punctuation
            if (clean.length > 0) {
                if (!weights[clean]) weights[clean] = 0;
                weights[clean] += item.label;
            }
        });
    });

    const status = document.getElementById('status');
    status.innerText = "🟢 Model Trained Successfully!";
    status.style.color = "#27ae60";
    document.getElementById('predictBtn').disabled = false;
    alert("Training Complete!");
}

// 3. PREDICTION FUNCTION (Fixed for "I am happy")
function runPrediction() {
    const input = document.getElementById('userInput').value.toLowerCase();
    if (!input.trim()) return alert("Please enter text!");

    const words = input.split(/\s+/);
    let totalScore = 0;
    let nextWordIsNegated = false;

    words.forEach(word => {
        const clean = word.replace(/[^\w]/g, "");
        if (clean.length === 0) return;

        // Check for negation words
        if (["not", "dont", "no", "never", "didnt", "isnt"].includes(clean)) {
            nextWordIsNegated = true;
            totalScore -= 0.5; // Slight negative bias for the negation word itself
            return;
        }

        // Calculate score
        if (weights[clean]) {
            let wordWeight = weights[clean];
            
            if (nextWordIsNegated) {
                totalScore += (wordWeight * -1.5); // Flip: "not happy" becomes negative
                nextWordIsNegated = false; // Reset negation after one word
            } else {
                totalScore += wordWeight; // Normal: "happy" stays positive
            }
        } else {
            // If word isn't in dataset, negation resets anyway
            nextWordIsNegated = false;
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

    console.log("Final Sentiment Score:", score); // For debugging in Console (F12)

    if (score > 0.1) {
        label.innerText = "POSITIVE";
        resBox.classList.add("positive");
    } else if (score < -0.1) {
        label.innerText = "NEGATIVE";
        resBox.classList.add("negative");
    } else {
        label.innerText = "NEUTRAL";
        resBox.classList.add("neutral");
    }
}