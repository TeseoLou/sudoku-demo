// Global Declarations

// API key used to access the puzzle generator service
const API_KEY = '6nP4AYB9ImbH8hd6Zl79tg==iJV6BjdAY08uPpZU';
// Stores the correct solution grid returned by the API
let currentSolution = null;
// Tracks the currently selected cell in the grid (if any)
let selectedCell = null;
// Holds the interval ID for the countdown timer
let countdownInterval = null;
// Time remaining for the current game in seconds
let timeRemaining = 0;
// Number of hints the player has used so far
let hintsUsed = 0;
// Flag to prevent replaying celebration effects (e.g. confetti) more than once
let hasCelebrated = false;
// Sound manager for game sound effects
// Object to store and control game sound effects
// Reference: https://stackoverflow.com/questions/40100433
const soundEffects = {
    key: new Audio("assets/sounds/key.mp3"),
    tap: new Audio("assets/sounds/tap.mp3"),
    applause: new Audio("assets/sounds/applause.mp3"),
    page: new Audio("assets/sounds/page.mp3"),
    hint: new Audio("assets/sounds/hint.mp3"),
    // Method to play a sound effect by name 
    // Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement
    play(name) {
        // Retrieve the sound object matching the given name from the themeToggleSounds object
        const sound = this[name];
        // Check if a valid sound was found for the given name
        if (sound) {
            // Restart sound
            sound.currentTime = 0;
            // Attempt to play the sound, and log a warning if playback fails (e.g. due to browser restrictions)
            sound.play().catch(err => console.warn(`⚠️ Failed to play ${name}:`, err));
        }
    }
};

/**
 * Render a blank 9x9 Sudoku grid
 */
// Reference: https://www.geeksforgeeks.org/create-a-sudoku-puzzle-using-html-css-javascript/
function renderEmptyGrid() {
    // Get the grid container
    const gridContainer = $('#grid');
    // Clear any existing content
    gridContainer.empty();
    // Loop through each row index (0 to 8) to build 9 rows for the grid
    for (let row = 0; row < 9; row++) {
        // Create a row div with Bootstrap flex class
        const rowDiv = $('<div>').addClass('d-flex');
        for (let col = 0; col < 9; col++) {
            // Create a paragraph element and add classes
            const cell = $('<p>')
                .addClass('m-0 text-center number select')
                .css({ width: '40px', height: '40px' })
                .attr('data-row', row)
                .attr('data-col', col);
            // Add thicker borders between 3x3 sections, excluding the outermost edge
            if ((col + 1) % 3 === 0 && col < 8) {
                cell.addClass('right-border');
            }
            if ((row + 1) % 3 === 0 && row < 8) {
                cell.addClass('bottom-border');
            }
            // Hide outer borders based on position
            if (row === 0) {
                cell.addClass('no-border-top');
            }
            if (col === 0) {
                cell.addClass('no-border-left');
            }
            if (row === 8) {
                cell.addClass('no-border-bottom');
            }
            if (col === 8) {
                cell.addClass('no-border-right');
            }
            // Add the current cell to the row
            rowDiv.append(cell);
            // Once the row is built, add it to the main grid
            gridContainer.append(rowDiv);
        }
    }
}

/**
 * Use generated sudoku grid from API Ninjas to put cell number values in board
 */
function populateGrid(puzzleData) {
    // Go through cells with data-row attribute
    $('[data-row]').each(function () {
        // Find vertical index
        const rowIndex = Number(this.dataset.row);
        // Find horizontal index
        const colIndex = Number(this.dataset.col);
        // Get respective puzzle value
        const cellValue = puzzleData[rowIndex][colIndex];
        if (cellValue !== null) {
            // Set a fixed cell value
            this.textContent = cellValue;
            // Make the fixed cell value stand out
            this.classList.add('fw-bold', 'generated');
        } else {
            // Clear the cell and mark it as user-editable
            this.textContent = '';
            // Add editable class to cell
            this.classList.add('editable');
            // Show interactivity
            this.style.cursor = 'pointer';
        }
    });
    // Allow interactions
    enableCellSelection();
}

/**
 * Create a new Sudoku board + solution from API Ninjas according to difficulty level chosen by the user
 * Reference: https://www.api-ninjas.com/api/sudoku
 */
