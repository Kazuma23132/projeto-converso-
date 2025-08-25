// Universal Unit Converter - Pure JS

let history = [];
let currentLanguage = 'en';
let langStrings = {
    title: "Universal Unit Converter",
    inputLabel: "Enter value:",
    conversionResults: "Result:",
    calculationHistory: "History:",
    invalidInput: "Please enter a valid number.",
    conversionMessage: "{value} {from} = {result} {to} ({date})"
};

// Supported units and their conversion to centimeters
const unitToCm = {
    mm: v => v / 10,
    cm: v => v,
    m: v => v * 100,
    km: v => v * 100000,
    in: v => v * 2.54,
    ft: v => v * 30.48,
    yd: v => v * 91.44,
    mi: v => v * 160934.4
};

// Supported units and their conversion from centimeters
const cmToUnit = {
    mm: v => v * 10,
    cm: v => v,
    m: v => v / 100,
    km: v => v / 100000,
    in: v => v / 2.54,
    ft: v => v / 30.48,
    yd: v => v / 91.44,
    mi: v => v / 160934.4
};

// Unit names for display
const unitNames = {
    mm: "Millimeters",
    cm: "Centimeters",
    m: "Meters",
    km: "Kilometers",
    in: "Inches",
    ft: "Feet",
    yd: "Yards",
    mi: "Miles"
};

// Load language strings (optional, fallback to English)
async function loadLanguage() {
    try {
        const response = await fetch(`lang/${currentLanguage}.json`);
        langStrings = await response.json();
    } catch {
        // fallback to default
    }
    updateTexts();
    updateHistoryDisplay();
}

// Update all text elements
function updateTexts() {
    document.getElementById('title').textContent = langStrings.title;
    document.getElementById('inputLabel').textContent = langStrings.inputLabel;
    document.getElementById('resultTitle').textContent = langStrings.conversionResults;
    document.getElementById('historyTitle').textContent = langStrings.calculationHistory;
    document.querySelector('label[for="languageSelect"]').textContent = currentLanguage === 'en' ? "Select Language:" : "Selecione o idioma:";
}

// Main conversion function
function convertUnits(value, from, to) {
    if (!(from in unitToCm) || !(to in cmToUnit)) return null;
    const cmValue = unitToCm[from](value);
    const result = cmToUnit[to](cmValue);
    return parseFloat(result.toFixed(2));
}

// Display conversion result
function displayResults(value, from, to) {
    const result = convertUnits(value, from, to);
    const date = new Date().toLocaleString();
    const resultsDiv = document.getElementById('results');
    if (result === null || isNaN(result)) {
        resultsDiv.innerHTML = `<span style="color:red">${langStrings.invalidInput}</span>`;
        return;
    }
    resultsDiv.innerHTML = `
        <div>
            <strong>${value} ${unitNames[from]} = ${result} ${unitNames[to]}</strong>
            <br><small>${date}</small>
        </div>
    `;
    showVisualBar(value, from, result, to);
    addToHistory(value, from, result, to, date);
}

// Visual bar/ruler representation
function showVisualBar(value, from, result, to) {
    const barDiv = document.getElementById('visualBar');
    // Normalize both values to centimeters for comparison
    const cmInput = unitToCm[from](value);
    const cmOutput = unitToCm[to](result);
    // Find max for scaling
    const maxCm = Math.max(cmInput, cmOutput, 1);
    const inputPercent = Math.min((cmInput / maxCm) * 100, 100);
    const outputPercent = Math.min((cmOutput / maxCm) * 100, 100);

    barDiv.innerHTML = `
        <div style="display:flex; align-items:center; height:100%;">
            <div class="visual-bar-inner" style="width:${inputPercent}%; background:linear-gradient(90deg,#0077ff 0%,#00e431 100%);"></div>
            <div style="width:4px;"></div>
            <div class="visual-bar-inner" style="width:${outputPercent}%; background:linear-gradient(90deg,#ff0606 0%,#ffb700 100%);"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-top:2px;">
            <span>${value} ${from}</span>
            <span>${result} ${to}</span>
        </div>
    `;
}

// Add conversion to history
function addToHistory(value, from, result, to, date) {
    history.push({ value, from, result, to, date });
    updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
    const historyDiv = document.getElementById('history');
    if (!langStrings.calculationHistory) return;
    if (history.length === 0) {
        historyDiv.innerHTML = `<em>No history yet.</em>`;
        return;
    }
    historyDiv.innerHTML = history.map(item => `
        <div class="history-item">
            <strong>${item.value} ${unitNames[item.from]} = ${item.result} ${unitNames[item.to]}</strong>
            <br><small>${item.date}</small>
        </div>
    `).join('');
}

// Clear history
document.getElementById('clearButton').addEventListener('click', () => {
    history = [];
    updateHistoryDisplay();
});

// Export history as CSV
document.getElementById('exportButton').addEventListener('click', () => {
    if (history.length === 0) return;
    let csv = "Input Value,Input Unit,Result,Output Unit,Date\n";
    history.forEach(item => {
        csv += `"${item.value}","${unitNames[item.from]}","${item.result}","${unitNames[item.to]}","${item.date}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "conversion_history.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Conversion button
document.getElementById('convertButton').addEventListener('click', () => {
    const value = parseFloat(document.getElementById('inputValue').value);
    const from = document.getElementById('inputUnit').value;
    const to = document.getElementById('outputUnit').value;
    if (isNaN(value) || value === "") {
        alert(langStrings.invalidInput);
        return;
    }
    displayResults(value, from, to);
});

// Language selection
document.getElementById('languageSelect').addEventListener('change', (event) => {
    currentLanguage = event.target.value;
    loadLanguage();
});

// Dark mode toggle
document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.getElementById('darkModeToggle').textContent =
        document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Initial load
window.onload = () => {
    loadLanguage();
    // Set dark mode icon
    document.getElementById('darkModeToggle').textContent =
        document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
};
