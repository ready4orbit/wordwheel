// Word Wheel
// created by Drew Gomez 
// copyright 2022 - present

// set some variables
let WORDS = [];
let CLUES = [];
let NUMBER_OF_WORDS = 6; // default 6
let animDelay = 6;
let inactiveLine = '#aaaaaa'
let activeLine = '#000000'
let correctLine = '#63cd66'
let correctBG = '#c4ebc6'
let leftLineColor = inactiveLine;
let rightLineColor = inactiveLine;
let gameOver = false;
let gameInterval;
let listenersLoaded = false; // make sure not to double load listeners
let thisDate = new Date();

// set some variables used to track the game
let currentGuess = '';
let currentGuesses = Array(NUMBER_OF_WORDS);
let currentHints = Array(NUMBER_OF_WORDS);
let currentTimers = Array(NUMBER_OF_WORDS);
let runTimer = false;
let totalTimer = 0;
let thisLetter = 0;
let curClue = 0;
let loadGame = '';
let rewindAmount = dateDifference();

// div elements
let timerObj = document.getElementById("hint-timer");

// start the game if user clicks the button
function gameButton() {
    // set button text to loading
    document.getElementById("start-button").textContent = ". . Loading . .";
    
    // load game
    gameLoader();
}

// check if there is a game and load it, or start a new one
function gameLoader() {
    // starting with today's date, iterate back until you find a game file that exists and load it
    let gameLoaded = false;
    for (let i = 0; gameLoaded == false && i < rewindAmount; i++) {
        var dateOffset = (24*60*60*1000) * i; //i days back
        let newDate = thisDate;
        newDate.setTime(thisDate.getTime() - dateOffset);
        
        // create file name
        let fileName = 'games/' + readableDate(newDate) + '.json';
        
        // See if the file exists
        if(checkFileExist(fileName)){
            // if so, load the file and set the date
            thisDate = newDate; 
            gameLoaded = true;
            
            fetch(fileName)
                .then(response => response.json())
                .then(data => {
                    WORDS = data.words;
                    CLUES = data.clues;

                    startGame();
                })
                .catch(console.error);
        }
    }
}

function startGame() {
    // reset clue number
    curClue = 0;
    
    // hide overlays
    document.getElementById("start-game").style.display = "none";
    document.getElementById("archive").style.display = "none";
    document.getElementById("you-win").style.display = "none";
    
    // show keyboard
    document.getElementById("keyboard-cont").style.display = "flex";
    
    // set some variables
    NUMBER_OF_WORDS = WORDS.length;
    
    loadCookie();
    if (!listenersLoaded) {
        // toggle variable to only load listeners once
        allListeners();
        listenersLoaded = true;
    }
    
    // start timer interval in milliseconds
    clearInterval(gameInterval);
    gameInterval = setInterval(gameTimer, 1000);
}

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

function loadCookie () {
    // see if there is a cookie for the current game and load relevant data
    
    let previouslyPlayed = false;
    let data = getCookieValue(readableDate(thisDate));
    if (data != '') { // if there is a cookie for this date
        if (data.substring(0,1) == "=") {
            // trim first character
            data = data.substring(1);
        }
        var cookieObj = JSON.parse(data);
        
        // load game date
        let gameDate = cookieObj.date;
        
        if (gameDate == readableDate(thisDate)) {
            // if there are guesses for this game date
            previouslyPlayed = true
            
            // load guesses array
            let cookieGuesses = Array.from(JSON.parse(cookieObj.guesses));

            // load hint array
            let cookieHints = Array.from(JSON.parse(cookieObj.hints));
            
            // load timer array
            let cookieTimers = Array.from(JSON.parse(cookieObj.timers));
            
            // if totalTime was recorded set it
            if (cookieObj.totaltime) {
                let cookieTotalTime = cookieObj.totaltime;
                totalTimer = cookieTotalTime;
                
                console.log(totalTimer);
            } else {
                totalTimer = 0;
            }
            
            currentGuesses = cookieGuesses;
            currentHints = cookieHints;
            currentTimers = cookieTimers;
        }
    }
    
    // if the player hasn't played recently
    if (!previouslyPlayed) {
        // reset timer
        totalTimer = 0;
        
        // if you haven't previous played, fresh guess arrays
        currentGuesses = Array(NUMBER_OF_WORDS);
        
        // create the array to contain hint guides
        currentHints = Array(NUMBER_OF_WORDS);
        for (let i = 0; i < WORDS.length; i++) {
            // iterate through each word, create a string of that word length of 'x' for no hint

            let hintHolder = '';
            for (let j = 0; j < WORDS[i].length; j++) {
                hintHolder = hintHolder.concat('x'); // fill with empty code 'x'
            }

            currentHints[i] = hintHolder;
        }
        
        // create array for timers
        const timerVal = 15;
        currentTimers = Array(NUMBER_OF_WORDS);
        for (let i = 0; i < WORDS.length; i++) {
            // iterate through each word, create a timer of X seconds
            currentTimers[i] = timerVal;
        }
    }
    initBoard();
}

