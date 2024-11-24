// Get references to the DOM elements
const statusMessage = document.getElementById('statusMessage');
const checkStatusButton = document.getElementById('checkStatusButton');

// Add event listener for the button click
checkStatusButton.addEventListener('click', async () => {
    const currentTab = await getCurrentTab();

    if (currentTab) {
        const url = currentTab.url;
        statusMessage.textContent = "Checking...";
        statusMessage.className = ""; // Reset any previous status class

        try {
            // Send the URL to the Flask server for prediction
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url })
            });

            const data = await response.json();

            if (response.ok) {
                const prediction = data.prediction === 1 ? "Phishing" : "Safe";
                const resultClass = data.prediction === 1 ? "phishing" : "safe";
                statusMessage.textContent = `Result: ${prediction}`;
                statusMessage.className = resultClass;
            } else {
                statusMessage.textContent = "Error in prediction.";
                statusMessage.className = "error";
            }
        } catch (error) {
            console.error("Error:", error);
            statusMessage.textContent = "Unable to connect to server.";
            statusMessage.className = "error";
        }
    } else {
        statusMessage.textContent = "Unable to get the current tab URL.";
        statusMessage.className = "error";
    }
});

// Helper function to get the current active tab
async function getCurrentTab() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs.length > 0) {
                resolve(tabs[0]);
            } else {
                reject("No active tab found.");
            }
        });
    });
}
