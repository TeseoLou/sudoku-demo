/**
 * Initialize all interactive features when the page loads
 */
// Reference: https://www.shecodes.io/athena/60837-how-to-call-a-function-within-another-function-in-javascript
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
// Reference: https://stackoverflow.com/questions/17567176
$(document).ready(() => {
    initPage();
});