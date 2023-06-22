/* 
 * gui.ts
 *
 * This file contains the code for the menu screen and the game over/paused 
 * screen. Most of the code here is just onlcick handlers for buttons which
 * call methods from elsewhere.
 */

import { AssetLoader, AssetType } from "./engine/asset_loader";
import Game from "./game";

// alias for document.querySelector
function $<T extends HTMLElement>(selector: string): T {
    return document.querySelector<T>(selector);
}

// type aliases for common HTML elements
type Div = HTMLDivElement;
type Button = HTMLButtonElement;
type Span = HTMLSpanElement;

// get the buttons which select the level
const [prevLevelButton, nextLevelButton] = Array.from(
    document.querySelectorAll<Button>(".level-selector button")
) as [Button, Button];

// disables buttons if needed (e.g. if level is set to 1, disable prev button)
const updateButtons = () => {
    const level = parseInt($<Span>(".level").innerText);

    if (level === 1) {
        prevLevelButton.disabled = true;
    } else {
        prevLevelButton.disabled = false;
    }

    if (level === Game.maxLevel) {
        nextLevelButton.disabled = true;
    } else {
        nextLevelButton.disabled = false;
    }
};

// onclick handler for the button which selects the previous level
prevLevelButton.onclick = () => {
    const level = $<Span>(".level");

    if (parseInt(level.innerText) > 1) {
        level.textContent = (parseInt(level.textContent) - 1).toString();
    }

    updateButtons();
};

// onclick handler for the one that selects the next level
nextLevelButton.onclick = () => {
    const level = $<Span>(".level");

    if (parseInt(level.innerText) < Game.maxLevel) {
        level.textContent = (parseInt(level.textContent) + 1).toString();
    }

    updateButtons();
};

const showMenuScreen = () => {
    $<Div>(".menu").hidden = false;
    $<Div>(".game-stopped").hidden = true;

    updateButtons();
};

// onclick handler for the button on the game over/paused screen that takes you back to the menu
$<Button>(".menu-button").onclick = () => {
    $<Div>(".game-stopped").hidden = true; // hide game over/paused screen
    $<Div>(".menu").hidden = false; // show menu screen

    updateButtons(); // disable buttons if needed
};

// code to resume game
$<Button>(".resume-button").onclick = () => {
    $<Div>(".game-stopped").hidden = true; // hide pause screen
    $<Div>("canvas").hidden = false; // show canvas

    window["game"].start(); // resume game
};

// show a screen with a message, a button to return to the menu, and an optional button to resume the game
export const showGameStoppedScreen = (message: string, backButtonText: string, canResume: boolean) => {
    $<Div>("canvas").hidden = true;
    $<Div>(".game-stopped").hidden = false;
    $<Div>(".game-stopped .message").textContent = message;
    $<Button>(".game-stopped .menu-button").textContent = "< " + backButtonText;
    $<Button>(".game-stopped .resume-button").disabled = !canResume;
};

// switch logic
document.querySelectorAll(".switch").forEach(switchElement => {
    switchElement.addEventListener("click", () => {
        switchElement.textContent = switchElement.textContent === "ON" ? "OFF" : "ON";
    });
});

// asset loader which will be used below 
const assetLoader = new AssetLoader(
    [
        { type: AssetType.Image, path: "assets/images/tiles.png" },
        { type: AssetType.Image, path: "assets/images/player.png" },
        { type: AssetType.Image, path: "assets/images/items.png" },
        { type: AssetType.Image, path: "assets/images/item_box.png" },
        { type: AssetType.Image, path: "assets/images/zombie.png" },
        { type: AssetType.Audio, path: "assets/sounds/music.mp3" },
        { type: AssetType.Audio, path: "assets/sounds/footstep.mp3" },
        { type: AssetType.Audio, path: "assets/sounds/pick_up.mp3" },
        { type: AssetType.Audio, path: "assets/sounds/place.mp3" },
        { type: AssetType.Audio, path: "assets/sounds/swap_hands.mp3" },
        { type: AssetType.Audio, path: "assets/sounds/decline.mp3" },
    ],
    $(".loading .inner") // progress bar element for the asset loader to update
);

document.fonts.ready.then(async () => { // once font has loaded
    const loadingContainer = $<Div>(".loading");
    loadingContainer.hidden = false; // show loading screen

    const assets = await assetLoader.loadAll(); // load all assets

    // hide loading screen once assets have loaded
    loadingContainer.hidden = true;

    showMenuScreen();

    // make the play button start the game with the selected level
    $<Button>(".play-button").onclick = () => {
        // hide menu screen
        $<Div>(".menu").hidden = true;

        // get the level number
        const level = parseInt($(".level").innerText);

        // get and un-hide the canvas
        const canvas = $<HTMLCanvasElement>("canvas");
        canvas.hidden = false;

        // get sound settings
        const shouldPlayMusic = $<Div>(".music").textContent === "ON";
        const shouldPlaySFX = $<Div>(".sfx").textContent === "ON";

        // start the game
        window["game"] = new Game(canvas, assets, level, shouldPlayMusic, shouldPlaySFX);
        window["game"].getAudio("music").currentTime = 0; // reset music
        window["game"].start();
    };
});