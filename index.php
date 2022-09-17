<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WordWheel</title>
    
    <link rel="stylesheet" href="style.css">
    
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-T31948700P"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-T31948700P');
    </script>
</head>
<body>
    <div id="start-game">
        <div id="start-game-text">
            <b>Game Rules</b>
            <br/><br/>
            Use the clues to guess all the words.
            <br/><br/>
            Every 15 seconds, a new letter is revealed.
            <br/><br/>
        </div>
        <div>
            <button id="start-button" class="keyboard-button">. . Loading . .</button>
            <button id="random-button" class="keyboard-button">. . Loading . .</button>
        </div>
    </div>
    <div id="archive">
        <div id="archive-text">
            <b>Select a puzzle</b>
            <div id="archive-scroll">
                <div class="archive-entry">Loading...</div>
            </div>
        </div>
        <div>
            <button id="archive-load" class="keyboard-button archive-load">Load</button>
            <button id="archive-cancel" class="keyboard-button">Cancel</button>
        </div>
    </div>
    <div id="you-win">
        <div id="you-win-text">
            Congrats you won! 🥳
        </div>
        <div>
            <button id="share-button" class="keyboard-button">Share results</button>
        </div>
        <div>
            Play <span id="play-more-games">another?</span> 🤔
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
                    <div class="tool-item">
                    </div>
                    <div id="progress-bar">
                    </div>
                    <div class="tool-item">
                        <button id="hint-timer" class="tool-button">15</button>
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
                    <button class="keyboard-button">&#x2794;</button>
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
    
    <script src="script.js" type="module"></script>
</body>
</html>