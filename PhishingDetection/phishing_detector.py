import pandas as pd
import numpy as np
import re
from urllib.parse import urlparse
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import lightgbm as lgb

# Function to extract features from the URL
def extract_features(url):
    parsed_url = urlparse(url)
    features = {
        "url_length": len(url),
        "has_https": 1 if parsed_url.scheme == "https" else 0,
        "num_special_chars": len(re.findall(r'[@\-_.]', url)),
        "num_digits": len(re.findall(r'\d', url)),
        "num_subdomains": len(parsed_url.netloc.split('.')) - 2,
        "is_ip": 1 if re.match(r'^\d{1,3}(\.\d{1,3}){3}$', parsed_url.netloc) else 0,
        "contains_suspicious_words": 1 if re.search(r"(login|secure|free|account|verify)", url) else 0,
    }
    return features

# Load dataset (Replace with the path to your CSV dataset)
# Sample CSV format: url,label
df = pd.read_csv(r'C:\Users\danan\Desktop\Python program\PhishingDetection')

# Extract features from URLs
X = df['url'].apply(extract_features)
X = pd.json_normalize(X)  # Flatten the nested dictionary

# Target variable: 0 for legitimate, 1 for phishing
y = df['label']

# Split data into training and testing sets, ensuring class balance
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

# Convert data to LightGBM dataset format
train_data = lgb.Dataset(X_train, label=y_train)
test_data = lgb.Dataset(X_test, label=y_test, reference=train_data)

# Set parameters for LightGBM
params = {
    "objective": "binary",
    "boosting_type": "gbdt",
    "metric": "binary_logloss",
    "num_leaves": 31,
    "learning_rate": 0.05,
    "feature_fraction": 0.8,
    "bagging_fraction": 0.8,
    "bagging_freq": 5,
}

# Train the LightGBM model
model = lgb.train(
    params,
    train_data,
    valid_sets=[train_data, test_data],
    valid_names=["train", "test"],
    num_boost_round=100,
    early_stopping_rounds=10
)

# Predict using the trained model
y_pred = model.predict(X_test, num_iteration=model.best_iteration)
y_pred_binary = [1 if x > 0.5 else 0 for x in y_pred]

# Evaluate the model
print("Accuracy:", accuracy_score(y_test, y_pred_binary))
print("Classification Report:")
print(classification_report(y_test, y_pred_binary, zero_division=1))
