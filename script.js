// Initialize the sentiment variable globally
let ml;

function analyzeSentiment() {
    const textInput = document.getElementById("textInput");
    const resultDiv = document.getElementById("result");
    const text = textInput.value.trim();

    if (text === "") {
        resultDiv.innerText = "⚠️ Please enter some text.";
        resultDiv.style.color = "white";
        return;
    }

    // Check if the Sentiment library is actually loaded in the browser
    if (typeof Sentiment === 'undefined') {
        resultDiv.innerText = "Connecting to analysis engine... try again in 1 second.";
        resultDiv.style.color = "orange";
        return;
    }

    try {
        // Create instance if it doesn't exist
        if (!ml) ml = new Sentiment();
        
        const result = ml.analyze(text);
        const score = result.score;

        let sentimentType = "";
        let color = "";

        if (score > 0) {
            sentimentType = "Positive 😊";
            color = "#90ee90";
        } else if (score < 0) {
            sentimentType = "Negative 😡";
            color = "#ff6b6b";
        } else {
            sentimentType = "Neutral 😐";
            color = "yellow";
        }

        resultDiv.style.color = color;
        resultDiv.innerText = `Sentiment: ${sentimentType} | Score: ${score}`;

    } catch (error) {
        console.error("Error:", error);
        resultDiv.innerText = "Analysis failed. Check your internet connection.";
    }
}

function clearAll() {
    document.getElementById("textInput").value = "";
    document.getElementById("result").innerText = "";
}