// --- BASE DE DATOS DE LOS 66 LIBROS (Reina Valera 1960) ---
const courseData = [
    {
        id: 0,
        title: "Génesis",
        questions: [
            { q: "En el principio creó Dios los cielos y la...", options: ["Tierra", "Naturaleza", "Luz"], ans: 0, ref: "Génesis 1:1" },
            { q: "¿Qué creó Dios el primer día?", options: ["Los animales", "La luz", "El sol y la luna"], ans: 1, ref: "Génesis 1:3" },
            { q: "¿De qué árbol no podían comer Adán y Eva?", options: ["De la vida", "Del conocimiento del bien y del mal", "De la sabiduría"], ans: 1, ref: "Génesis 2:17" }
        ]
    },
    {
        id: 1,
        title: "Éxodo",
        questions: [
            { q: "¿Quién fue salvado de las aguas en una arquilla de juncos?", options: ["Abraham", "José", "Moisés"], ans: 2, ref: "Éxodo 2:3-10" },
            { q: "¿Qué mar abrió Dios para que Israel cruzara en seco?", options: ["Mar Muerto", "Mar Rojo", "Mar Mediterráneo"], ans: 1, ref: "Éxodo 14:21" },
            { q: "¿Cuántos mandamientos entregó Dios en tablas de piedra?", options: ["12", "7", "10"], ans: 2, ref: "Éxodo 20" }
        ]
    },
    {
        id: 2,
        title: "Levítico",
        questions: [
            { q: "Habla a toda la congregación... y diles: Santos seréis, porque santo soy yo...", options: ["Jehová vuestro Dios", "El profeta", "Moisés"], ans: 0, ref: "Levítico 19:2" },
            { q: "No te vengarás, ni guardarás rencor... sino amarás a tu prójimo como...", options: ["A tus hermanos", "A ti mismo", "A Dios"], ans: 1, ref: "Levítico 19:18" }
        ]
    },
    
    // =========================================================================
    // AQUÍ DEBES AGREGAR LOS LIBROS DEL 4 AL 65 (Números hasta Judas)
    // Cópialos siguiendo el mismo formato de arriba.
    // =========================================================================

    {
        id: 65, // Este sería el índice 65 porque empezamos a contar desde 0 (0 a 65 = 66 libros)
        title: "Apocalipsis",
        questions: [
            { q: "Yo soy el Alfa y la Omega, principio y fin, dice...", options: ["El ángel", "El Señor", "Juan"], ans: 1, ref: "Apocalipsis 1:8" },
            { q: "¿A cuántas iglesias en Asia se envían las cartas?", options: ["Siete", "Doce", "Diez"], ans: 0, ref: "Apocalipsis 1:4" },
            { q: "Vi un cielo nuevo y una...", options: ["Tierra nueva", "Estrella brillante", "Jerusalén celestial"], ans: 0, ref: "Apocalipsis 21:1" }
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
    earnedXp: document.getElementById('earned-xp'),
    bibleRef: document.getElementById('bible-ref')
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
        // Contenedor para el botón y su título
        const wrapper = document.createElement('div');
        wrapper.classList.add('level-wrapper');

        const btn = document.createElement('button');
        btn.classList.add('level-btn');
        
        const titleLabel = document.createElement('div');
        titleLabel.classList.add('level-name');
        titleLabel.innerText = level.title; // Muestra el nombre del libro bíblico

        if (index > playerState.unlockedLevels) {
            btn.classList.add('locked');
            btn.innerHTML = '🔒';
        } else {
            btn.innerHTML = '⭐';
            btn.onclick = () => startLevel(index);
        }

        wrapper.appendChild(btn);
        wrapper.appendChild(titleLabel);
        ui.levelsContainer.appendChild(wrapper);
    });
}

// --- LÓGICA DEL QUIZ ---
function startLevel(index) {
    if (playerState.lives <= 0) {
        alert("¡Te has quedado sin vidas! Intenta más tarde.");
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
    ui.checkBtn.style.boxShadow = "0 6px 0 #58a700";
    ui.checkBtn.onclick = checkAnswer;

    const qData = courseData[currentLevel].questions[currentQuestionIndex];
    ui.questionText.innerText = qData.q;
    ui.optionsContainer.innerHTML = '';
    ui.bibleRef.innerText = "📖 " + qData.ref;

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
    
    options.forEach(b => b.onclick = null);

    if (selectedOption === qData.ans) {
        options[selectedOption].classList.add('correct');
        ui.checkBtn.innerText = "¡Correcto! Continuar";
    } else {
        options[selectedOption].classList.add('wrong');
        options[qData.ans].classList.add('correct');
        ui.checkBtn.innerText = "Incorrecto. Continuar";
        ui.checkBtn.style.backgroundColor = "#ff4b4b";
        ui.checkBtn.style.boxShadow = "0 6px 0 #ea1537";
        
        playerState.lives--;
        updateTopBar();
    }

    ui.checkBtn.onclick = nextQuestion;
}

function nextQuestion() {
    if (playerState.lives <= 0) {
        alert("¡Perdiste todas tus vidas! Regresando al inicio.");
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

init();
