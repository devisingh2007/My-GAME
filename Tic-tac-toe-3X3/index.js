const boxes = document.querySelectorAll(".btn");
//consol.log(boxes);

var player = true; // player0 = true ,player1==false; 

const winner = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
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

        if (btn1 != "" && btn2 != "" && btn3 != "") {
            if (btn1 === btn2 && btn2 === btn3) {
                if (btn1 == "O") {
                    console.log("the winner is playerO");
                }
                else {
                    console.log("the winner is player1");
                }
                disablebtn();
            }
        }

    }
};

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (player) {
            //console.log(box.innerHTML);
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

const savedata=document.getElementById("savesessionbtn");
const winnerboard=document.getElementById("winner-board");

