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

// Load game words and clues
import { WORDS } from "./wheel.js";
import { CLUES } from "./wheel.js";

// set some variables
const NUMBER_OF_WORDS = WORDS.length;
let animDelay = 6; // was 6
let inactiveLine = '#aaaaaa'
let activeLine = '#000000'
let correctLine = '#63cd66'
let correctBG = '#c4ebc6'
let leftLineColor = inactiveLine;
let rightLineColor = inactiveLine;
let gameOver = false;

// set some variables used to track the game
let currentGuess = '';
let currentGuesses = Array(NUMBER_OF_WORDS);
let thisLetter = 0;
let curClue = 0;

// function to create the visible word and clue based on a clue #
function initBoard() {
    
    // create a human readable version of the number
    let readableClueNum = curClue+1;
    
    // select the board div
    let board = document.getElementById("game-board");
    
    // reset thisletter to find first empty word box
    thisLetter = 0;
    
    // check if there is a guess already and set universal variable
    if (currentGuesses[curClue] != '' && currentGuesses[curClue] != undefined) {
        // if it's not empty or undefined, set the universal variable to the previous entry
        currentGuess = currentGuesses[curClue]
    } else {
        // otherwise set universal variable blank
        currentGuess = '';
    }
    
    //reset gameboard
    board.innerHTML = ""; 
    
    // create lines
    let gameLines = document.createElement("div")
    let leftLine = document.createElement("div")
    let rightLine = document.createElement("div")
    gameLines.id= "game-lines"
    leftLine.id = "game-lines-left"
    rightLine.id = "game-lines-right"
    
    // create background lines
    leftLine.style.backgroundColor = inactiveLine;
    rightLine.style.backgroundColor = inactiveLine;
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
    let emptyWord = true; // assume it's empty
    let lastLetter = 0;
    let firstEmpty = 0;
    
    // for each letter of the answer word, create a box
    for (let j = 0; j < WORDS[curClue].length; j++) {
        let box = document.createElement("div")
        
        // set text size based on the length of the answer word
        var styleSize = "letter-box"
        box.className = styleSize
        
        if (WORDS[curClue].length <= 6) {
            styleSize = styleSize.concat("-6")
        } else if (WORDS[curClue].length > 6) {
            styleSize = styleSize.concat("-",WORDS[curClue].length)
        }
        
        box.classList.add(styleSize)
        
        // if it isn't the last box, give it a right margin to cover the lines in the background
        if (j < WORDS[curClue].length - 1) {
            box.style.marginRight = "4px"
        }
        
        // check if there is a guess already and fill the box with the guess
        if (currentGuess[j] != '' && currentGuess[j] != undefined) {
            // add letter if there is already a guess letter
            box.textContent = currentGuess[j]
            
            // set the right color for the box
            if (currentGuess[j] != ' ') {                
                // if filled box, the first empty box is the next one
                lastLetter = j + 1;
            } else { 
                // if the letter in the guess is blank
                if (emptyWord == true) {
                    firstEmpty = j;
                }
                emptyWord = false
            }
        }
        
        row.appendChild(box)
    }
        
    // set active letter
    if (emptyWord == true) {
        thisLetter = lastLetter;
    } else {
        thisLetter = firstEmpty;
    }
    
    board.appendChild(row)
    
    // set colors
    colorBoxandLine();
    
    // show clue
    let clueText = document.createElement("div")
    clueText.className = "clue"
    clueText.textContent = CLUES[curClue]
    board.appendChild(clueText)
    
    // set progress
    createProgress();
}

initBoard()

