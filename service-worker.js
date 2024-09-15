if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(error => {
            console.log('ServiceWorker registration failed: ', error);
        });
}

// Get the dropdown menus and output div
const roll1Select = document.getElementById('roll1');
const roll2Select = document.getElementById('roll2');
const outputDiv = document.getElementById('splicing-output');

// Create an object to store the combined diameter values
let combinedDiameters = {};

// Function to convert arrayBuffer to binary string
function arrayBufferToString(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return binary;
}

// Function to parse Excel data
function parseExcelData(data) {
    const binaryString = arrayBufferToString(data);
    const workbook = XLSX.read(binaryString, { type: 'binary' });
    const sheetName = workbook.SheetNames[1];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return; // Skip the header row
        const roll1 = row[0];
        row.forEach((cell, colIndex) => {
            if (colIndex === 0 || cell === undefined) return; // Skip the first column and undefined cells
            const roll2 = rows[0][colIndex]; // Get the roll2 value from the header row
            const combinedDiameter = cell;

            if (!combinedDiameters[roll1]) {
                combinedDiameters[roll1] = {};
            }
            combinedDiameters[roll1][roll2] = combinedDiameter;
        });
    });
}

// Load the Excel file and parse it
fetch('Splicing Diameters - Copy.xlsx')
    .then(response => response.arrayBuffer())
    .then(data => {
        parseExcelData(data);
    })
    .catch(error => console.error('Error loading Excel data:', error));

// Event listener for the submit button
document.getElementById('submit-button').addEventListener('click', () => {
    const roll1Value = parseInt(roll1Select.value, 10);
    const roll2Value = parseInt(roll2Select.value, 10);

    if (combinedDiameters[roll1Value] && combinedDiameters[roll1Value][roll2Value] !== undefined) {
        const combinedDiameter = combinedDiameters[roll1Value][roll2Value];
        outputDiv.textContent = `Combined diameter: ${combinedDiameter.toFixed(2)}`;
    } else {
        outputDiv.textContent = 'No data available for the selected combination.';
    }
});

// Additional JavaScript for the Winding Diameter Calculator
document.getElementById('material').addEventListener('change', function() {
    const thicknessInput = document.getElementById('thickness');
    switch (this.value) {
        case 'Film':
            thicknessInput.value = 0.003;
            break;
        case 'BOPP':
            thicknessInput.value = 0.004;
            break;
        case 'Paper':
            thicknessInput.value = 0.005;
            break;
        case 'Estate':
            thicknessInput.value = 0.009;
            break;
        default:
            thicknessInput.value = '';
            break;
    }
});

document.getElementById('calculate-button').addEventListener('click', function() {
    const material = document.getElementById('material').value;
    const thickness = parseFloat(document.getElementById('thickness').value);
    const core = parseFloat(document.getElementById('core').value);
    const labels = parseFloat(document.getElementById('labels').value);
    const length = parseFloat(document.getElementById('length').value);

    if (isNaN(thickness) || isNaN(core) || isNaN(labels) || isNaN(length)) {
        document.getElementById('winding-output').textContent = 'Please enter valid values for all parameters.';
    } else {
        const rollDiameter = Math.sqrt((core ** 2) + (4 * (thickness * length * labels) / Math.PI));
        document.getElementById('winding-output').textContent = `Size of Roll: ${rollDiameter.toFixed(2)}`;
    }
});

// Function to calculate Time for Print
function calculateTimeForPrint() {
    const copies = parseFloat(document.getElementById('copies').value);
    const color = parseFloat(document.getElementById('color').value);

    if (!isNaN(copies) && !isNaN(color)) {
        const length = (copies * color) / 60;
        document.getElementById('print-output').textContent = `Time: ${length.toFixed(2)} minutes`;
    } else {
        document.getElementById('print-output').textContent = 'Please enter valid values for copies and color.';
    }
}

// Fetch and parse TimeForPrint.xlsx
fetch('TimeForPrint.xlsx')
    .then(response => response.arrayBuffer())
    .then(data => {
        // You can parse the data here if needed or use it as it is
    })
    .catch(error => console.error('Error loading TimeForPrint data:', error));

