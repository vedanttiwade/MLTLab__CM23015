async function processText() {
    const text = document.getElementById("inputText").value.trim();

    // Input validation
    if (!text || text.length < 3) {
        alert("Enter valid text (min 3 characters)");
        return;
    }

    try {
        // Step 1: Detect Language (basic but effective)
        const langCode = detectLanguage(text);
        const langName = getLanguageName(langCode);

        document.getElementById("language").innerText = langName;

        // Step 2: Translate using MyMemory API
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langCode}|en`
        );

        if (!response.ok) {
            throw new Error("Network response failed");
        }

        const data = await response.json();

        if (!data.responseData || !data.responseData.translatedText) {
            throw new Error("Invalid API response");
        }

        document.getElementById("translation").innerText =
            data.responseData.translatedText;

    } catch (error) {
        console.error("ERROR:", error);
        alert("Something went wrong. Press F12 → Console");
    }
}

// 🔍 Language Detection (regex-based)
function detectLanguage(text) {
    if (/[\u0900-\u097F]/.test(text)) return "hi"; // Hindi
    if (/[\u0980-\u09FF]/.test(text)) return "bn"; // Bengali
    if (/[\u0A00-\u0A7F]/.test(text)) return "pa"; // Punjabi
    if (/[\u0B80-\u0BFF]/.test(text)) return "ta"; // Tamil
    if (/[\u0C00-\u0C7F]/.test(text)) return "te"; // Telugu
    if (/[\u0600-\u06FF]/.test(text)) return "ar"; // Arabic
    if (/[\u4e00-\u9fff]/.test(text)) return "zh"; // Chinese
    if (/[\u3040-\u30ff]/.test(text)) return "ja"; // Japanese
    if (/[\uAC00-\uD7AF]/.test(text)) return "ko"; // Korean
    if (/[а-яА-Я]/.test(text)) return "ru"; // Russian

    // Default assumption
    return "auto";
}

// 🌍 Language Name Mapping (20–30 major languages)
function getLanguageName(code) {
    const languages = {
        "auto": "Auto / Unknown",
        "en": "English",
        "hi": "Hindi",
        "bn": "Bengali",
        "pa": "Punjabi",
        "ta": "Tamil",
        "te": "Telugu",
        "mr": "Marathi",
        "gu": "Gujarati",
        "ar": "Arabic",
        "zh": "Chinese",
        "ja": "Japanese",
        "ko": "Korean",
        "ru": "Russian",
        "es": "Spanish",
        "fr": "French",
        "de": "German",
        "it": "Italian",
        "pt": "Portuguese",
        "tr": "Turkish",
        "vi": "Vietnamese",
        "id": "Indonesian",
        "th": "Thai",
        "pl": "Polish",
        "nl": "Dutch",
        "sv": "Swedish",
        "fi": "Finnish"
    };

    return languages[code] || "Unknown";
}