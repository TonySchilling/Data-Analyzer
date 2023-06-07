// const button = document.getElementById('send-button');

let rawData = null;
let title = null;
// const uploadButton = document.getElementById("uploadButton");
const preview = document.getElementById('data-preview');
const descriptive = document.getElementById('descriptive-overview');
const predictive = document.getElementById('predictive-overview');
const tableContainer = document.getElementById('table-container');

const columns = [];
const finalizeButton = document.getElementById('finalize-btn');
const fileUpload = document.getElementById("csvFileInput");

const previewButton = document.getElementById('preview-btn');
const descriptiveButton = document.getElementById('descriptive-btn');
const predictiveButton = document.getElementById('predictive-btn');

function hideShowSections(hidden1, hidden2, show) {
    hidden1.style.display = "none"
    hidden2.style.display = "none"
    show.style.display = "block"
}
previewButton.addEventListener("click", () => {
    hideShowSections(descriptive, predictive, preview);
})

descriptiveButton.addEventListener("click", () => {
    hideShowSections(predictive, preview, descriptive);
})

predictiveButton.addEventListener("click", () => {
    hideShowSections(preview, descriptive, predictive);
})


finalizeButton.addEventListener("click", () => {
    finalData();

})


// uploadButton.addEventListener("click", function() {
fileUpload.addEventListener("change", function() {
    preview.innerHTML = '';
    const fileInput = document.getElementById("csvFileInput");
    title = fileInput.value.split('\\').pop().replace('.csv', '');
    console.log(title);
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const csvData = e.target.result;
        const jsonData = convertCsvToJson(csvData);

        previewJson(jsonData);

    };

reader.readAsText(file);
});

function convertCsvToJson(csvData) {
    // Convert CSV data to JSON object
    // Here, you can use your preferred method or a library like Papa Parse
  
    // Example using Papa Parse library:
    const parsedData = Papa.parse(csvData);
    const jsonData = parsedData.data;
    rawData = jsonData;
    // console.log(jsonData);
  
    return jsonData;
  }

function sendJsonDataToBackend(jsonData) {
    // Send JSON data to the backend using an HTTP request
    // You can use the fetch API or XMLHttpRequest

    console.log(jsonData);

    // Example using fetch API:
    fetch("/api/analysis1", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from the backend
        console.log(data);

        hideShowSections(predictive, preview, descriptive);

        createTable(data.data.descriptive, tableContainer);

        requestImage2(`/api/get_image?path=${data.urls.heatMap}`,'heatmap-container', 'chart');
        const histos = data.urls.hist;
        const boxes = data.urls.box;

        for (let i = 0; i < histos.length; i++) {
            // requestImage(`/api/get_image?path=${histos[i]}`)
            requestImage2(`/api/get_image?path=${histos[i]}`, 'hist-container', 'chart-small');
        }

        for (let i = 0; i < histos.length; i++) {
            // requestImage(`/api/get_image?path=${histos[i]}`)
            requestImage2(`/api/get_image?path=${histos[i]}`, 'hist-container', 'chart-small');
        }

        for (let i = 0; i < boxes.length; i++) {
            // requestImage(`/api/get_image?path=${histos[i]}`)
            requestImage2(`/api/get_image?path=${boxes[i]}`, 'box-container', 'chart-small');
        }
    })
    .catch(error => {
        // Handle any errors
        console.error(error);
    });
}


function createTable(data, parent) {
    console.log('Creating Table!');
    const table = document.createElement('table');
    table.className = 'table table-striped';
    parent.appendChild(table);
    console.log(table);
    const header = document.createElement('thead');
    table.appendChild(header);
    const firstRow = document.createElement('tr');
    header.appendChild(firstRow);


    for (let i = 0; i <data[0].length; i++) {

        addTableData('th', data[0][i], firstRow, 'col');

    }

    const body = document.createElement('tbody');
    table.appendChild(body);

    for (let i = 1; i <data.length; i++) {
        const newRow = document.createElement('tr');
        body.appendChild(newRow);

        for (let j = 0; j <data[i].length; j++) {
            console.log(data[i][j]);
            if (j === 0) {
                addTableData('th', data[i][j], newRow, 'row');

            } else {
                addTableData('td', data[i][j], newRow, '');
            }
    
        }

    }


}


