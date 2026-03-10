/**
 * Practical No. 3: Text Sentiment Analysis
 * This script uses a weighted scoring system and negation detection 
 * to simulate the behavior of a pre-trained RNN model.
 */

function analyzeSentiment() {
    // 1. Get the input and UI elements
    const textarea = document.getElementById('userInput');
    const text = textarea.value.trim().toLowerCase();
    const resultDiv = document.getElementById('resultContainer');
    const label = document.getElementById('sentimentLabel');
    const confidence = document.getElementById('confidenceValue');

    if (!text) {
        alert("Please enter some text to analyze.");
        return;
    }

    // 2. Define Sentiment Dictionaries (Simulating Word Embeddings)
    const positiveWords = ['good', 'great', 'happy', 'love', 'excellent', 'best', 'work', 'help', 'yes', 'thanks'];
    const negativeWords = ['bad', 'worst', 'hate', 'sad', 'terrible', 'no', 'dont', "don't", 'not', 'stop', 'problem'];
    
    // 3. Logic for Negation and Sequence (RNN behavior)
    let score = 0;
    const words = text.split(/\s+/);
    let negationActive = false;

    words.forEach((word) => {
        // Remove punctuation for better matching
        const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

        // Check for negation words (don't, not, never)
        if (['not', 'dont', "don't", 'never', 'no'].includes(cleanWord)) {
            negationActive = true;
            score -= 1; // Direct negative impact
            return;
        }

        if (positiveWords.includes(cleanWord)) {
            // If we said "not good", it's negative. If just "good", it's positive.
            score += negationActive ? -2 : 2;
            negationActive = false; // Reset negation after one word
        } else if (negativeWords.includes(cleanWord)) {
            score -= 2;
            negationActive = false;
        }
    });

    // 4. Update UI based on final score
    resultDiv.classList.remove('hidden');
    
    // Default styling
    resultDiv.style.padding = "15px";
    resultDiv.style.borderRadius = "8px";
    resultDiv.style.marginTop = "20px";

    if (score > 0) {
        label.innerText = "POSITIVE";
        label.style.color = "#155724";
        resultDiv.style.backgroundColor = "#d4edda";
        confidence.innerText = Math.min(70 + (score * 5), 98); // Dynamic confidence
    } else if (score < 0) {
        label.innerText = "NEGATIVE";
        label.style.color = "#721c24";
        resultDiv.style.backgroundColor = "#f8d7da";
        confidence.innerText = Math.min(70 + (Math.abs(score) * 5), 99);
    } else {
        label.innerText = "NEUTRAL";
        label.style.color = "#383d41";
        resultDiv.style.backgroundColor = "#e2e3e5";
        confidence.innerText = "50";
    }
}