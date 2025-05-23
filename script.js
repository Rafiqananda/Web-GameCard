const emojis = ['🐶','🐱','🦊','🐸','🐵','🦁','🐼','🐷','🐮','🐔','🐨','🐙','🐯','🐳','🦄'];
let cards = [];
let flippedCards = [];
let matchedCount = 0;
let moves = 0;
let timerInterval = null;
let timeLeft = 0;
let currentLevel = 1;
let maxLevel = 10;

const board = document.querySelector('.game-board');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const message = document.getElementById('message');
const levelDisplay = document.getElementById('level');

// Audio
const flipSound = new Audio('sounds/flip.mp3');
const matchSound = new Audio('sounds/match.mp3');
const winSound = new Audio('sounds/win.mp3');

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function startGame() {
  clearInterval(timerInterval);
  board.innerHTML = '';
  message.textContent = '';
  flippedCards = [];
  matchedCount = 0;
  moves = 0;
  movesDisplay.textContent = 'Moves: 0';
  levelDisplay.textContent = `Level: ${currentLevel}`;

  // Tentukan jumlah pasangan berdasarkan level
  const pairs = 2 + currentLevel; // mulai dari 3 pasang (level 1) hingga 12 pasang (level 10)
  cards = shuffle([...emojis.slice(0, pairs), ...emojis.slice(0, pairs)]);

  // Tentukan ukuran grid
  const totalCards = pairs * 2;
  const cols = totalCards <= 12 ? 4 : 6;
  const rows = Math.ceil(totalCards / cols);
  board.style.gridTemplateColumns = `repeat(${cols}, 70px)`;

  // Waktu berdasarkan level (semakin tinggi level = semakin sedikit waktu)
  timeLeft = Math.max(20, 70 - currentLevel * 5); // misal level 1 = 65s, level 10 = 20s
  timerDisplay.textContent = `⏱️ Time: ${timeLeft}`;

  cards.forEach(emoji => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.textContent = '❓';
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `⏱️ Time: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameOver(false);
    }
  }, 1000);
}

function flipCard() {
  if (flippedCards.length === 2 || this.classList.contains('flipped') || this.classList.contains('matched')) return;

  flipSound.play();
  this.classList.add('flipped');
  this.textContent = this.dataset.emoji;
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    moves++;
    movesDisplay.textContent = `Moves: ${moves}`;
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.emoji === card2.dataset.emoji) {
    matchSound.play();
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedCount += 2;
    if (matchedCount === cards.length) {
      clearInterval(timerInterval);
      gameOver(true);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card1.textContent = '❓';
      card2.classList.remove('flipped');
      card2.textContent = '❓';
    }, 700);
  }
  flippedCards = [];
}

function gameOver(won) {
  message.style.color = won ? 'green' : 'red';
  if (won) {
    winSound.play();
    message.textContent = `🎉 Level ${currentLevel} Cleared!`;
    if (currentLevel < maxLevel) {
      currentLevel++;
      setTimeout(startGame, 2000);
    } else {
      message.textContent = '🏆 You finished all levels! Congrats!';
    }
  } else {
    message.textContent = '💥 Time\'s up! Game Over. Restarting from Level 1...';
    currentLevel = 1;
    setTimeout(startGame, 3000);
  }

  document.querySelectorAll('.card').forEach(card => card.removeEventListener('click', flipCard));
}
