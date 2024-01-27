from amazon import amazon
from flipkart import flip
from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
import os
import string
import random
import requests
import base64
import datetime


con = sqlite3.connect("dark.db", check_same_thread=False)
app = Flask(__name__)
CORS(app)
cur = con.cursor()
try: 
    cur.execute('''CREATE TABLE darkpatterns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        website_name VARCHAR(200),
        img VARCHAR(200),
        htmlcontent varchar(200),
        tag VARCHAR(75)
    );''')
except:
     print("table exists, continuing")

try: 
    cur.execute('''CREATE TABLE trainingdata (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        website_name VARCHAR(200),
        img VARCHAR(200),
        htmlcontent varchar(200),
        tag VARCHAR(75)
    );''')
except:
     print("table exists, continuing")

try: 
    cur.execute('''CREATE TABLE model (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        website_name VARCHAR(200),
        Date DATE,
        Forced_Action INT DEFAULT 0,
        Misdirection INT DEFAULT 0,
        Not_Dark_Pattern INT DEFAULT 0,
        Obstruction INT DEFAULT 0,
        Scarcity INT DEFAULT 0,
        Sneaking INT DEFAULT 0,
        Social_Proof INT DEFAULT 0,
        Urgency INT DEFAULT 0
    );''')
except:
     print("table exists, continuing")

try: 
    os.mkdir(os.path.join(os.getcwd,"images"))
except:
    print("images folder already exists, continuing")

@app.route('/search', methods=['POST'])
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

@app.route("/report", methods=["POST"])
def reportpattern():
    if 'img' not in request.files:
            return 'there is no file1 in form!'
    file1 = request.files['img']
    path = os.path.join("./images", ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))+".jpg")
    file1.save(path)
    website = request.form["website"]
    tag = request.form["tag"]
    htmlcontent = request.form["content"]
    cur.execute('''INSERT INTO darkpatterns (website_name, img, htmlcontent, tag)
                   VALUES (?, ?, ?,?)''', (website, path, htmlcontent, tag))
    con.commit()
    return "Thank you for reporting the dark pattern!"

@app.route("/report", methods=["GET"])
def getpattern():
    try:
        cur.execute('''SELECT * FROM darkpatterns''')
        rows = cur.fetchall()
        result = []
        for row in rows:
            with open(row[2], "rb") as image_file:
                encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
            pattern = {
                'id': row[0],
                'website_name': row[1],
                'img': encoded_image,
                'htmlcontent': row[3],
                'tag': row[4]
            }
            result.append(pattern)
        return jsonify(result)
    except Exception as e:
        return str(e)

@app.route("/approve",methods=["POST"])
def approval():
    id = request.form.get("id")
    cur.execute('''DELETE FROM darkpatterns WHERE id = ?''', (id,))
    website_name, img, htmlcontent, tag = request.form.get("website"),request.form.get("img"),request.form.get("htmlcontent"),request.form.get("tag")
    cur.execute('''INSERT INTO trainingdata (website_name, img, htmlcontent, tag)
                        VALUES (?, ?, ?, ?)''', (website_name, img, htmlcontent, tag))

    con.commit()
    return "Done"

@app.route("/test",methods=["GET"])
def servercheck():
    print("server is running")
    return jsonify({"message": "Server is running"})



pattern_labels = ['Forced Action', 'Misdirection', 'Not Dark Pattern', 'Obstruction',
                  'Scarcity', 'Sneaking', 'Social Proof', 'Urgency']
label_mapping = {f'LABEL_{index}': label for index, label in enumerate(pattern_labels)}

def call_hugging_face_api(input_string):
    # Single Class model api
    # api_url = 'https://api-inference.huggingface.co/models/h4shk4t/darkpatternLLM'

    # Multi Class model api
    api_url = 'https://api-inference.huggingface.co/models/h4shk4t/darkpatternLLM-multiclass'
    access_token = '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'

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {access_token}'
    }

    input_data = {
        'inputs': input_string
    }

    response = requests.post(api_url, headers=headers, json=input_data)
    if not response.ok:
        raise Exception(f'API request failed with status: {response.status_code}')

    return response.json()


def handleapi_response(api_response):
    first_element = api_response[0]
    first_dictionary = first_element[0]
    label = first_dictionary['label']
    score = first_dictionary['score']

    if (label_mapping[label] == "Not Dark Pattern"):
        return "NODP"
    else:
        return label_mapping[label]


@app.route("/checkdarkpattern", methods=["POST"])
def checkdarkpattern():
    try:

        input_json = request.get_json()
        result_list = {
        }

        for key, value in input_json.items():
            api_response = [[{'label': 'LABEL_7', 'score': 0.9925353527069092}, {'label': 'LABEL_3', 'score': 0.0028718383982777596}, {'label': 'LABEL_4', 'score': 0.0011883211554959416}, {'label': 'LABEL_0', 'score': 0.0010276654502376914}, {'label': 'LABEL_5', 'score': 0.0007491591386497021}, {'label': 'LABEL_1', 'score': 0.0006587384850718081}, {'label': 'LABEL_6', 'score': 0.0005630258820019662}, {'label': 'LABEL_2', 'score': 0.0004058541962876916}]]
            check = handleapi_response(api_response)
            if check != "NODP":
                result_list[key] = check

        return jsonify(result_list)

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)})
    
@app.route("/perform", methods=["POST"])
def perform():
    website_name =request.form.get("URL")
    patterns = request.form.get("dark")
    x = datetime.datetime.now()
    existing_row = con.execute("SELECT * FROM model WHERE website_name = ? AND Date = ?", (website_name, x)).fetchone()
    if(existing_row is None):    
        placeholders = ', '.join(['?'] * (len(patterns) + 3))  # +3 for website_name, count, Date
        columns = ', '.join(['website_name', 'Date'] + list(patterns.keys()))
        values = [website_name, x] + [patterns.get(label, 0) for label in patterns.keys()]
        con.execute(f"INSERT INTO model ({columns}) VALUES ({placeholders})", values)
        five_days_ago = datetime.datetime.now() - datetime.timedelta(days=5)
        con.execute("DELETE FROM model WHERE Date < ?", (five_days_ago.strftime('%Y-%m-%d %H:%M:%S'),))
        con.commit()

    return None


if __name__ == '__main__':
    app.run()