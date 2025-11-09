let symptoms = [];
let diseases = [];
let rules = [];
let selectedSymptoms = new Set();

document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        loadSymptoms(),
        loadDiseases(),
        loadRules()
    ]);
    renderSymptomsChecklist();
});

async function loadSymptoms() {
    try {
        const response = await fetch('assets/data/symptoms.json');
        const data = await response.json();
        symptoms = data.gejala;
    } catch (error) {
        console.error('Error loading symptoms:', error);
    }
}

async function loadDiseases() {
    try {
        const response = await fetch('assets/data/diseases.json');
        const data = await response.json();
        diseases = data.penyakit;
    } catch (error) {
        console.error('Error loading diseases:', error);
    }
}

async function loadRules() {
    try {
        const response = await fetch('assets/data/rules.json');
        const data = await response.json();
        rules = data.rules;
    } catch (error) {
        console.error('Error loading rules:', error);
    }
}

function renderSymptomsChecklist() {
    const symptomsChecklist = document.getElementById('symptomsChecklist');
    symptomsChecklist.innerHTML = '';
    
    symptoms.forEach(symptom => {
        const symptomItem = document.createElement('div');
        symptomItem.className = 'symptom-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = symptom.id;
        checkbox.className = 'symptom-checkbox';
        checkbox.addEventListener('change', () => toggleSymptom(symptom.id));
        
        const label = document.createElement('label');
        label.htmlFor = symptom.id;
        label.className = 'symptom-label';
        label.textContent = symptom.nama;
        
        label.title = symptom.deskripsi;
        
        symptomItem.appendChild(checkbox);
        symptomItem.appendChild(label);
        symptomsChecklist.appendChild(symptomItem);
    });
    
    updateDiagnoseButton();
}

function toggleSymptom(symptomId) {
    if (selectedSymptoms.has(symptomId)) {
        selectedSymptoms.delete(symptomId);
    } else {
        selectedSymptoms.add(symptomId);
    }
    updateDiagnoseButton();
    updateSelectedCount();
}

function updateSelectedCount() {
    const selectedCount = document.getElementById('selectedCount');
    if (selectedCount) {
        selectedCount.textContent = selectedSymptoms.size;
    }
}

function updateDiagnoseButton() {
    const diagnoseButton = document.getElementById('diagnoseButton');
    diagnoseButton.disabled = selectedSymptoms.size === 0;
}

function forwardChaining(selectedSymptoms) {
    let possibleDiagnoses = [];
    
    const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);
    
    for (let rule of sortedRules) {
        const isMatch = rule.antecedent.every(symptom => 
            selectedSymptoms.has(symptom));
        
        if (isMatch) {
            const disease = diseases.find(d => d.id === rule.output);
            
            if (disease) {
                possibleDiagnoses.push({
                    disease: disease,
                    rule: rule
                });
            }
        }
    }
    
    return possibleDiagnoses;
}

document.getElementById('diagnoseButton').addEventListener('click', () => {
    const diagnoses = forwardChaining(selectedSymptoms);
    showResults(diagnoses);
});

function showResults(diagnoses) {
    const startScreen = document.getElementById('startScreen');
    const resultScreen = document.getElementById('resultScreen');
    const resultTitle = document.getElementById('resultTitle');
    const resultDescription = document.getElementById('resultDescription');
    const recommendationsDiv = document.getElementById('recommendations');
    
    startScreen.style.display = 'none';
    resultScreen.style.display = 'block';
    recommendationsDiv.innerHTML = '';
    
    if (diagnoses.length > 0) {
        const diagnosis = diagnoses[0];
        
        resultTitle.textContent = diagnosis.disease.nama;
        resultDescription.textContent = diagnosis.disease.deskripsi;
        
        const recommendations = [
            {
                icon: 'fa-exclamation-circle',
                text: diagnosis.rule.keterangan
            },
            {
                icon: 'fa-list-check',
                text: diagnosis.rule.saran
            },
            {
                icon: 'fa-user-doctor',
                text: diagnosis.disease.saran_dokter
            },
            {
                icon: 'fa-shield-heart',
                text: diagnosis.disease.pencegahan
            }
        ];
        
        recommendations.forEach(rec => {
            const recItem = document.createElement('div');
            recItem.className = 'recommendation-item';
            recItem.innerHTML = `
                <i class="fas ${rec.icon}"></i>
                <span>${rec.text}</span>
            `;
            recommendationsDiv.appendChild(recItem);
        });
        
    } else {
        resultTitle.textContent = 'Tidak Dapat Menentukan Diagnosis';
        resultDescription.textContent = 
            'Berdasarkan gejala yang Anda pilih, sistem tidak dapat menentukan diagnosis yang pasti. ' +
            'Silakan konsultasikan dengan dokter untuk pemeriksaan lebih lanjut.';
            
        const recItem = document.createElement('div');
        recItem.className = 'recommendation-item';
        recItem.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>Segera kunjungi dokter untuk pemeriksaan lebih lanjut</span>
        `;
        recommendationsDiv.appendChild(recItem);
    }
}

document.getElementById('restartButton').addEventListener('click', () => {
    selectedSymptoms.clear();
    const resultScreen = document.getElementById('resultScreen');
    const startScreen = document.getElementById('startScreen');
    
    resultScreen.style.display = 'none';
    startScreen.style.display = 'block';
    
    const checkboxes = document.querySelectorAll('.symptom-checkbox');
    checkboxes.forEach(checkbox => checkbox.checked = false);
    
    updateSelectedCount();
    updateDiagnoseButton();
});