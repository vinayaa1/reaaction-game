let startTime = 0;
let timeout = null;
let gameState = "idle";
let reactionTimes = [];
let round = 0;
let theme = "cuteness";

const maxRounds = 5;
const box = document.getElementById("box");
const startBtn = document.getElementById("startBtn");
const message = document.getElementById("message");
const result = document.getElementById("result");

function resetGame() {
    startTime = 0;
    reactionTimes = [];
    round = 0;
    gameState = "idle";

    box.style.display = "none";
    result.textContent = "";
    message.textContent = "click start to begin!!! (you will play 5 rounds, click the square as soon as it turns green, your average score will be given at the end!"
    playClick();
}

function startRound(){
    gameState = "waiting";
    box.style.display = "block";
    box.style.background = "#ff8fab"
    
    message.textContent = `round ${round + 1}/${maxRounds}: wait for green...`;
    const delay = Math.random() * 3000 + 1000
    
    timeout = setTimeout(() => {
        box.style.background = "#7ae582";
        message.textContent = "click nowww";
        playSuccess();
        startTime = Date.now();
        gameState = "ready";
        }, delay);
}

function endGame() {
  const avg =
    reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;

  const best = Math.min(...reactionTimes);

  message.textContent = "game over";
  result.innerHTML = `
    <p>Average: ${Math.round(avg)} ms</p>
    <p>Best: ${best} ms</p>
    <p>Click start to play again</p>
  `;

  gameState = "idle";
  box.style.display = "none";

  leaderboard.push({
    avg: Math.round(avg),
    best: best,
    date: new Date().toLocaleTimeString()
  })

  leaderboard.sort((a,b) => a.best - b.best);
  leaderboard = leaderboard.slice(0,5);

  localStorage.setItem("leaderboard", JSONstringify(leaderboard));
  renderLeaderboard();

}

function renderLeaderboard() {
  const lb = document.getElementById("leaderboard");

  lb.innerHTML = "<h3>🏆 Leaderboard</h3>" +
    leaderboard.map((s, i) =>
      `<p>${i + 1}. ${s.best}ms (avg ${s.avg}ms)</p>`
    ).join("");
}

startBtn.onclick = () => {
  resetGame();
  startRound();
  round = 0;
};

box.onclick = () => {
  if (gameState === "waiting") {
    clearTimeout(timeout);
    message.textContent = "too early...";
    playFail();
    setTimeout(() => {
      startRound();
    }, 1000);

    return;
  }

  if (gameState === "ready") {
    const reaction = Date.now() - startTime;
    reactionTimes.push(reaction);

    message.textContent = `reaction: ${reaction} ms`;
    gameState = "result";

    round++;

    setTimeout(() => {
      if (round < maxRounds) {
        startRound();
      } else {
        endGame();
      }
    }, 800);
  }
};

const themeBtn = document.getElementById("themeToggle");

themeBtn.onclick = () => {
  if (theme === "cuteness") {
    theme = "dark";
    document.body.className = "dark";
  } else {
    theme = "cuteness";
    document.body.className = "cuteness";
  }
};

let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
