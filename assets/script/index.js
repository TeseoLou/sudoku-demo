/**
 * Collapse the Bootstrap navbar when a nav-link is clicked.
 */
function setupNavLinkCollapse() {
    // Attach a click event to all nav links inside the collapsed navbar
    $(".navbar-collapse .nav-link").on("click", function (e) {
        // Set the href attribute of the clicked nav link
        const href = $(this).attr("href");
         // Set the target section based on the href 
        const $section = $(href);
        // Only proceed if the target section exists in the DOM
        if ($section.length) {
            // Prevent the default anchor jump behavior for smoother scrolling
            // Reference: https://www.w3schools.com/howto/howto_css_smooth_scroll.asp
            e.preventDefault(); 
            // Get the height of the navbar toggle button to adjust the scroll offset
            // Reference: https://templatesherpa.com/blog/bootstrap-navbar
            const navbarHeight = $(".navbar-toggler").outerHeight() || 0; 
            // Smoothly scroll to the section's position minus the navbar height for better visibility
            // Reference: https://css-tricks.com/snippets/jquery/smooth-scrolling/
            $("html, body").animate({
                scrollTop: $section.offset().top - navbarHeight,
            }, 600);
            // Remove Bootstrap 'show' class after selection
            // Reference: https://stackoverflow.com/a/42401606
            $(".navbar-collapse").removeClass("show"); 
        }
    });
}

/**
 * Collapse the Bootstrap navbar when clicking outside of the open menu.
 */
function setupOutsideNavbarCollapse() {
    // Listen for any click on the entire document
    $(document).on("click", function (e) {
        // Set the collapsible navbar element and store it for reuse
        const $navbarCollapse = $("#navbar-content");
        // Return early if navbar content element is not found in the DOM
        // Reference: https://www.sitepoint.com/jquery-check-element-exists/
        if (!$navbarCollapse.length) return;
        // Check if the click happened inside the navbar content
        // Reference: https://stackoverflow.com/questions/62375324
        const isClickInsideNavbar = $(e.target).closest("#navbar-content").length > 0;
        // Check if the click target is the navbar toggler or inside it
        // Reference: https://stackoverflow.com/questions/46736823
        const isNavbarToggler = $(e.target).is(".navbar-toggler") || $(e.target).closest(".navbar-toggler").length > 0;
        // If the click is outside both the navbar and toggler, and the navbar is expanded
        if (!isClickInsideNavbar && !isNavbarToggler && $navbarCollapse.hasClass("show")) {
            // Get the Bootstrap Collapse instance associated with the navbar
            // https://getbootstrap.com/docs/5.3/components/collapse/#methods
            const bsCollapse = bootstrap.Collapse.getInstance($navbarCollapse[0]);
            // If the instance exists hide the navbar
            if (bsCollapse) {
                bsCollapse.hide();
            }
        }
    });
}

/**
 * Handle theme switch toggle (light/dark mode)
 */
function setupThemeSwitch() {
    // Set the checkbox input for theme switching
    const $themeSwitch = $("#theme-switch");
    // Set the icon element that visually represents the theme
    const $themeIcon = $("#theme-icon");
    // Set the New Game button that opens the Setup modal
    const $newGameButton = $('button[data-bs-target="#setup-modal"]');
    // Set the Start button within the Setup modal
    const $startButton = $("#start-button");
    // Set the Back button in the Rules modal
    const $rulesBackButton = $("#rules-back-button");
    // Set up an event listener for when the theme switch is toggled
    // Reference: https://dev.to/whitep4nth3r/the-best-lightdark-mode-theme-toggle-in-javascript-368f
    $themeSwitch.on("change", function () {
        // Determine if the switch is in the "light mode" position
        const isLightMode = $(this).is(":checked");
        // Toggle the 'dark' class on the body based on switch state
        $("body").toggleClass("dark", !isLightMode);
        // Update the ARIA attribute for accessibility
        // Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-checked
        $(this).attr("aria-checked", isLightMode ? "true" : "false");
        // Update the theme icon to match the current mode
        $themeIcon.attr("class", isLightMode ? "fa-solid fa-sun" : "fa-solid fa-moon");
        // Toggle button styles based on the theme
        $newGameButton
            .toggleClass("btn-light", !isLightMode)
            .toggleClass("btn-dark", isLightMode);
        $startButton
            .toggleClass("btn-light", !isLightMode)
            .toggleClass("btn-dark", isLightMode);
        $rulesBackButton
            .toggleClass("btn-light", !isLightMode)
            .toggleClass("btn-dark", isLightMode);
    });
}

/**
 * Close the setup modal when the Enter button is clicked.
 */
function setupStartButton() {
    // Attach a click event handler to the Start button
    $("#start-button").on("click", function () {
        // Get the existing Bootstrap modal instance for the setup modal
        const setupModal = bootstrap.Modal.getInstance($("#setup-modal")[0]);
        // If the modal instance exists, hide the modal
        if (setupModal) {
            setupModal.hide();
        }
    });
}

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
    // Call the main initialization function to set up all interactivity
    initPage();
});