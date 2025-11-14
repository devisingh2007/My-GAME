const textDisplay = document.querySelector('#textDisplay')
const typingArea = document.querySelector('#typingArea')
const timerDisplay = document.querySelector('#timer')
const wpmDisplay = document.querySelector('#wpm')
const accuracyDisplay = document.querySelector('#accuracy')
const bestWPMDisplay = document.querySelector('#bestWPM')
const startBtn = document.querySelector('#startBtn')
const resetBtn = document.querySelector('#resetBtn')
const time60=document.querySelector('#time-60')
const time30=document.querySelector('#time-30')
const time15=document.querySelector('#time-15')
//test texts

const testTexts = [
    "The quick brown fox jumps over the Lazy dog. Practice makes perfect when learning to type faster.",
    "Technology has revolutionized the way we communicate and work in the modern digital era.",
    "Typing speed is an essential skill for anyone working with computers in today's workplace.",
    "ipsum dolor,s optio error, consequuntur libero ullam maxime esse fugiat sapiente labore perspiciatis assumenda repellat dolore vel. Ad, maiores?",
    "asperiores aperiam quaerat veniam, nisi enim mollitia molestiae omnis repellendus similique vel amet at incidunt quibusdam."];


// Game state
let currentText = '';
let timeleft = "--";
let timerInterval = null;
let startTime = null;
let isTestActive = false;
let bestWPM = 0;
startBtn.disabled = true;

function webLoad() {
    onLoad();
    displayContent();
}


function onLoad() {
    var temp = sessionStorage.getItem('previousWpm');
    if (temp != null) {
        bestWPM = parseInt(temp);
    }
    else {
        bestWPM = 0;
    }
}

function displayContent() {
    timerDisplay.textContent = timeleft;
    bestWPMDisplay.textContent = bestWPM;
}

function exteraText()
{
    var extraText=testTexts[Math.floor(Math.random()*testTexts.length)]

    return extraText;
}


function Highlights() {
    var typed = typingArea.value;
    var highlightText = '';
    for (let i = 0; i < currentText.length; i++) {
        if (i < typed.length) {
            if (currentText[i] == typed[i]) {
                highlightText += `<span class="correct">${currentText[i]}</span>`
            }
            else {
                highlightText += `<span class="incorrect">${currentText[i]}</span>`;

            }
        }
        else {
            highlightText += currentText[i];
        }
    }
    textDisplay.innerHTML = highlightText;
}

function updateStatus() {
    var textContent = typingArea.value;

    const word = textContent.trim().split(/\s+/).filter(w => w.length > 0);
    // console.log(word);
    const minute = (Date.now() - startTime) / 1000 / 60;
    //console.log(minute)
    const wpm = minute > 0 ? Math.floor(word.length / minute) : 0;
    wpmDisplay.textContent = wpm;

    var currentScore = 0;
    for (var i = 0; i < currentText.length; i++) {
        if (currentText[i] === textContent[i]) {
            currentScore++;


        }

    }
    const accuracy = (textContent.length > 0) ? Math.floor((currentScore / textContent.length) * 100) : 0;
    accuracyDisplay.textContent = accuracy + "%";
     if (wpm > bestWPM) {
         bestWPM = wpm;
        sessionStorage.setItem('previousWpm',bestWPM)
        bestWPMDisplay.textContent=bestWPM;
        
        
        
    }


}
function timer60()
{
    timeleft=60;
    displayContent()
    startBtn.disabled = false;
    
    time30.style.pointerEvents="none";
    time30.classList.add('disabled')
    time15.classList.add('disabled')
    time15.style.pointerEvents="none";
}
function timer30()
{
    timeleft=30;
    displayContent()
   startBtn.disabled = false;
    time60.style.pointerEvents="none";
   time60.classList.add('disabled')
    time15.classList.add('disabled')
    time15.style.pointerEvents="none";
}
function timer15()
{
    timeleft=15;
    displayContent()
   startBtn.disabled = false;
    time60.style.pointerEvents="none";
     time30.classList.add('disabled')
    time60.classList.add('disabled')
    time30.style.pointerEvents="none";
   
}

function startGame() {
    time60.style.pointerEvents="none";
    time30.style.pointerEvents="none";
    time15.style.pointerEvents="none";
    startBtn.disabled = true;
    wpmDisplay.textContent=0;
    accuracyDisplay.textContent=100+"%"
    
    //[5                4         3            1                  2      ]
    currentText = testTexts[Math.floor(Math.random() * testTexts.length)];
    console.log(currentText);
    textDisplay.textContent = currentText;
    
    typingArea.disabled = false;
    typingArea.value = "";
    typingArea.focus();
    typingArea.setAttribute('placeholder', 'now you are eligible to write and use the input box....')
    timerInterval = setInterval(() => {
        timeleft--;
        {

            // if(timeleft>15&&timeleft<35&&currentText.length==textContent.length&& currentScore==currentText.length)
            // {
            //     textDisplay.textContent=exteraText();
            //     displayContent();

            // }
            if (timeleft <= 0) {
                endGame();
            }
        }
        displayContent();
    }, 50);



}

function wordType() {
    if (startTime == null) {
        startTime = Date.now();

    }
    updateStatus();
    Highlights();
}


function endGame() {
    clearInterval(timerInterval)
     startBtn.disabled = true;
    typingArea.disabled = true;
    timeleft = "-";
    time60.style.pointerEvents="auto";
    time30.style.pointerEvents="auto";
    time15.style.pointerEvents="auto";
      time30.classList.remove('disabled')
    time60.classList.remove('disabled')
    time15.classList.remove('disabled')
    displayContent();
}
function reset()
{
    sessionStorage.removeItem('previousWpm');
   
    bestWPM=0;
    bestWPMDisplay.textContent=bestWPM;
    

}
time60.addEventListener('click',timer60);
time30.addEventListener('click',timer30);
time15.addEventListener('click',timer15);
startBtn.addEventListener('click', startGame);
typingArea.addEventListener('input', wordType);
resetBtn.addEventListener('click',reset)

webLoad();