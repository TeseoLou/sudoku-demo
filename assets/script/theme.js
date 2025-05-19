const themeToggleSounds = {
    tweet: new Audio("assets/sounds/tweet.mp3"),
    hoot: new Audio("assets/sounds/hoot.mp3"),

    play(name) {
        const sound = this[name];
        if (sound) {
            sound.currentTime = 0; // restart sound
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
        $newGameButton
            .toggleClass("btn-light", !isLightMode)
            .toggleClass("btn-dark", isLightMode);
    }
    if ($startButton.length) {
        $startButton
            .toggleClass("btn-light", !isLightMode)
            .toggleClass("btn-dark", isLightMode);
    }
    if ($rulesBackButton.length) {
        $rulesBackButton
            .toggleClass("btn-light", !isLightMode)
            .toggleClass("btn-dark", isLightMode);
    }
    if ($donateButton.length) {
        $donateButton
            .toggleClass("btn-light", !isLightMode)
            .toggleClass("btn-dark", isLightMode);
    }
    if ($checkButton.length) {
        $checkButton
            .toggleClass("btn-light", !isLightMode)
            .toggleClass("btn-dark", isLightMode);
    }
    if ($hintButton.length) {
        $hintButton
            .toggleClass("btn-light", !isLightMode)
            .toggleClass("btn-dark", isLightMode);
    }

    // Set up an event listener for when the theme switch is toggled
    // Reference: https://dev.to/whitep4nth3r/the-best-lightdark-mode-theme-toggle-in-javascript-368f
    themeSwitch.addEventListener("change", function () {
        const isLightMode = this.checked;

        themeToggleSounds.play(isLightMode ? "tweet" : "hoot");

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
        if ($newGameButton.length) {
            $newGameButton
                .toggleClass("btn-light", !isLightMode)
                .toggleClass("btn-dark", isLightMode);
        }
        if ($startButton.length) {
            $startButton
                .toggleClass("btn-light", !isLightMode)
                .toggleClass("btn-dark", isLightMode);
        }
        if ($rulesBackButton.length) {
            $rulesBackButton
                .toggleClass("btn-light", !isLightMode)
                .toggleClass("btn-dark", isLightMode);
        }
        if ($donateButton.length) {
            $donateButton
                .toggleClass("btn-light", !isLightMode)
                .toggleClass("btn-dark", isLightMode);
        }
        if ($checkButton.length) {
            $checkButton
                .toggleClass("btn-light", !isLightMode)
                .toggleClass("btn-dark", isLightMode);
        }
        if ($hintButton.length) {
            $hintButton
                .toggleClass("btn-light", !isLightMode)
                .toggleClass("btn-dark", isLightMode);
        }
    });

    themeSwitch.dispatchEvent(new Event("change"));
}

if (document.readyState !== "loading") {
    setupThemeSwitch();
} else {
    document.addEventListener("DOMContentLoaded", setupThemeSwitch);
}
