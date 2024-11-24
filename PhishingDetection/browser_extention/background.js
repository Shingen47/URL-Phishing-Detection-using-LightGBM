// Function to extract features from the URL
function extractFeatures(url) {
    return {
        url_length: url.length,
        num_digits: (url.match(/\d/g) || []).length,
        num_special_chars: (url.match(/[^a-zA-Z0-9]/g) || []).length,
        num_hyphens: (url.match(/-/g) || []).length,
        num_dots: (url.match(/\./g) || []).length,
        num_https: url.toLowerCase().includes("https") ? 1 : 0  // Properly checking for "https"
    };
}

// background.js

async function sendToBackend(url) {
    console.log('Sending URL to backend:', url);  // Log the URL being sent to the backend

    try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })  // Send URL for prediction
        });

        if (!response.ok) {
            console.error('Failed to fetch data from the server');
            chrome.runtime.sendMessage({ prediction: 'Error' });  // Send error response back
            return;
        }

        const data = await response.json();
        console.log('Received prediction from backend:', data);  // Log the prediction data

        const prediction = data.prediction;  // Get prediction (1 for phishing, 0 for safe)

        // Send the prediction to the popup
        chrome.runtime.sendMessage({ prediction: prediction });

    } catch (error) {
        console.error('Error fetching prediction:', error);
        chrome.runtime.sendMessage({ prediction: 'Error' });  // Send error response back
    }
}

// Listen for a message from popup to check phishing
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Background received message:', message);  // Log the received message
    
    if (message.action === 'checkPhishingStatus') {
        const url = message.url;  // Extract URL from the message
        console.log('Received URL in background:', url);  // Log the URL
        sendToBackend(url);  // Send URL to the backend for prediction
    }
});
