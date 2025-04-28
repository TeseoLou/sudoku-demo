/**
 * Collapse the Bootstrap navbar when a nav-link is clicked.
 * Also smooth scrolls to the linked section, adjusting for navbar height.
 */
function setupNavLinkCollapse() {
    // Select all nav-links inside the collapsed navbar
    document
        .querySelectorAll(".navbar-collapse .nav-link")
        .forEach((link) => {
            // Add a click event listener to each nav-link
            link.addEventListener("click", function (e) {
                // Find the target section element based on the href attribute
                let section = document.querySelector(e.target.getAttribute("href"));

                // If the section exists on the page
                if (section) {
                    e.preventDefault(); // Prevent the default anchor jump behavior

                    // Get the height of the navbar toggler (hamburger menu)
                    let navbarHeight = document.querySelector(".navbar-toggler").offsetHeight;

                    // Smoothly scroll to the target section
                    // Adjust the scroll position by subtracting the navbar height to avoid hiding content
                    window.scroll({
                        top: section.offsetTop - navbarHeight,
                        behavior: "smooth",
                    });

                    // After clicking a nav-link, manually collapse the navbar
                    document
                        .querySelector(".navbar-collapse")
                        .classList.remove("show");
                }
            });
        });
}

/**
 * Collapse the Bootstrap navbar when clicking outside of the open menu.
 */
function setupOutsideNavbarCollapse() {
    // Listen for any click anywhere on the document
    document.addEventListener("click", function (event) {
        const navbarCollapse = document.getElementById("navbarContent");

        // If the navbar collapse element does not exist, exit early
        if (!navbarCollapse) return;

        // Check if the clicked element is inside the navbar collapse area
        const isClickInsideNavbar = navbarCollapse.contains(event.target);

        // Check if the clicked element is the navbar toggler (hamburger button)
        const isNavbarToggler = event.target.classList.contains("navbar-toggler") || event.target.closest(".navbar-toggler");

        // If click is outside navbar and toggler, and navbar is currently open (has class 'show')
        if (!isClickInsideNavbar && !isNavbarToggler && navbarCollapse.classList.contains("show")) {
            // Get the existing Bootstrap Collapse instance
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);

            // If the Bootstrap Collapse instance exists, call hide() to collapse the navbar
            if (bsCollapse) {
                bsCollapse.hide();
            }
        }
    });
}

/**
 * Initialize all navbar behaviors for collapse and smooth scrolling.
 * This function calls both setup functions to activate navbar functionality.
 */
function initNavbarBehavior() {
    setupNavLinkCollapse();       // Enable nav-link click behavior
    setupOutsideNavbarCollapse(); // Enable outside-click collapse behavior
}

// Call the initializer function immediately to set up the navbar behaviors
initNavbarBehavior();



