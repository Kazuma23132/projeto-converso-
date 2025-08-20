// filepath: c:\Users\adriano.henriques\Desktop\projeto ajudar meu amor\script.js

let history = [];

// Function to convert centimeters to millimeters
function cmToMm(cm) {
    return cm * 10;
}

// Function to convert centimeters to inches
function cmToInches(cm) {
    return cm / 2.54;
}

// Function to display results
function displayResults(cm) {
    const mm = cmToMm(cm);
    const inches = cmToInches(cm);
    const resultDiv = document.getElementById('results');
    resultDiv.innerHTML = `
        <p>${cm} cm is equal to ${mm} mm</p>
        <p>${cm} cm is equal to ${inches.toFixed(2)} inches</p>
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
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = history.map(item => `
        <p>${item.cm} cm = ${item.mm} mm, ${item.inches} inches (on ${item.date})</p>
    `).join('');
}

// Event listeners for conversion buttons
document.getElementById('convertButton').addEventListener('click', () => {
    const cmInput = parseFloat(document.getElementById('cmInput').value);
    if (!isNaN(cmInput)) {
        displayResults(cmInput);
    } else {
        alert('Please enter a valid number');
    }
});