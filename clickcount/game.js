var currentScore = document.querySelector('#currentScore');
var highScore = document.querySelector('#highScore');
var timer = document.querySelector('#timer');
var clickButton = document.querySelector('#clickButton');
var startButton = document.querySelector('#startButton');
var pauseButton = document.querySelector('#pauseButton'); // <-- new pause button
var resetButton = document.querySelector('#resetButton');
var statusMessage = document.querySelector('#statusMessage');
var video = document.querySelector('#video');
var newname = prompt("enter your name");
var body=document.querySelector('body');
var CPS=document.querySelector('#CPS');



var current = 0;
var high = 0;
var time1 = 10;
var track = false;
var idTrack = null;
var paused = false; //
var highestScorer = null;
var name = newname;
var cps=null;



function loadContent() {
    dataLoad();
    displayMessage();
}

function dataLoad() {
    var temp = localStorage.getItem('highScore');
    var highname = localStorage.getItem('highestScorername');
    if (temp != null) {
        high = parseInt(temp);
        highestScorer = highname;
    } else {
        high = 0;
    }
}

function displayMessage() {

    currentScore.textContent = current;
    if (current > 20) {
        currentScore.style.color = "red";
    }
    else {
        currentScore.style.color = "white";

    }
    highScore.textContent = high;
    timer.textContent = time1;
    CPS.textContent=cps;
}

function statuMsg(msg) {
    statusMessage.textContent = msg;
}



function endGame() {
    clearInterval(idTrack);
    track = false;
    clickButton.disabled = true;
    startButton.disabled = false;
    pauseButton.disabled = true;
    cps = current / 10;
   displayMessage()
    startButton.textContent = "Play Again";
    if (current > high) {
        localStorage.setItem('highScore', current);
        localStorage.setItem('highestScorername', name)
        highestScorer = name;
        high = current;
        var x = 0;
        var time2 = setInterval(() => {
            x++;
          //  video.style.display = "block"
          body.style.background="gold"
          
          if (x > 2) {
              //   video.style.display = "none"
              body.style.background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
video.style.display = "block"
                clearInterval('time2');

            }
        }, 1000)


        displayMessage();
        statuMsg(`🎉 Great job! ${name} your score is higher than the ${highestScorer} 🏆     you clicked ${cps} times per Second!`);
    }
    else if (current == high) {
        statuMsg(`😕 Oops!  ${name}  your score is equal to  ${highestScorer}   score. Try again! 💪    you clicked ${cps} times per Second!`)
    }
    else {
        statuMsg(`😕 Oops!  ${name}  your score is lower than   ${highestScorer}   score . Try again! 💪    you clicked ${cps} times per Second!`);
    }
}

function startGame() {
    track = true;
    paused = false;
    time1 = 10;
    current = 0;

    video.style.display = "none";
    clickButton.disabled = false;
    startButton.disabled = true;
    pauseButton.disabled = false;
    statuMsg("🚀 Game started! ⏳");
    clickButton.style.transform = 'scale(1)';
    let timeout = setTimeout(() => {
        statuMsg("🚀 Game started! Click as fast as you can! 🖱⏳");
    }, 1000);

    idTrack = setInterval(function () {
        if (!paused) {
            time1--;

            if (time1 >= 9) {
                clearTimeout(timeout);
            }

            if (time1 <= 8) {
                statuMsg("🚀 Game started! ⏳");
            }
            if (time1 <= 5) {
                statuMsg("🚀 half time is over! Click as fast as you can! 🖱⏳");
            }
            if (time1 <= 0) {
                endGame();
            }
            displayMessage();
        }
    },1000);
}

function clickMe() {
    if (track && !paused) {
        current++;
        displayMessage();
        if (current < 11) {
            clickButton.style.transform = `scale(1.${current})`;
        }
        else {
            clickButton.style.transform = 'scale(1)';
        }
    }


}

function pauseGame() {
    if (!track) return;
    paused = !paused;
    if (paused) {
        statuMsg("⏸ Game paused! Click resume to continue!");
        pauseButton.textContent = "Resume";
        clickButton.disabled = true;
    } else {
        statuMsg("▶ Game resumed! Keep clicking!");
        pauseButton.textContent = "Pause";
        clickButton.disabled = false;
    }
}

function resetGame() {
    localStorage.removeItem('highScore');
    localStorage.removeItem('highestScorername');
    clickButton.style.transform = 'scale(1)';
    high = 0;
    current = 0;
    time1 = 10;
    displayMessage();
    statuMsg("🔄 Game has been reset. Ready for a fresh start! 🌟");
    clearInterval(idTrack);
    track = false;
    paused = false;
    startButton.disabled = false;
    clickButton.disabled = true;
    pauseButton.disabled = true;
    pauseButton.textContent = "Pause";
}

startButton.addEventListener('click', startGame);
clickButton.addEventListener('click', clickMe);
pauseButton.addEventListener('click', pauseGame);
resetButton.addEventListener('click', resetGame);
window.addEventListener('load', loadContent);