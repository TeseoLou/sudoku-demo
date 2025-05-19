// Sound manager for theme toggle: plays 'tweet' or 'hoot' audio cues
// Object to store and control theme toggle sound effects
// Reference: https://stackoverflow.com/questions/40100433
const themeToggleSounds = {
    // The 'tweet' sound effect from file path
    tweet: new Audio("assets/sounds/tweet.mp3"),
    // The 'hoot' sound effect from file path
    hoot: new Audio("assets/sounds/hoot.mp3"),
    // Method to play a sound effect by name 
    // Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement
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
 * Handle theme switch toggle (light/dark mode)
 */
function setupThemeSwitch() {
    // Set the checkbox input for theme switching
    const themeSwitch = document.getElementById("theme-switch");
    // Set the icon element that visually represents the theme
    const $themeIcon = $("#theme-icon");
    // Set the New Game button that opens the Setup modal
    const $newGameButton = $('button[data-bs-target="#setup-modal"]');
    // Set the Start button within the Setup modal
    const $startButton = $("#start-button");
    // Set the Back button in the Rules modal
    const $rulesBackButton = $("#rules-back-button");
    // Set the Donate button on the About page
    const $donateButton = $("#donate-button");
    // Set the Check button on the Game page
    const $checkButton = $("#check-button");
    // Set the Hint button on the Game page
    const $hintButton = $("#hint-button");
    // Load stored theme preference on page load
    // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
    // Reference: https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/#toggling-manually
    const savedTheme = localStorage.getItem("theme");
    const isLightMode = savedTheme !== "dark"; // default to light mode if unset
    // Toggle the 'dark' class on the <body> based on the user's saved preference
    $("body").toggleClass("dark", !isLightMode);
    // Update the checkbox's checked property to reflect the current mode
    $(themeSwitch).prop("checked", isLightMode);
    // Change the icon class to a sun or moon based on the mode
    $themeIcon.attr("class", isLightMode ? "fa-solid fa-sun" : "fa-solid fa-moon");
    // Toggle button styles based on theme
    if ($newGameButton.length) {
        // Toggle between light and dark button classes based on the current theme
        $newGameButton
            .toggleClass("btn-light", !isLightMode)
            .toggleClass("btn-dark", isLightMode);
    }
    if ($startButton.length) {
        // Apply appropriate Bootstrap button style for the current theme
        $startButton
            .toggleClass("btn-light", !isLightMode)
            .toggleClass("btn-dark", isLightMode);
    }
    if ($rulesBackButton.length) {
        // Apply light or dark theme class depending on isLightMode
        $rulesBackButton
            .toggleClass("btn-light", !isLightMode)
            .toggleClass("btn-dark", isLightMode);
    }
    if ($donateButton.length) {
        // Update theme class for donate button
        $donateButton
            .toggleClass("btn-light", !isLightMode)
            .toggleClass("btn-dark", isLightMode);
    }
    if ($checkButton.length) {
        // Toggle Bootstrap classes for the check button based on theme
        $checkButton
            .toggleClass("btn-light", !isLightMode)
            .toggleClass("btn-dark", isLightMode);
    }
    if ($hintButton.length) {
        // Update hint button appearance based on current theme
        $hintButton
            .toggleClass("btn-light", !isLightMode)
            .toggleClass("btn-dark", isLightMode);
    }
    // Set up an event listener for when the theme switch is toggled
    // Reference: https://dev.to/whitep4nth3r/the-best-lightdark-mode-theme-toggle-in-javascript-368f
    themeSwitch.addEventListener("change", function () {
        // Determine if the theme toggle checkbox is checked (true = light mode, false = dark mode)
        const isLightMode = this.checked;
        // Play a sound based on the selected theme: 'tweet' for light mode, 'hoot' for dark mode
        themeToggleSounds.play(isLightMode ? "tweet" : "hoot");
        // Toggle the 'dark' class on the body element: add it when dark mode is active
        $("body").toggleClass("dark", !isLightMode);
        // Update the ARIA attribute for accessibility
        // Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-checked
        this.setAttribute("aria-checked", isLightMode ? "true" : "false");
        // Update the theme icon to match the current mode
        $themeIcon.attr("class", isLightMode ? "fa-solid fa-sun" : "fa-solid fa-moon");
        // Save user preference to localStorage
        // Reference: https://www.w3schools.com/jsref/prop_win_localstorage.asp
        localStorage.setItem("theme", isLightMode ? "light" : "dark");
        // Toggle button styles based on theme
        // Check if $newGameButton exists and update its style
        if ($newGameButton.length) {
            // Apply 'btn-light' when NOT in light mode, 'btn-dark' when in light mode
            $newGameButton
                .toggleClass("btn-light", !isLightMode)
                .toggleClass("btn-dark", isLightMode);
        }
        if ($startButton.length) {
            // Apply 'btn-light' when NOT in light mode, 'btn-dark' when in light mode
            $startButton
                .toggleClass("btn-light", !isLightMode)
                .toggleClass("btn-dark", isLightMode);
        }
        if ($rulesBackButton.length) {
            // Apply 'btn-light' when NOT in light mode, 'btn-dark' when in light mode
            $rulesBackButton
                .toggleClass("btn-light", !isLightMode)
                .toggleClass("btn-dark", isLightMode);
        }
        if ($donateButton.length) {
            // Apply 'btn-light' when NOT in light mode, 'btn-dark' when in light mode
            $donateButton
                .toggleClass("btn-light", !isLightMode)
                .toggleClass("btn-dark", isLightMode);
        }
        if ($checkButton.length) {
            // Apply 'btn-light' when NOT in light mode, 'btn-dark' when in light mode
            $checkButton
                .toggleClass("btn-light", !isLightMode)
                .toggleClass("btn-dark", isLightMode);
        }
        if ($hintButton.length) {
            // Apply 'btn-light' when NOT in light mode, 'btn-dark' when in light mode
            $hintButton
                .toggleClass("btn-light", !isLightMode)
                .toggleClass("btn-dark", isLightMode);
        }
    });
    // Trigger the 'change' event on the theme switch to apply theme changes programmatically
    themeSwitch.dispatchEvent(new Event("change"));
}

// Check if the HTML document has already been fully loaded and parsed
if (document.readyState !== "loading") {
    // If so immediately run the setupThemeSwitch function
    setupThemeSwitch();
} else {
    // If not wait until the DOM is fully loaded before running the function
    document.addEventListener("DOMContentLoaded", setupThemeSwitch);
}