function fetchSudokuBoard() {
    // Get the value of the currently selected radio button for difficulty
    const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
    // Make GET request
    $.ajax({
        method: 'GET',
        url: `https://api.api-ninjas.com/v1/sudokugenerate?difficulty=${selectedDifficulty}`,
        headers: { 'X-Api-Key': API_KEY },
        contentType: 'application/json',
        // Request Success
        success: function (result) {
            // Extract the puzzle and its solution from the API response
            const { puzzle, solution } = result;
            // Save the correct solution
            currentSolution = solution;
            // Prepare a fresh grid
            renderEmptyGrid();
            // Put the cell values in the grid
            populateGrid(puzzle);
        },
        // Request failure
        error: function (response) {
            // Show a message in the console to show failure
            console.error('Failed to retrieve puzzle data:', response?.responseText || 'No response text available');
        }
    });
}

/**
 * Allow interactivity with editable grid cells with clicking or typing
 */
function enableCellSelection() {
    // Make each editable cell selectable
    $('.editable').each(function () {
        $(this).on('click', function () {
            // Deselect cells that were previously selected
            if (selectedCell) {
                $(selectedCell).removeClass('selected');
            }
            // Add selected class to clicked cell
            selectedCell = this;
            $(selectedCell).addClass('selected');
            soundEffects.play("tap");
        });
    });
    // Handle keyboard number and deletion interactions
    $(document).on('keydown', function (event) {
        if (!selectedCell) return;
        const isAllowed = $(selectedCell).hasClass('editable');
        if (!isAllowed) return;
        // Accept numbers between 1-9
        if (event.key >= '1' && event.key <= '9') {
            selectedCell.textContent = event.key;
            // Get rid of previous incorrect color
            $(selectedCell).removeClass('incorrect');
            // See if the game is complete
            triggerAutoWinCheck();
            soundEffects.play("key");
            // Allow backspace or delete
        } else if (event.key === 'Backspace' || event.key === 'Delete') {
            selectedCell.textContent = '';
            // Remove incorrect color if it is present
            $(selectedCell).removeClass('incorrect');
            // See if the game is complete
            triggerAutoWinCheck();
            soundEffects.play("key");
        }
    });
    // Handle clicks on on-screen number tiles
    $('#numbers-container h2').each(function () {
        $(this).on('click', function () {
            if (!selectedCell) return;
            if (!$(selectedCell).hasClass('editable')) return;
            const val = $(this).text();
            selectedCell.textContent = val === 'X' ? '' : val;
            // Remove incorrect color if it is present
            $(selectedCell).removeClass('incorrect');
            // See if the game is complete
            triggerAutoWinCheck();
            soundEffects.play("key");
        });
    });
}

/**
 * Compare the user's current inputs against the correct solution
 */
function checkUserInput() {
    // Increase the hint counter and refresh the display
    hintsUsed++;
    updateHintsDisplay();
    // If the solution hasn't been loaded yet, skip the check
    if (!currentSolution) return;
    // Loop through each editable cell to compare input with the correct value
    $('.editable').each(function () {
        const cell = $(this);
        const rowIndex = parseInt(cell.data('row'));
        const colIndex = parseInt(cell.data('col'));
        const expected = currentSolution[rowIndex][colIndex];
        const entered = cell.text().trim();
        // Clear incorrect state if cell is blank or correct
        if (entered === "" || entered === String(expected)) {
            cell.removeClass('incorrect');
        } else {
            cell.addClass('incorrect');
        }
    });
}

/**
 * Pick one empty cell and show its correct number from the solution
 */
function revealHint() {
    // Increase the count of used hints and update the display in game-stats div
    hintsUsed++;
    updateHintsDisplay();
    // Exit if there is no solution
    if (!currentSolution) {
        return;
    }
    // Identify all cells in the grid that are empty
    const blanks = [];
    $('.editable').each(function () {
        const value = $(this).text().trim();
        if (value.length === 0) {
            blanks.push(this);
        }
    });
    // Stop if there are no empty cells are left
    if (blanks.length === 0) {
        return;
    }
    // Randomly select one of the empty cells
    const pick = blanks[Math.floor(Math.random() * blanks.length)];
    const cell = $(pick);
    // Find the matching solution value
    const y = parseInt(cell.data('row'), 10);
    const x = parseInt(cell.data('col'), 10);
    const answer = currentSolution[y][x];
    // Populate corresponding cell with the correct answer and apply hint styling
    cell.text(answer);
    cell.addClass('hinted').removeClass('incorrect');
}

