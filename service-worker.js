// Set initial thickness based on selected material
document.addEventListener('DOMContentLoaded', function() {
    setThickness();
    populateRollOptions(); // Ensure options are populated
});

// Winding Diameter Calculator
function setThickness() {
    const thicknessInput = document.getElementById('thickness');
    const material = document.getElementById('material').value;
    const thicknessValues = {
        'BOPP': 0.004,
        'Film': 0.003,
        'Paper': 0.007,
        'Estate': 0.009
    };
    thicknessInput.value = thicknessValues[material] || '';
}

function calculateWindingDiameter() {
    const thickness = parseFloat(document.getElementById('thickness').value);
    const core = parseFloat(document.getElementById('core').value);
    const labels = parseFloat(document.getElementById('labels').value);
    const length = parseFloat(document.getElementById('length').value);
    if (isNaN(thickness) || isNaN(core) || isNaN(labels) || isNaN(length)) {
        document.getElementById('winding-output').textContent = 'Please enter valid values for all parameters.';
    } else {
        const rollDiameter = Math.sqrt(core * core + (4 * thickness * length * labels / Math.PI));
        document.getElementById('winding-output').textContent = `Size of Roll: ${rollDiameter.toFixed(2)} inches`;
    }
}

// Generate options for roll1 and roll2 selects
function populateRollOptions() {
    const roll1Select = document.getElementById('roll1');
    const roll2Select = document.getElementById('roll2');
    for (let i = 5; i <= 14; i++) {
        const option1 = document.createElement('option');
        option1.value = i;
        option1.textContent = i;
        roll1Select.appendChild(option1);
        const option2 = document.createElement('option');
        option2.value = i;
        option2.textContent = i;
        roll2Select.appendChild(option2);
    }
}

// Splicing Diameter Calculator
// Splicing Diameter Calculator
let combinedDiameters = {}; // Ensure this is defined at the top

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("defaultOpen").click();
    loadExcelData(); // Load the Excel data when the page is loaded
});

// Function to calculate splicing diameter
function calculateSplicingDiameter() {
    const roll1Value = document.getElementById('roll1').value;
    const roll2Value = document.getElementById('roll2').value;

    // Check if the data for the selected rolls is available
    if (combinedDiameters[roll1Value] && combinedDiameters[roll1Value][roll2Value] !== undefined) {
        const combinedDiameter = combinedDiameters[roll1Value][roll2Value];
        document.getElementById('splicing-output').textContent = `Combined Diameter: ${combinedDiameter.toFixed(2)} inches`;
    } else {
        document.getElementById('splicing-output').textContent = 'No data available for the selected combination.';
    }
}

// Function to load Excel data
function loadExcelData() {
    fetch('Splicing Diameters - Copy.xlsx') // Ensure the correct path to the file
        .then(response => response.arrayBuffer())
        .then(data => parseExcelData(data))
        .catch(error => console.error('Error loading Excel data:', error));
}

// Helper function to convert arrayBuffer to binary string
function arrayBufferToString(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return binary;
}

// Function to parse Excel data
function parseExcelData(data) {
    const binaryString = arrayBufferToString(data);
    const workbook = XLSX.read(binaryString, { type: 'binary' });
    const sheetName = workbook.SheetNames[1]; // Make sure this matches your Excel file
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return; // Skip header row
        const roll1 = row[0].toString();
        for (let colIndex = 1; colIndex < row.length; colIndex++) {
            const roll2 = rows[0][colIndex];
            const combinedDiameter = parseFloat(row[colIndex]);
            if (!combinedDiameters[roll1]) combinedDiameters[roll1] = {};
            combinedDiameters[roll1][roll2] = combinedDiameter;
        }
    });
}


// Time for Print Calculator
function calculateTimeForPrint() {
    const copies = parseFloat(document.getElementById('copies').value);
    const color = parseFloat(document.getElementById('color').value);
    if (isNaN(copies) || isNaN(color)) {
        document.getElementById('print-output').textContent = 'Please enter valid values for copies and color.';
    } else {
        const time = (copies * color) / 60;
        document.getElementById('print-output').textContent = `Time: ${time.toFixed(2)} minutes`;
    }
}
