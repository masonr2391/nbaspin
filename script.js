const categories = ["Shooting", "Defense", "Speed", "Strength", "IQ"];
let attributes = {};
let currentCategoryIndex = 0;
let playerName = "";

const startBtn = document.getElementById("startBtn");
const spinBtn = document.getElementById("spinBtn");
const restartBtn = document.getElementById("restartBtn");

const gameDiv = document.getElementById("game");
const spinsDiv = document.getElementById("spins");
const resultsDiv = document.getElementById("results");

const currentCategoryEl = document.getElementById("currentCategory");
const resultEl = document.getElementById("result");
const attributesList = document.getElementById("attributesList");
const summaryEl = document.getElementById("summary");
const careerResultsEl = document.getElementById("careerResults");

function spinWheel() {
  return Math.floor(Math.random() * 60) + 40; // range 40–99
}

function overallScore(attrs) {
  let values = Object.values(attrs);
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function evaluatePlayer(attrs) {
  const ovr = overallScore(attrs);
  let results = {};

  results["Points Per Game"] = (Math.random() * (ovr/1.5 - ovr/2) + ovr/2).toFixed(1);
  results["Rebounds Per Game"] = (Math.random() * (ovr/5 - ovr/10) + ovr/10).toFixed(1);
  results["Assists Per Game"] = (Math.random() * (ovr/6 - ovr/12) + ovr/12).toFixed(1);

  results["Championships"] = Math.floor(ovr / 20) + (Math.random() > 0.5 ? 1 : 0);
  results["MVP Awards"] = Math.floor(ovr / 25) + (Math.random() > 0.7 ? 1 : 0);
  results["All-Star Selections"] = Math.floor(ovr / 10) + Math.floor(Math.random() * 3);

  return results;
}

startBtn.addEventListener("click", () => {
  playerName = document.getElementById("playerName").value.trim();
  if (!playerName) {
    alert("Please enter a player name!");
    return;
  }

  gameDiv.classList.add("hidden");
  spinsDiv.classList.remove("hidden");

  attributes = {};
  currentCategoryIndex = 0;
  attributesList.innerHTML = "";
  resultEl.textContent = "";
  currentCategoryEl.textContent = `Spin for ${categories[currentCategoryIndex]}`;
});

spinBtn.addEventListener("click", () => {
  let category = categories[currentCategoryIndex];
  let score = spinWheel();
  attributes[category] = score;

  resultEl.textContent = `${category}: ${score}`;
  attributesList.innerHTML += `<li>${category}: ${score}</li>`;

  currentCategoryIndex++;

  if (currentCategoryIndex < categories.length) {
    currentCategoryEl.textContent = `Spin for ${categories[currentCategoryIndex]}`;
  } else {
    spinsDiv.classList.add("hidden");
    resultsDiv.classList.remove("hidden");

    const ovr = overallScore(attributes).toFixed(1);
    summaryEl.textContent = `${playerName} (OVR ${ovr}) with attributes: ${JSON.stringify(attributes)}`;

    let career = evaluatePlayer(attributes);
    careerResultsEl.innerHTML = "";
    for (let [key, value] of Object.entries(career)) {
      careerResultsEl.innerHTML += `<li>${key}: ${value}</li>`;
    }
  }
});

restartBtn.addEventListener("click", () => {
  resultsDiv.classList.add("hidden");
  gameDiv.classList.remove("hidden");
  document.getElementById("playerName").value = "";
});
