const categories = ["Shooting", "Defense", "Speed", "Strength", "IQ"];
let attributes = {};
let currentCategoryIndex = 0;
let playerName = "";

// DOM elements
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

// 🎡 Wheel setup
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const wheelNumbers = Array.from({ length: 60 }, (_, i) => i + 40); // 40–99
const wheelColors = ["#e74c3c", "#3498db", "#f1c40f", "#2ecc71", "#9b59b6"];

let angle = 0;
let spinning = false;
let spinVelocity = 0;

// Draw wheel
function drawWheel() {
  const radius = canvas.width / 2;
  const step = (2 * Math.PI) / wheelNumbers.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < wheelNumbers.length; i++) {
    const startAngle = i * step + angle;
    const endAngle = startAngle + step;

    // Colored slice
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, startAngle, endAngle);
    ctx.fillStyle = wheelColors[i % wheelColors.length];
    ctx.fill();

    // Number
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(startAngle + step / 2);
    ctx.fillStyle = "white";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "right";
    ctx.fillText(wheelNumbers[i], radius - 10, 5);
    ctx.restore();
  }

  // Pointer arrow (top center)
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.moveTo(radius, 5);
  ctx.lineTo(radius - 15, 35);
  ctx.lineTo(radius + 15, 35);
  ctx.closePath();
  ctx.fill();
}

// Spin animation
function spinWheelAnimation() {
  if (!spinning) return;

  angle += spinVelocity;
  spinVelocity *= 0.985; // friction

  if (spinVelocity < 0.002) {
    spinning = false;
    const selected = getWheelResult();
    finalizeSpin(selected);
  }

  drawWheel();
  requestAnimationFrame(spinWheelAnimation);
}

function startSpin() {
  if (spinning) return;
  spinVelocity = Math.random() * 0.25 + 0.25; // random speed
  spinning = true;
  spinWheelAnimation();
}

function getWheelResult() {
  const step = (2 * Math.PI) / wheelNumbers.length;
  const normalizedAngle = (2 * Math.PI - (angle % (2 * Math.PI))) % (2 * Math.PI);
  const index = Math.floor(normalizedAngle / step);
  return wheelNumbers[index];
}

// Career logic (realistic)
function overallScore(attrs) {
  let values = Object.values(attrs);
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function evaluatePlayer(attrs) {
  const ovr = overallScore(attrs);
  let results = {};

  // More realistic ranges
  results["Points Per Game"] = (8 + ovr * 0.25 + Math.random() * 3).toFixed(1); // ~10–35
  results["Rebounds Per Game"] = (2 + ovr * 0.08 + Math.random() * 2).toFixed(1); // ~3–15
  results["Assists Per Game"] = (1 + ovr * 0.07 + Math.random() * 2).toFixed(1); // ~2–12

  results["Championships"] = ovr > 80 ? Math.floor((ovr - 70) / 15) + (Math.random() > 0.7 ? 1 : 0) : 0;
  results["MVP Awards"] = ovr > 92 ? Math.floor(Math.random() * 3) : 0;
  results["All-Star Selections"] = Math.floor(ovr / 10) + (Math.random() > 0.7 ? 1 : 0);

  return results;
}

// 🎮 Game flow
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

  drawWheel(); // draw immediately
});

spinBtn.addEventListener("click", () => {
  if (currentCategoryIndex >= categories.length) return;
  startSpin();
});

function finalizeSpin(score) {
  let category = categories[currentCategoryIndex];
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
}

restartBtn.addEventListener("click", () => {
  resultsDiv.classList.add("hidden");
  gameDiv.classList.remove("hidden");
  document.getElementById("playerName").value = "";
  angle = 0; // reset wheel
  drawWheel();
});

// Draw wheel immediately on page load
drawWheel();