function colorBoxandLine () {
    let row = document.getElementsByClassName("letter-row")[0]
    
    // iterate through each letter box
    for (let i = 0; i < row.children.length; i++) {
        // read box contents
        let box = row.children[i]
        
        
        // if current guess is the correct word, set to green
        if (currentGuess == WORDS[curClue]) {
            box.classList.add("correct-box")
            setLineColor('left', correctLine)
            setLineColor('right', correctLine)
        } else { // if not, remove green
            box.classList.remove("correct-box")
            let boxContents = box.textContent
            
            // if there is a guess letter, figure out how to color it
            if (boxContents != '' && boxContents != ' ' && boxContents != undefined) {
                box.classList.add("filled-box")

                // for first letter, check if previous word is correct
                if (i == 0) {
                    // create previous guess #
                    var prevClue = curClue - 1;
                    if (prevClue < 0) {
                        prevClue = WORDS.length - 1;
                    }
                    
                    // if previous word correct, set green
                    if (currentGuesses[prevClue] == WORDS[prevClue]) {
                        // set box and line green
                        box.classList.add("correct-box")
                        setLineColor('left', correctLine)
                    } else {
                        // if not, set line black
                        setLineColor('left', activeLine)
                    }
                }

                // if it's the last letter, check if next word is correct
                if (i == row.children.length - 1) {
                    // create next guess #
                    var nextClue = curClue + 1;
                    if (nextClue >= NUMBER_OF_WORDS) {
                        nextClue = 0;
                    }
                    
                    // if next word correct, set green
                    if (currentGuesses[nextClue] == WORDS[nextClue]) {
                        // set box and line green
                        box.classList.add("correct-box")
                        setLineColor('right', correctLine)
                    } else {
                        // if not, set line black
                        setLineColor('right', activeLine)
                    }                    
                }
            } else {
                // if the box IS blank, set line and box color
                box.classList.remove("filled-box")
                
                // if first box, change left line color
                if (i == 0) { 
                    setLineColor('left', inactiveLine) 
                }
                
                // if last box, change right line color
                if (i == row.children.length - 1) {
                    setLineColor('right', inactiveLine)                  
                }
            }
        }
    }
}

function setLineColor(thisLine, thisColor) {
    // set a given line a given color
    
    if (thisLine == 'left') {
        document.getElementById("game-lines-left").style.backgroundColor = thisColor;
    } else if (thisLine == 'right') {
        document.getElementById("game-lines-right").style.backgroundColor = thisColor;
    }
    
    
}

function createProgress() {
    
    let progressBar = document.getElementById("progress-bar");
    progressBar.innerHTML = "";
    
    for (let k = 0; k < NUMBER_OF_WORDS; k++) {
        let progressDot = document.createElement("div")
        progressDot.textContent = '•'
        
        // if the correct word, make green
        if (currentGuesses[k] == WORDS[k]) {
            // make bright green
            progressDot.style.color = correctLine;
            
            // if active make blink
            if (k == curClue) {
                progressDot.classList.add("active-dot")
            }
        } else { // else if not correct, make grey
            // make gray
            progressDot.style.color = activeLine;
            
            // if active blink
            if (k == curClue) {
                progressDot.classList.add("active-dot")
            }
        }
        
        progressBar.appendChild(progressDot)
    }
}

function insertLetter (pressedKey) {
    var spacer = ' ';
    pressedKey = pressedKey.toLowerCase()
    
    // if already at the end of the word, skip everything and go to next word
    if (thisLetter == WORDS[curClue].length) {
        nextWord()
    } else { // if not, add letter
        // identify the letter pressed
        let row = document.getElementsByClassName("letter-row")[0]
        let box = row.children[thisLetter]
        box.textContent = pressedKey
        
        // Add the letter to existing guess
        var curGuessStr = currentGuess.substr(0, thisLetter).concat(box.textContent,currentGuess.substr(thisLetter + 1))
        currentGuess = curGuessStr;
        currentGuesses.splice(curClue, 1, currentGuess);
        
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
                        var a = i - 1;
                        var b = i;
                        // if there is a letter keep it, otherwise add a space
                        let checkLetter = String(currentGuesses[prevClue]);
                        checkLetter = checkLetter.slice(a,b);
                        if (checkLetter != undefined && checkLetter != '') {
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
        }

        // if this is the last letter, add to the beginning of the next word
        if (thisLetter == WORDS[curClue].length - 1) {
            // identify the next word
            var nextClue = curClue + 1;
            if (nextClue >= NUMBER_OF_WORDS) {
                nextClue = 0;
            }
            
            // if next guess if undefined, make it, other add it
            if (currentGuesses[nextClue] == undefined) {
                currentGuesses.splice(nextClue, 1, pressedKey);
            } else {
                var nextGuess = pressedKey.concat(currentGuesses[nextClue].substr(1));

                currentGuesses.splice(nextClue, 1, nextGuess);
            }
        }
        
        // add to the guesses array
        logGuess()
        
        //check if all the guesses are correct
        checkGuesses()

        // color game board
        colorBoxandLine()
        
        // if correct word, go to next clue
        thisLetter += 1
        if (currentGuess == WORDS[curClue]) {
            var delay = 250
            setTimeout(()=> {
                // after short delay, go to next word
                nextWord()
            }, delay)
        }
    }
}

