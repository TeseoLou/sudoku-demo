// Load boards from file //
const API_KEY = '6nP4AYB9ImbH8hd6Zl79tg==iJV6BjdAY08uPpZU';

/**
 * Renders a blank 9x9 Sudoku grid on the page.
 */
function renderEmptyGrid() {
    const gridContainer = document.getElementById('grid');
    gridContainer.innerHTML = ''; // Clear any existing content

    for (let row = 0; row < 9; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('d-flex');

        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('p');
            cell.classList.add('m-0', 'text-center', 'number');
            cell.style.width = '40px';
            cell.style.height = '40px';
            cell.dataset.row = row;
            cell.dataset.col = col;

            // Add thick borders for 3x3 separation
            if ((col + 1) % 3 === 0 && col !== 8) {
                cell.classList.add('right-border');
            }
            if ((row + 1) % 3 === 0 && row !== 8) {
                cell.classList.add('bottom-border');
            }

            // Remove outer grid borders
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
 * Fills the rendered grid with the fetched puzzle data.
 * @param {Array} puzzle - 2D array of numbers/nulls from API
 */
function populateGrid(puzzle) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            const value = puzzle[row][col];

            if (value !== null) {
                cell.textContent = value;
                cell.classList.add('generated'); 
            } else {
                cell.textContent = '';
                cell.classList.remove('fw-bold', 'generated');
            }
        }
    }
}

/**
 * Fetches a Sudoku puzzle and solution from the API based on selected difficulty.
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

            console.log("Puzzle:", puzzle);
            console.log("Solution:", solution);

            renderEmptyGrid();
            populateGrid(puzzle);

            // You may want to store `solution` globally for later validation
        },
        error: function (jqXHR) {
            console.error('Error fetching puzzle:', jqXHR.responseText);
        }
    });
}

// === Initial Setup ===

// Render an empty grid on page load
renderEmptyGrid();

// Optional: Uncomment to immediately fetch a puzzle on load
// fetchSudokuBoard();