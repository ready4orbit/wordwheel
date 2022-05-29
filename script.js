/**
How to test on a local server

Go to Teminal and type

cd Documents/Web

then

python -m SimpleHTTPServer

You should then be able to access at http://localhost:8000

References: 
https://workshops.hackclub.com/spinning_wheel/
https://www.freecodecamp.org/news/build-a-wordle-clone-in-javascript/
**/

import { WORDS } from "./wheel.js";
import { CLUES } from "./wheel.js";

const NUMBER_OF_WORDS = WORDS.length;
let animDelay = 6;
let currentGuess = '';
let currentGuesses = Array(NUMBER_OF_WORDS);
let thisLetter = 0;
let curClue = 0;
let leftLineColor = '#aaaaaa';
let rightLineColor = '#aaaaaa';

let gameOver = false;

// don't need after setting new checkAnswer function
let rightGuessString = WORDS[Math.floor(Math.random() * NUMBER_OF_WORDS)]



function initBoard(varClue) {
    let readableClueNum = varClue+1;
    
    // create board
    let board = document.getElementById("game-board");
    
    thisLetter = 0;
    
    // check if existing guess
    if (currentGuesses[curClue] != '' && currentGuesses[curClue] != undefined) {
        currentGuess = currentGuesses[curClue]
    } else {
        currentGuess = '';
    }
    
    
    board.innerHTML = ""; //reset gameboard
    
    // create lines
    let gameLines = document.createElement("div")
    let leftLine = document.createElement("div")
    let rightLine = document.createElement("div")
    gameLines.id= "game-lines"
    leftLine.id = "game-lines-left"
    rightLine.id = "game-lines-right"
    
    // if first and last letter set, change color
    let checkFirst = currentGuess.slice(0,1);
    if (checkFirst != '' && checkFirst != ' ') {
        leftLineColor = '#000000';
    } else {
        leftLineColor = '#aaaaaa';
    }
    
    let checkLast = currentGuess.slice(WORDS[varClue].length - 1,WORDS[varClue].length);
    if (checkLast != '' && checkLast != ' ') {
        rightLineColor = '#000000';
    } else {
        rightLineColor = '#aaaaaa';
    }
    
    leftLine.style.backgroundColor = leftLineColor;
    rightLine.style.backgroundColor = rightLineColor;
    gameLines.appendChild(leftLine)
    gameLines.appendChild(rightLine)
    board.appendChild(gameLines)
    
    // show clue number
    let clueNumber = document.createElement("div")
    clueNumber.className = "clue-number"
    clueNumber.textContent = "#"+readableClueNum
    board.appendChild(clueNumber)
    
    // create word boxes
    let row = document.createElement("div")
    row.className = "letter-row"
    
    // active letter parameters
    let emptyWord = false;
    let lastLetter = 0;
    let firstEmpty = 0;

    for (let j = 0; j < WORDS[varClue].length; j++) {
        let box = document.createElement("div")
        
        // right size the input word
        var styleSize = "letter-box"
        box.className = styleSize
        
        if (WORDS[varClue].length <= 6) {
            styleSize = styleSize.concat("-6")
        } else if (WORDS[varClue].length > 6) {
            styleSize = styleSize.concat("-",WORDS[varClue].length)
        }
        
        box.classList.add(styleSize)
        
        // if it isn't the last box, give it a right margin
        if (j < WORDS[varClue].length - 1) {
            box.style.marginRight = "4px"
        }
        
        // add letter if there is already a guess
        if (currentGuess[j] != '' && currentGuess[j] != undefined) {
            box.textContent = currentGuess[j]
            
            if (currentGuess[j] != ' ') {
                box.classList.add("filled-box")
                lastLetter = j + 1;
            } else {
                if (emptyWord == false) {
                    firstEmpty = j;
                }
                emptyWord = true
            }
        }
        
        row.appendChild(box)
    }
    
    logGuess();
    
    // set active letter
    if (emptyWord == false) {
        thisLetter = lastLetter;
    } else {
        thisLetter = firstEmpty;
    }

    board.appendChild(row)
    
    // show clue
    let clueText = document.createElement("div")
    clueText.className = "clue"
    clueText.textContent = CLUES[varClue]
    board.appendChild(clueText)
    
    // set progress
    let progressBar = document.getElementById("progress-bar");
    progressBar.innerHTML = "";
    
    for (let k = 0; k < NUMBER_OF_WORDS; k++) {
        let progressDot = document.createElement("div")
        progressDot.textContent = '•'
        
        // if active doc
        if (k == varClue) {
            progressDot.classList.add("active-dot")
        }
        
        progressBar.appendChild(progressDot)
    }
}

initBoard(curClue)

