from amazon import amazon
from flipkart import flip
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import sqlite3
from flask_cors import CORS
import os
import string
import random
import requests
import base64
import datetime
import json
import time
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from urllib.parse import urlparse

# Download the VADER lexicon if you haven't already
nltk.download('vader_lexicon')

# Initialize the sentiment analyzer
sid = SentimentIntensityAnalyzer()

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


try: 
    cur.execute('''CREATE TABLE price (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        website_name VARCHAR(200),
        Date DATE,
        Price int,
    );''')
except:
     print("table exists, continuing")


@app.route('/search', methods=['POST'])
def postproduct():
    input_json = request.get_json(force=True) 
    url = input_json["url"]
    parsed_url = urlparse(url)
    path = parsed_url.path
    path_parts = path.split('/')
    path_parts = list(filter(None, path_parts))
    if len(path_parts) >= 1:
        prod = path_parts[0]
        print(prod)
    ama_data = amazon(prod)
    flip_data = flip(prod)
    response_data = {
        "amazon": ama_data,
        "flipkart": flip_data
    }
    return jsonify(response_data)

@app.route('/search', methods=['GET'])
def getproduct():
    cur.execute('''SELECT * FROM price where website_name="amazon"''')
    rows = cur.fetchall()
    result = []
    for row in rows:
        price = {
            'id': row[0],
            'date': row[2],
            'Price': row[3]
        }
        result.append(price)
    res={"amazon":result}
    cur.execute('''SELECT * FROM price where website_name="flipkart"''')
    rows = cur.fetchall()
    result = []
    for row in rows:
        price = {
            'id': row[0],
            'date': row[2],
            'Price': row[3]
        }
        result.append(price)
    res["flipkart"]=result
    return jsonify(res)


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


# Hosted on azure but very very slow latency rate
def call_hosted_llm(input_string):
    # api_url = 'http://20.204.86.227:80/predict'
    api_url = 'http://127.0.0.1:8000/predict'
    headers = {
        'Content-Type': 'application/json'
    }
    input_data = {
        'text': input_string
    }
    response = requests.post(api_url, headers=headers, json=input_data)
    if not response.ok:
        raise Exception(f'API request failed with status: {response.status_code}')

    return response.json()

def call_hugging_face_api(input_string):
    # Single Class model api
    # api_url = 'https://api-inference.huggingface.co/models/h4shk4t/darkpatternLLM'

    # Multi Class model api
    api_url = 'https://api-inference.huggingface.co/models/h4shk4t/darkpatternLLM-multiclass'
    access_token = os.environ.get('ACCESS_TOKEN_BASIC')
    # take the token from env file

    # api_url = 'https://xolortql4954et50.us-east-1.aws.endpoints.huggingface.cloud'
    # access_token = os.environ.get('ACCESS_TOKEN')

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {access_token}'
    }

    input_data = {
        "inputs": input_string,
    }

    print(input_data)

    response = requests.post(api_url, headers=headers, json=input_data)
    if not response.ok:
        print(response.text)
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

def handleapi_response_end(api_response):
    label = api_response[0]['label']
    score = api_response[0]['score']
    if (label_mapping[label] == "Not Dark Pattern"):
        return "NODP"
    else:
        return label_mapping[label]

#### ---developement----
def write_dictionary_to_file(dictionary, file_path):
    try:
        with open(file_path, 'w') as file:
            json.dump(dictionary, file, indent=4)
        print(f"Dictionary successfully written to {file_path}")
    except Exception as e:
        print(f"Error writing dictionary to file: {e}")