function deleteLetter () {
    var spacer = ' ';
    
    // if we're already at the beginning, go to previous word
    if (thisLetter === 0) {
        prevWord()
        return;
    } else {
        // delete letter from guesses
        let row = document.getElementsByClassName("letter-row")[0]
        let box = row.children[thisLetter - 1]
        box.textContent = ""
        
        // remove letter at active position    
        currentGuess = currentGuess.substr(0, thisLetter - 1).concat(" ", currentGuess.substr(thisLetter)) 
        
        // if deleting the first letter, remove the last letter of the previous word
        if (thisLetter == 1) {
            var prevClue = curClue - 1;
            if (prevClue < 0) {
                prevClue = WORDS.length - 1;
            }


            // if previous guess if undefined, add a blank entry
            if (currentGuesses[prevClue] == undefined) {
                var prevGuess = '';

                currentGuesses.splice(prevClue, 1, prevGuess);
            } else { // if there is a guess, delete last letter
                var trimmedGuess = currentGuesses[prevClue].substring(0, currentGuesses[prevClue].length - 1)
                currentGuesses.splice(prevClue, 1, trimmedGuess);
            }
        }

        // if deleting the last letter, delete the first letter of the next word
        if (thisLetter === WORDS[curClue].length) {
            var nextClue = curClue + 1;
            if (nextClue >= NUMBER_OF_WORDS) {
                nextClue = 0;
            }

            // if next guess if undefined
            if (currentGuesses[nextClue] == undefined) {
                // if undefined, just leave blank - shouldn't ever happen
                currentGuesses.splice(nextClue, 1, '');
            } else {
                // if not blank, cut first letter and add a spacer
                var nextGuess = spacer.concat(currentGuesses[nextClue].slice(1));

                currentGuesses.splice(nextClue, 1, nextGuess);
            }
        }
           

        // add to the guesses array
        logGuess()

        // color game board
        colorBoxandLine()
        
        thisLetter -= 1
    }
}

function logGuess () {
    //console.log(curClue)
    
    // create string for guesses array
    currentGuesses.splice(curClue, 1, currentGuess)
    
    //console.log(currentGuess)
    //console.log('currentGuess:'+currentGuess)
    //console.log(currentGuesses)
}

function nextWord () {
    // function to progress to the next word
    
    curClue++;
    // check if we need to cycle back to the beginning
    if (curClue === NUMBER_OF_WORDS) {
        curClue = 0;
    }

    slideOutClue("left");
}

function prevWord () {
    // function to progress to the prev word
    
    curClue--;
    // check if we need to cycle back to the beginning
    if (curClue < 0) {
        curClue = NUMBER_OF_WORDS - 1;
    }

    slideOutClue("right");
}

function slideOutClue (slideDir) {
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
                initBoard()
                
                // invisibly move game board to other side
                if (slideDir == 'left') {
                    document.getElementById("game-board").style.marginLeft = marginMove;
                    
                    document.getElementById("game-lines-left").style.width = '100%';
                    document.getElementById("game-lines-right").style.width = '0%';
                } else {
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
                document.getElementById("game-board").style.marginRight = 0;
                document.getElementById("game-board").style.marginLeft = marginMove;
                
                document.getElementById("game-lines-left").style.width = lineBig;
                document.getElementById("game-lines-right").style.width = lineSmall;
            } else {
                document.getElementById("game-board").style.marginLeft = 0;
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
        
        // do all guesses match all words
        for (var i = 0; i < WORDS.length; i++) {
            if (currentGuesses[i] === WORDS[i]) {
                z++;
            }
        }
        
        if (z == WORDS.length) {
            youWin()
        }
    }
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
    
    if (key === "Ent") {
        key = "Return"
    }
    
    if (key === "<") {
        key = "ArrowLeft"
    }
    
    if (key === ">") {
        key = "ArrowRight"
    }

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

let touchstartX = 0
let touchendX = 0

function handleGesture() {
  if (touchendX < touchstartX) nextWord()
  if (touchendX > touchstartX) prevWord()
}

document.getElementById("game-board").addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX
})

document.getElementById("game-board").addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX
  handleGesture()
})