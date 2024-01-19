from amazon import amazon
from flipkart import flip
from flask import Flask, render_template, request, url_for, jsonify
 
app = Flask(__name__)

@app.route('/', methods=['POST'])
def product():
    input_json = request.get_json(force=True) 
    print(input_json)
 
# main driver function
if __name__ == '__main__':
    app.run()