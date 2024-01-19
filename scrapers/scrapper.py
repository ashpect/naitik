from amazon import amazon
from flipkart import flip
from flask import Flask, request, jsonify
 
app = Flask(__name__)

@app.route('/', methods=['POST'])
def product():
    input_json = request.get_json(force=True) 
    prod = input_json["product"]
    ama_data = amazon(prod)
    flip_data = flip(prod)
    response_data = {
        "amazon": ama_data,
        "flipkart": flip_data
    }
    return jsonify(response_data)

if __name__ == '__main__':
    app.run()