function addTableData(tag, value, parent, scope) {
    const tableData = document.createElement(tag);
    tableData.textContent = value;
    if (scope === 'col' || scope === 'row') {
        tableData.scope = scope;
    }

    parent.appendChild(tableData);

    // tableData.addEventListener("mouseover", () => {
    //     tableData.classList.add('hightlight');

    // });

    // tableData.addEventListener('mouseout', () => {
    //     td.classList.remove('highlight');
    //   });

}


function requestImage(url) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
        const imageUrl = URL.createObjectURL(blob);
        const imageElement = document.createElement('img');
        imageElement.src = url;
        descriptive.appendChild(imageElement);
        })
        .catch(error => {
        console.error('Error:', error);
        });
}

function requestImage2(url, targetId, imgClass) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
        const imageUrl = URL.createObjectURL(blob);
        const imageElement = document.createElement('img');
        imageElement.src = url;
        imageElement.className = imgClass;
        const targetElement = document.getElementById(targetId);
        targetElement.appendChild(imageElement);

        imageElement.addEventListener('click', function() {
            const enlargedChart = document.createElement('img');
            enlargedChart.src = imageElement.src;
            enlargedChart.className = 'enlarged-chart';
          
            // const container = document.querySelector(targetId);
            const container = document.getElementById('small-section');
            container.appendChild(enlargedChart);
          
            enlargedChart.addEventListener('click', function() {
              container.removeChild(enlargedChart);
            });
          });


        })
        .catch(error => {
        console.error('Error:', error);
        });

}

function dynamicElement(tag, className, id, parent) {
    const element = document.createElement(tag);
    element.className = className;
    element.id = id;
    parent.appendChild(element);
    return element;
}


function previewJson(jsonData) {
    console.log(jsonData[0]);
    const headers = jsonData[0];

    // const titleLabel = document.createElement('label');
    // titleLabel.for = 'title-input';
    // titleLabel.textContent = 'Title: '
    // preview.appendChild(titleLabel);
    const titleInput = dynamicElement('input', 'form-control', 'title-input', preview);
    titleInput.type="text";
    titleInput.value = title;

    const table = document.createElement('table')
    table.className = 'table table-striped';
    table.id = 'preview-table';
    preview.appendChild(table);

    const tableHead = document.createElement('thead');
    table.appendChild(tableHead);
    const headerRow = document.createElement('tr');
    tableHead.appendChild(headerRow);


    for (let i = 0; i < jsonData[0].length; i++) {
        const row = document.createElement('th');
        row.scope="col";
        row.textContent = jsonData[0][i];
        row.id = jsonData[0][i];
        headerRow.appendChild(row);
        console.log(jsonData[1][i]);
        const card = createAdjustmentCard(jsonData[0][i], preview, i+1, jsonData[1][i]);
        columns.push(jsonData[0][i]);


        row.addEventListener("click", () => {

            for (let i = 0; i <jsonData[0].length; i++) {
                const otherRows = document.getElementById(jsonData[0][i]);
                otherRows.style.color = 'black';

            }
            row.style.color = "#0d00ff"

            const cards = document.querySelectorAll('.card');

            for (let i = 0; i < cards.length; i++) {
            cards[i].style.display = 'none';
            }
            const rect = row.getBoundingClientRect();
            const absoluteLeft = rect.left;
            const colWidth = (rect.right - rect.left);

            const card = document.getElementById(`card-${jsonData[0][i]}`);
            card.style.position = 'absolute';
            card.style.width = `${colWidth}px`;
            // card.style.width = '100px';
            card.style.display = "flex";
            card.style.left = `${absoluteLeft}px`;
            card.style.bottom = `${rect.top-50}px`;
            // card.style.bottom = '20px';
            
        })
    }

    const tableBody = document.createElement('tbody');
    table.appendChild(tableBody);

    for (let i = 1; i < 10; i += 2) {
        const dataRow = document.createElement('tr');
        tableBody.appendChild(dataRow);

        for (let j = 0; j < jsonData[0].length; j++) {
            const dataPoint = document.createElement('td');
            dataPoint.textContent = jsonData[i+1][j];
            dataRow.appendChild(dataPoint);
        }

      }

      const dataRow = document.createElement('tr');
        tableBody.appendChild(dataRow);

        for (let j = 0; j < jsonData[0].length; j++) {
            const dataPoint = document.createElement('td');
            dataPoint.textContent = '...';
            dataRow.appendChild(dataPoint);
        }

}


