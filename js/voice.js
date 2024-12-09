function speakText(text) {
    if (window.AndroidBridge && typeof window.AndroidBridge.speakText === "function") {
        window.AndroidBridge.speakText(text);
    } else if (window.speechSynthesis) {
        var utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'te-IN';
        window.speechSynthesis.speak(utterance);
    }
}

function stopSpeech() {
    if (window.AndroidBridge && typeof window.AndroidBridge.stopSpeech === "function") {
        window.AndroidBridge.stopSpeech();
    } else if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}
