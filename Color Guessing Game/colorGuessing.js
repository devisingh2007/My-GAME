var colorDisplay = document.querySelector('#colorDisplay');
var messageDisplay = document.querySelector('#message');
var currentStreakDisplay = document.querySelector('#CurrentStreak');
var bestStreakDisplay = document.querySelector('#bestStreak');
var colorBoxes = document.querySelectorAll('.color-box');
var newRoundBtn = document.querySelector('#newRoundBtn');
var easyBtn = document.querySelector('#easyBtn');
var hardBtn = document.querySelector('#hardBtn');
var resetStreakBtn = document.querySelector('#resetStreakBtn');
var btnTrack = document.querySelector('.color-box-container');//--> 6 box ka baap
var video = document.querySelector('#video');
var image = document.querySelector('#image');
var currentStreak = 0;
var bestStreak = 0;
//var currectColor = null;
var color = [];
var num = 6;
var pickCorrectColor = 0;


function webLoad() {
    onload();
    setGame();
    displayContent();
}


// whenever the website will load then first it will load the entire data....
function onload() {
    var temp = localStorage.getItem('highBestStreak');

    if (temp != null) {
        bestStreak = parseInt(temp);  //-->here the local organ contains the data so it will return the data not null.
    }
    else {
        bestStreak = 0;  //--> if there is no data in localstorage so it wwill return null instead of number.
    }

}
// here we difine the display content message in a functions format..
function displayContent() {
    currentStreakDisplay.textContent = currentStreak;
    bestStreakDisplay.textContent = bestStreak;

}

function statuMsg(msg) {
    messageDisplay.textContent = msg;
}

function forEays() {
    easyBtn.style.backgroundColor = "white";
    easyBtn.style.color = "Black";
    hardBtn.style.backgroundColor = "Black";
    hardBtn.style.color = "white";
    color.length = 3;
    num = 3

    for (var i = 3; i < 6; i++) {
        colorBoxes[i].style.display = "none";
    }

}
function forhard() {
    hardBtn.style.backgroundColor = "white";
    hardBtn.style.color = "Black";
    easyBtn.style.backgroundColor = "Black";
    easyBtn.style.color = "white";
    color.length = 6;
    num = 6
    for (var i = 0; i < 6; i++) {
        colorBoxes[i].style.display = "block";
    }

}

//random color generator
function colorGenerate() {
    var a = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    var c = Math.floor(Math.random() * 256);
    return `rgb(${a}, ${b}, ${c})`;
}
function generateColor(num) { // num->6 i=0,color generate ->rgb(122,25,88),,,,,,,i=6-> colorGenerate 
    const arr = [];
    for (var i = 0; i < num; i++) {
        arr.push(colorGenerate());
    }
    return arr;
}

function pickGenerator() {
    const pic = Math.floor(Math.random() * color.length);
    console.log(color.length)
    return color[pic];
}



function setGame() {

    color = generateColor(num);
    console.log(color);
    pickCorrectColor = pickGenerator();

    console.log(pickCorrectColor);
    colorDisplay.textContent = pickCorrectColor;

    for (var i = 0; i < color.length; i++) {
        colorBoxes[i].style.backgroundColor = color[i];
    }
    video.style.display = "none";
    image.style.display = "block";

}
//for auto reset
function timer() {
    var timerepet = 0;
    var time = setInterval(function () {
        timerepet++;
        setGame();
        if (timerepet > 0) {
            clearInterval(time)
        }
        statuMsg("Next Round Starting...")
    }, 1500)
}


//parent box me addeventlisner  if-->parent par lagaya jishshe ham iske chils par kam kar shake

function trackBtn(event) {
    const element = event.target;
    console.log(element)
    const rgb = element.style.backgroundColor;
    console.log(rgb)
   var right=0;
    if (rgb === pickCorrectColor) {
        currentStreak++;
        displayContent();
        statuMsg("🎉 You Win!")
        element.disabled = true;
        for (var i = 0; i < 6; i++) {
            colorBoxes[i].style.backgroundColor = rgb;
            colorBoxes[i].style.opacity = "1";
        }
        video.style.display = "block";
        image.style.display = "none";
        if (currentStreak > bestStreak) {

            localStorage.setItem('highBestStreak', currentStreak)
            bestStreak = currentStreak

            webLoad();
            displayContent();

        }
        timer()




    }
    else {
        right++;
        statuMsg(` ❌ Try Again! your current Streak is ${currentStreak}  ${right}`)
        currentStreak = 0;
        displayContent();
        
          timer()

 onload();

    }
}


btnTrack.addEventListener('click', trackBtn);
hardBtn.addEventListener('click', forhard)
easyBtn.addEventListener('click', forEays);
resetStreakBtn.addEventListener('click', () => {
    currentStreak = 0;
    localStorage.removeItem('highBestStreak');
    webLoad();
    displayContent();
    statuMsg("🔄 Streak Reset!");

});
newRoundBtn.addEventListener('click', () => {
    currentStreak = 0;

    displayContent();
    webLoad();
})

webLoad();