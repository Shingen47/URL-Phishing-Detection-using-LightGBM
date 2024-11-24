from flask import Flask, request, jsonify
from flask_cors import CORS
import lightgbm as lgb
import numpy as np
import re
from urllib.parse import urlparse

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests for frontend communication

# Load your pre-trained model
model = lgb.Booster(model_file=r'C:\Users\danan\Desktop\Python program\PhishingDetection\browser_extention\lightgbm_model.txt')

def extract_features_from_url(url):
    parsed_url = urlparse(url)
    features = {
        "url_length": len(url),
        "has_https": 1 if parsed_url.scheme == "https" else 0,
        "num_special_chars": len(re.findall(r'[@\-_.]', url)),
        "num_digits": len(re.findall(r'\d', url)),
        "num_subdomains": len(parsed_url.netloc.split('.')) - 2,
        "is_ip": 1 if re.match(r'^\d{1,3}(\.\d{1,3}){3}$', parsed_url.netloc) else 0,
        "contains_suspicious_words": 1 if re.search(r"(login|secure|free|account|verify)", url) else 0,
        "domain_length": len(parsed_url.netloc),
        "contains_www": 1 if 'www.' in parsed_url.netloc else 0
    }
    return features

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        if 'url' not in data:
            return jsonify({'error': 'No URL provided'}), 400

        url = data['url']
        features = extract_features_from_url(url)
        feature_list = np.array([list(features.values())])
        prediction = model.predict(feature_list)
        prediction_result = int(prediction[0] > 0.5)

        return jsonify({'prediction': prediction_result})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
