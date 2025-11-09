// Get DOM elements
const welcomeScreen = document.querySelector('.welcome-screen');
const questionnaire = document.querySelector('.questionnaire');
const startDiagnosisButton = document.querySelector('.start-diagnosis-button');

// Handle start diagnosis button click
startDiagnosisButton.addEventListener('click', () => {
    // Hide welcome screen with animation
    welcomeScreen.style.opacity = '0';
    welcomeScreen.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        welcomeScreen.classList.add('hidden');
        // Show questionnaire with animation
        questionnaire.style.display = 'block';
        // Force reflow
        questionnaire.offsetHeight;
        questionnaire.classList.add('active');
    }, 500);
});