/**
 * Initiates a countdown timer corresponding with the time limit set by the user
 */
function startTimer() {
    // Get the time limit set by the user in the setup modal
    const timeLimit = $('input[name="time"]:checked').val();
    if (timeLimit === "none") {
        // Clear timer in game-stats div if no time is selected
        $('#timer').text("Timer: None");
        return;
    }
    // Change minutes to seconds
    let minutes = parseInt(timeLimit, 10);
    timeRemaining = minutes * 60;
    // Show the initial time right away
    updateTimerDisplay();
    // Stop any existing timer before starting a new one
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    // Begin countdown loop every second
    countdownInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        // End game when timer reaches 00:00
        if (timeRemaining <= 0) {
            clearInterval(countdownInterval);
            endGameDueToTime();
        }
    }, 1000);
}

/**
 * Show remaining time in game-stats
 */
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    // Always show seconds with two digits
    // Reference: https://stackoverflow.com/questions/8043026/how-to-format-numbers-by-prepending-0-to-single-digit-numbers
    const reformattedSeconds = seconds.toString().padStart(2, '0');
    // Update the timer text on the page
    // Reference: https://stackoverflow.com/questions/59747815
    $('#timer').text(`Timer: ${minutes}:${reformattedSeconds}`);
}

/**
 * Show difficulty level in game-stats
 */
function updateDifficultyDisplay() {
    // Get the currently checked radio button for difficulty
    const difficultyLevel = $('input[name="difficulty"]:checked').get(0);
    if (difficultyLevel) {
        // Find label text next to the input/fallback to the value
        const level = difficultyLevel.nextElementSibling?.textContent || difficultyLevel.value;
        // Update the difficulty text on the page
        $('#difficulty').text(`Difficulty: ${level}`);
    }
}

/**
 * Displays the current number of hints used on the screen
 */
function updateHintsDisplay() {
    // Update the hints count in the UI using jQuery
    $('#hints').text(`Hints: ${hintsUsed}`);
}

/**
 * Checks whether all editable cells have the correct solution values
 * Returns true if the entire board is filled and correct
 */
function isBoardCompleteAndCorrect() {
    // Exit if filled board has incorrect values inputted
    if (!currentSolution) {
        return false;
    }
    // See if all editable cells matches the corresponding solution
    const allCorrect = $('.editable').toArray().every(cell => {
        const rowIndex = parseInt(cell.dataset.row, 10);
        const colIndex = parseInt(cell.dataset.col, 10);
        const expected = String(currentSolution[rowIndex][colIndex]);
        const input = cell.textContent.trim();
        return input === expected;
    });
    return allCorrect;
}

/**
 * Checks if every editable cell on the board has some value entered
 */
function isBoardFilled() {
    // Grab all editable cells and make an array
    const editableCells = $('.editable').toArray();
    // Go through array and it is filled with numbers
    const allFilled = editableCells.every(cell => {
        // Remove whitespace from cells' content
        const value = cell.textContent.trim();
        // Return true if this cell has something in it
        return value !== '';
    });
    return allFilled;
}

/**
 * Confetti animation when board is complete
 */
function popConfetti() {
    confetti({
        // Confetti pieces
        particleCount: 200,
        // How far the confetti spreads out 
        spread: 100,
        // Starting point of the confetti on the Y axis (0 = top, 1 = bottom)
        origin: { y: 0.5 }
    });
}

/**
 * Checks if the board is complete and correct
 */
function triggerAutoWinCheck() {
    // If the player hasn't completed yet and the answers are right
    if (!hasCelebrated && isBoardCompleteAndCorrect()) {
        // Show confetti and applause
        popConfetti();
        soundEffects.play("applause");
        // Prevent repeated celebration
        hasCelebrated = true;
        // Halt the countdown timer
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        // Access the setup modal using Bootstrap's Modal API
        const setupModal = $('#setup-modal');
        const setupModalInstance = new bootstrap.Modal(setupModal[0]);
        // Display the setup modal again after board completion
        setupModalInstance.show();
        // If the board is full but the user has made a mistake
    } else if (isBoardFilled() && !isBoardCompleteAndCorrect()) {
        // Get the preloaded error sound element from the HTML
        // Reference: https://stackoverflow.com/questions/21815323
        const errorAudio = document.getElementById("error-sound");
        // Make sure the audio element exists before trying to play it
        if (errorAudio) {
            // Reset the audio to the start so it plays from the beginning each time
            errorAudio.currentTime = 0;
            // Attempt to play the error sound
            errorAudio.play().catch(err => console.warn("🔇 Couldn't play error sound:", err));
        }
        // Delay the alert slightly so the sound can begin playing before the blocking alert appears
        setTimeout(() => {
            alert("🔍 Try again! It looks like there's an error somewhere!");
        }, 100); // 100ms delay
    }
}