function initBoard() {
    // create a "Jul 2, 2021" date
    let displayDate = thisDate.toLocaleDateString('en-us', { weekday:"short", year:"numeric", month:"short", day:"numeric"}).toUpperCase().substring(0, 3).concat(thisDate.toLocaleDateString('en-us', { weekday:"short", year:"numeric", month:"short", day:"numeric"}).toUpperCase().substring(4));
    
    // write date
    document.getElementById('game-date').innerHTML = displayDate;

    
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
    
    // show time left based on timer array value
    timerObj.textContent = currentTimers[curClue];
    
    // set type to red if 5 seconds or less
    if (currentTimers[curClue] <= 5) {
        timerObj.classList.add("hint-alert");
        timerObj.classList.remove("hint-timer");
    } else {
        timerObj.classList.add("hint-timer");
        timerObj.classList.remove("hint-alert");
    }
    
    // set progress
    createProgress();
    
    // turn on timer if there are available hints    
    let availableHints = [];
    for (let i = 1; i < WORDS[curClue].length - 1; i++) {
        if (currentHints[curClue][i] != 'h') { // check if it's not an 'h'
            // add to available hint array
            availableHints.push(i);
            i = WORDS[curClue].length;
        }
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
                box.classList.add("correct-box");
                setLineColor('left', correctLine);
                setLineColor('right', correctLine);
                
                // turn off timer
                runTimer = false;
            } else { // if not, remove green
                // turn on timer
                runTimer = true;
                
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

function gameTimer() {
    // this is the function that tracks the game timer and auto generates hints when needed
    
    // if the timer is on, run the timer actions
    if (runTimer) {
        // add time to total timer
        totalTimer++;
        
        // subtract one second from the timer
        let timerSet = currentTimers[curClue];
        timerSet--;
        
        // if the timer is <= 5, set color to red, if not, black
        if (timerSet <= 5) {
            timerObj.classList.add("hint-alert");
            timerObj.classList.remove("hint-timer");
        } else {
            timerObj.classList.add("hint-timer");
            timerObj.classList.remove("hint-alert");
        }
        
        // if -1, set back to 15 and display a clue, set universal array
        if (timerSet < 0) {
            timerSet = 15;
            currentTimers[curClue] = timerSet;
            
            generateHint();
        } else {
            currentTimers[curClue] = timerSet;
            document.getElementById("hint-timer").textContent = timerSet;
        }
        
        // update cookie
        setCookie();
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
}

function readableDate(varDate) {
    // function to make a YYYY-MM-DD date based on a date object
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
    cookieObject.timers = JSON.stringify(currentTimers);
    cookieObject.totaltime = totalTimer;
    cookieObject.win = gameOver;
    let jsonObject = JSON.stringify(cookieObject);
    
    // create expiration date 10 years in the future
    const futureDate = new Date();
    futureDate.setTime(futureDate.getTime() + (10*365*24*60*60*1000));    
    let cookieExpiry = 'expires='.concat(futureDate.toUTCString())
    
    // add it all together, named after this game date
    let fullCookie = readableDate(thisDate).concat('=',jsonObject,';', cookieExpiry, ';', 'SameSite=Strict', ';')
    
    // set/update cookie
    document.cookie = fullCookie
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
    // turn off timer during animation
    clearInterval(gameInterval); 
    
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
            
            if (k == 50) {
                // turn back on timer
                gameInterval = setInterval(gameTimer, 1000);
            }
        }, delay)
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

        // iterate through each letter of the word, to create a placeholder word with spaces, or existing letters if there are already hints
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

function showArchive () {
    // display the archive window
    document.getElementById("archive").style.display = "block";
    let archiveScroll = document.getElementById('archive-scroll');
    archiveScroll.innerHTML = 'Loading...';
    runTimer = false; // pause the timer
    
    // hide share button if game is over
    if (gameOver) {
        document.getElementById("you-win").style.display = "none";
    }
    
    
    // set load game button push listener
    document.getElementById("archive-load").addEventListener("click", (e) => {
        loadArchive();
    })
    
    // set cancel hide window
    document.getElementById("archive-cancel").addEventListener("click", (e) => {
        document.getElementById("archive").style.display = "none";
        if (!gameOver) {
            runTimer = true; // restart the timer if the game isn't over
        } else {
            // reveal share box if game is over
            document.getElementById("you-win").style.display = "block";
        }
    })
    
    let delay = 800
    setTimeout(()=> {
        // after short delay, load previous games
        archiveEntryLoad ();
    }, delay)
}

// function to calculate how far back to go to reach 2022-06-04 (first puzzle)
function dateDifference () {
    let date_1 = new Date('06/04/2022'); // date of first puzzle
    let date_2 = new Date();

    let difference = date_2.getTime() - date_1.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
}

function archiveEntryLoad () {
    // function to load previous games
    let archiveScroll = document.getElementById('archive-scroll');
    function highlightDate (thisEntry) {
        // highlight the chosen date and unhighlight the rest
        
        // iterate through each entry
        for (let i = 0; i < archiveScroll.children[0].children.length; i++) {
            if (archiveScroll.children[0].children[i].id == thisEntry) {
                // highlight this div
                archiveScroll.children[0].children[i].classList.add("archive-select");
            } else {
                // make this div normal 
                archiveScroll.children[0].children[i].classList.remove("archive-select");
            }
        }
    }
    
    // load the list of previous games for last 365 days
    let archiveEntries = document.createElement("div")
    for (let i = 0; i < rewindAmount; i++) {
        var dateOffset = (24*60*60*1000) * i; //i days back
        let newDate = new Date();
        newDate.setTime(newDate.getTime() - dateOffset);
        
        // create file name
        let fileName = 'games/' + readableDate(newDate) + '.json';
        
        // See if the file exists
        if(checkFileExist(fileName)){
            // if so add item to list
            
            let archiveEntry = document.createElement("div")
            archiveEntry.className = "archive-entry"
            archiveEntry.id = readableDate(newDate);
            
            // see if there is a cookie for that date
            let data = getCookieValue(readableDate(newDate));
            if (data != '') { // if there is a cookie for this date
                if (data.substring(0,1) == "=") {
                    // trim first character
                    data = data.substring(1);
                }
                var cookieObj = JSON.parse(data);

                // load game date
                let gamewin = false;
                if (cookieObj.win != undefined) {
                    gamewin = cookieObj.win;
                }
                
                
                // is gamewin is true, indicate finished game, otherwise, indicate incomplete
                if (gamewin) {
                    // indicate won game
                    let entryStyle = 'archive-entry-win'
                    archiveEntry.classList.add(entryStyle);
                } else {
                    // indicate incomplete game
                    let entryStyle = 'archive-entry-incomplete'
                    archiveEntry.classList.add(entryStyle);
                }
            } else {
                let entryStyle = 'archive-entry-unstarted'
                archiveEntry.classList.add(entryStyle);
            }
            
            // create a "Jul 2, 2021" date
            let displayDate = newDate.toLocaleDateString('en-us', { weekday:"short", year:"numeric", month:"short", day:"numeric"}).substring(0, 3).concat(newDate.toLocaleDateString('en-us', { weekday:"short", year:"numeric", month:"short", day:"numeric"}).substring(4));
            archiveEntry.textContent = displayDate;
            
            // attach listener to load date
            archiveEntry.addEventListener("click", (e) => {
                loadGame = archiveEntry.id;
                highlightDate(archiveEntry.id);
            })
            
            archiveEntries.appendChild(archiveEntry)
        }
    }
    
    // append list to scroll
    archiveScroll.innerHTML = '';
    archiveScroll.appendChild(archiveEntries)
}

function loadArchive () {
    // if the load game isn't blank, load the game
    if (loadGame != '') {
        // load game with the date loadGame
        var newGame = new Date(loadGame);
        newGame.setDate(newGame.getDate() + 1);

        // set game date to loaded date
        thisDate = newGame;
        
        // set to new game
        gameOver = false;

        // start new game with that date
        gameLoader();
    }  
}

function formatSecs (secs) {
    let totalMS = secs * 1000; // convert to milliseconds
    let d = new Date(Date.UTC(0,0,0,0,0,0,totalMS));
    
    // format the timer
    let timerFormatted = ' in ';
    let s;
    
    if (d.getUTCHours() > 0) { // only if it took longer than an hour
        s = d.getUTCHours();
        timerFormatted = timerFormatted.concat(String(s).padStart(2,'0'),':');
    }
    
    s = d.getUTCMinutes();
    timerFormatted = timerFormatted.concat(String(s),':');
    
    s = d.getUTCSeconds();
    timerFormatted = timerFormatted.concat(String(s).padStart(2,'0'));
    
    return timerFormatted;
}

function youWin() {
    gameOver = true;
    runTimer = false; // pause the timer
    setCookie();
    
    let shareTimer = '';
    if (totalTimer > 0) { // if there is a total time
        shareTimer = formatSecs(totalTimer)
    }
    
    let youWinText = 'Congrats you won'.concat(shareTimer, '! 🥳');
    document.getElementById("you-win-text").innerHTML = youWinText;
    
    document.getElementById("you-win").style.display = "block";
    
    // hide keyboard
    document.getElementById("keyboard-cont").style.display = "none";
    
    // set share action on share button push
    document.getElementById("share-button").addEventListener("click", (e) => {   
        let shareText = shareResults();
        
        if (navigator.canShare) {
            navigator.share({
                title: 'WordWheel',
                text: shareText,
                url: 'https://word-wheel.herokuapp.com'
            })
            .then(() => console.log('Share was successful.'))
            .catch((error) => console.log('Sharing failed', error));
        } else {
            // fallback of just copy to clipboard
            navigator.clipboard.writeText(shareText.concat('https://word-wheel.herokuapp.com'));

            document.getElementById('you-win-text').textContent = 'Copied to clipboard';
        }
    })
}

function shareResults() {
    // create a "Jul 2, 2021" date
    let shareableDate = thisDate.toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"});
    
    let shareTimer = '';
    if (totalTimer > 0) { // if there is a total time
        shareTimer = formatSecs(totalTimer)
    }
    
    // create the text to share
    let shareText = 'I won Word Wheel'.concat(shareTimer,'! 🥳\n')
    shareText = shareText.concat(shareableDate,'\r');
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
    
    shareText = shareText.concat('\nCan you do better?\r');
    
    return shareText;
}

function checkFileExist(urlToFile) {
    // function to see if javascript file exists
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();

    if (xhr.status == "404") {
        return false;
    } else {
        return true;
    }
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

        if (gameOver == false) {

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
}

// attach boot up game function to start button
document.getElementById("start-button").addEventListener("click", (e) => {   
    gameButton();
})

// attach archive window to logo
document.getElementById("logo-cont").addEventListener("click", (e) => {   
    showArchive();
})

// attach archive window to share box
document.getElementById("play-more-games").addEventListener("click", (e) => {   
    showArchive();
})

document.getElementById("start-button").innerHTML = "Start Game";
document.getElementById("start-button").style.backgroundColor = correctBG;