/**
 * Close the setup modal when the Enter button is clicked.
 */
function setupStartButton() {
    // Attach a click event handler to the Start button
    const startButton = document.getElementById("start-button");
    if (!startButton) return;
    startButton.addEventListener("click", function () {
        // Get the setup modal element
        const $setupModal = $("#setup-modal");
        // Get the existing Bootstrap modal instance for the setup modal
        // Reference: https://getbootstrap.com/docs/5.3/components/modal/#methods
        const setupModal = bootstrap.Modal.getInstance($setupModal[0]);
        // If the modal instance exists, hide the modal
        if (setupModal) {
            setupModal.hide();
        }
        // Call the board generator after modal closes
        fetchSudokuBoard();
        startTimer();
        updateDifficultyDisplay();
        hintsUsed = 0;
        updateHintsDisplay();
        hasCelebrated = false;
    });
}
