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
    error: new Audio("assets/sounds/error.mp3"),
    alarm: new Audio("assets/sounds/alarm.mp3"),
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
    const $gridContainer = $('#grid');
    // Clear any existing content
    $gridContainer.empty();
    // Loop through each row index (0 to 8) to build 9 rows for the grid
    for (let row = 0; row < 9; row++) {
        // Create a row div with Bootstrap flex class
        const $rowDiv = $('<div>').addClass('d-flex');
        for (let col = 0; col < 9; col++) {
            // Create a paragraph element and add classes
            const $cell = $('<p>')
                .addClass('m-0 text-center number select')
                .css({ width: '40px', height: '40px' })
                .attr('data-row', row)
                .attr('data-col', col);
            // Add thick borders between 3x3 boxes
            if ((col + 1) % 3 === 0 && col !== 8) $cell.addClass('right-border');
            if ((row + 1) % 3 === 0 && row !== 8) $cell.addClass('bottom-border');
            // Remove outer borders
            if (row === 0) $cell.addClass('no-border-top');
            if (col === 0) $cell.addClass('no-border-left');
            if (row === 8) $cell.addClass('no-border-bottom');
            if (col === 8) $cell.addClass('no-border-right');
            // Append cell to the current row
            $rowDiv.append($cell);
        }
        // Append completed row to the grid
        $gridContainer.append($rowDiv);
    }
}

/**
 * Populate the grid with API puzzle values
 */
function populateGrid(puzzle) {
    // Select all cells with a data-row attribute
    $('[data-row]').each(function () {
        const row = parseInt(this.dataset.row);
        const col = parseInt(this.dataset.col);
        const value = puzzle[row][col];
        if (value !== null) {
            this.textContent = value;
            this.classList.add('fw-bold', 'generated');
        } else {
            this.textContent = '';
            this.classList.add('editable');
            this.style.cursor = 'pointer';
        }
    });
    // Call function to enable cell click handling
    enableCellSelection();
}

/**
 * Fetch puzzle and solution from API based on selected difficulty
 */
function fetchSudokuBoard() {
    const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
    $.ajax({
        method: 'GET',
        url: `https://api.api-ninjas.com/v1/sudokugenerate?difficulty=${selectedDifficulty}`,
        headers: { 'X-Api-Key': API_KEY },
        contentType: 'application/json',
        success: function (result) {
            const { puzzle, solution } = result;
            currentSolution = solution;

            renderEmptyGrid();
            populateGrid(puzzle);
        },
        error: function (jqXHR) {
            console.error('Error fetching puzzle:', jqXHR.responseText);
        }
    });
}

/**
 * Allow user to select editable cells and input numbers via keyboard or tile
 */
function enableCellSelection() {
    document.querySelectorAll('.editable').forEach(cell => {
        cell.addEventListener('click', function () {
            if (selectedCell) {
                selectedCell.classList.remove('selected');
            }
            selectedCell = this;
            selectedCell.classList.add('selected');
            soundEffects.play("tap");
        });
    });

    // Keyboard input handler
    document.addEventListener('keydown', function (e) {
        if (!selectedCell) return;
        const isEditable = selectedCell.classList.contains('editable');
        if (!isEditable) return;

        if (e.key >= '1' && e.key <= '9') {
            selectedCell.textContent = e.key;
            selectedCell.classList.remove('incorrect'); // Reset red if previously incorrect
            triggerAutoWinCheck(); // Check for win after number input
            soundEffects.play("key");
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            selectedCell.textContent = '';
            selectedCell.classList.remove('incorrect'); // Reset red if cleared
            triggerAutoWinCheck(); // Also check after clearing
            soundEffects.play("key");
        }
    });

    // Tile/tap input handler
    document.querySelectorAll('#numbers-container h2').forEach(tile => {
        tile.addEventListener('click', function () {
            if (!selectedCell) return;
            if (!selectedCell.classList.contains('editable')) return;

            const val = this.textContent;
            selectedCell.textContent = val === 'X' ? '' : val;
            selectedCell.classList.remove('incorrect'); // Reset red if tile input used
            triggerAutoWinCheck(); // Auto-check after tile input
            soundEffects.play("key");
        });
    });
}

function checkUserInput() {
    hintsUsed++;
    updateHintsDisplay();

    if (!currentSolution) return;

    document.querySelectorAll('.editable').forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const correctValue = currentSolution[row][col];
        const userValue = cell.textContent.trim();

        if (userValue === "") {
            cell.classList.remove('incorrect');
        } else if (userValue === String(correctValue)) {
            cell.classList.remove('incorrect');
        } else {
            cell.classList.add('incorrect');
        }
    });
}

