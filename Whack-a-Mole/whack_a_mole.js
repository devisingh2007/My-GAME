const scoreDisplay = document.querySelector('#score');
const timeLeftDisplay = document.querySelector('#timeLeft');
const maxScoreDisplay = document.querySelector('#maxScore');
const startBtn = document.querySelector('#startBtn');
const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const resetBtn = document.querySelector('#resetBtn');
const pauseBtn = document.querySelector('#pauseBtn');

//variable

var score = 0;
var time = 30;
var bestScore = 0;
var playGame = false;
var gameId = null;

//common function

function webload() {
    onLoad();
    displayContent();
}
function onLoad() {
    var tamp = localStorage.getItem('highScoreMole')
    bestScore = (tamp != null) ? (bestScore = tamp) : (bestScore = 0);
};

function displayContent() {
    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = time;
    maxScoreDisplay.textContent = bestScore;
}
function endGame() {
    clearInterval(gameId);
    startBtn.disabled = false;
    playGame = false;
    if (score > bestScore) {
        localStorage.setItem('highScoreMole', score);
        bestScore = score;
        score = 0;
        alert(`you have scored max score then previous : ${bestScore}`);
    }
    else {
        alert(`you have current score is : ${bestScore}`)
    }
    displayContent();
}

function randomtime(min, max) {
    return Math.floor(Math.random() * (max - min) + max);
}

function randomHole() {
    var index = Math.floor(Math.random() * holes.length);
    return holes[index];
}
function popGame() {
    var timer = randomtime(500, 800);
    var hole = randomHole();
    var mole = hole.querySelector('.mole');
    if (playGame) {
        mole.classList.add('up');
        setTimeout(function () {
            mole.classList.remove('up');
            if (playGame) {
                popGame();
            }
        }, timer);
    }
}
// setTimeOut ot will wait  for some time than call again

function startGame() {
    time = 30;
    score = 0;
    startBtn.disabled = true; // true means btn is disabled
    playGame = true;
    popGame();
    gameId = setInterval(function () {
        time--;
        if (time == 0) {
            endGame();
        }
        displayContent();
    }, 1000);
}

function bonk(event) {
    if (!event.isTrusted) return;
    if (playGame == false) return;
    if (event.target.classList.contains('up')) {  // Only increment score if mole is up
        score++;
        event.target.classList.remove('up');
        event.target.classList.add('bonked');
        displayContent();  // Update the score display
        setTimeout(function () {
            event.target.classList.remove('bonked');
        }, 300);
    }
}
function resetGame(){
    localStorage.removeItem('highScoreMole');
    score = 0;
    bestScore = 0;
    playGame = false;
    time = 30;
    timeLeftDisplay.textContent = time;
    startBtn.disabled = false;
    clearInterval(gameId);
    
    // Reset all moles (remove up and bonked classes if any)
    moles.forEach(mole => {
        mole.classList.remove('up', 'bonked');
    });
    
    displayContent();
    alert('Game has been reset. All scores cleared!');
}

function pauseGame(){

    
    
}
webload();
moles.forEach(box => {
    box.addEventListener('click', bonk);  // Just pass the function reference
});
startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
pauseBtn.addEventListener('click', pauseGame);