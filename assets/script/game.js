const API_KEY = '6nP4AYB9ImbH8hd6Zl79tg==iJV6BjdAY08uPpZU';

let currentSolution = null;
let selectedCell = null;

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

    document.addEventListener('keydown', function (e) {
        if (!selectedCell) return;

        const isEditable = selectedCell.classList.contains('editable');
        if (!isEditable) return;

        if (e.key >= '1' && e.key <= '9') {
            selectedCell.textContent = e.key;
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            selectedCell.textContent = '';
        }
    });

    document.querySelectorAll('#numbers-container h2').forEach(tile => {
        tile.addEventListener('click', function () {
            if (!selectedCell) return;
            if (!selectedCell.classList.contains('editable')) return;

            const val = this.textContent;
            selectedCell.textContent = val === 'X' ? '' : val;
        });
    });
}

// === Init ===
renderEmptyGrid();