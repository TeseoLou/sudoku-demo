// Theme toggle sound effects
// Object to store and control theme toggle sound effects
// Reference: https://stackoverflow.com/questions/40100433
const themeToggleSounds = {
    // The 'tweet' sound for light mode
    tweet: new Audio("assets/sounds/tweet.mp3"),
    // The 'hoot' sound for dark mode
    hoot: new Audio("assets/sounds/hoot.mp3"),
    // Method that plays a sound effect by name 
    // Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement
    play(name) {
        // Retrieve the sound object matching the given name from the themeToggleSounds object
        const sound = this[name];
        // Check if a valid sound was found for the given name
        if (sound) {
            // Restart sound
            sound.currentTime = 0;
            // Play the sound
            sound.play();
        }
    }
};

/**
 * Apply the theme settings to the DOM.
 */
function applyTheme(isLightMode, playSound = false) {
    // Toggle 'dark' class based on theme
    // Reference: https://stackoverflow.com/questions/60469551
    $("body").toggleClass("dark", !isLightMode);
    // Update the checkbox to reflect the current theme
    // Reference: https://api.jquery.com/prop/
    $("#theme-switch").prop("checked", isLightMode);
    // Change theme icon class
    $("#theme-icon").attr("class", isLightMode ? "fa-solid fa-sun" : "fa-solid fa-moon");
    // Play sound if requested
    if (playSound) {
        themeToggleSounds.play(isLightMode ? "tweet" : "hoot");
    }
    // Button elements that change appearance depending on theme
    const themeButtons = [
        $('button[data-bs-target="#setup-modal"]'),
        $("#start-button"),
        $("#rules-back-button"),
        $("#donate-button"),
        $("#check-button"),
        $("#hint-button")
    ];
    // Toggle Bootstrap theme classes
    // Reference: https://www.freecodecamp.org/news/javascript-array-foreach-tutorial-how-to-iterate-through-elements-in-an-array-with-map/
    themeButtons.forEach($btn => {
        if ($btn.length) {
            $btn
                .toggleClass("btn-light", !isLightMode)
                .toggleClass("btn-dark", isLightMode);
        }
    });
    // Save theme preference to localStorage
    // Reference: https://www.w3schools.com/jsref/prop_win_localstorage.asp
    localStorage.setItem("theme", isLightMode ? "light" : "dark");
}

/**
 * Setup the theme switch logic on page load and user interaction.
 */
function setupThemeSwitch() {
    const themeSwitch = document.getElementById("theme-switch");
    // Get saved theme preference from localStorage
    // Reference: https://whitep4nth3r.com/blog/best-light-dark-mode-theme-toggle-javascript/
    const savedTheme = localStorage.getItem("theme");
    const isLightMode = savedTheme !== "dark"; // Default to light mode
    // Call function - Apply the theme settings to the DOM without sound
    applyTheme(isLightMode, false);
    // Add listener for user toggle
    // Reference: https://dev.to/whitep4nth3r/the-best-lightdark-mode-theme-toggle-in-javascript-368f
    themeSwitch.addEventListener("change", function () {
        const isLight = this.checked;
        // Update ARIA for accessibility
        // Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-checked
        this.setAttribute("aria-checked", isLight ? "true" : "false");
        // Call function - Apply the theme settings to the DOM with sound
        applyTheme(isLight, true);
    });
}

// Run setupThemeSwitch when DOM is ready
// Reference: https://builtin.com/articles/document-ready-javascript
if (document.readyState !== "loading") {
    // Call function - Setup the theme switch logic on page load and user interaction
    setupThemeSwitch();
} else {
    document.addEventListener("DOMContentLoaded", setupThemeSwitch);
}