let numberOfQuestions; // Nombre de questions
const questionsContainer = document.getElementById('questions-container');
const timerDisplay = document.getElementById('timer');
const resultDisplay = document.getElementById('result');
const restartBtn = document.getElementById('restart-btn');
let timer = 0;
let interval;
let countdownInterval;
const questions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0; // Compteur de bonnes réponses
let isQuizStarted = false;
let userAnswers = []; // Tableau pour stocker les réponses de l'utilisateur
let errors = []; // Tableau pour stocker les erreurs et leurs corrections
let mode = ""; // Variable pour savoir quel mode est actif

// Générer les questions
function generateQuestions() {
    for (let i = 0; i < numberOfQuestions; i++) {
        const num1 = Math.floor(Math.random() * 13);
        const num2 = Math.floor(Math.random() * 13);
        questions.push({ num1, num2 });
    }
}

// Afficher la question actuelle
function showQuestion(index) {
    questionsContainer.innerHTML = ''; // Réinitialise l'affichage des questions

    const question = questions[index];
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.innerHTML = 
        `<p>Question ${index + 1}: Combien fait ${question.num1} x ${question.num2} ?</p>
        <input type="number" id="answer-${index}" oninput="checkAnswer(${index})" autofocus />`;
    questionsContainer.appendChild(questionDiv);
    document.getElementById(`answer-${index}`).focus(); // Met le curseur dans  l'input à chaque question
}

// Gérer le décompte avant de commencer
function startCountdown() {
    let countdown = 3; // Décompte de 3 secondes
    timerDisplay.textContent = `Décompte avant le début: ${countdown}`;
    countdownInterval = setInterval(() => {
        countdown--;
        timerDisplay.textContent = `Décompte avant le début: ${countdown}`;
        if (countdown === 0) {
            clearInterval(countdownInterval);
            generateQuestions();
            startQuiz();
        }
    }, 1000);
}

// Démarrer le quiz
function startQuiz() {
    isQuizStarted = true;
    timerDisplay.textContent = `Temps écoulé : ${timer} secondes`;
    startTimer();
    showQuestion(currentQuestionIndex);
    disableModeButtons(); // Désactiver les boutons après le démarrage du quiz
}

// Démarrer le chronomètre
function startTimer() {
    interval = setInterval(() => {
        timer++;
        timerDisplay.textContent = `Temps écoulé : ${timer} secondes`;
    }, 1000);
}

function checkAnswer(index) {
    const userAnswerInput = document.getElementById(`answer-${index}`);
    
    // Vérifier si l'input existe
    if (!userAnswerInput) {
        console.error(`L'input pour la question ${index + 1} n'a pas été trouvé.`);
        return; // Arrêter la fonction si l'input n'existe plus
    }

    const userAnswer = parseInt(userAnswerInput.value);
    const correctAnswer = questions[index].num1 * questions[index].num2;

    // Si la réponse est correcte, incrémenter de 1 le compteur de bonnes réponses
    if (userAnswer === correctAnswer) {
        correctAnswers++; // Incrémenter le compteur
    } else {
        // Enregistrer l'erreur si la réponse est incorrecte
        errors.push({
            question: index,
            correctAnswer: correctAnswer
        });
    }

    // Passer à la question suivante en mode rapide
    if (mode === "rapid" && userAnswer === correctAnswer) {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion(currentQuestionIndex); // Afficher la question suivante
        } else {
            finishQuiz(); // Terminer le quiz si toutes les questions ont été répondues
        }
    } 

    // En mode classique, avancer uniquement avec la touche "Enter"
    if (mode === "classic") {
        userAnswerInput.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    showQuestion(currentQuestionIndex); // Afficher la question suivante
                } else {
                    finishQuiz(); // Terminer le quiz si toutes les questions ont été répondues
                }
            }
        });
    }
}





function finishQuiz() {
    // Afficher le bouton recommencer après 2 secondes
    setTimeout(() => {
        restartBtn.style.display = 'inline-block'; // Afficher le bouton recommencer
    }, 1000);
    
    clearInterval(interval); // Arrêter le chronomètre
    const percentage = (correctAnswers / numberOfQuestions) * 100; // Calcul du score en %
    
    resultDisplay.innerHTML = 
    `<p>Quiz terminé en ${timer.getMilliseconds()} secondes.</p>
     <p>Vous avez obtenu ${correctAnswers} sur ${numberOfQuestions} bonnes réponses, soit ${percentage.toFixed(2)}%.</p>`;
    
    // Afficher les erreurs uniquement en mode classique
    if (errors.length > 0 && mode === "classic") {
        let errorMessages = '<h3>Erreurs:</h3>';
        errors.forEach(error => {
            errorMessages += 
                `<h5>Question ${error.question + 1}: Votre réponse était incorrecte. La bonne réponse était ${error.correctAnswer}.</h5>`;
        });
        resultDisplay.innerHTML += errorMessages; // Afficher les erreurs après le score
    }
}

// Réinitialiser le quiz
function restartQuiz() {
    currentQuestionIndex = 0;
    correctAnswers = 0; // Réinitialiser le compteur de bonnes réponses
    timer = 0;
    questions.length = 0;
    userAnswers.length = 0;
    errors.length = 0;
    resultDisplay.innerHTML = '';
    questionsContainer.innerHTML = '';
    timerDisplay.innerHTML = '';
    restartBtn.style.display = 'none';
    isQuizStarted = false;
    document.getElementById('nombre-question').style.display = 'block';
    document.getElementById('nombre-question-text').style.display = 'block';

    // Réactiver les boutons pour sélectionner le mode
    enableModeButtons();
}

// Désactiver les boutons de mode après un clic
function disableModeButtons() {
    document.getElementById('mode-rapide-btn').style.display = 'none';
    document.getElementById('mode-classique-btn').style.display = 'none';
}

// Réactiver les boutons après avoir redémarré le quiz
function enableModeButtons() {
    document.getElementById('mode-rapide-btn').style.display = 'inline-block';
    document.getElementById('mode-classique-btn').style.display = 'inline-block';
}

// Démarrer le mode rapide
function startRapidMode() {
    mode = "rapid";
    numberOfQuestions = parseInt(document.getElementById('nombre-question').value);
    startCountdown();
    document.getElementById('nombre-question').style.display = 'none';
    document.getElementById('nombre-question-text').style.display = 'none';
    document.getElementById('mode-rapide-btn').style.display = 'none'
    document.getElementById('mode-classique-btn').style.display = 'none'
}

// Démarrer le mode classique
function startClassicMode() {
    mode = "classic";
    numberOfQuestions = parseInt(document.getElementById('nombre-question').value);
    startCountdown();
    document.getElementById('nombre-question').style.display = 'none';
    document.getElementById('nombre-question-text').style.display = 'none';
    document.getElementById('mode-rapide-btn').style.display = 'none'
    document.getElementById('mode-classique-btn').style.display = 'none'
}