function insertLetter (pressedKey) {
    var spacer = ' ';
    
    // if this is the first letter, add to end of previous word
    if (thisLetter === 0) {
        var prevClue = curClue - 1;
        if (prevClue < 0) {
            prevClue = WORDS.length - 1;
        }
        
        // if previous guess if undefined
        if (currentGuesses[prevClue] == undefined) {
            var prevGuess = '';
            
            for (var i = 1; i <= WORDS[prevClue].length; i++) {
                if (i < WORDS[prevClue].length) {
                    prevGuess = prevGuess.concat(spacer);
                } else if (i = WORDS[prevClue].length) {
                    prevGuess = prevGuess.concat(pressedKey);
                }
            }
            
            currentGuesses.splice(prevClue, 1, prevGuess);
        } else {
            var prevGuess = '';
            
            for (var i = 1; i <= WORDS[prevClue].length; i++) {
                if (i < WORDS[prevClue].length) {
                    // if there is a letter keep it, otherwise add a space
                    let checkLetter = currentGuesses[prevClue].slice(i-1,i);
                    if (checkLetter != undefined) {
                        prevGuess = prevGuess.concat(checkLetter)
                    } else {
                        prevGuess = prevGuess.concat(spacer)
                    }
                } else if (i = WORDS[prevClue].length) {
                    // if at end, add letter
                    prevGuess = prevGuess.concat(pressedKey);
                }
            }
            
            currentGuesses.splice(prevClue, 1, prevGuess);
        }
        
        // change line color
        leftLineColor = '#000000';
        let leftLine = document.getElementById("game-lines-left");
        leftLine.style.backgroundColor = leftLineColor;
    }
    
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName("letter-row")[0]
    let box = row.children[thisLetter]
    
    // add to the screen
    box.textContent = pressedKey
    box.classList.add("filled-box")
    
    // FIX THIS WORKIT
    var curGuessStr = currentGuess.substr(0, thisLetter).concat(box.textContent,currentGuess.substr(thisLetter + 1))
    currentGuess = curGuessStr;
    
    thisLetter += 1
    
    // add to the guesses array
    logGuess()
    
    //check if all the guesses are correct
    checkGuesses()
    
    // go to the next word if at the end and set the first letter to this letter
    if (thisLetter == WORDS[curClue].length) {
        var nextClue = curClue + 1;
        if (nextClue >= NUMBER_OF_WORDS) {
            nextClue = 0;
        }
        
        // if next guess if undefined
        if (currentGuesses[nextClue] == undefined) {
            currentGuesses.splice(nextClue, 1, pressedKey);
        } else {
            // FIXIT
            var nextGuess = pressedKey.concat(currentGuesses[nextClue].substr(1));
            
            currentGuesses.splice(nextClue, 1, nextGuess);
        }
        
        // change line color
        rightLineColor = '#000000';
        let rightLine = document.getElementById("game-lines-right");
        rightLine.style.backgroundColor = rightLineColor;
        
        nextWord()
    }
}

