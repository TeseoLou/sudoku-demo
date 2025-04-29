/**
 * Collapse the Bootstrap navbar when a nav-link is clicked.
 * Also smooth scrolls to the linked section, adjusting for navbar height.
 */
function setupNavLinkCollapse() {
    // Select all navigation links inside the collapsed navbar
    $(".navbar-collapse .nav-link").on("click", function (e) {
        const href = $(this).attr("href"); // Get the href attribute of the clicked link
        const $section = $(href); // Select the section element matching the href

        // Check if the target section exists on the page
        if ($section.length) {
            e.preventDefault(); // Prevent the default anchor link jump behavior

            // Get the height of the navbar toggler (hamburger button)
            const navbarHeight = $(".navbar-toggler").outerHeight() || 0;

            // Animate smooth scroll to the target section
            // Adjust scroll position to account for navbar height
            $("html, body").animate(
                {
                    scrollTop: $section.offset().top - navbarHeight,
                },
                600 // Duration of the animation in milliseconds
            );

            // Manually collapse (hide) the navbar after clicking a nav-link
            $(".navbar-collapse").removeClass("show");
        }
    });
}

/**
 * Collapse the Bootstrap navbar when clicking outside of the open menu.
 */
function setupOutsideNavbarCollapse() {
    // Listen for click events anywhere in the document
    $(document).on("click", function (e) {
        const $navbarCollapse = $("#navbarContent"); // Select the collapsible navbar content

        // Exit early if the navbar content is not found
        if (!$navbarCollapse.length) return;

        // Determine if the clicked element is inside the navbar collapse area
        const isClickInsideNavbar = $(e.target).closest("#navbarContent").length > 0;

        // Determine if the clicked element is the navbar toggler (hamburger button)
        const isNavbarToggler = $(e.target).is(".navbar-toggler") || $(e.target).closest(".navbar-toggler").length > 0;

        // If the click is outside the navbar content and the toggler, and the navbar is open
        if (!isClickInsideNavbar && !isNavbarToggler && $navbarCollapse.hasClass("show")) {
            // Get the existing Bootstrap Collapse instance associated with the navbar
            const bsCollapse = bootstrap.Collapse.getInstance($navbarCollapse[0]);

            // If an instance exists, call hide() to collapse the navbar
            if (bsCollapse) {
                bsCollapse.hide();
            }
        }
    });
}

// JavaScript to toggle dark mode class when switch is flipped
document.getElementById('theme-switch').addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.remove('dark'); // Light mode
    } else {
        document.body.classList.add('dark'); // Dark mode
    }
});

/**
 * Initialize all navbar behaviors for collapse and smooth scrolling.
 */
function initNavbarBehavior() {
    setupNavLinkCollapse();       // Set up nav-link click behavior (smooth scroll + collapse)
    setupOutsideNavbarCollapse(); // Set up click-outside behavior (collapse navbar)
}

// When the document is fully loaded, initialize navbar behaviors
$(document).ready(function () {
    initNavbarBehavior();
});