@app.route("/checkdarkpattern", methods=["POST"])
def checkdarkpattern():
    try:

        input_json = request.get_json()
        # print(input_json['data'])
        #write input_json['data'] to disk
        
        input_json['data'] = cleanup(input_json['data'])
        write_dictionary_to_file(input_json['data'],"/Users/ashishkumarsingh/Desktop/dark/naitik/scrapers/naitikdata.txt")

        result_list = {
        }

        #for website : https://electricfireplacesdepot.com/collections/electric-fireboxe-inserts/products/dimplex-revillusion-36-inch-built-in-electric-fireplace-firebox-heater-rbf36#
        input_json['data'] = {
            "root-1-1-1-3-1-2-0-0-3-2-6-3-2-1": "LIMITED TIME>> Best Deals of The Year ",
            "root-1-1-1-3-1-2-0-0-3-2-6-3-3": "HURRY>> Offer Ends Jan 30th ",
            "root-1-1-1-3-1-2-0-0-3-2-6-3-4-0": " EASY RETURNS: **30 Days Money Back Guaranteed**",
            "root-1-1-1-3-1-2-0-0-3-2-6-3-4-1": " FREE SHIPPING: **All Continental USA**",
            "root-1-1-1-3-1-2-0-0-3-2-6-3-4-3": " QUICK FINANCING APPLICATION: 0% APR available*",
            "root-1-1-1-3-1-2-0-0-3-2-6-3-4-4": " TRADE & VOLUME DISCOUNTS: ** Call or Chat for Details**",
            "root-1-1-1-3-1-2-0-0-3-2-6-3-4-2": " GUARANTEE: **We will BEAT OR MATCH any Price on This Unit!**",
            "root-1-1-1-3-1-2-0-0-3-2-6-4": "82 Viewing This Product",
        }
        
        for key, value in input_json["data"].items():
            print(value)
            # api_response = call_hosted_llm(value)
            api_response = call_hugging_face_api(value)
            # Testing purposes to not overload huggingface
            # api_response = [[{'label': 'LABEL_1', 'score': 0.9925353527069092}, {'label': 'LABEL_3', 'score': 0.0028718383982777596}, {'label': 'LABEL_4', 'score': 0.0011883211554959416}, {'label': 'LABEL_0', 'score': 0.0010276654502376914}, {'label': 'LABEL_5', 'score': 0.0007491591386497021}, {'label': 'LABEL_7', 'score': 0.0006587384850718081}, {'label': 'LABEL_6', 'score': 0.0005630258820019662}, {'label': 'LABEL_2', 'score': 0.0004058541962876916}]]
            print(api_response)
            # check = handleapi_response(api_response)
            check = handleapi_response_end(api_response)
            print(check)
            if check != "NODP":
                result_list[key] = check

            # Test response
            # test_response_list = {
            #     "root-1-1-1-3-1-2-0-0-3-2-6-3-2": "Urgency",
            #     "root-1-1-1-3-1-2-0-0-3-2-6-3-3": "Urgency",
            #     "root-1-1-1-3-1-2-0-0-3-2-6-3-3-0-0-0": "Urgency",
            #     "root-1-1-1-3-1-2-0-0-3-2-6-3-4": "Obstruction",
            #     "root-1-1-1-3-1-2-0-0-3-2-6-3-4-0": "Obstruction",
            #     "root-1-1-1-3-1-2-0-0-3-2-6-3-4-3": "Obstruction",
            #     "root-1-1-1-3-1-2-0-0-3-2-6-3-4-4": "Obstruction",
            # } 
            print("-------------next--------------")
        populateDbWithResult(result_list,input_json["website_url"])
        write_dictionary_to_file(result_list,"/Users/ashishkumarsingh/Desktop/dark/naitik/scrapers/naitikfinal.txt")
        print(result_list)

        return jsonify(result_list)

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)})

def cleanup(input_dict):
    # Only allowes values starting with words, letters or spaces and if it contains '{'
    filtered_dict = {}
    for key, value in input_dict.items():
        if (value == " ") or ('{' in value) or len(value) >156:
            continue
        elif value and (value[0].isalnum() or value[0].isalpha() or value[0] in {' '}):
            filtered_dict[key] = value
    filtered_dict = {key: value for key, value in filtered_dict.items() if '{' not in str(value)[:30]}
    
    filtered_dict = cleanusingtries(filtered_dict)

    return filtered_dict

def cleanusingtries(A):
    for a in A : A[a] = A[a].strip()
    L = sorted([ a for a in A ])
    root = {}

    B = {}

    for l in L :
        V = l.split('-')
        pre = -1
        cur = root
        for i in range ( 1, len (V) ):
            v = int(V[i])
            if v in cur :
                if cur[v][1] == A[l] : break
                pre = cur ; cur = cur[v][0] ; continue
            else :
                cur[v] = [ {} , "INVALID" ]
                pre = cur ; cur = cur[v][0] ; continue
        else :
            pre[int(V[-1])][1] = A[l]
            B[l] = A[l]

    return B

def populateDbWithResult(result_list,website_url):

    pattern_result = [0] * len(pattern_labels)

    for value in result_list.values():
        if value in pattern_labels:
            pattern_result[pattern_labels.index(value)] += 1

    occurance_list = [{label: count} for label, count in zip(pattern_labels, pattern_result) if count != 0]

    website_data = [
    {"website_url": website_url}
    ]

    website_data.append(occurance_list)
    perform(website_data)

