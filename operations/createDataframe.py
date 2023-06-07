# import pandas as pd
import json

def saveJsonData(data):
    print('DATA!!!!')
    print(data)
    with open('testData.txt', 'w') as f:
        f.write(json.dumps(data))

# def dataframeFromJson(data):
