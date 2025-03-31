### **Phishing Website Detection Using LightGBM**  

#### **Overview**  
This project is a **phishing website detection system** that utilizes **LightGBM**, a high-performance gradient boosting framework. The model is trained to classify websites as either **phishing ("bad")** or **legitimate ("good")** based on URL features. Additionally, a **browser extension** integrates with a Flask API to provide real-time phishing detection for users.  

#### **Features**  
✅ **LightGBM Model**: Trained on a dataset of over 500,000 entries for high accuracy.  
✅ **Flask Backend**: Handles incoming URL requests and returns predictions.  
✅ **Browser Extension**: Scans websites in real-time and warns users of potential phishing threats.  
✅ **Feature Extraction**: Extracts relevant characteristics from URLs for classification.  

#### **Architecture**  
- **LightGBM Model**: Trained using feature-engineered URL datasets.  
- **Flask API**: Serves as the backend to process URL predictions.  
- **Browser Extension**: Captures the current URL, sends it to the backend, and displays results to the user.  
- **Frontend Popup UI**: Provides phishing detection status.  

#### **Installation**  

**1. Clone the repository**  
```bash
git clone https://github.com/Shingen47/PhishingDetection.git
cd phishing-detection
```

**2. Install dependencies**  
```bash
pip install -r requirements.txt
```

**3. Run the Flask server**  
```bash
python app.py
```

**4. Load the Chrome Extension**  
1. Open Chrome and go to `chrome://extensions/`  
2. Enable **Developer Mode** (top-right corner)  
3. Click **Load Unpacked** and select the `extension/` folder  

#### **Usage**  
- When visiting a website, the extension will **automatically analyze** the URL.  
- Click the extension icon to **manually check the website status**.  
- If a website is detected as **phishing**, an alert will be shown.  

#### **Model Performance**  
- **Accuracy**: 84.41%  
- **Precision (Phishing)**: 86%  
- **Recall (Phishing)**: 93%  
- **F1-Score**: 0.90  
- **Weighted Avg**: 84%  

#### **Future Enhancements**  
- Improve false-positive handling for legitimate websites.  
- Deploy the model to a cloud-based API for better scalability.  
- Implement deep learning models for enhanced accuracy.  
- Add support for more browsers like Firefox and Edge.  


