/**
How to test on a local server

Go to Teminal and type

cd Documents/Web

then

python -m SimpleHTTPServer

You should then be able to access at http://localhost:8000

References: 
https://www.freecodecamp.org/news/build-a-wordle-clone-in-javascript/
**/

// set some variables
let NUMBER_OF_WORDS = 6; // default 6
let animDelay = 6;
let inactiveLine = '#aaaaaa'
let activeLine = '#000000'
let correctLine = '#63cd66'
let correctBG = '#c4ebc6'
let leftLineColor = inactiveLine;
let rightLineColor = inactiveLine;
let gameOver = false;
let thisDate = new Date();

// set some variables used to track the game
let currentGuess = '';
let currentGuesses = Array(NUMBER_OF_WORDS);
let currentHints = Array(NUMBER_OF_WORDS);
let thisLetter = 0;
let curClue = 0;

// start the game
function gameLoader() {
    // function to see if javascript file exists
    function checkFileExist(urlToFile) {
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', urlToFile, false);
        xhr.send();

        if (xhr.status == "404") {
            return false;
        } else {
            return true;
        }
    }
    
    // starting with today's date, iterate back until you find a game file that exists and load it
    let gameLoaded = false;
    for (let i = 0; gameLoaded == false && i < 10; i++) {
        var dateOffset = (24*60*60*1000) * i; //i days back
        let newDate = thisDate
        newDate.setTime(thisDate.getTime() - dateOffset);
        
        // create file name
        let fileName = 'games/' + readableDate(newDate) + '.js';
        
        // See if the file exists
        if(checkFileExist(fileName)){
            // if so, load the file and set the date
            thisDate = newDate; 
            let gameScript = document.createElement('script');
            gameScript.onload = function () {
                startGame();
            };
            gameScript.src = fileName;

            document.head.appendChild(gameScript);
            
            gameLoaded = true;
        }
    }
}

function startGame() {
    // set some variables
    NUMBER_OF_WORDS = WORDS.length;
    
    loadCookie();
    // initHints();
    // initBoard();
    allListeners();
}

function initHints () { 
    // see if cookie with thisDate, if so set guess and hint arrays
    // if not cookie, start clean game
    
    // create the array to contain hint guides
    for (let i = 0; i < WORDS.length; i++) {
        // iterate through each word, create a string of that word length of 'x' for no hint
        
        let hintHolder = '';
        for (let j = 0; j < WORDS[i].length; j++) {
            hintHolder = hintHolder.concat('x'); // fill with empty code 'x'
        }
        
        currentHints[i] = hintHolder;
    }    
}

function initBoard() {
    // function to create the visible word and clue based on a clue #
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
        let styleSize = "letter-box"
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
    
    // set hint button color if available hints    
    let availableHints = [];
    for (let i = 1; i < WORDS[curClue].length - 1; i++) {
        if (currentHints[curClue][i] != 'h') { // check if it's not an 'h'
            // add to available hint array
            availableHints.push(i);
            i = WORDS[curClue].length;
        }
    }
    
    // if there is at least one hint available, generate hint
    if (availableHints.length > 0) {
        document.getElementById("hint-button").style.color = "#000000";
    } else {
        document.getElementById("hint-button").style.color = "#aaaaaa";
    }
    
    checkGuesses ()
}

