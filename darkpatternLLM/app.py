from flask import Flask, request, jsonify
import torch
from dotenv import load_dotenv
import os
from transformers import AutoModelForSequenceClassification, AutoTokenizer

load_dotenv()

token = os.getenv("TOKEN")
app = Flask(__name__)
# Load the model and tokenizer
model = AutoModelForSequenceClassification.from_pretrained('h4shk4t/darkpatternLLM-multiclass', token=token)
tokenizer = AutoTokenizer.from_pretrained('h4shk4t/darkpatternLLM-multiclass',token=token)

@app.route('/predict', methods=['POST'])
def predict():
    # Get the text from the request
    text = request.json['text']

    # Tokenize the text and convert to tensor
    inputs = tokenizer(text, return_tensors='pt')

    # Run the model
    outputs = model(**inputs)

    # Apply softmax to get probabilities
    probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)

    # Convert the output to JSON and return it
    probs = probabilities.tolist()[0]
    prob_dict = {}
    for i in range(len(probs)):
        prob_dict["LABEL_"+str(i)] = probs[i]
    # Arrange dictionary in descending order of probabilities (values in the dict)
    return jsonify(prob_dict)

if __name__ == '__main__':
    app.run(debug=False, port=8000)