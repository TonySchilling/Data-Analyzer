import mimetypes
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')
from flask import Flask, send_file, send_from_directory, render_template, request, jsonify
from operations.operations import *

app = Flask(__name__)

@app.route('/')
def hello():
    return send_file('templates/index.html')

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename, mimetype='application/javascript')

@app.route('/multiply', methods=['POST'])
def multiply():
    data = request.json
    print(data)
    number = int(data['number'])
    # result = number * 2
    result=multiplyNumber(number)
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run()