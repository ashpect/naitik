from amazon import amazon
from flipkart import flip
from flask import Flask, request, jsonify
import sqlite3
from werkzeug.utils import secure_filename
import os
import string
import random

con = sqlite3.connect("dark.db", check_same_thread=False)
app = Flask(__name__)
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
            pattern = {
                'id': row[0],
                'website_name': row[1],
                'img': row[2],
                'htmlcontent': row[3],
                'tag': row[4]
            }
            result.append(pattern)
        return jsonify(result)
    except Exception as e:
        return str(e)

@app.route("approve",methods=["POST"])
def approval():
    id = request.form.get("id")
    if(request.form["approve"]):
        cur.execute('''SELECT * FROM darkpatterns WHERE id = ?''', (id,))
        row = cur.fetchone()
        if row:
            id, website_name, img, htmlcontent, tag = row
            cur.execute('''INSERT INTO trainingdata (website_name, img, htmlcontent, tag)
                            VALUES (?, ?, ?, ?)''', (website_name, img, htmlcontent, tag))

    cur.execute('''DELETE FROM darkpatterns WHERE id = ?''', (id,))
    con.commit()
    return "Done"
if __name__ == '__main__':
    app.run()