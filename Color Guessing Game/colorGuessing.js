// RGB Master - Core Game Logic
const colorDisplay = document.querySelector("#colorDisplay");
const messageDisplay = document.querySelector("#message");
const currentStreakDisplay = document.querySelector("#CurrentStreak");
const bestStreakDisplay = document.querySelector("#bestStreak");
const comboBadge = document.querySelector("#comboBadge");
const colorBoxContainer = document.querySelector("#colorBoxContainer");
const newRoundBtn = document.querySelector("#newRoundBtn");
const easyBtn = document.querySelector("#easyBtn");
const hardBtn = document.querySelector("#hardBtn");
const resetStreakBtn = document.querySelector("#resetStreakBtn");
const bgVideo = document.querySelector("#bgVideo");

let currentStreak = 0;
let bestStreak = localStorage.getItem("highBestStreak") ? parseInt(localStorage.getItem("highBestStreak")) : 0;
let colors = [];
let difficulty = 6;
let pickedColor;
let isGameActive = true;
let comboMultiplier = 1;

function init() {
  setupModeButtons();
  setupActionButtons();
  syncDifficultyUI();
  resetGame();
  bestStreakDisplay.textContent = bestStreak;
}

function syncDifficultyUI() {
  const thumb = document.querySelector(".toggle-thumb");
  if (difficulty === 6) {
    hardBtn.classList.add("selected");
    easyBtn.classList.remove("selected");
    if (thumb) thumb.style.transform = "translateX(22px)";
  } else {
    easyBtn.classList.add("selected");
    hardBtn.classList.remove("selected");
    if (thumb) thumb.style.transform = "translateX(0)";
  }
}

function setupModeButtons() {
  const thumb = document.querySelector(".toggle-thumb");

  easyBtn.addEventListener("click", function () {
    difficulty = 3;
    this.classList.add("selected");
    hardBtn.classList.remove("selected");
    if (thumb) thumb.style.transform = "translateX(0)";
    resetGame();
  });

  hardBtn.addEventListener("click", function () {
    difficulty = 6;
    this.classList.add("selected");
    easyBtn.classList.remove("selected");
    if (thumb) thumb.style.transform = "translateX(22px)";
    resetGame();
  });
}

function setupActionButtons() {
  newRoundBtn.addEventListener("click", () => {
    currentStreak = 0;
    comboMultiplier = 1;
    updateStats();
    resetGame();
  });

  resetStreakBtn.addEventListener("click", () => {
    currentStreak = 0;
    comboMultiplier = 1;
    bestStreak = 0;
    localStorage.removeItem("highBestStreak");
    updateStats();
    resetGame();
    showMessage("SYSTEM RESET COMPLETE");
  });
}

let pressureTimer;

function resetGame() {
  isGameActive = true;
  colors = generateRandomColors(difficulty);
  pickedColor = pickColor();
  colorDisplay.textContent = pickedColor.toUpperCase();

  // UI Cleanup
  colorBoxContainer.innerHTML = "";
  messageDisplay.textContent = "SELECT THE FREQUENCY";
  messageDisplay.style.color = "var(--primary)";

  // Smooth video fade out if it was on
  bgVideo.classList.remove("visible");
  setTimeout(() => {
    if (!bgVideo.classList.contains("visible")) {
      bgVideo.style.display = "none";
    }
  }, 2000);

  document.body.classList.remove("pressure-active");
  clearTimeout(pressureTimer);

  // Start pressure pulse after 5 seconds of hesitation
  pressureTimer = setTimeout(() => {
    if (isGameActive) {
      document.body.classList.add("pressure-active");
      showMessage("TIME IS RUNNING OUT...");
    }
  }, 5000);

  createColorBoxes();
}

function createColorBoxes() {
  for (let i = 0; i < colors.length; i++) {
    const box = document.createElement("div");
    box.classList.add("color-box");
    box.style.backgroundColor = colors[i];

    box.addEventListener("click", function () {
      if (!isGameActive) return;
      handleChoice(this, colors[i]);
    });

    colorBoxContainer.appendChild(box);
  }
}

