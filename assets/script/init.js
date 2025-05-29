/**
 * Initialize all interactive features when the page loads
 */
// Reference: https://www.shecodes.io/athena/60837-how-to-call-a-function-within-another-function-in-javascript
function initPage() {
    // Call function - Collapse the Bootstrap navbar when a nav-link is clicked
    setupNavLinkCollapse();
    // Call function - Collapse the Bootstrap navbar when clicking outside of the open menu
    setupOutsideNavbarCollapse();
    // Call function - Setup the theme switch logic on page load and user interaction
    setupThemeSwitch();
    // Call function - Close the setup modal when the Enter button is clicked
    setupStartButton();
}

// Run everything once the page is fully loaded
// Reference: https://stackoverflow.com/questions/17567176
$(document).ready(() => {
    initPage();
});