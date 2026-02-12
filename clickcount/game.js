// --- Constants & State ---
let currentScore = 0;
let highScore = 0;
let timeRemaining = 10.0;
let isPlaying = false;
let isPaused = false;
let gameInterval = null;
let cps = 0;
let clickTimestamps = [];
let comboCount = 0;
let lastClickTime = 0;
let achievementsEarned = new Set();

// --- DOM Elements ---
const elCurrentScore = document.querySelector('#currentScore');
const elHighScore = document.querySelector('#highScore');
const elTimer = document.querySelector('#timer');
const elCPS = document.querySelector('#CPS');
const elCPSBar = document.querySelector('#cpsBar');
const elClickBtn = document.querySelector('#clickButton');
const elStartBtn = document.querySelector('#startButton');
const elPauseBtn = document.querySelector('#pauseButton');
const elResetBtn = document.querySelector('#resetButton');
const elStatusMsg = document.querySelector('#statusMessage');
const elComboContainer = document.querySelector('#comboContainer');
const elComboMultiplier = document.querySelector('#comboMultiplier');
const elComboLabel = document.querySelector('#comboLabel');
const elOverlay = document.querySelector('#overlay');
const elOverlayTitle = document.querySelector('#overlayTitle');
const elOverlayMsg = document.querySelector('#overlayMessage');
const elResumeBtn = document.querySelector('#resumeButton');
const elAchievementPopup = document.querySelector('#achievementPopup');
const elAchievementTitle = document.querySelector('#achievementTitle');
const elAchievementDesc = document.querySelector('#achievementDesc');
const elVideo = document.querySelector('#video');
const elContainer = document.querySelector('.container');

// --- Audio System (Using Web Audio API for synthetic sounds) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const tickAudio = new Audio('studiokolomna-clock-ticking-60-second-countdown-118231.mp3');
tickAudio.loop = true;

function playSound(freq, type = 'sine', duration = 0.1, volume = 0.1) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

const sounds = {
    click: () => playSound(440 + (comboCount * 20), 'square', 0.05, 0.05),
    start: () => playSound(523.25, 'triangle', 0.3, 0.1),
    end: () => playSound(261.63, 'sawtooth', 0.5, 0.1),
    combo: () => playSound(880, 'sine', 0.2, 0.1),
    achievement: () => {
        playSound(523.25, 'sine', 0.1, 0.1);
        setTimeout(() => playSound(659.25, 'sine', 0.1, 0.1), 100);
        setTimeout(() => playSound(783.99, 'sine', 0.3, 0.1), 200);
    }
};

// --- Initialization ---
function init() {
    loadData();
    updateDisplay();
    setupEventListeners();
}

function loadData() {
    const savedScore = localStorage.getItem('highScore');
    if (savedScore) {
        highScore = parseInt(savedScore);
    }
}

function setupEventListeners() {
    elStartBtn.addEventListener('click', startGame);
    elClickBtn.addEventListener('click', handleClick);
    elPauseBtn.addEventListener('click', togglePause);
    elResetBtn.addEventListener('click', resetData);
    elResumeBtn.addEventListener('click', togglePause);
}

// --- Game Logic ---
function startGame() {
    if (isPlaying) return;


    currentScore = 0;
    timeRemaining = 10.0;
    isPlaying = true;
    isPaused = false;
    clickTimestamps = [];
    comboCount = 0;
    achievementsEarned.clear();

    elClickBtn.disabled = false;
    elStartBtn.disabled = true;
    elPauseBtn.disabled = false;
    elVideo.classList.remove('active');

    sounds.start();
    tickAudio.currentTime = 0;
    tickAudio.play().catch(e => console.log("Audio play failed:", e));
    updateDisplay();
    setStatus("GO GO GO!!");

    gameInterval = setInterval(updateTick, 100);
}

function updateTick() {
    if (isPaused) return;

    timeRemaining -= 0.1;
    if (timeRemaining <= 0) {
        timeRemaining = 0;
        endGame();
    }

    calculateCPS();
    updateDisplay();
    checkAchievements();
}

function handleClick() {
    if (!isPlaying || isPaused) return;

    currentScore++;
    const now = Date.now();
    clickTimestamps.push(now);

    // Combo Logic
    if (now - lastClickTime < 500) {
        comboCount++;
    } else {
        comboCount = 0;
    }
    lastClickTime = now;

    sounds.click();
    updateComboDisplay();
    triggerClickFeedback();
}

