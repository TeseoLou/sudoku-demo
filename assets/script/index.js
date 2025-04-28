// Collapse navbar when clicking outside the menu (for mobile/tablet view)
document.addEventListener('click', function(event) {
    const navbarCollapse = document.getElementById('navbarContent');
    
    // Check if click is inside the navbar or on the hamburger button
    const isClickInsideNavbar = navbarCollapse.contains(event.target);
    const isNavbarToggler = event.target.classList.contains('navbar-toggler') || event.target.closest('.navbar-toggler');
  
    // If navbar is open, and click is outside, collapse it
    if (!isClickInsideNavbar && !isNavbarToggler && navbarCollapse.classList.contains('show')) {
      const collapse = new bootstrap.Collapse(navbarCollapse, {
        toggle: true
      });
    }
  });