// Variabel untuk menyimpan data
let rules = [];
let symptoms = [];
let currentSymptomIndex = 0;
let selectedSymptoms = new Set();

// Element references
const startScreen = document.getElementById('startScreen');
const questionnaire = document.getElementById('questionnaire');
const resultScreen = document.getElementById('resultScreen');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const progressBar = document.querySelector('.progress-bar');
const currentQuestionSpan = document.querySelector('.current');
const totalQuestionsSpan = document.querySelector('.total');

// Event Listeners
document.getElementById('startButton').addEventListener('click', startQuestionnaire);
document.getElementById('restartButton').addEventListener('click', restartQuestionnaire);
prevButton.addEventListener('click', showPreviousQuestion);
nextButton.addEventListener('click', handleNextButton);

// Load rules and generate symptoms list from JSON file
async function loadRulesAndSymptoms() {
    try {
        const response = await fetch('assets/data/rules.json');
        const data = await response.json();
        rules = data.rules;
        
        // Extract unique symptoms from rules
        const symptomSet = new Set();
        rules.forEach(rule => {
            rule.gejala.forEach(gejala => symptomSet.add(gejala));
        });
        symptoms = Array.from(symptomSet);
        totalQuestionsSpan.textContent = symptoms.length;
    } catch (error) {
        console.error('Error loading rules:', error);
    }
}

// Initialize when document loads
document.addEventListener('DOMContentLoaded', loadRulesAndSymptoms);

// Start questionnaire
function startQuestionnaire() {
    startScreen.style.display = 'none';
    questionnaire.style.display = 'block';
    selectedSymptoms = new Set(); // Reset selected symptoms
    currentSymptomIndex = 0;
    showQuestion(0);
    
    // Reset button states
    const buttons = document.querySelectorAll('.option-button');
    buttons.forEach(button => button.classList.remove('selected'));
    
    // Reset navigation
    nextButton.disabled = true;
}

// Show symptom question
function showQuestion(index) {
    const symptom = symptoms[index];
    questionText.textContent = `Apakah Anda mengalami gejala: ${symptom}?`;
    optionsContainer.innerHTML = '';

    // Create Yes/No buttons
    const options = [
        { text: 'Ya', value: true },
        { text: 'Tidak', value: false }
    ];

    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.innerHTML = option.text;
        button.addEventListener('click', () => selectOption(symptom, option.value));
        optionsContainer.appendChild(button);
    });

    updateNavigation();
    updateProgress();
}

// Select option for symptom
function selectOption(symptom, value) {
    const buttons = optionsContainer.querySelectorAll('.option-button');
    buttons.forEach(button => button.classList.remove('selected'));
    
    if (value) {
        selectedSymptoms.add(symptom);
        buttons[0].classList.add('selected'); // Ya button
    } else {
        selectedSymptoms.delete(symptom);
        buttons[1].classList.add('selected'); // Tidak button
    }
    
    updateNavigation();
    
    // Save to localStorage
    localStorage.setItem('gerdcare_symptoms', JSON.stringify(Array.from(selectedSymptoms)));
}

// Navigation functions
function showPreviousQuestion() {
    if (currentSymptomIndex > 0) {
        currentSymptomIndex--;
        showQuestion(currentSymptomIndex);
    }
}

function handleNextButton() {
    if (currentSymptomIndex === symptoms.length - 1) {
        showResults();
    } else {
        currentSymptomIndex++;
        showQuestion(currentSymptomIndex);
    }
}

// Update navigation buttons
function updateNavigation() {
    prevButton.disabled = currentSymptomIndex === 0;
    
    // Cek apakah ada tombol yang dipilih
    const selectedButton = document.querySelector('.option-button.selected');
    const hasAnswer = selectedButton !== null;
    
    if (currentSymptomIndex === symptoms.length - 1) {
        nextButton.textContent = 'Lihat Hasil';
    } else {
        nextButton.innerHTML = 'Selanjutnya <i class="fas fa-arrow-right"></i>';
    }
    nextButton.disabled = !hasAnswer;
}

// Update progress
function updateProgress() {
    const progress = ((currentSymptomIndex + 1) / symptoms.length) * 100;
    progressBar.style.width = `${progress}%`;
    currentQuestionSpan.textContent = currentSymptomIndex + 1;
}

// Find matching rule using Forward Chaining
function findMatchingRule() {
    const userSymptoms = Array.from(selectedSymptoms);
    
    // Sort rules by number of symptoms (most specific first)
    const sortedRules = [...rules].sort((a, b) => b.gejala.length - a.gejala.length);
    
    // Find first rule where ALL rule symptoms are in user symptoms
    for (let rule of sortedRules) {
        const isMatch = rule.gejala.every(symptom => 
            userSymptoms.includes(symptom));
        if (isMatch) return rule;
    }
    return null;
}

// Show results using Forward Chaining
function showResults() {
    const matchingRule = findMatchingRule();

    questionnaire.style.display = 'none';
    resultScreen.style.display = 'block';
    
    const resultTitle = document.getElementById('resultTitle');
    const resultDescription = document.getElementById('resultDescription');
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '';

    if (matchingRule) {
        // Show diagnosis result
        resultTitle.textContent = matchingRule.penyakit;
        resultDescription.textContent = matchingRule.solusi;
        
        // Add recommendations
        const recommendations = [
            matchingRule.saran,
            'Jaga pola makan dan gaya hidup sehat',
            'Konsultasikan dengan dokter jika gejala memberat'
        ];
        
        recommendations.forEach(rec => {
            const recItem = document.createElement('div');
            recItem.className = 'recommendation-item';
            recItem.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>${rec}</span>
            `;
            recommendationsDiv.appendChild(recItem);
        });
    } else {
        // No matching rule found
        resultTitle.textContent = 'Tidak Dapat Menentukan Diagnosis';
        resultDescription.textContent = 'Berdasarkan gejala yang Anda pilih, ' +
            'sistem tidak dapat menentukan diagnosis yang pasti. ' +
            'Silakan konsultasikan dengan dokter untuk pemeriksaan lebih lanjut.';
            
        const recItem = document.createElement('div');
        recItem.className = 'recommendation-item';
        recItem.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>Segera kunjungi dokter untuk pemeriksaan lebih lanjut</span>
        `;
        recommendationsDiv.appendChild(recItem);
    }

    // Save results to localStorage
    localStorage.setItem('gerdcare_result', JSON.stringify({
        selectedSymptoms: Array.from(selectedSymptoms),
        diagnosis: matchingRule,
        timestamp: new Date().toISOString()
    }));
}

// Restart questionnaire
function restartQuestionnaire() {
    currentSymptomIndex = 0;
    selectedSymptoms = new Set(); // Create new empty set
    localStorage.removeItem('gerdcare_symptoms');
    localStorage.removeItem('gerdcare_result');
    resultScreen.style.display = 'none';
    startScreen.style.display = 'block';
    progressBar.style.width = '0%';
    currentQuestionSpan.textContent = '0';
    
    // Reset all button selections
    const buttons = document.querySelectorAll('.option-button');
    buttons.forEach(button => button.classList.remove('selected'));
}