function createAdjustmentCard(columnName, parent, columnNumber, value) {

    const card = dynamicElement('div', 'card', `card-${columnName}`, parent);
    const body = dynamicElement('div', 'card-body', `card-body-${columnName}`, card);
    const header = dynamicElement('h5', 'card-title', `card-title-${columnName}`, body);
    header.textContent = `Column ${columnNumber}`;
    const form = dynamicElement('div', 'form-group', `card-form-${columnName}`, body);
    const label = document.createElement('label');
    label.for = `columnName-${columnName}`;
    label.textContent='Column Name';
    form.appendChild(label);
    const input1 = dynamicElement('input', 'form-control', `columnName-${columnName}`, form);
    input1.type="text";
    input1.value=columnName;
    const form2 = dynamicElement('div', 'form-group', `card-form2-${columnName}`, body);
    const label2 = document.createElement('label');
    label2.for = `dataType-${columnName}`;
    label2.textContent='Data Type';
    form2.appendChild(label2);
    const col = dynamicElement('div', 'col-sm-6', `col-${columnName}`, form2);
    const dataType = dynamicElement('select', 'form-control', `dataType-${columnName}`, col);
    const dtypes = ['Text', 'Integer', 'Float', 'Date']
    for (let i = 0; i < dtypes.length; i++) {
        const option = document.createElement('option');
        option.value = dtypes[i];
        option.text = dtypes[i];
        dataType.add(option);
        // col.appendChild(option);

    }
    if (isNaN(value) === false) {
        dataType.value = 'Float';
    }
    
    // const checkboxContainer = dynamicElement('div', 'checkbox-container', `checkbox-container-${columnName}`, body);
    const form3 = dynamicElement('div', 'form-group', `card-form3-${columnName}`, body);
    const input3 = dynamicElement('input', 'form-check-input', `checkbox1-${columnName}`, form3);
    input3.type="checkbox";
    input3.checked=true;
    const label3 = document.createElement('label');
    label3.for = `checkbox1-${columnName}`;
    label3.textContent='Include Column';
    form3.appendChild(label3);

    const form4 = dynamicElement('div', 'form-group', `checkbox2-${columnName}`, body);
    const input4 = dynamicElement('input', 'form-check-input', `checkbox2-${columnName}`, form4);
    input4.type="checkbox";
    const label4 = document.createElement('label');
    label4.for = `checkbox2-${columnName}`;
    label4.textContent='Categorical Variable';
    form4.appendChild(label4);

    const form5 = dynamicElement('div', 'form-group', `checkbox3-${columnName}`, body);
    const input5 = dynamicElement('input', 'form-check-input', `checkbox3-${columnName}`, form5);
    input5.type="checkbox";
    const label5 = document.createElement('label');
    label5.for = `checkbox3-${columnName}`;
    label5.textContent='Dependent Variable';
    form5.appendChild(label5);

    card.style.display = "none";

    return card;

}

function getUpdates() {

    const dataAdjustments = {};

    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];

        const columnData = getSingleColumnData(column);
        dataAdjustments[column] = columnData;
    }

    console.log(dataAdjustments);
    return dataAdjustments;

}

function getSingleColumnData(column) {
    const data = {};
    data['title'] = getColumnValue('columnName-', column, 'value');
    data['dtype'] = getColumnValue('dataType-', column, 'value');
    data['include'] = getColumnValue('checkbox1-', column, 'checked');
    data['categorical'] = getColumnValue('checkbox2-', column, 'checked');
    data['dependentVariable'] = getColumnValue('checkbox3-', column, 'checked');
    console.log(data);

    return data;

}

function getColumnValue(idPrefix, column, valueType) {

    const element = document.getElementById(`${idPrefix}${column}`);


    if (valueType === 'value') {
        return element.value;
    } else if (valueType === 'checked') {
        if (element.checked) {
            return true;
        } else {
            return false;
        }
    }


}

function finalData() {
    const finalTitle = document.getElementById('title-input');
    const finalAdjustments = getUpdates();
    const finalData = {
        title: finalTitle.value,
        adjustments: finalAdjustments,
        rawData: rawData
    }

    sendJsonDataToBackend(finalData);
}