const API_KEY = '6nP4AYB9ImbH8hd6Zl79tg==iJV6BjdAY08uPpZU';

let currentSolution = null;
let selectedCell = null;
let countdownInterval = null;
let timeRemaining = 0;
let hintsUsed = 0;
let hasCelebrated = false;

/**
 * Render a blank 9x9 Sudoku grid
 */
function renderEmptyGrid() {
    const gridContainer = document.getElementById('grid');
    gridContainer.innerHTML = '';
    for (let row = 0; row < 9; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('d-flex');
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('p');
            cell.classList.add('m-0', 'text-center', 'number', 'select');
            cell.style.width = '40px';
            cell.style.height = '40px';
            cell.dataset.row = row;
            cell.dataset.col = col;
            // Add thick borders between 3x3 boxes
            if ((col + 1) % 3 === 0 && col !== 8) cell.classList.add('right-border');
            if ((row + 1) % 3 === 0 && row !== 8) cell.classList.add('bottom-border');
            // Remove outer borders
            if (row === 0) cell.classList.add('no-border-top');
            if (col === 0) cell.classList.add('no-border-left');
            if (row === 8) cell.classList.add('no-border-bottom');
            if (col === 8) cell.classList.add('no-border-right');
            rowDiv.appendChild(cell);
        }
        gridContainer.appendChild(rowDiv);
    }
}

/**
 * Populate the grid with API puzzle values
 */
function populateGrid(puzzle) {
    document.querySelectorAll('[data-row]').forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const value = puzzle[row][col];

        if (value !== null) {
            cell.textContent = value;
            cell.classList.add('fw-bold', 'generated');
        } else {
            cell.textContent = '';
            cell.classList.add('editable');
            cell.style.cursor = 'pointer';
        }
    });
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
        });
    });

    // Keyboard input handler
    document.addEventListener('keydown', function (e) {
        if (!selectedCell) return;
        const isEditable = selectedCell.classList.contains('editable');
        if (!isEditable) return;

        if (e.key >= '1' && e.key <= '9') {
            selectedCell.textContent = e.key;
            triggerAutoWinCheck(); // Check for win after number input
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            selectedCell.textContent = '';
            triggerAutoWinCheck(); // Also check after clearing
        }
    });

    // Tile/tap input handler
    document.querySelectorAll('#numbers-container h2').forEach(tile => {
        tile.addEventListener('click', function () {
            if (!selectedCell) return;
            if (!selectedCell.classList.contains('editable')) return;

            const val = this.textContent;
            selectedCell.textContent = val === 'X' ? '' : val;

            triggerAutoWinCheck(); // Auto-check after tile input
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
        hasCelebrated = true;
        // Stop the countdown timer if it's running
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        // Reopen the setup modal using Bootstrap's modal API
        const setupModalElement = document.getElementById("setup-modal");
        const setupModal = new bootstrap.Modal(setupModalElement);
        setupModal.show();
    }
}

function endGameDueToTime() {
    alert("Time's up! Better luck next time.");

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
            }, 10);
        });
    }
    const hintButton = document.getElementById('hint-button');
    if (hintButton) {
        // Slight delay ensures hint inserts after any user interaction
        hintButton.addEventListener('click', () => {
            setTimeout(() => {
                revealHint();
            }, 10);
        });
    }
});

renderEmptyGrid();