/**
 * Ends the game when the timer runs out, disables input, and shows the setup modal
 */
function endGameDueToTime() {
    // Get the preloaded alarm sound element from the HTML
    // Reference: https://stackoverflow.com/questions/21815323
    const alarmAudio = document.getElementById("alarm-sound");
    // Make sure the element exists before trying to use it
    if (alarmAudio) {
        // Reset playback position to the beginning
        alarmAudio.currentTime = 0;
        // Attempt to play the alarm sound
        alarmAudio.play().catch(err => console.warn("🔇 Couldn't play alarm:", err));
    }
    // Slightly delay the alert so the alarm sound has time to begin playing
    setTimeout(() => {
        alert("⏰ Time's up! Better luck next time."); // 100ms delay
    }, 100);
    // Disable all editable cells 
    $('.editable').each(function () {
        // Remove editable class
        $(this).removeClass('editable');
        // Make the cell unclickable
        $(this).css('pointer-events', 'none');
    });
    // Access the setup modal element
    const setupModal = $('#setup-modal');
    // Create a new Bootstrap modal instance using the raw DOM node
    const setupModalInstance = new bootstrap.Modal(setupModal[0]);
    // Display the modal to allow the player to start over or pick a new game
    setupModalInstance.show()
    // When the modal is fully shown, trigger the start of a new game
    setupModalInstance._element.addEventListener('shown.bs.modal', () => {
        // Reset everything 
        startNewGame();
    }, { once: true }); // Ensure this only runs once per modal opening
}

/**
 * Start a game by providing a fresh board, resetting stats, and resetting the timer and game stats.
 */
function startNewGame() {
    // Load new board
    fetchSudokuBoard();
    // Start timer        
    startTimer();
    // Update difficulty shown          
    updateDifficultyDisplay();
    // Reset hints
    hintsUsed = 0;
    // Update hints display           
    updateHintsDisplay();
    // Reset celebration with confetti and cheer     
    hasCelebrated = false;
}

/**
 * Sets up button event listeners, sound triggers, and navigation handling once the page is fully loaded
 */
document.addEventListener('DOMContentLoaded', function () {
    // Handle the Check button click
    const checkButton = $('#check-button');
    if (checkButton.length) {
        checkButton.on('click', () => {
            setTimeout(() => {
                checkUserInput();
                soundEffects.play("hint");
            }, 10);
        });
    }
    // Handle the Hint button click
    const $hintButton = $('#hint-button');
    if ($hintButton.length) {
        $hintButton.on('click', () => {
            setTimeout(() => {
                revealHint();
                soundEffects.play("hint");
            }, 10);
        });
    }
    // Add sound effects for when any Bootstrap modal opens or closes
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('shown.bs.modal', () => {
            soundEffects.play("page");
        });
        modal.addEventListener('hidden.bs.modal', () => {
            soundEffects.play("page");
        });
    });
    // Intercept clicks on main navigation links
    document.querySelectorAll('a[href="index.html"], a[href="about.html"]').forEach(link => {
        link.addEventListener('click', function (event) {
            // Stop the browser from navigating right away
            event.preventDefault();
            const href = $(this).attr('href');
            // Check if the current page is index.html
            const isLeavingGame = window.location.pathname.includes("index.html") || window.location.pathname === "/" || window.location.pathname.endsWith("index.html");
            // Prompt the user before leaving the game to avoid accidental loss
            if (isLeavingGame && href.includes("about.html")) {
                const proceed = confirm("Are you sure you want to leave? Your current game will be lost.");
                if (!proceed) return;
            }
            // Play a page transition sound and navigate after a short delay
            soundEffects.play("page");
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
});

renderEmptyGrid();