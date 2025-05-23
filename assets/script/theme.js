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
        // Grabs the sound object that matches the name from the themeToggleSounds object
        const sound = this[name];
        // Confirm that a valid sound was found
        if (sound) {
            // Reset playback
            sound.currentTime = 0;
            // Try to play it
            sound.play().catch(err => console.warn(`⚠️ Failed to play ${name}:`, err));
        }
    }
};

/**
 * Handle theme switch toggle (light/dark mode)
 */
function setupThemeSwitch() {
    // Reference the toggle checkbox
    const themeSwitch = document.getElementById("theme-switch");
    // Elements that need style changes depending on the selected theme
    const themeIcon = $("#theme-icon");
    const newGameButton = $('button[data-bs-target="#setup-modal"]');
    const startButton = $("#start-button");
    const rulesBackButton = $("#rules-back-button");
    const donateButton = $("#donate-button");
    const checkButton = $("#check-button");
    const hintButton = $("#hint-button");
    // Load stored theme preference on page load
    // Reference: https://whitep4nth3r.com/blog/best-light-dark-mode-theme-toggle-javascript/#:~:text=Get%20theme%20preference%20from%20local%20storage,-We%20can%20use&text=On%20page%20load%2C%20use%20localStorage,the%20value%20will%20be%20null%20.
    // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
    // Reference: https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/#toggling-manually
    const savedTheme = localStorage.getItem("theme");
    const isLightMode = savedTheme !== "dark"; // default to light mode if unset
    // Toggle the 'dark' class on the <body> based on the user's saved preference
    // Reference: https://stackoverflow.com/questions/60469551
    $("body").toggleClass("dark", !isLightMode);
    // Update the checkbox's checked property to reflect the current mode
    // Reference: https://api.jquery.com/prop/
    $(themeSwitch).prop("checked", isLightMode);
    // Change the icon class to a sun or moon based on the mode
    themeIcon.attr("class", isLightMode ? "fa-solid fa-sun" : "fa-solid fa-moon");
    // Make button array
    const themeButtons = [
        newGameButton,
        startButton,
        rulesBackButton,
        donateButton,
        checkButton,
        hintButton
    ];
    // Loop through each button
    // Reference: https://www.freecodecamp.org/news/javascript-array-foreach-tutorial-how-to-iterate-through-elements-in-an-array-with-map/
    themeButtons.forEach(button => {
        // Only proceed if the element actually matched something
        if (button.length) {
            // If we're in light mode, remove the dark class and add the light one, and vice versa
            button
                .toggleClass("btn-light", !isLightMode) // Apply light button class when not in light mode
                .toggleClass("btn-dark", isLightMode);  // Apply dark button class when light mode is active
        }
    });
    // Create event listener for theme toggling
    // Reference: https://dev.to/whitep4nth3r/the-best-lightdark-mode-theme-toggle-in-javascript-368f
    themeSwitch.addEventListener("change", function () {
        // Find out if the theme toggle checkbox is checked
        const isLightMode = this.checked;
        // Play sound associated with the theme
        themeToggleSounds.play(isLightMode ? "tweet" : "hoot");
        // Toggle the 'dark' class on the body element
        $("body").toggleClass("dark", !isLightMode);
        // Update the ARIA attribute
        // Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-checked
        this.setAttribute("aria-checked", isLightMode ? "true" : "false");
        // Update the theme icon to match the current mode
        themeIcon.attr("class", isLightMode ? "fa-solid fa-sun" : "fa-solid fa-moon");
        // Save user preference to localStorage
        // Reference: https://www.w3schools.com/jsref/prop_win_localstorage.asp
        localStorage.setItem("theme", isLightMode ? "light" : "dark");
        // Loop through each button and toggle Bootstrap theme classes
        // Reference: https://www.freecodecamp.org/news/javascript-array-foreach-tutorial-how-to-iterate-through-elements-in-an-array-with-map/
        themeButtons.forEach($btn => {
            if ($btn.length) {
                // Add 'btn-dark' in light mode, 'btn-light' in dark mode
                $btn
                    .toggleClass("btn-light", !isLightMode)
                    .toggleClass("btn-dark", isLightMode);
            }
        });
    });
    // Trigger the 'change' event on the theme switch to apply theme changes programmatically
    themeSwitch.dispatchEvent(new Event("change"));
}

// Check if the HTML document has already been fully loaded and parsed
// Reference: https://builtin.com/articles/document-ready-javascript?
if (document.readyState !== "loading") {
    // If so immediately run the setupThemeSwitch function
    setupThemeSwitch();
// Reference: https://oxylabs.io/resources/web-scraping-faq/javascript/wait-page-load
} else {
    // If not wait until the DOM is fully loaded before running the function
    document.addEventListener("DOMContentLoaded", setupThemeSwitch);
}
