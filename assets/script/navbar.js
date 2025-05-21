const navSounds = {
    page: new Audio("assets/sounds/page.mp3"),
    play(name) {
        // Retrieve the sound object matching the given name from the themeToggleSounds object
        const sound = this[name];
        // Check if a valid sound was found for the given name
        if (sound) {
            // Restart sound
            sound.currentTime = 0;
            // Attempt to play the sound, and log a warning if playback fails (e.g. due to browser restrictions)
            sound.play().catch(err => console.warn(`⚠️ Failed to play ${name}:`, err));
        }
    }
};

/**
 * Collapse the Bootstrap navbar when a nav-link is clicked
 */
// Reference: https://stackoverflow.com/questions/62375324
function setupNavLinkCollapse() {
    // Attach a click event to all nav links inside the collapsed navbar
    document.querySelectorAll(".navbar-collapse .nav-link").forEach(function (link) {
        link.addEventListener("click", function (event) {
            // Set the href attribute of the clicked nav link using jQuery
            const href = $(this).attr("href");
            // Set the target section based on the href using jQuery
            const section = $(href);
            // Only proceed if the target section exists in the DOM
            if (section.length) {
                // Prevent the default anchor jump behavior for smoother scrolling
                // Reference: https://www.w3schools.com/howto/howto_css_smooth_scroll.asp
                event.preventDefault();
                // Get the height of the navbar toggle button to adjust the scroll offset
                // Reference: https://templatesherpa.com/blog/bootstrap-navbar
                const navbarToggler = document.querySelector(".navbar-toggler");
                const navbarHeight = navbarToggler ? navbarToggler.offsetHeight : 0;
                // Smoothly scroll to the section's position minus the navbar height for better visibility
                // Reference: https://css-tricks.com/snippets/jquery/smooth-scrolling/
                $("html, body").animate({
                    scrollTop: section.offset().top - navbarHeight
                }, 600);
                // Remove Bootstrap 'show' class after selection
                // Reference: https://stackoverflow.com/a/42401606
                $(".navbar-collapse").removeClass("show");
            }
        });
    });
}

/**
 * Collapse the Bootstrap navbar when clicking outside of the open menu
 */
// Reference: https://stackoverflow.com/questions/74670132
function setupOutsideNavbarCollapse() {
    // Listen for any click on the entire document
    document.addEventListener("click", function (event) {
        // Set the collapsible navbar element using jQuery
        const navbarCollapse = $("#navbar-content");
        // Return early if navbar content element is not found in the DOM
        // Reference: https://www.sitepoint.com/jquery-check-element-exists/
        if (!navbarCollapse.length) return;
        // Check if the click happened inside the navbar content using jQuery
        // Reference: https://stackoverflow.com/questions/62375324
        const isClickInsideNavbar = $(event.target).closest("#navbar-content").length > 0;
        // Check if the click target is the navbar toggler or inside it using jQuery
        // Reference: https://stackoverflow.com/questions/46736823
        const isNavbarToggler = $(event.target).is(".navbar-toggler") || $(event.target).closest(".navbar-toggler").length > 0;
        // If the click is outside both the navbar and toggler, and the navbar is expanded
        if (!isClickInsideNavbar && !isNavbarToggler && $navbarCollapse.hasClass("show")) {
            // Get the Bootstrap Collapse instance associated with the navbar
            // https://getbootstrap.com/docs/5.3/components/collapse/#methods
            const bsCollapse = bootstrap.Collapse.getInstance($navbarCollapse[0]);
            // If the instance exists, hide the navbar
            if (bsCollapse) {
                bsCollapse.hide();
            }
        }
    });
}

/**
 * Sets up button event listeners, sound triggers, and navigation handling once the page is fully loaded
 */
document.addEventListener('DOMContentLoaded', function () {
    // Add sound effects for when any Bootstrap modal opens or closes
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('shown.bs.modal', () => {
            soundEffects.play("page");
        });
        modal.addEventListener('hidden.bs.modal', () => {
            soundEffects.play("page");
        });
    });
    // Intercept clicks on main navigation links
    document.querySelectorAll('a[href="index.html"], a[href="about.html"]').forEach(link => {
        link.addEventListener('click', function (event) {
            // Stop the browser from navigating right away
            event.preventDefault();
            const href = $(this).attr('href');
            // Check if the current page is index.html
            const isLeavingGame = window.location.pathname.includes("index.html") || window.location.pathname === "/" || window.location.pathname.endsWith("index.html");
            // Prompt the user before leaving the game to avoid accidental loss
            if (isLeavingGame && href.includes("about.html")) {
                const proceed = confirm("Are you sure you want to leave? Your current game will be lost.");
                if (!proceed) return;
            }
            // Play a page transition sound and navigate after a short delay
            soundEffects.play("page");
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
});