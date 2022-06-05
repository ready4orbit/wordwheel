<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WordWheel</title>
    
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="you-win">
        <div id="you-win-text">
            Congrats you won!
        </div>
        <div>
            <button id="share-button" class="keyboard-button">Share results</button>
        </div>
    </div>
    <div id="give-hint">
        <div>Are you sure you want a hint?</div>
        <div id="hint-controls">
            <button class="keyboard-button">Yes</button>
            <button class="keyboard-button">No</button>
        </div>
    </div>
    <div id="game-container">
        <div id="flex-holder">
            <div id="logo-cont">
                <div id="game-logo">WordWheel</div>
                <div id="game-date"></div>
            </div>
            <div id="game-board"></div>
            <div id="keyboard-cont">
                <div id="tool-bar">
                    <div id="tool-item"></div>
                    <div id="progress-bar">
                    </div>
                    <div id="tool-item">
                        <button id="hint-button" class="tool-button">&#9733;</button>
                    </div>
                </div>
                <div class="first-row">
                    <button class="keyboard-button">q</button>
                    <button class="keyboard-button">w</button>
                    <button class="keyboard-button">e</button>
                    <button class="keyboard-button">r</button>
                    <button class="keyboard-button">t</button>
                    <button class="keyboard-button">y</button>
                    <button class="keyboard-button">u</button>
                    <button class="keyboard-button">i</button>
                    <button class="keyboard-button">o</button>
                    <button class="keyboard-button">p</button>
                </div>
                <div class="second-row">
                    <button class="keyboard-button">a</button>
                    <button class="keyboard-button">s</button>
                    <button class="keyboard-button">d</button>
                    <button class="keyboard-button">f</button>
                    <button class="keyboard-button">g</button>
                    <button class="keyboard-button">h</button>
                    <button class="keyboard-button">j</button>
                    <button class="keyboard-button">k</button>
                    <button class="keyboard-button">l</button>
                </div>
                <div class="third-row">
                    <button class="keyboard-button">Ent</button>
                    <button class="keyboard-button">z</button>
                    <button class="keyboard-button">x</button>
                    <button class="keyboard-button">c</button>
                    <button class="keyboard-button">v</button>
                    <button class="keyboard-button">b</button>
                    <button class="keyboard-button">n</button>
                    <button class="keyboard-button">m</button>
                    <button class="keyboard-button">Del</button>
                </div>
            </div>
        </div>
    </div>
    
    <script
    src="https://code.jquery.com/jquery-3.6.0.min.js"
    integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
    crossorigin="anonymous"></script>
    <script src="script.js" type="module"></script>
</body>
</html>