// Extract the current URL
const url = window.location.href;
console.log("Current URL:", url);  // Debugging log

// Function to send extracted features to the backend for prediction
async function sendToBackend(url) {
    try {
        console.log("Sending URL to backend:", url);  // Debugging log

        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })  // Send URL for prediction
        });

        console.log("Backend response status:", response.status);  // Debugging log

        if (!response.ok) {
            throw new Error('Failed to fetch data from the server');
        }

        const data = await response.json();
        console.log("Backend response data:", data);  // Debugging log
        const prediction = data.prediction;  // Get prediction

        // Send the prediction to the popup or content script
        chrome.runtime.sendMessage({ prediction: prediction });
        console.log("Prediction sent to popup:", prediction);  // Debugging log

    } catch (error) {
        console.error('Error fetching prediction:', error);
        chrome.runtime.sendMessage({ prediction: 'Error' });  // Handle error gracefully
    }
}

// Trigger the backend check
sendToBackend(url);