def perform(request_data):
    website_name =request_data[0]["website_url"]
    patterns = request_data[1][0]
    x = datetime.datetime.now().strftime('%Y-%m-%d')
    existing_row = con.execute("SELECT * FROM model WHERE website_name = ? AND Date = ?", (website_name, x)).fetchone()
    if(existing_row is None):    
        placeholders = ', '.join(['?'] * (len(patterns) + 2)) 
        columns = ', '.join(['website_name', 'Date'] + list(patterns.keys()))
        try:
            columns[columns.index("Forced Action")]="forced_action"
        except:
            pass
        try:
            columns[columns.index("Social Proof")]="social_proof"
        except:
            pass
        values = [website_name, x] + [patterns[label] for label in patterns.keys()]
        con.execute(f"INSERT INTO model ({columns}) VALUES ({placeholders})", values)
        five_days_ago = datetime.datetime.now() - datetime.timedelta(days=5)
        con.execute("DELETE FROM model WHERE Date < ?", (five_days_ago.strftime('%Y-%m-%d %H:%M:%S'),))
        con.commit()

    return None
@app.route("/monitor", methods=["GET"])
def monitor():
    x = datetime.datetime.now().strftime('%Y-%m-%d')
    rows = cur.execute("SELECT * FROM model WHERE Date = ?", (x,)).fetchall()
    result = []

    for row in rows:
        pattern = {
            'id': row[0],
            'website_name': row[1],
            'forced_action': row[3],
            'misdirection': row[4],
            'not_dark_pattern': row[5],
            'obstruction': row[6],
            'scarcity': row[7],
            'sneaking': row[8],
            'social_proof': row[9],
            'urgency': row[10],
        }
        result.append(pattern)

    return jsonify(result)

@app.route("/monitor",methods=["POST"])
def monitor2():
    json_id = request.get_json()["website_name"]
    cur.execute("SELECT * FROM model WHERE website_name = ?", (json_id,))    
    rows = cur.fetchall()
    result=[]
    for row in rows:
        pattern = {
            'id': row[0],
            'date': row[2],
            'forced_action': row[3],
            'misdirection': row[4],
            'not_dark_pattern': row[5],
            'obstruction': row[6],
            'scarcity': row[7],
            'sneaking': row[8],
            'social_proof': row[9],
            'urgency': row[10],
        }
        result.append(pattern)
    return jsonify(result)

@app.route('/getsentiment', methods=['POST'])
def sentiment():
    input_json = request.get_json(force=True) 
    text = input_json["review"]
    accountURL = input_json["accountURL"]
    scores = sid.polarity_scores(text)
    # Print sentiment scores
    if (scores['compound'] >= 0.80):
        scores['sentiment'] = 'Positive'
        # reviews = getMoreReviews(accountURL)
        example_reviews = ["I absolutely love my new smartphone! The camera quality is outstanding, capturing every moment with stunning clarity. The battery life lasts all day, even with heavy use, and the sleek design fits perfectly in my hand. The user interface is intuitive and responsive, making it a joy to use. Overall, I couldn't be happier with my purchase!","This fitness tracker has transformed my workouts! It accurately tracks my steps, heart rate, and calories burned, providing valuable insights into my daily activity levels. The sleek design is comfortable to wear all day, and the battery life lasts for days on end. The accompanying app is easy to navigate and offers personalized coaching tips to help me reach my fitness goals. I highly recommend this tracker to anyone looking to take their fitness journey to the next level!","I recently purchased this cookware set, and it has exceeded my expectations! The pots and pans heat up quickly and distribute heat evenly, resulting in perfectly cooked meals every time. The non-stick coating makes cleanup a breeze, and the durable construction ensures that these pans will last for years to come. Plus, the variety of sizes included in the set makes it versatile enough for any cooking task. I'm thrilled with my purchase and can't wait to try out more recipes!","I'm blown away by the performance of these wireless earbuds! The sound quality is exceptional, with crisp highs and deep bass that make my favorite songs come to life. The earbuds fit snugly in my ears and stay put during even the most intense workouts. The battery life is impressive, lasting for hours on a single charge, and the charging case is compact and convenient for on-the-go use. I highly recommend these earbuds to anyone in the market for a new pair!"]
        reviews = example_reviews
        results = {}
        for review in reviews:
            results[review] = sid.polarity_scores(review)['compound']
        average = sum(results.values())/len(results)
        if average > 0.9:
            return jsonify({"average is": average, "conclusion": "likely that it is a fake review"})
        return jsonify({"average is: ": average, "conclusion": "unlikely that it is a fake review"})
    else:
        return jsonify({"Single review score": scores['compound']})

def getMoreReviews(url):
    # Get more reviews from the website
    pass

if __name__ == '__main__':
    app.run()