function calculateCPS() {
    const now = Date.now();
    clickTimestamps = clickTimestamps.filter(ts => now - ts < 1000);
    cps = clickTimestamps.length;
}

function endGame() {
    clearInterval(gameInterval);
    isPlaying = false;
    elClickBtn.disabled = true;
    elStartBtn.disabled = false;
    elPauseBtn.disabled = true;
    elStartBtn.textContent = "NEW ATTEMPT";

    sounds.end();
    tickAudio.pause();
    tickAudio.currentTime = 0;

    const isNewHigh = currentScore > highScore;
    if (isNewHigh) {
        highScore = currentScore;
        localStorage.setItem('highScore', highScore);
        triggerVictory();
    }

    showGameOverOverlay(isNewHigh);
}

function triggerVictory() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f2ff', '#7000ff', '#ff00ea']
    });
    elVideo.classList.add('active');
    elVideo.play();
}

function togglePause() {
    if (!isPlaying) return;
    isPaused = !isPaused;

    if (isPaused) {
        elOverlay.classList.add('active');
        elOverlayTitle.textContent = "PAUSED";
        elOverlayMsg.textContent = "READY TO JUMP BACK IN?";
        elClickBtn.disabled = true;
        tickAudio.pause();
    } else {
        elOverlay.classList.remove('active');
        elClickBtn.disabled = false;
        tickAudio.play().catch(e => console.log("Audio play failed:", e));
    }
}
function resetData() {
    if (confirm("ERASE ALL HIGH SCORES AND DATA?")) {
        localStorage.removeItem('highScore');
        highScore = 0;
        updateDisplay();
        setStatus("SYSTEM WIPED.");
    }
}

// --- Visual Updates ---
function updateDisplay() {
    elCurrentScore.textContent = currentScore;
    elHighScore.textContent = highScore;
    elTimer.textContent = timeRemaining.toFixed(1);
    elCPS.textContent = cps.toFixed(1);

    // Timer Urgency
    if (timeRemaining < 3 && isPlaying) {
        elTimer.classList.add('urgent');
    } else {
        elTimer.classList.remove('urgent');
    }

    // CPS Bar
    const barWidth = Math.min((cps / 15) * 100, 100);
    elCPSBar.style.width = `${barWidth}%`;

    // Screen Shake based on CPS
    if (cps > 10) {
        elContainer.classList.add('shake');
    } else {
        elContainer.classList.remove('shake');
    }
}

function updateComboDisplay() {
    if (comboCount > 2) {
        elComboContainer.classList.add('active');
        elComboMultiplier.textContent = `x${comboCount}`;
        elComboLabel.textContent = "COMBO!!";
        if (comboCount % 5 === 0) sounds.combo();
    } else {
        elComboContainer.classList.remove('active');
    }
}

function triggerClickFeedback() {
    elClickBtn.style.transform = 'scale(0.95)';
    setTimeout(() => elClickBtn.style.transform = '', 50);
}

function setStatus(msg) {
    elStatusMsg.textContent = msg;
}

function checkAchievements() {
    const earn = (id, title, desc) => {
        if (!achievementsEarned.has(id)) {
            achievementsEarned.add(id);
            showAchievement(title, desc);
        }
    };

    if (cps >= 10) earn('cps10', 'SPEED DEMON', 'Reached 10 Clicks Per Second!');
    if (comboCount >= 20) earn('combo20', 'UNSTOPPABLE', '20+ Click Combo Streak!');
    if (currentScore >= 50) earn('score50', 'HARD HITTER', 'Hit 50 total clicks!');
}

function showAchievement(title, desc) {
    sounds.achievement();
    elAchievementTitle.textContent = title;
    elAchievementDesc.textContent = desc;
    elAchievementPopup.classList.add('show');
    setTimeout(() => {
        elAchievementPopup.classList.remove('show');
    }, 4000);
}

function showGameOverOverlay(isHigh) {
    elOverlay.classList.add('active');
    elOverlayTitle.textContent = isHigh ? "NEW RECORD!" : "TIME'S UP!";
    elOverlayMsg.innerHTML = `
        SCORE: ${currentScore}<br>
        BEST: ${highScore}<br>
        CPS: ${cps.toFixed(1)}
    `;
    elResumeBtn.textContent = "CLOSE";
    elResumeBtn.onclick = () => {
        elOverlay.classList.remove('active');
        elResumeBtn.textContent = "RESUME";
        elResumeBtn.onclick = togglePause;
    };
}

// Initialize on Load
window.addEventListener('load', init);