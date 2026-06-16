// --- BASE DE DATOS DE PREGUNTAS (Simulada) ---
const courseData = [
    {
        id: 0,
        title: "La Creación",
        questions: [
            { q: "En el principio creó Dios los cielos y la...", options: ["Tierra", "Naturaleza", "Luz"], ans: 0 },
            { q: "¿Qué creó Dios el primer día?", options: ["Los animales", "La luz", "El sol y la luna"], ans: 1 },
            { q: "Y vio Dios que la luz era...", options: ["Brillante", "Buena", "Hermosa"], ans: 1 }
        ]
    },
    {
        id: 1,
        title: "Adán y Eva",
        questions: [
            { q: "¿De qué árbol no podían comer?", options: ["De la vida", "Del conocimiento del bien y del mal", "De la sabiduría"], ans: 1 },
            { q: "¿Quién engañó a la mujer?", options: ["La serpiente", "Un león", "El cuervo"], ans: 0 },
            { q: "El hombre llamó el nombre de su mujer...", options: ["Sara", "María", "Eva"], ans: 2 }
        ]
    }
];

// --- VARIABLES DE ESTADO ---
let playerState = {
    xp: parseInt(localStorage.getItem("bibliaXP")) || 0,
    lives: parseInt(localStorage.getItem("bibliaLives")) || 5,
    unlockedLevels: parseInt(localStorage.getItem("bibliaLevels")) || 0
};

let currentLevel = 0;
let currentQuestionIndex = 0;
let selectedOption = null;

// --- ELEMENTOS DEL DOM ---
const screens = {
    map: document.getElementById('map-screen'),
    quiz: document.getElementById('quiz-screen'),
    result: document.getElementById('result-screen')
};

const ui = {
    xp: document.getElementById('xp-display'),
    lives: document.getElementById('lives-display'),
    levelsContainer: document.getElementById('levels-container'),
    progressBar: document.getElementById('progress-bar'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    checkBtn: document.getElementById('check-btn'),
    earnedXp: document.getElementById('earned-xp')
};

// --- INICIALIZACIÓN ---
function init() {
    updateTopBar();
    renderMap();
}

function updateTopBar() {
    ui.xp.innerText = playerState.xp;
    ui.lives.innerText = '❤️'.repeat(playerState.lives) + '🖤'.repeat(5 - playerState.lives);
    localStorage.setItem("bibliaXP", playerState.xp);
    localStorage.setItem("bibliaLives", playerState.lives);
    localStorage.setItem("bibliaLevels", playerState.unlockedLevels);
}

function switchScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// --- MAPA DE NIVELES ---
function renderMap() {
    ui.levelsContainer.innerHTML = '';
    courseData.forEach((level, index) => {
        const btn = document.createElement('button');
        btn.classList.add('level-btn');
        if (index > playerState.unlockedLevels) {
            btn.classList.add('locked');
            btn.innerHTML = '🔒';
        } else {
            btn.innerHTML = index + 1;
            btn.onclick = () => startLevel(index);
        }
        ui.levelsContainer.appendChild(btn);
    });
}

// --- LÓGICA DEL QUIZ ---
function startLevel(index) {
    if (playerState.lives <= 0) {
        alert("¡Te has quedado sin vidas! Espera a que se recarguen.");
        playerState.lives = 5; // Reseteo rápido para la demo
        updateTopBar();
        return;
    }
    currentLevel = index;
    currentQuestionIndex = 0;
    switchScreen('quiz');
    loadQuestion();
}

function loadQuestion() {
    selectedOption = null;
    ui.checkBtn.disabled = true;
    ui.checkBtn.innerText = "Comprobar";
    ui.checkBtn.style.backgroundColor = "#58cc02";
    ui.checkBtn.onclick = checkAnswer;

    const qData = courseData[currentLevel].questions[currentQuestionIndex];
    ui.questionText.innerText = qData.q;
    ui.optionsContainer.innerHTML = '';

    // Barra de progreso
    const progress = (currentQuestionIndex / courseData[currentLevel].questions.length) * 100;
    ui.progressBar.style.width = progress + '%';

    qData.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.innerText = opt;
        btn.onclick = () => selectOption(btn, idx);
        ui.optionsContainer.appendChild(btn);
    });
}

function selectOption(btn, index) {
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedOption = index;
    ui.checkBtn.disabled = false;
}

function checkAnswer() {
    const qData = courseData[currentLevel].questions[currentQuestionIndex];
    const options = document.querySelectorAll('.option-btn');
    
    // Deshabilitar botones
    options.forEach(b => b.onclick = null);

    if (selectedOption === qData.ans) {
        options[selectedOption].classList.add('correct');
        ui.checkBtn.innerText = "¡Correcto! Continuar";
    } else {
        options[selectedOption].classList.add('wrong');
        options[qData.ans].classList.add('correct');
        ui.checkBtn.innerText = "Incorrecto. Continuar";
        ui.checkBtn.style.backgroundColor = "#ff4b4b";
        
        playerState.lives--;
        updateTopBar();
    }

    ui.checkBtn.onclick = nextQuestion;
}

function nextQuestion() {
    if (playerState.lives <= 0) {
        alert("¡Perdiste todas tus vidas! Inténtalo de nuevo.");
        switchScreen('map');
        return;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < courseData[currentLevel].questions.length) {
        loadQuestion();
    } else {
        finishLevel();
    }
}

function finishLevel() {
    ui.progressBar.style.width = '100%';
    const xpGained = 15;
    playerState.xp += xpGained;
    
    // Desbloquear siguiente nivel si existe
    if (currentLevel === playerState.unlockedLevels && currentLevel < courseData.length - 1) {
        playerState.unlockedLevels++;
    }

    updateTopBar();
    ui.earnedXp.innerText = xpGained;
    switchScreen('result');
}

document.getElementById('continue-btn').onclick = () => {
    renderMap();
    switchScreen('map');
};

// Iniciar aplicación
init();
