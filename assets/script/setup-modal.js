/**
 * Close the setup modal when the Enter button is clicked.
 */
function setupStartButton() {
    // Attach a click event handler to the Start button
    // Reference: https://stackoverflow.com/questions/61793029
    const startButton = document.getElementById("start-button");
    if (!startButton) return;
    startButton.addEventListener("click", function () {
        // Get the setup modal element
        const setupModal = $("#setup-modal");
        // Get the existing Bootstrap modal instance for the setup modal
        // Reference: https://getbootstrap.com/docs/5.3/components/modal/#methods
        const setupModalBootstrap = bootstrap.Modal.getInstance(setupModal[0]);
        // If the modal instance exists hide the modal
        if (setupModalBootstrap) {
            // Reference: https://getbootstrap.com/docs/5.0/components/modal/#hide
            setupModalBootstrap.hide();
        }
        // Call function - Start a game by providing a fresh board, resetting stats, and resetting the timer and game stats
        startNewGame();
    });
}