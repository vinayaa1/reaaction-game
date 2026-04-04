const clickSound = new Audio("assets/click.mp3");
const successSound = new Audio ("assets/success.mp3");
const failSound = new Audio ("assets/fail.mp3");

function playClick() {
    clickSound.currentTime = 0;
    clickSound.play();
}

function playSuccess() {
    successSound.currentTime = 0;
    successSound.play();
}

function playFail() {
    failSound.currentTime = 0;
    failSound.play();
}