function colorBoxandLine () {
    let row = document.getElementsByClassName("letter-row")[0]
    
    // iterate through each letter box
    for (let i = 0; i < row.children.length; i++) {
        // read box contents
        let box = row.children[i]
        
        // if it's a hint letter, make it hint colored
        if (currentHints[curClue][i] == 'h') {
            box.classList.add("hint-box")
        } else {
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
                        let prevClue = curClue - 1;
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
                        let nextClue = curClue + 1;
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
    let spacer = ' ';
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
        let curGuessStr = currentGuess.substr(0, thisLetter).concat(box.textContent,currentGuess.substr(thisLetter + 1))
        currentGuess = curGuessStr;
        currentGuesses.splice(curClue, 1, currentGuess);
        
        // if this is the first letter, add to end of previous word
        if (thisLetter === 0) {
            let prevClue = curClue - 1;
            if (prevClue < 0) {
                prevClue = WORDS.length - 1;
            }

            // if previous guess if undefined
            if (currentGuesses[prevClue] == undefined) {
                let prevGuess = '';

                for (let i = 1; i <= WORDS[prevClue].length; i++) {
                    if (i < WORDS[prevClue].length) {
                        prevGuess = prevGuess.concat(spacer);
                    } else if (i = WORDS[prevClue].length) {
                        prevGuess = prevGuess.concat(pressedKey);
                    }
                }

                currentGuesses.splice(prevClue, 1, prevGuess);
            } else {
                let prevGuess = '';

                for (let i = 1; i <= WORDS[prevClue].length; i++) {
                    if (i < WORDS[prevClue].length) {
                        let a = i - 1;
                        let b = i;
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
            let nextClue = curClue + 1;
            if (nextClue >= NUMBER_OF_WORDS) {
                nextClue = 0;
            }
            
            // if next guess if undefined, make it, other add it
            if (currentGuesses[nextClue] == undefined) {
                currentGuesses.splice(nextClue, 1, pressedKey);
            } else {
                let nextGuess = pressedKey.concat(currentGuesses[nextClue].substr(1));

                currentGuesses.splice(nextClue, 1, nextGuess);
            }
        }
        
        // add to the guesses array
        logGuess()
        
        //check if all the guesses are correct
        checkGuesses()

        // color game board
        colorBoxandLine()
        
        // go to next letter, skip any hint letters
        thisLetter += 1
        let hintGuide = currentHints[curClue]
        while (hintGuide[thisLetter] == 'h') { // skip hints
            thisLetter += 1
        }
        
        // if correct word, go to next clue
        if (currentGuess == WORDS[curClue]) {
            let delay = 250
            setTimeout(()=> {
                // after short delay, go to next word
                nextWord()
            }, delay)
        }
    }
}

function deleteLetter () {
    let spacer = ' ';
    
    // if we're already at the beginning, go to previous word
    if (thisLetter === 0) {
        prevWord()
        return;
    } else {
        // if it's a hint letter, go back one more
        let hintGuide = currentHints[curClue]
        while (hintGuide[thisLetter - 1] == 'h') { // skip hints
            thisLetter -= 1
        }
        
        // delete letter from guesses
        let row = document.getElementsByClassName("letter-row")[0]
        let box = row.children[thisLetter - 1]
        box.textContent = ""
        
        // remove letter at active position    
        currentGuess = currentGuess.substr(0, thisLetter - 1).concat(" ", currentGuess.substr(thisLetter)) 
        
        // if deleting the first letter, remove the last letter of the previous word
        if (thisLetter == 1) {
            let prevClue = curClue - 1;
            if (prevClue < 0) {
                prevClue = WORDS.length - 1;
            }


            // if previous guess if undefined, add a blank entry
            if (currentGuesses[prevClue] == undefined) {
                let prevGuess = '';

                currentGuesses.splice(prevClue, 1, prevGuess);
            } else { // if there is a guess, delete last letter
                let trimmedGuess = currentGuesses[prevClue].substring(0, currentGuesses[prevClue].length - 1)
                currentGuesses.splice(prevClue, 1, trimmedGuess);
            }
        }

        // if deleting the last letter, delete the first letter of the next word
        if (thisLetter === WORDS[curClue].length) {
            let nextClue = curClue + 1;
            if (nextClue >= NUMBER_OF_WORDS) {
                nextClue = 0;
            }

            // if next guess if undefined
            if (currentGuesses[nextClue] == undefined) {
                // if undefined, just leave blank - shouldn't ever happen
                currentGuesses.splice(nextClue, 1, '');
            } else {
                // if not blank, cut first letter and add a spacer
                let nextGuess = spacer.concat(currentGuesses[nextClue].slice(1));

                currentGuesses.splice(nextClue, 1, nextGuess);
            }
        }
           

        // add to the guesses array
        logGuess()

        // color game board
        colorBoxandLine()
        
        // go to previous letter
        thisLetter -= 1
    }
}

function logGuess () {    
    // create string for guesses array
    currentGuesses.splice(curClue, 1, currentGuess)
    
    // update cookies
    setCookie();
    
    //console.log(currentGuess)
    //console.log('currentGuess:'+currentGuess)
    //console.log(currentGuesses)
}

// function to make a YYYY-MM-DD date based on a date object
function readableDate(varDate) {
    let dd = String(varDate.getDate()).padStart(2, '0');
    let mm = String(varDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = varDate.getFullYear();

    let readDate = yyyy + '-' + mm + '-' + dd;
    return readDate;
}

function setCookie () {
    // cookie structure: date, guesses, hints, expires
    var cookieObject = {};
    cookieObject.date = readableDate(thisDate);
    cookieObject.guesses = JSON.stringify(currentGuesses);
    cookieObject.hints = JSON.stringify(currentHints);
    let jsonObject = JSON.stringify(cookieObject);
    
    // create expiration date 10 years in the future
    const futureDate = new Date();
    futureDate.setTime(futureDate.getTime() + (10*365*24*60*60*1000));    
    let cookieExpiry = 'expires='.concat(futureDate.toUTCString())
    
    // add it all together
    let fullCookie = "data=".concat(jsonObject,';', cookieExpiry, ';', 'SameSite=Strict', ';')
    
    // set/update cookie
    document.cookie = fullCookie
}

function loadCookie () {
    function getCookieValue(name) {
        const nameString = name + "="

        const value = document.cookie.split(";").filter(item => {
            return item.includes(nameString)
        })

        if (value.length) {
            return value[0].substring(nameString.length, value[0].length)
        } else {
            return ""
        }
    }
    
    let previouslyPlayed = false;
    let data = getCookieValue("data");
    if (data != '') { // if there is a cookie
        var cookieObj = JSON.parse(getCookieValue("data"));
        
        // load game date
        let gameDate = cookieObj.date;
        
        if (gameDate == readableDate(thisDate)) {
            // if there are guesses for this game date
            previouslyPlayed = true
            
            // load guesses array
            let cookieGuesses = Array.from(JSON.parse(cookieObj.guesses));

            // load hint array
            let cookieHints = Array.from(JSON.parse(cookieObj.hints));

            currentGuesses = cookieGuesses;
            currentHints = cookieHints;
        }
    }
    
    if (!previouslyPlayed) {
        // if you haven't previous played, fresh guess and hint arrays
        currentGuesses = Array(NUMBER_OF_WORDS);
        currentHints = Array(NUMBER_OF_WORDS);
        
        // create the array to contain hint guides
        for (let i = 0; i < WORDS.length; i++) {
            // iterate through each word, create a string of that word length of 'x' for no hint

            let hintHolder = '';
            for (let j = 0; j < WORDS[i].length; j++) {
                hintHolder = hintHolder.concat('x'); // fill with empty code 'x'
            }

            currentHints[i] = hintHolder;
        } 
    }
    initBoard();
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

function showHint () {
    let availableHints = [];
    
    // iterate through hint guide from second letter to second to last
    for (let i = 1; i < WORDS[curClue].length - 1; i++) {
        if (currentHints[curClue][i] != 'h') { // check if it's not an 'h'
            // add to available hint array
            availableHints.push(i);
        }
    }
    
    // if there is at least one hint available, generate hint
    if (availableHints.length > 0) {
        document.getElementById("give-hint").style.display = "block";
    }
}

function generateHint() {    
    let availableHints = [];
    
    // iterate through hint guide from second letter to second to last
    for (let i = 1; i < WORDS[curClue].length - 1; i++) {
        if (currentHints[curClue][i] != 'h') { // check if it's not an 'h'
            // add to available hint array
            availableHints.push(i);
        }
    }
    
    // if there is at least one hint available, generate hint
    if (availableHints.length > 0) {
        let randHint = availableHints[Math.floor(Math.random()*availableHints.length)];
        
        let hintPosition = randHint;
        let hintLetter = WORDS[curClue][hintPosition];

        // iterate through each letter of the word, to create a placeholder word with spaces
        let updatedGuess = '';

        for (let i = 0; i < WORDS[curClue].length; i++) {        
            if (currentGuess[i] != undefined) {
                updatedGuess = updatedGuess.concat(currentGuess[i]);
            } else { // add a space
                updatedGuess = updatedGuess.concat(' ');
            }
        }

        // add hint letter to guess array
        updatedGuess = updatedGuess.substr(0, hintPosition).concat(hintLetter,updatedGuess.substr(hintPosition + 1))
        currentGuess = updatedGuess;
        currentGuesses.splice(curClue, 1, currentGuess);

        // update hint guide to show hint given
        let currentGuide = currentHints[curClue];
        let updatedGuide = currentGuide.substr(0, hintPosition).concat('h',currentGuide.substr(hintPosition + 1))
        currentHints.splice(curClue, 1, updatedGuide);
        
        // update cookies
        setCookie();
        
        initBoard();
    }
}

function checkGuesses () {
    
    // does the current guess match the current word
    if (currentGuess == WORDS[curClue]) {
        //check all words        
        let z = 0;
        
        // do all guesses match all words
        for (let i = 0; i < WORDS.length; i++) {
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

function shareResults() {
    console.log('shareResults');
    // create the text to share
    let shareText = 'I won Word Wheel! \n';
    // iterate through words
    for (let i = 0; i < WORDS.length; i++) {
        
        // iterate through hint guide and add the correct color box
        for (let j = 0; j < WORDS[i].length; j++) {
            if (currentHints[i][j] == 'h') { // check if it's not an 'h'
                // if it's a hint, add blue box
                shareText = shareText.concat('🟦');
            } else {
                // if not, add green box
                shareText = shareText.concat('🟩');
            }
        }   
        // add a line break
        shareText = shareText.concat('\n');
    }
    
    shareText = shareText.concat('\nTry it yourself: https://word-wheel.herokuapp.com');
    
    return shareText;
}

function allListeners() {
    document.addEventListener("keyup", (e) => {
        let pressedKey = String(e.key)

        if (pressedKey === "ArrowLeft") {
            prevWord()
            return
        }

        if (pressedKey === "ArrowRight") {
            nextWord()
            return
        }

        if (gameOver === false) {

            if (pressedKey === "Backspace") {
                deleteLetter()
                return
            }

            if (pressedKey === "Enter") {
                nextWord()
                return
            }

            if (pressedKey === "Hint") {
                showHint()
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

        if (target.tagName != 'BUTTON') {
            return
        }
        let key = target.textContent

        if (key === "Del") {
            key = "Backspace"
        }

        if (key === "Ent") {
            key = "Return"
        }

        if (key === "\u2605") {
            key = "Hint"
        }

        document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
    })
    
    // scroll action listeners
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

    // set hint button action on button push
    document.getElementById("hint-controls").addEventListener("click", (e) => {
        const target = e.target

        if (target.tagName != 'BUTTON') {
            return
        }
        let key = target.textContent

        if (key == "Yes") {
            // show hint
            generateHint();
            document.getElementById("give-hint").style.display = "none";
        }

        if (key == "No") {
            // hide box
            document.getElementById("give-hint").style.display = "none";
        }
    })

    // set share action on share button push
    document.getElementById("share-button").addEventListener("click", (e) => {   
        let shareText = shareResults();
        console.log('shareText-')
        console.log(shareText)
        
        alert(navigator.canShare)
        
        if (navigator.canShare) {
            navigator.share({
                text: shareText
            })
            .then(() => alert('Share was successful.'))
            .catch((error) => alert('Sharing failed', error));
        } else {
            alert('fallback')
            // fallback of just copy to clipboard
            navigator.clipboard.writeText(shareText);

            document.getElementById('you-win-text').textContent = 'Copied to clipboard';
        }
        
        /*
        if (navigator.share) {
            navigator.share({
                text: shareText
            })
        } else {
            // fallback of just copy to clipboard
            navigator.clipboard.writeText(shareText);

            document.getElementById('you-win-text').textContent = 'Copied to clipboard';
        }
        */
    })
}

gameLoader()