import mimetypes
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')
from flask import Flask, send_file, send_from_directory, render_template, request, jsonify
from operations.operations import *
from operations.createDataframe import saveJsonData
import json

app = Flask(__name__)

@app.route('/')
def hello():
    return send_file('templates/index.html')

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename, mimetype='application/javascript')

@app.route('/api/multiply', methods=['POST'])
def multiply():
    data = request.json
    # print(data)
    number = int(data['number'])
    # result = number * 2
    result=multiplyNumber(number)
    return jsonify({'result': result})

@app.route('/api/upload', methods=['POST'])
def upload():
    # Assume 'data' contains the parsed CSV data as a list or dictionary
    # print(type(request))
    # print(request)
    data = request.json
    saveJsonData(data)
    return jsonify({'message': 'File uploaded and data saved'})



if __name__ == '__main__':
    app.run(
        debug=True
    )