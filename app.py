from flask import Flask, render_template, request, jsonify, Response
from pymongo import MongoClient
import gridfs
import uuid
import mimetypes

app = Flask(__name__)

client = MongoClient("mongodb+srv://swathim:61GBHPDriOeLqhYL@cluster0.obtwbz8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
# client = MongoClient("mongodb://localhost:27017/")

db = client["flask_auth_db"]

fs = gridfs.GridFS(db)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/save", methods=["POST"])
def save():

    sheets=request.json

    for sheet in sheets:

        db.sheets.update_one(
            {"sheet_id":sheet["id"]},
            {"$set":{
                "sheet_id":sheet["id"],
                "parent":sheet["parent"],
                "title":sheet["title"],
                "content":sheet["content"]
            }},
            upsert=True
        )

    return jsonify({"status":"saved"})


@app.route("/load")
def load():

    sheets=list(db.sheets.find())

    result=[]

    for s in sheets:

        result.append({
            "id":s["sheet_id"],
            "parent":s.get("parent","root"),
            "title":s["title"],
            "content":s["content"]
        })

    return jsonify(result)


@app.route("/delete/<sheet_id>",methods=["DELETE"])
def delete_sheet(sheet_id):

    db.sheets.delete_one({"sheet_id":sheet_id})

    return jsonify({"status":"deleted"})


@app.route("/upload_file",methods=["POST"])
def upload_file():

    file=request.files["file"]

    file_id=str(uuid.uuid4())

    fs.put(file.read(),filename=file.filename,file_id=file_id)

    return jsonify({"id":file_id})


@app.route("/file/<file_id>")
def get_file(file_id):

    file=db.fs.files.find_one({"file_id":file_id})

    if not file:
        return "File not found",404

    data=fs.get(file["_id"]).read()

    mime,_=mimetypes.guess_type(file["filename"])

    if not mime:
        mime="application/octet-stream"

    return Response(data,mimetype=mime)


if __name__=="__main__":
    app.run(debug=True)