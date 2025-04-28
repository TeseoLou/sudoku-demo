// ==============================
// Collapse navbar and smooth scroll on nav-link click
// ==============================

document
  .querySelectorAll(".navbar-collapse .nav-link")
  .forEach((link) => {
    link.addEventListener("click", function (e) {
      let section = document.querySelector(e.target.getAttribute("href"));
      if (section) {
        e.preventDefault(); // Prevent default anchor behavior
        let navbarHeight = document.querySelector(".navbar-toggler").offsetHeight;
        window.scroll({
          top: section.offsetTop - navbarHeight, // Adjust scroll position for navbar height
          behavior: "smooth",
        });
        document
          .querySelector(".navbar-collapse")
          .classList.remove("show"); // Collapse the navbar
      }
    });
  });

// ==============================
// Collapse navbar when clicking outside the menu
// ==============================

document.addEventListener("click", function (event) {
  const navbarCollapse = document.getElementById("navbarContent");

  if (!navbarCollapse) return;

  const isClickInsideNavbar = navbarCollapse.contains(event.target);
  const isNavbarToggler = event.target.classList.contains("navbar-toggler") || event.target.closest(".navbar-toggler");

  if (!isClickInsideNavbar && !isNavbarToggler && navbarCollapse.classList.contains("show")) {
    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
    if (bsCollapse) {
      bsCollapse.hide();
    }
  }
});

