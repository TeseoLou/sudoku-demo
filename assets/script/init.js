/**
 * Initialize all interactive features when the page loads
 */
function initPage() {
    // Handle nav link clicks and auto-collapse behavior
    setupNavLinkCollapse();
    // Close the navbar if user clicks outside of it
    setupOutsideNavbarCollapse();
    // Enable light/dark mode toggle
    setupThemeSwitch();
    // Close the setup modal when the start button is pressed
    setupStartButton();
}

// Run everything once the page is fully loaded
$(document).ready(() => {
    initPage();
});