function revealHint() {
    hintsUsed++;
    updateHintsDisplay();

    if (!currentSolution) return;

    // Find all editable, empty cells
    const emptyCells = Array.from(document.querySelectorAll('.editable')).filter(cell => cell.textContent.trim() === '');

    if (emptyCells.length === 0) return;

    // Pick a random one
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    const row = parseInt(randomCell.dataset.row);
    const col = parseInt(randomCell.dataset.col);
    const correctValue = currentSolution[row][col];

    // Fill it with correct value and style as hint
    randomCell.textContent = correctValue;
    randomCell.classList.add('hinted');
    randomCell.classList.remove('incorrect'); // remove red if present
}

function startTimer() {
    const selectedTime = document.querySelector('input[name="time"]:checked').value;

    if (selectedTime === "none") {
        // Clear timer text if no time is selected
        document.getElementById("timer").textContent = "Timer: None";
        return;
    }

    // Convert minutes to seconds
    timeRemaining = parseInt(selectedTime) * 60;

    // Update immediately
    updateTimerDisplay();

    // Clear any previous timer
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    // Start countdown
    countdownInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            clearInterval(countdownInterval);
            endGameDueToTime();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById("timer").textContent = `Timer: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateDifficultyDisplay() {
    const selected = document.querySelector('input[name="difficulty"]:checked');
    if (selected) {
        const label = selected.nextElementSibling?.textContent || selected.value;
        document.getElementById("difficulty").textContent = `Difficulty: ${label}`;
    }
}

function updateHintsDisplay() {
    document.getElementById("hints").textContent = `Hints: ${hintsUsed}`;
}

function isBoardCompleteAndCorrect() {
    if (!currentSolution) return false;

    return Array.from(document.querySelectorAll('.editable')).every(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const correctValue = String(currentSolution[row][col]);
        const userValue = cell.textContent.trim();
        return userValue === correctValue;
    });
}

function isBoardFilled() {
    return Array.from(document.querySelectorAll('.editable')).every(cell =>
        cell.textContent.trim() !== ''
    );
}

function launchConfetti() {
    confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
    });
}

function triggerAutoWinCheck() {
    if (!hasCelebrated && isBoardCompleteAndCorrect()) {
        launchConfetti();
        soundEffects.play("applause");
        hasCelebrated = true;
        // Stop the countdown timer if it's running
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        // Reopen the setup modal using Bootstrap's modal API
        const setupModalElement = document.getElementById("setup-modal");
        const setupModal = new bootstrap.Modal(setupModalElement);
        setupModal.show();
    } else if (isBoardFilled() && !isBoardCompleteAndCorrect()) {
        soundEffects.play("error");
        alert("🔍 Try again! It looks like there's an error somewhere!");
    }
}

function endGameDueToTime() {
    soundEffects.play("alarm");
    alert("⏰ Time's up! Better luck next time.");
    document.querySelectorAll('.editable').forEach(cell => {
        cell.classList.remove('editable');
        cell.style.pointerEvents = "none";
    });

    // Reopen the setup modal using Bootstrap's modal API
    const setupModalElement = document.getElementById("setup-modal");
    const setupModal = new bootstrap.Modal(setupModalElement);
    setupModal.show();
}

document.addEventListener('DOMContentLoaded', function () {
    const checkButton = document.getElementById('check-button');
    if (checkButton) {
        // Use slight delay to ensure mobile DOM updates are applied before checking
        checkButton.addEventListener('click', () => {
            setTimeout(() => {
                checkUserInput();
                soundEffects.play("hint");
            }, 10);
        });
    }
    const hintButton = document.getElementById('hint-button');
    if (hintButton) {
        // Slight delay ensures hint inserts after any user interaction
        hintButton.addEventListener('click', () => {
            setTimeout(() => {
                revealHint();
                soundEffects.play("hint");
            }, 10);
        });
    }
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('shown.bs.modal', () => {
            soundEffects.play("page");
        });
        modal.addEventListener('hidden.bs.modal', () => {
            soundEffects.play("page");
        });
    });
    document.querySelectorAll('a[href="index.html"], a[href="about.html"]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // prevent default nav

            const href = this.getAttribute('href');

            const isLeavingGame = window.location.pathname.includes("index.html") || window.location.pathname === "/" || window.location.pathname.endsWith("index.html");

            // Show confirmation only if leaving the game
            if (isLeavingGame && href.includes("about.html")) {
                const proceed = confirm("Are you sure you want to leave? Your current game will be lost.");
                if (!proceed) return;
            }

            soundEffects.play("page");

            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
});

renderEmptyGrid();
