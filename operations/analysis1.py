import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import json
import os




# from sklearn.ensemble import RandomForestRegressor

def Analysis1(data):


    jsonData = {}
    urls = {}


    with open('testData.txt', 'w') as f:
        f.write(json.dumps(data))

    rawData = data['rawData']
    allColumns = rawData[0]
    df = pd.DataFrame(rawData[1:], columns = rawData[0])

    adjustments = data['adjustments']

    df = removeNanDups(df)

    df = changeDtypes(df, adjustments)
    print(df.dtypes)

    numerical_df = getNumericalDatabase(df)

    statistics_json = getDescriptiveStatistics(df)
    jsonData['descriptive'] = statistics_json

    categoricalSummaries = []
    for c in list(df.select_dtypes(include=['object']).columns):
        catSummary = categoricalSummary(df, c)
        categoricalSummaries.append(catSummary)
    jsonData['categoricalSummaries'] = categoricalSummaries

    saveName = './exports/correlationHeatmap.png'
    create_heatmap(numerical_df, saveName)
    urls['heatMap'] = saveName

    histograms = []
    for c in allColumns:
        try:
            saveName = f'./exports/hist-{c}.png'
            getHistogram(df, c, saveName)
            histograms.append(saveName)
        except:
            print(f"Couldn't run hist for {c}")
    urls['hist'] = histograms

    boxplots = []
    for c in allColumns:
        try:
            saveName = f'./exports/box-{c}.png'
            getBoxPlot(df, c, saveName)
            boxplots.append(saveName)
        except:
            print(f"Couldn't run box for {c}")
    
    urls['box'] = boxplots

    finalData = {'data': jsonData, 'urls': urls}

    finalData = json.dumps(finalData)
    with open('poop.txt', 'w') as f:
        f.write(finalData)

    print(finalData)
    return finalData


def getNumericalDatabase(df):
    numerical_df = df.select_dtypes(include=['number'])
    print(numerical_df)

    return numerical_df

def removeNanDups(df):
    df = df.dropna()
    df = df.drop_duplicates()

    return df

def dropCOlumns(df, adjustments):
    for k in list(adjustments.keys()):
        if adjustments[k]['include'] == False:
            df.drop([k], axis=1, inplace=True)

    return df


def changeDtypes(df, adjustments):
    for k in list(adjustments):
        if adjustments[k]['dtype'] == 'Float':
            df[k] = df[k].astype(float)
        elif adjustments[k]['dtype'] == 'Integer':
            df[k] = df[k].astype(int)
        else:
            df[k] = df[k].astype(str)
    return df

def getDescriptiveStatistics(df):
    # statistics = df.describe()
    # # statistics_json = statistics.to_json()
    # statistics_dict = statistics.to_dict()

    sdic = df.describe().transpose().to_dict()
    data = []
    rows = list(sdic.keys())
    headers = list(sdic[rows[1]].keys())
    data.append([''] + headers)
    for r in rows:
        dataRow = [r]
        for h in headers:
            dataRow.append(sdic[r][h])
        data.append(dataRow)

    return data



def getCorrelationMatrix(df):
    correlation_matrix = df.corr()
    correlation_matrix_json = correlation_matrix.to_json()


def getHistogram(df, column, saveName):
    sns.histplot(data=df, x=column)
    plt.title(f'Histogram {column}')
    plt.savefig(saveName, format='png')
    plt.clf()
    plt.cla()
    # plt.show()

def getBoxPlot(df, column, saveName):
    sns.boxplot(data=df, x=column)
    plt.title(f'Box Plot {column}')
    plt.savefig(saveName, format='png')
    plt.clf()
    plt.cla()
    # plt.show()


def renameColumns(df, updates):
    #updates should be a dict, {'old_column_name1': 'new_column_name1', 'old_column_name2': 'new_column_name2'}
    df.rename(columns=updates, inplace=True)

    return df

def categoricalSummary(df, column):
    categorical_column = 'Species'
    summary = df[categorical_column].value_counts()
    summaryData = {}

    for i in range(len(summary)):
        summaryData[summary.index[i]] = int(summary[i])
    
    return summaryData

def create_heatmap(data, saveName):

    correlation_matrix = data.corr()

    # Create heatmap
    plt.figure(figsize=(10, 8))
    sns.heatmap(correlation_matrix, annot=True, cmap="coolwarm")
    plt.title("Correlation of Numerical Values")
    plt.savefig(saveName, format='png')
    # plt.show()