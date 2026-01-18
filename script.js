//your code here
const cards = document.querySelectorAll(".whitebox2");
const deck = document.getElementById("deck");
const holders = {
  club: document.getElementById("100"),
  diamond: document.getElementById("101"),
  heart: document.getElementById("102"),
  spade: document.getElementById("103"),
};

const wonScreen = document.getElementById("won");
const resetBtn = document.getElementById("reset");
const shuffleBtn = document.getElementById("shuffle");

let draggedCard = null;

// ---------- CARD SUIT DETECTION ----------
function getSuit(imgSrc) {
  if (imgSrc.includes("C")) return "club";
  if (imgSrc.includes("D")) return "diamond";
  if (imgSrc.includes("H")) return "heart";
  if (imgSrc.includes("S")) return "spade";
}

// ---------- DRAG EVENTS ----------
cards.forEach((card) => {
  card.addEventListener("dragstart", () => {
    draggedCard = card;
  });
});

// ---------- DROP ZONES ----------
Object.keys(holders).forEach((suit) => {
  const holder = holders[suit].parentElement;

  holder.addEventListener("dragover", (e) => e.preventDefault());

  holder.addEventListener("drop", () => {
    if (!draggedCard) return;

    const img = draggedCard.querySelector("img");
    const cardSuit = getSuit(img.src);

    if (cardSuit === suit) {
      holder.appendChild(img);
      draggedCard.remove();
      saveGame();
      checkWin();
    }
  });
});

// ---------- SAVE GAME ----------
function saveGame() {
  const state = {};
  Object.keys(holders).forEach((suit) => {
    const img = holders[suit].parentElement.querySelector("img");
    state[suit] = img ? img.src : null;
  });
  localStorage.setItem("deckGame", JSON.stringify(state));
}

// ---------- LOAD GAME ----------
function loadGame() {
  const state = JSON.parse(localStorage.getItem("deckGame"));
  if (!state) return;

  Object.keys(state).forEach((suit) => {
    if (state[suit]) {
      const img = document.createElement("img");
      img.src = state[suit];
      img.className = "imgsbox";
      holders[suit].parentElement.appendChild(img);

      document.querySelectorAll(".whitebox2").forEach((box) => {
        if (box.querySelector("img")?.src === state[suit]) {
          box.remove();
        }
      });
    }
  });

  checkWin();
}

// ---------- CHECK WIN ----------
function checkWin() {
  const allPlaced = Object.keys(holders).every(
    (suit) => holders[suit].parentElement.querySelector("img")
  );

  if (allPlaced) {
    wonScreen.style.display = "flex";
  }
}

// ---------- RESET ----------
resetBtn.addEventListener("click", () => {
  localStorage.removeItem("deckGame");
  location.reload();
});

// ---------- SHUFFLE ----------
shuffleBtn.addEventListener("click", () => {
  const cardsArr = Array.from(deck.children);
  cardsArr.sort(() => Math.random() - 0.5);
  cardsArr.forEach((c) => deck.appendChild(c));
});

// ---------- INIT ----------
loadGame();

