const descriptive = document.getElementById('descriptive-overview');
const tableContainer = document.getElementById('table-container');



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

        })
        .catch(error => {
        console.error('Error:', error);
        });

}

function requestTextFile(url) {
    fetch(url)
        .then(response => response.text())
        .then(text => {
            // console.log(text);
            const data = JSON.parse(text);

            console.log(data.data.descriptive);
            createTable(data.data.descriptive, tableContainer);


        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const textFileUrl = '/api/get_text?path=test.txt';
requestTextFile(textFileUrl);



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

requestImage2('/api/get_image?path=exports/correlationHeatmap.png', 'heatmap-container', 'chart');


requestImage2('/api/get_image?path=exports/hist-Height.png', 'hist-container', 'chart-small');
requestImage2('/api/get_image?path=exports/hist-Length1.png', 'hist-container', 'chart-small');
requestImage2('/api/get_image?path=exports/hist-Length2.png', 'hist-container', 'chart-small');
requestImage2('/api/get_image?path=exports/hist-Species.png', 'hist-container', 'chart-small');

requestImage2('/api/get_image?path=exports/box-Height.png', 'box-container', 'chart-small');
requestImage2('/api/get_image?path=exports/box-Width.png', 'box-container', 'chart-small');
requestImage2('/api/get_image?path=exports/box-Weight.png', 'box-container', 'chart-small');

