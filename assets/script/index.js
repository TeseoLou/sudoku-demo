/**
 * Collapse the Bootstrap navbar when a nav-link is clicked.
 * Also smooth scrolls to the linked section, adjusting for navbar height.
 */
function setupNavLinkCollapse() {
    $(".navbar-collapse .nav-link").on("click", function (e) {
        const href = $(this).attr("href");
        const $section = $(href);

        if ($section.length) {
            e.preventDefault();
            const navbarHeight = $(".navbar-toggler").outerHeight() || 0;

            $("html, body").animate(
                {
                    scrollTop: $section.offset().top - navbarHeight,
                },
                600
            );

            $(".navbar-collapse").removeClass("show");
        }
    });
}

/**
 * Collapse the Bootstrap navbar when clicking outside of the open menu.
 */
function setupOutsideNavbarCollapse() {
    $(document).on("click", function (e) {
        const $navbarCollapse = $("#navbarContent");
        if (!$navbarCollapse.length) return;

        const isClickInsideNavbar = $(e.target).closest("#navbarContent").length > 0;
        const isNavbarToggler = $(e.target).is(".navbar-toggler") || $(e.target).closest(".navbar-toggler").length > 0;

        if (!isClickInsideNavbar && !isNavbarToggler && $navbarCollapse.hasClass("show")) {
            const bsCollapse = bootstrap.Collapse.getInstance($navbarCollapse[0]);
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
    const themeSwitch = document.getElementById('theme-switch');
    const themeLabel = document.getElementById('theme-label');
    const themeIcon = document.getElementById('theme-icon');
  
    themeSwitch.addEventListener('change', function () {
      if (this.checked) {
        document.body.classList.remove('dark'); // Switch to Light Mode
        themeSwitch.setAttribute('aria-checked', 'true'); // Accessibility
        themeIcon.className = 'fa-solid fa-sun'; // Change to sun icon
      } else {
        document.body.classList.add('dark'); // Switch to Dark Mode
        themeSwitch.setAttribute('aria-checked', 'false'); // Accessibility
        themeIcon.className = 'fa-solid fa-moon'; // Change to moon icon
      }
    });
  }
  

/**
 * Close the setup modal when the Start button is clicked.
 */
function setupStartButton() {
    const startButton = document.getElementById('start-button');

    startButton.addEventListener('click', function () {
        const setupModal = bootstrap.Modal.getInstance(document.getElementById('setupModal'));
        if (setupModal) {
            setupModal.hide();
        }
    });
}

/**
 * Initialize all behaviors on page load.
 */
function initPage() {
    setupNavLinkCollapse();
    setupOutsideNavbarCollapse();
    setupThemeSwitch();
    setupStartButton();
}

// When the document is fully loaded, initialize everything
$(document).ready(function () {
    initPage();
});