function deleteLetter () {
    var spacer = ' ';
    
    if (thisLetter === 0) {
        prevWord()
        return;
    }
    
    // if deleting the first letter, remove the last letter of the previous word
    if (thisLetter == 1) {
        var prevClue = curClue - 1;
        if (prevClue < 0) {
            prevClue = WORDS.length - 1;
        }
        
        
        // if previous guess if undefined
        if (currentGuesses[prevClue] == undefined) {
            var prevGuess = '';
            
            currentGuesses.splice(prevClue, 1, prevGuess);
        } else {
            var prevGuess = '';
            
            for (var i = 1; i <= WORDS[prevClue].length; i++) {
                if (i < WORDS[prevClue].length) {
                    // if there is a letter keep it, otherwise add a space
                    let checkLetter = currentGuesses[prevClue].slice(i-1,i);
                    if (checkLetter != undefined) {
                        prevGuess = prevGuess.concat(checkLetter)
                    } else {
                        prevGuess = prevGuess.concat(spacer)
                    }
                } else if (i = WORDS[prevClue].length) {
                    // if at end, remove letter
                    prevGuess = prevGuess.concat(spacer)
                }
            }
            
            currentGuesses.splice(prevClue, 1, prevGuess);
        }
        
        // change line color
        leftLineColor = '#aaaaaa';
        let leftLine = document.getElementById("game-lines-left");
        leftLine.style.backgroundColor = leftLineColor;
    }
    
    // if deleting the last letter, delete the first letter of the next word
    if (thisLetter === WORDS[curClue].length) {
        var nextClue = curClue + 1;
        if (nextClue >= NUMBER_OF_WORDS) {
            nextClue = 0;
        }
        
        // if next guess if undefined
        if (currentGuesses[nextClue] == undefined) {
            currentGuesses.splice(nextClue, 1, '');
        } else {
            var nextGuess = spacer.concat(currentGuesses[nextClue].slice(1));
            
            currentGuesses.splice(nextClue, 1, nextGuess);
        }
        
        // change line color
        rightLineColor = '#aaaaaa';
        let rightLine = document.getElementById("game-lines-right");
        rightLine.style.backgroundColor = rightLineColor;
    }
    
    let row = document.getElementsByClassName("letter-row")[0]
    let box = row.children[thisLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    
    // WORK FROM HERE WORKIT
    thisLetter -= 1
    
    // remove letter at active position
    
    currentGuess = currentGuess.substr(0, thisLetter).concat(" ", currentGuess.substr(thisLetter + 1))    
    
    // add to the guesses array
    logGuess()
}

function logGuess () {
    //console.log(curClue)
    
    // create string for guesses array
    currentGuesses.splice(curClue, 1, currentGuess)
    
    //console.log(currentGuess)
    //console.log('currentGuess:'+currentGuess)
    console.log(currentGuesses)
}

function nextWord () {
    // function to progress to the next word
    
    curClue++;
    // check if we need to cycle back to the beginning
    if (curClue === NUMBER_OF_WORDS) {
        curClue = 0;
    }

    slideOutClue(curClue,"left");
}

function prevWord () {
    // function to progress to the prev word
    
    curClue--;
    // check if we need to cycle back to the beginning
    if (curClue < 0) {
        curClue = NUMBER_OF_WORDS - 1;
    }

    slideOutClue(curClue,"right");
}

function slideOutClue (curClue, slideDir) {
    for (let i = 0; i <= 50; i++) {
        let delay = animDelay * i
        
        let marginMove = i*4
        let lineBig = 50 + i;
        let lineSmall = 50 - i;
        marginMove = marginMove+"%";
        lineBig = lineBig+"%";
        lineSmall = lineSmall+"%";
        
        if (i < 50) {
            setTimeout(()=> {
                // slide div
                if (slideDir == 'left') {
                    document.getElementById("game-board").style.marginRight = marginMove;
                    
                    document.getElementById("game-lines-right").style.width = lineBig;
                    document.getElementById("game-lines-left").style.width = lineSmall;
                } else {
                    document.getElementById("game-board").style.marginLeft = marginMove;
                    
                    document.getElementById("game-lines-right").style.width = lineSmall;
                    document.getElementById("game-lines-left").style.width = lineBig;
                }

            }, delay)
        } else if (i = 50) {
            setTimeout(()=> {
                // reset board and line color
                initBoard(curClue)
                if (slideDir == 'left') {
                    document.getElementById("game-board").style.marginRight = 0;
                    document.getElementById("game-board").style.marginLeft = marginMove;
                    
                    document.getElementById("game-lines-left").style.width = '100%';
                    document.getElementById("game-lines-right").style.width = '0%';
                } else {
                    document.getElementById("game-board").style.marginLeft = 0;
                    document.getElementById("game-board").style.marginRight = marginMove;
                    
                    document.getElementById("game-lines-left").style.width = '0%';
                    document.getElementById("game-lines-right").style.width = '100%';
                }
                
                slideInClue(slideDir)
            }, delay)
        }
    }
}

function slideInClue(slideDir) {
    for (let k = 0; k <= 50; k++) {
        let delay = animDelay * k
        let j = 50 - k
        
        let marginMove = j*4
        let lineBig = 100 - k;
        let lineSmall = k;
        marginMove = marginMove+"%";
        lineBig = lineBig+"%";
        lineSmall = lineSmall+"%";

        setTimeout(()=> {
            if (slideDir == 'left') {
                document.getElementById("game-board").style.marginLeft = marginMove;
                
                document.getElementById("game-lines-left").style.width = lineBig;
                document.getElementById("game-lines-right").style.width = lineSmall;
            } else {
                document.getElementById("game-board").style.marginRight = marginMove;
                
                document.getElementById("game-lines-left").style.width = lineSmall;
                document.getElementById("game-lines-right").style.width = lineBig;
            }
        }, delay)
    }
}

function checkGuesses () {
    // does the current guess match the current word
    if (currentGuess == WORDS[curClue]) {
        //check all words        
        var z = 0;
        for (var i = 0; i < WORDS.length; i++) {
            if (currentGuesses[i] === WORDS[i]) {
                z++;
            }
        }
        
        if (z == WORDS.length) {
            youWin()
        }
    }
        
    //currentGuesses.splice(curClue, 1, currentGuess)
    
    // do all guesses match all words
}

function youWin() {
    gameOver = true;
    
    document.getElementById("you-win").style.display = "block";
}

document.addEventListener("keyup", (e) => {
    if (gameOver === false) {
        let pressedKey = String(e.key)

        if (pressedKey === "ArrowLeft") {
            prevWord()
            return
        }

        if (pressedKey === "ArrowRight") {
            nextWord()
            return
        }

        if (pressedKey === "Backspace") {
            deleteLetter()
            return
        }

        if (pressedKey === "Enter") {
            nextWord()
            return
        }

        let found = pressedKey.match(/[a-z]/gi)
        if (!found || found.length > 1) {
            return
        } else {
            insertLetter(pressedKey)
        }
    }
})

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target
    
    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
    }
    
    if (key === "<") {
        key = "ArrowLeft"
    }
    
    if (key === ">") {
        key = "ArrowRight"
    }

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})