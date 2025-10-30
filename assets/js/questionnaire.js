// Variabel untuk menyimpan data kuesioner
let questions = [];
let currentQuestionIndex = 0;
let userAnswers = {};

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

// Load questions from JSON file
async function loadQuestions() {
    try {
        const response = await fetch('assets/data/questions.json');
        const data = await response.json();
        questions = data.questions;
        totalQuestionsSpan.textContent = questions.length;
    } catch (error) {
        console.error('Error loading questions:', error);
    }
}

// Initialize when document loads
document.addEventListener('DOMContentLoaded', loadQuestions);

// Start questionnaire
function startQuestionnaire() {
    startScreen.style.display = 'none';
    questionnaire.style.display = 'block';
    showQuestion(0);
}

// Show question
function showQuestion(index) {
    const question = questions[index];
    questionText.textContent = question.question;
    optionsContainer.innerHTML = '';

    question.options.forEach((option, i) => {
        const button = document.createElement('button');
        button.className = 'option-button';
        if (userAnswers[question.id] === option.value) {
            button.classList.add('selected');
        }
        button.innerHTML = `${option.text}`;
        button.addEventListener('click', () => selectOption(question.id, option.value));
        optionsContainer.appendChild(button);
    });

    updateNavigation();
    updateProgress();
}

// Select option
function selectOption(questionId, value) {
    userAnswers[questionId] = value;
    const buttons = optionsContainer.querySelectorAll('.option-button');
    buttons.forEach(button => button.classList.remove('selected'));
    buttons[value].classList.add('selected');
    updateNavigation();
    
    // Save to localStorage
    localStorage.setItem('gerdcare_answers', JSON.stringify(userAnswers));
}

// Navigation functions
function showPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
}

function handleNextButton() {
    if (currentQuestionIndex === questions.length - 1) {
        showResults();
    } else {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    }
}

// Update navigation buttons
function updateNavigation() {
    prevButton.disabled = currentQuestionIndex === 0;
    
    const currentQuestion = questions[currentQuestionIndex];
    const hasAnswer = userAnswers.hasOwnProperty(currentQuestion.id);
    
    if (currentQuestionIndex === questions.length - 1) {
        nextButton.textContent = 'Lihat Hasil';
        nextButton.disabled = !hasAnswer;
    } else {
        nextButton.innerHTML = 'Selanjutnya <i class="fas fa-arrow-right"></i>';
        nextButton.disabled = !hasAnswer;
    }
}

// Update progress
function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
}

// Calculate results
function calculateResults() {
    let totalScore = 0;
    questions.forEach(question => {
        if (userAnswers.hasOwnProperty(question.id)) {
            totalScore += userAnswers[question.id] * question.weight;
        }
    });
    return totalScore;
}

// Show results
async function showResults() {
    const score = calculateResults();
    const response = await fetch('assets/data/questions.json');
    const data = await response.json();
    const criteria = data.analysis_criteria;
    
    let result;
    if (score <= criteria.mild.max_score) {
        result = criteria.mild;
    } else if (score <= criteria.moderate.max_score) {
        result = criteria.moderate;
    } else {
        result = criteria.severe;
    }

    questionnaire.style.display = 'none';
    resultScreen.style.display = 'block';
    
    document.getElementById('resultTitle').textContent = result.title;
    document.getElementById('resultDescription').textContent = result.description;
    
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '';
    result.recommendations.forEach(rec => {
        const recItem = document.createElement('div');
        recItem.className = 'recommendation-item';
        recItem.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${rec}</span>
        `;
        recommendationsDiv.appendChild(recItem);
    });

    // Save results to localStorage
    localStorage.setItem('gerdcare_result', JSON.stringify({
        score: score,
        result: result,
        timestamp: new Date().toISOString()
    }));
}

// Restart questionnaire
function restartQuestionnaire() {
    currentQuestionIndex = 0;
    userAnswers = {};
    localStorage.removeItem('gerdcare_answers');
    localStorage.removeItem('gerdcare_result');
    resultScreen.style.display = 'none';
    startScreen.style.display = 'block';
    progressBar.style.width = '0%';
    currentQuestionSpan.textContent = '0';
}