function handleChoice(element, color) {
  if (color === pickedColor) {
    handleWin(element);
  } else {
    handleLoss(element);
  }
}

function handleWin(element) {
  isGameActive = false;
  currentStreak++;
  clearTimeout(pressureTimer);
  document.body.classList.remove("pressure-active");

  // Combo Logic
  if (currentStreak % 3 === 0) comboMultiplier++;

  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
    localStorage.setItem("highBestStreak", bestStreak);
  }

  showMessage("ACCESS GRANTED - HARMONIC MATCH");
  element.style.boxShadow = "0 0 30px white, 0 0 60px " + pickedColor;

  // Sync with Visual FX if exists
  if (window.vFX) {
    const rect = element.getBoundingClientRect();
    window.vFX.createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, pickedColor);
  }

  updateStats();
  changeAllToWinnerColor(pickedColor);

  // Trigger video on milestones with smooth fade
  if (currentStreak >= 5) {
    bgVideo.style.display = "block";
    // Force reflow for transition
    bgVideo.offsetHeight;
    bgVideo.classList.add("visible");
    bgVideo.play();
  }

  setTimeout(resetGame, 1800);
}

function handleLoss(element) {
  isGameActive = false;
  currentStreak = 0;
  comboMultiplier = 1;
  clearTimeout(pressureTimer);
  document.body.classList.remove("pressure-active");

  showMessage("ACCESS DENIED - FREQUENCY MISMATCH");
  element.classList.add("shake");
  messageDisplay.style.color = "var(--accent)";

  updateStats();

  setTimeout(() => {
    element.style.opacity = "0";
    setTimeout(resetGame, 1000);
  }, 500);
}

function changeAllToWinnerColor(color) {
  const boxes = document.querySelectorAll(".color-box");
  boxes.forEach(box => {
    box.style.backgroundColor = color;
    box.style.opacity = "1";
  });
}

function pickColor() {
  const random = Math.floor(Math.random() * colors.length);
  return colors[random];
}

function generateRandomColors(num) {
  const arr = [];
  // Dynamic difficulty: shades get closer as streak increases
  // Hard mode (num=6) starts with a more challenging variance
  const startVariance = num === 6 ? 120 : 255;
  const variance = Math.max(20, startVariance - (currentStreak * 15));

  // First color is truly random or base for the round
  const baseR = Math.floor(Math.random() * 256);
  const baseG = Math.floor(Math.random() * 256);
  const baseB = Math.floor(Math.random() * 256);

  for (let i = 0; i < num; i++) {
    const isHardTarget = num === 6 || currentStreak > 3;

    if (isHardTarget) {
      // Generate colors close to each other
      const r = clamp(baseR + (Math.random() - 0.5) * variance);
      const g = clamp(baseG + (Math.random() - 0.5) * variance);
      const b = clamp(baseB + (Math.random() - 0.5) * variance);
      arr.push(`rgb(${r}, ${g}, ${b})`);
    } else {
      arr.push(randomColor());
    }
  }
  return arr;
}

function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

function clamp(val) {
  return Math.min(255, Math.max(0, Math.floor(val)));
}

function updateStats() {
  currentStreakDisplay.textContent = currentStreak;
  bestStreakDisplay.textContent = bestStreak;

  const oldCombo = comboBadge.textContent;
  comboBadge.textContent = `x${comboMultiplier}`;

  if (`x${comboMultiplier}` !== oldCombo) {
    comboBadge.classList.remove("pop");
    void comboBadge.offsetWidth; // Force reflow
    comboBadge.classList.add("pop");
  }

  if (currentStreak >= 3) {
    currentStreakDisplay.classList.add("pulse");
  } else {
    currentStreakDisplay.classList.remove("pulse");
  }
}

function showMessage(msg) {
  messageDisplay.textContent = msg;
}

// Start the engine
init();

