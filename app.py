import mimetypes
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')
from flask import Flask, send_file, send_from_directory, render_template, request, jsonify
from operations.operations import *
from operations.createDataframe import saveJsonData
import json
from operations.analysis1 import *

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

@app.route('/api/analysis1', methods=['POST'])
def analysis1():
    # Assume 'data' contains the parsed CSV data as a list or dictionary
    # print(type(request))
    # print(request)
    data = request.json

    finalData = Analysis1(data)
    return finalData

@app.route('/api/get_image', methods=['GET'])
def get_image():

    image_path = request.args.get('path')

    return send_file(image_path, mimetype='image/png')

@app.route('/api/get_text', methods=['GET'])
def get_text():

    file_path = request.args.get('path')

    return send_file(file_path, mimetype='text/plain')


if __name__ == '__main__':
    app.run(
        debug=True
    )