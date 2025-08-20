let history = [];
let currentLanguage = 'en';
let langStrings = {};

// Load language strings from JSON files
async function loadLanguage() {
    const response = await fetch(`lang/${currentLanguage}.json`);
    langStrings = await response.json();
    updateTexts();
    updateHistoryDisplay();
}

// Function to convert centimeters to millimeters
function cmToMm(cm) {
    return cm * 10;
}

// Function to convert centimeters to inches
function cmToInches(cm) {
    return cm / 2.54;
}

// Function to update text elements on the page
function updateTexts() {
    document.getElementById('title').textContent = langStrings.title;
    document.getElementById('inputLabel').textContent = langStrings.inputLabel;
    document.getElementById('convertButton').textContent = langStrings.convertToMillimeters + " / " + langStrings.convertToInches;
    document.getElementById('resultTitle').textContent = langStrings.conversionResults;
    document.getElementById('historyTitle').textContent = langStrings.calculationHistory;
    document.querySelector('label[for="languageSelect"]').textContent = currentLanguage === 'en' ? "Select Language:" : "Selecione o idioma:";
}

// Function to display results
function displayResults(cm) {
    const mm = cmToMm(cm);
    const inches = cmToInches(cm);
    const date = new Date().toLocaleString();

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <p>${langStrings.conversionMessage.replace('{cm}', cm).replace('{mm}', mm)}</p>
        <p>${langStrings.conversionMessageInches.replace('{cm}', cm).replace('{inches}', inches.toFixed(2)).replace('{date}', date)}</p>
    `;
    addToHistory(cm, mm, inches, date);
}

// Function to add calculation to history
function addToHistory(cm, mm, inches, date) {
    history.push({ cm, mm, inches: inches.toFixed(2), date });
    updateHistoryDisplay();
}

// Function to update history display
function updateHistoryDisplay() {
    const historyDiv = document.getElementById('history');
    if (!langStrings.calculationHistory) return;
    historyDiv.innerHTML = history.map(item => `
        <div class="history-item">
            <p>${langStrings.conversionMessage.replace('{cm}', item.cm).replace('{mm}', item.mm)}</p>
            <p>${langStrings.conversionMessageInches.replace('{cm}', item.cm).replace('{inches}', item.inches).replace('{date}', item.date)}</p>
        </div>
    `).join('');
}

// Event listener for conversion button
document.getElementById('convertButton').addEventListener('click', () => {
    const cmInput = parseFloat(document.getElementById('cmInput').value);
    if (!isNaN(cmInput) && cmInput !== "") {
        displayResults(cmInput);
    } else {
        alert(langStrings.invalidInput || langStrings.alertInvalidNumber);
    }
});

// Language selection
document.getElementById('languageSelect').addEventListener('change', (event) => {
    currentLanguage = event.target.value;
    loadLanguage();
});

// Initial load of language strings
window.onload = loadLanguage;
