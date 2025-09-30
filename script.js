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
const attributeTitle = document.getElementById("attributeTitle");
const resultEl = document.getElementById("result");
const attributesList = document.getElementById("attributesList");
const summaryEl = document.getElementById("summary");
const careerResultsEl = document.getElementById("careerResults");

// Wheel setup
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
let wheelNumbers = Array.from({ length: 60 }, (_, i) => i + 40); // 40-99
const wheelColors = ["#e74c3c", "#3498db", "#f1c40f", "#2ecc71", "#9b59b6"];
const sliceCount = wheelNumbers.length;
const sliceAngle = (2 * Math.PI) / sliceCount;

// Animation variables
let spinning = false;
let startAngle = 0;
let targetAngle = 0;
let animationStartTime = 0;
const animationDuration = 3000; // spin duration in ms

// Easing function
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Draw wheel
function drawWheel(angle) {
  const radius = canvas.width / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < sliceCount; i++) {
    const start = i * sliceAngle + angle;
    const end = start + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, start, end);
    ctx.fillStyle = wheelColors[i % wheelColors.length];
    ctx.fill();

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(start + sliceAngle / 2);
    ctx.fillStyle = "white";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "right";
    ctx.fillText(wheelNumbers[i], radius - 10, 5);
    ctx.restore();
  }

  // Pointer
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.moveTo(radius, 5);
  ctx.lineTo(radius - 15, 35);
  ctx.lineTo(radius + 15, 35);
  ctx.closePath();
  ctx.fill();
}

// Spin animation
function animateSpin(timestamp) {
  if (!animationStartTime) animationStartTime = timestamp;
  const elapsed = timestamp - animationStartTime;
  const t = Math.min(elapsed / animationDuration, 1);
  const easedT = easeOutCubic(t);
  const currentAngle = startAngle + (targetAngle - startAngle) * easedT;

  drawWheel(currentAngle);

  if (t < 1) {
    requestAnimationFrame(animateSpin);
  } else {
    spinning = false;
    finalizeSpin(getWheelResult(currentAngle));
  }
}

// Start spin
function startSpin() {
  if (spinning) return;
  spinning = true;

  const rotations = Math.floor(Math.random() * 3) + 5; // 5-7 full rotations
  const targetIndex = Math.floor(Math.random() * sliceCount);

  startAngle = 0;
  targetAngle = rotations * 2 * Math.PI + targetIndex * sliceAngle;
  animationStartTime = 0;

  requestAnimationFrame(animateSpin);
}

// Get number under pointer
function getWheelResult(angle) {
  angle = angle % (2 * Math.PI);
  const index = Math.floor((2 * Math.PI - angle) / sliceAngle) % sliceCount;
  return wheelNumbers[index];
}

// Career logic
function overallScore(attrs) {
  return Object.values(attrs).reduce((a, b) => a + b, 0) / Object.values(attrs).length;
}

function evaluatePlayer(attrs) {
  const ovr = overallScore(attrs);
  let results = {};
  results["Points Per Game"] = (8 + ovr * 0.25 + Math.random() * 3).toFixed(1);
  results["Rebounds Per Game"] = (2 + ovr * 0.08 + Math.random() * 2).toFixed(1);
  results["Assists Per Game"] = (1 + ovr * 0.07 + Math.random() * 2).toFixed(1);
  results["Championships"] = ovr > 80 ? Math.floor((ovr - 70) / 15) + (Math.random() > 0.7 ? 1 : 0) : 0;
  results["MVP Awards"] = ovr > 92 ? Math.floor(Math.random() * 3) : 0;
  results["All-Star Selections"] = Math.floor(ovr / 10) + (Math.random() > 0.7 ? 1 : 0);
  return results;
}

// Move to next attribute
function nextAttribute() {
  if (currentCategoryIndex >= categories.length) return;
  const attrName = categories[currentCategoryIndex];
  attributeTitle.textContent = `Spin for ${attrName}`;
  drawWheel(0);
}

// Finalize spin
function finalizeSpin(score) {
  const attrName = categories[currentCategoryIndex];
  attributes[attrName] = score;
  resultEl.textContent = `${attrName}: ${score}`;
  attributesList.innerHTML += `<li>${attrName}: ${score}</li>`;
  currentCategoryIndex++;

  if (currentCategoryIndex < categories.length) {
    nextAttribute();
  } else {
    spinsDiv.classList.add("hidden");
    resultsDiv.classList.remove("hidden");
    const ovr = overallScore(attributes).toFixed(1);
    summaryEl.textContent = `${playerName} (OVR ${ovr}) with attributes: ${JSON.stringify(attributes)}`;
    const career = evaluatePlayer(attributes);
    careerResultsEl.innerHTML = "";
    for (let [key, value] of Object.entries(career)) {
      careerResultsEl.innerHTML += `<li>${key}: ${value}</li>`;
    }
  }
}

// Event listeners
startBtn.addEventListener("click", () => {
  playerName = document.getElementById("playerName").value.trim();
  if (!playerName) return alert("Please enter a player name!");
  gameDiv.classList.add("hidden");
  spinsDiv.classList.remove("hidden");
  attributes = {};
  currentCategoryIndex = 0;
  attributesList.innerHTML = "";
  resultEl.textContent = "";
  nextAttribute();
});

spinBtn.addEventListener("click", startSpin);

restartBtn.addEventListener("click", () => {
  resultsDiv.classList.add("hidden");
  gameDiv.classList.remove("hidden");
  document.getElementById("playerName").value = "";
  attributes = {};
  currentCategoryIndex = 0;
  nextAttribute();
});

// Initial draw
drawWheel(0);
