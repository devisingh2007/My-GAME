const boxes = document.querySelectorAll(".btn");
var player1=prompt("Enter name of  player1");
var player2=prompt("Enter name of  player2");

var player = true;

const winner = [

   [0,1,2,3],[1,2,3,4],[2,3,4,5],
  [6,7,8,9],[7,8,9,10],[8,9,10,11],
  [12,13,14,15],[13,14,15,16],[14,15,16,17],
  [18,19,20,21],[19,20,21,22],[20,21,22,23],
  [24,25,26,27],[25,26,27,28],[26,27,28,29],
  [30,31,32,33],[31,32,33,34],[32,33,34,35],

 [0,6,12,18],[6,12,18,24],[12,18,24,30],
  [1,7,13,19],[7,13,19,25],[13,19,25,31],
  [2,8,14,20],[8,14,20,26],[14,20,26,32],
  [3,9,15,21],[9,15,21,27],[15,21,27,33],
  [4,10,16,22],[10,16,22,28],[16,22,28,34],
  [5,11,17,23],[11,17,23,29],[17,23,29,35],

  [0,7,14,21],[1,8,15,22],[2,9,16,23],
  [6,13,20,27],[7,14,21,28],[8,15,22,29],
  [12,19,26,33],[13,20,27,34],[14,21,28,35],

  [3,8,13,18],[4,9,14,19],[5,10,15,20],
  [9,14,19,24],[10,15,20,25],[11,16,21,26],
  [15,20,25,30],[16,21,26,31],[17,22,27,32]

];

function disablebtn() {
    for (var b of boxes) {
        b.innerHTML = "";
        b.disabled = false;
    }
}
function displaywinner() {
    for (let row of winner) {
        var btn1 = boxes[row[0]].innerHTML;
        var btn2 = boxes[row[1]].innerHTML;
        var btn3 = boxes[row[2]].innerHTML;
        var btn4 = boxes[row[3]].innerHTML;
       


        if (btn1 != "" && btn2 != "" && btn3 != "" && btn4 != "" ) {
            if (btn1 === btn2 && btn2 === btn3 && btn3 === btn4) {
                if (btn1 == "O") {
                    console.log("the winner is "+player1);
                }
                else {
                    console.log("the winner is "+player2);
                }
                disablebtn();
            }
        }

    }
};

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (player) {

            box.innerHTML = "O";
            player = false;


        }
        else {
            box.innerHTML = "X";
            player = true;

        }
        box.disabled = true;
        displaywinner();
    });

});