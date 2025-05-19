/**
 * Initialize all behaviors on page load.
 */
function initPage() {
    // Setup smooth scroll and collapse for navbar links
    setupNavLinkCollapse();
    // Setup logic to collapse the navbar when clicking outside of it
    setupOutsideNavbarCollapse();
    // Setup the theme switch toggle functionality 
    setupThemeSwitch();
    // Setup functionality to close the setup modal when the start button is clicked
    setupStartButton();
}

// When the document is fully loaded, initialize everything
$(document).ready(function () {
    initPage();
});