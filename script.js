let history = [];
let currentLanguage = 'en'; // Default language

// Load language strings from JSON files
async function loadLanguage() {
    const response = await fetch(`lang/${currentLanguage}.json`);
    return response.json();
}

// Function to convert centimeters to millimeters
function cmToMm(cm) {
    return cm * 10;
}

// Function to convert centimeters to inches
function cmToInches(cm) {
    return cm / 2.54;
}

// Function to display results
async function displayResults(cm) {
    const mm = cmToMm(cm);
    const inches = cmToInches(cm);
    const langStrings = await loadLanguage();
    
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <p>${cm} ${langStrings.cm} ${langStrings.isEqualTo} ${mm} ${langStrings.mm}</p>
        <p>${cm} ${langStrings.cm} ${langStrings.isEqualTo} ${inches.toFixed(2)} ${langStrings.inches}</p>
    `;
    addToHistory(cm, mm, inches);
}

// Function to add calculation to history
function addToHistory(cm, mm, inches) {
    const conversion = {
        cm: cm,
        mm: mm,
        inches: inches.toFixed(2),
        date: new Date().toLocaleString()
    };
    history.push(conversion);
    updateHistoryDisplay();
}

// Function to update history display
function updateHistoryDisplay() {
    const historyDiv = document.getElementById('historyList');
    const langStrings = loadLanguage();
    historyDiv.innerHTML = history.map(item => `
        <li>${item.cm} ${langStrings.cm} = ${item.mm} ${langStrings.mm}, ${item.inches} ${langStrings.inches} (${langStrings.on} ${item.date})</li>
    `).join('');
}

// Event listeners for conversion buttons
document.getElementById('toMillimeters').addEventListener('click', () => {
    const cmInput = parseFloat(document.getElementById('cmInput').value);
    if (!isNaN(cmInput)) {
        displayResults(cmInput);
    } else {
        alert('Please enter a valid number');
    }
});

document.getElementById('toInches').addEventListener('click', () => {
    const cmInput = parseFloat(document.getElementById('cmInput').value);
    if (!isNaN(cmInput)) {
        displayResults(cmInput);
    } else {
        alert('Please enter a valid number');
    }
});

// Language selection
document.getElementById('languageSelect').addEventListener('change', (event) => {
    currentLanguage = event.target.value;
    updateHistoryDisplay(); // Update history display to reflect the selected language
});

// Initial load of language strings
loadLanguage();