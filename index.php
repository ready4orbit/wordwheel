<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WordWheel</title>
    
    <link rel="stylesheet" id="stylesheet" href="style.css?v16" as="style">
    <link rel="preload" id="stylesheet" href="style_dark.css?v16" as="style">
    
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
    <button id="ui_toggle"></button>
    <div id="start-game">
        <div id="start-game-text">
            <b>Game Rules</b>
            <br/><br/>
            Use the clues to guess all the words.
            <br/><br/>
            Every 15 seconds, a new letter is revealed.
        </div>
        <div>
            <button id="start-button" class="system-button">. . Loading . .</button>
            <button id="random-button" class="system-button">. . Loading . .</button>
        </div>
		<div class="streak-bar">
			0 Day Streak
		</div>
    </div>
    <div id="archive">
        <div id="archive-text">
            <b>Select a Puzzle</b>
            <div id="archive-scroll">
                <div class="archive-entry">Loading...</div>
            </div>
        </div>
        <div>
            <button id="archive-load">Load</button>
            <button id="archive-cancel">Cancel</button>
        </div>
        <div>
            <b>Or</b> <button id="archive-random" class="system-button">Play random 🤪</button>
        </div>
    </div>
    <div id="you-win">
        <div id="you-win-text">
            Congrats you won! 🥳
        </div>
        <div>
            <button id="share-button" class="system-button">Share results</button>
        </div>
		Play next game?
        <div class="game_nav">
            <button id="nav_prev" class="system-button">&#8249;</button>
			<button id="play-more-games" class="system-button">Archive</button>
			<button id="nav_next" class="system-button">&#8250;</button>
        </div>
		<div class="streak-bar">
			0% complete
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
                        <button id="hint-timer" class="hint-timer">15</button>
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
    
    <script src="script.js?v20" type="module"></script>
</body>
</html>