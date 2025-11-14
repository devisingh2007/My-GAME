//1
const board = document.getElementById("board");
const movesEl = document.getElementById("moves");
const pairsEl = document.getElementById("pairs");
const timeEl = document.getElementById("timeLeft");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const resetBtn = document.getElementById("resetBtn");
const bestScoreEl = document.getElementById("bestScore");
const overlay = document.getElementById("countdownOverlay");

//2
// Game configuration
const rows = 3; // grid layout chosen via CSS; use 6x3 = 18 cards (9 pairs)
const cols = 6;
const totalPairs = 9;
const initialTime = 60; // seconds
// State
let firstcard = null;
let secondCard = null;
let busy = false;
let moves = 0;
let matchedPairs = 0;
let timeLeft = initialTime;
let timerId = null;
let pendingTimeouts = [];
let bestScore = null;

//3
function onLoad() {
  var temp = localStorage.getItem("bestPair");
  if (temp != null) {
    bestScore = parseInt(temp);
  } else {
    bestScore = 0;
  }
}

//4
function displayContent() {
  timeEl.textContent = timeLeft;
  bestScoreEl.textContent = bestScore;
  movesEl.textContent = moves;
}

//7
function CreateCard(value) {
  const card = document.createElement("div");
  card.classList.add("card");

  const inner = document.createElement("div");
  inner.classList.add("inner");

  const front = document.createElement("div");
  front.classList.add("front");
  front.textContent = "";

  const back = document.createElement("div");
  back.classList.add("back");
  back.textContent = value;

  inner.appendChild(front);
  inner.appendChild(back);

  card.appendChild(inner);

  return card;
}

//5
//shuffle
var num1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
function shuffle(num2) {
  console.log(num2);
  for (let i = num2.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    console.log(j);
    [num2[i], num2[j]] = [num2[j], num2[i]];
  }
  return num2;
}
function displayValue()
{
    
}


//4
function createBoxGame() {
  //8++
  board.innerHTML = ``; //8--
  const reshuffleNumber = shuffle([...num1, ...num1]);
  console.log(reshuffleNumber);

  //6
  reshuffleNumber.forEach((value) => {
    const card = CreateCard(value);
    console.log(card);
    board.appendChild(card);

    //9++
    card.addEventListener('click',()=>
    {
        displayValue(card);
    })
  });
}

createBoxGame();
onLoad();
displayContent();
