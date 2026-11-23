const setupScreen = document.getElementById('setup');
const flashcardsScreen = document.getElementById('flashcards');
const gameScreen = document.getElementById('game');
const card = document.getElementById('card');
const cardFront = document.getElementById('card-front');
const cardBack = document.getElementById('card-back');
const playerLabel = document.getElementById('player-label');

// Player/Spies controls
const playersDec = document.getElementById('players-dec');
const playersInc = document.getElementById('players-inc');
const playersCount = document.getElementById('players-count');
const spiesDec = document.getElementById('spies-dec');
const spiesInc = document.getElementById('spies-inc');
const spiesCount = document.getElementById('spies-count');

// Category selector
const categorySelect = document.getElementById('category-select');
const startBtn = document.getElementById('start-btn');
const revealBtn = document.getElementById('reveal-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const revealResult = document.getElementById('reveal-result');
const roundInfo = document.getElementById('round-info');

// State
let totalPlayers = 5;
let numSpies = 1;
let category = 'all';
let words = [];
let currentWord = '';
let spys = [];
let currentPlayerIndex = 0;
let isFlipped = false;
let roundTime = 60;
let roundTimer = null;

// Word bank
const wordBank = {
  places: [
    'beach', 'casino', 'cinema', 'hospital', 'museum', 'market', 'park',
    'restaurant', 'school', 'airport', 'library', 'motel', 'office', 'bank',
    'stadium', 'plaza', 'theater', 'university', 'community center', 'police station',
    'fire station', 'bakery', 'dentist office', 'pharmacy', 'veterinary clinic',
    'laundry', 'gym', 'shopping mall', 'supermarket', 'grocery store', 'bookstore',
    'hotel', 'cathedral', 'municipal building', 'post office', 'telecommunications office',
    'cobbler', 'butcher', 'hairdresser', 'garage', 'taxi stand', 'parking lot',
    'playground', 'zen garden', 'antique store', 'railroad station', 'sports arena'
  ],
  items: [
    'remote control', 'key', 'stamp', 'glasses', 'umbrella', 'cup', 'phone',
    'wallet', 'watch', 'book', 'pencil', 'fork', 'mask', 'badge', 'candle',
    'compass', 'microphone', 'microscope', 'mirror', 'notebook', 'match', 'ring',
    'scissors', 'tape', 'trousers', 'hat', 'keychain', 'camera', 'charger', 'chain',
    'lighter', 'note', 'pen', 'pencil', 'plate', 'sponge', 'spoon', 'towel', 'vine',
    'clock', 'vase', 'wallet', 'vehicle', 'weather', 'wine', 'wireless',
    'toolkit', 'ruler', 'tape measure', 'thermos', 'teapot', 'plastic bag', 'breakfast set',
    'walking stick', 'pot', 'pan', 'bowl', 'fork', 'spoon', 'teaspoon', 'tongs',
    'hot plate', 'parchment paper', 'plastic container', 'metal spoon',
    'plastic fork', 'plastic spoon', 'rubber gloves', 'plastic bottle', 'paper towel',
    'paper cup', 'paper plate', 'plastic container', 'plastic bag', 'plastic gloves',
    'plastic wrapper', 'plastic straw', 'plastic cup', 'plastic fork', 'plastic spoon',
    'plastic knife', 'plastic cup', 'plastic bottle', 'plastic container', 'plastic bag'
  ],
  professions: [
    'architect', 'designer', 'digital artist', 'cook', 'engineer', 'electrician',
    'photographer', 'cameraman', 'chef', 'doctor', 'dentist', 'freshman',
    'second-year student', 'lawyer', 'university lecturer', 'janitor', 'accountant',
    'astronomer', 'mechanic', 'manager', 'maid', 'carpenter', 'waitress',
    'security guard', 'ambulance driver', 'steward', 'farmer', 'teacher',
    'veterinary surgeon', 'translator', 'conductor', 'plumber', 'policeman',
    'police officer', 'pilot', 'operator', 'postman', 'boxer', 'director',
    'fireman', 'welder', 'rancher', 'actor', 'sailor', 'seamstress',
    'appraiser', 'tailor', 'musician', 'artist', 'writer', 'programmer'
  ],
  food: [
    'apple', 'candy', 'fish', 'latte', 'pasta', 'cracker', 'sauce',
    'bread', 'tuna', 'meatball', 'pizza', 'sushi', 'burger', 'beef',
    'pork', 'eggs', 'bacon', 'lamb', 'chicken', 'steak', 'fish',
    'milk', 'tea', 'coffee', 'juice', 'wine', 'beer', 'soda',
    'cocktail', 'water', 'smoothie', 'shake', 'dessert', 'snack', 'breakfast',
    'dinner', 'lunch', 'snack bar', 'fast food', 'mexican food', 'chinese food',
    'italian food', 'indian food', 'japanese food', 'french food', 'greek food',
    'turkish food', 'thai food', 'vietnamese food', 'middle eastern food', 'asian food',
    'soul food', 'american food', 'british food', 'irish food', 'german food',
    'french cuisine', 'mediterranean food', 'seafood', 'steakhouse', 'bistro',
    'cafe', 'restaurant', 'pub', 'bar', 'diner', 'buffet', 'takeout',
    'delivery', 'catering', 'dining hall', 'snack stand', 'food truck',
    'street food', 'roadside stand', 'market stall'
  ]
};

// Word bank (combined for all categories)
let allWords = [];
Object.values(wordBank).forEach(wordsArr => {
  allWords = allWords.concat(wordsArr);
});
allWords = [...new Set(allWords)].sort();

// Setup screen controls
playersDec.addEventListener('click', () => {
  if (totalPlayers > 3) {
    totalPlayers--;
    playersCount.textContent = totalPlayers;
    updateSpiesMax();
  }
});

playersInc.addEventListener('click', () => {
  if (totalPlayers < 20) {
    totalPlayers++;
    playersCount.textContent = totalPlayers;
    updateSpiesMax();
  }
});

function updateSpiesMax() {
  if (numSpies > totalPlayers - 1) {
    numSpies = totalPlayers - 1;
    spiesCount.textContent = numSpies;
  }
}

spiesDec.addEventListener('click', () => {
  if (numSpies > 1) {
    numSpies--;
    spiesCount.textContent = numSpies;
  }
});

spiesInc.addEventListener('click', () => {
  if (numSpies < totalPlayers - 1) {
    numSpies++;
    spiesCount.textContent = numSpies;
  }
});

startBtn.addEventListener('click', startGame);
revealBtn.addEventListener('click', revealSpy);
playAgainBtn.addEventListener('click', () => {
  resetGame();
  showScreen('setup');
});

// Flashcard tap handling — tap anywhere on the card
card.addEventListener('click', () => {
  if (!isFlipped) {
    // First tap: reveal card
    isFlipped = true;
    card.classList.add('flipped');
  } else {
    // Second tap: hide card and advance
    // CRITICAL: Clear old content BEFORE starting the flip transition,
    // so there's no leftover "YOU ARE SPY" or word visible during the animation.
    cardBack.innerHTML = '';

    card.classList.remove('flipped');
    isFlipped = false;

    if (currentPlayerIndex < totalPlayers - 1) {
      currentPlayerIndex++;
      renderCard();
    } else {
      // All cards revealed, go to game screen
      setTimeout(() => {
        showScreen('game');
        endFlashcards();
      }, 100);
    }
  }
});

// Start game
function startGame() {
  if (numSpies >= totalPlayers) {
    alert('Number of spies must be less than total players');
    return;
  }

  // Get words for selected category
  if (category === 'all') {
    words = [...allWords].sort(() => 0.5 - Math.random());
  } else {
    const selectedWords = wordBank[category];
    words = [...selectedWords].sort(() => 0.5 - Math.random());
  }

  // Pick random word
  currentWord = words[Math.floor(Math.random() * words.length)];

  // Assign spies
  const playerSpies = new Set();
  while (playerSpies.size < numSpies) {
    playerSpies.add(Math.floor(Math.random() * totalPlayers) + 1);
  }
  spys = Array.from(playerSpies).sort((a, b) => a - b);

  // Reset indices
  currentPlayerIndex = 0;
  isFlipped = false;

  // Show flashcards screen
  card.classList.remove('flipped');
  showScreen('flashcards');
  renderCard();
}

// Render current player's card
function renderCard() {
  playerLabel.textContent = `Player ${currentPlayerIndex + 1} — Tap card to reveal`;
  cardFront.textContent = playerLabel.textContent;
  cardBack.innerHTML = '';

  if (spys.includes(currentPlayerIndex + 1)) {
    const spyText = document.createElement('div');
    spyText.className = 'spy-text';
    spyText.textContent = 'YOU ARE SPY';
    cardBack.appendChild(spyText);
  } else {
    const wordText = document.createElement('div');
    wordText.className = 'card-content';
    wordText.textContent = currentWord;

    const categoryText = document.createElement('div');
    categoryText.className = 'card-category';
    categoryText.textContent = category === 'all' ? currentWord : category.toUpperCase();

    cardBack.appendChild(wordText);
    cardBack.appendChild(categoryText);
  }
}

// End flashcards setup (called after game screen shows)
function endFlashcards() {
  roundInfo.textContent = `${totalPlayers} players · ${numSpies} spy${numSpies > 1 ? 's' : ''}`;

  roundTime = 60;
  updateRevealBtn();

  clearInterval(roundTimer);
  roundTimer = setInterval(() => {
    roundTime--;
    updateRevealBtn();
    if (roundTime <= 0) {
      clearInterval(roundTimer);
      revealSpy();
    }
  }, 1000);
}

// Update reveal button text
function updateRevealBtn() {
  revealBtn.textContent = `Reveal Spy / End Round (Time: ${roundTime}s)`;
}

// Reveal spies and end round
function revealSpy() {
  clearInterval(roundTimer);

  revealResult.classList.remove('hidden');
  revealResult.innerHTML = `
    <h3>Round Over</h3>
    <p><strong>Secret word:</strong> ${currentWord}</p>
    <p><strong>Spy${numSpies > 1 ? 's' : ''}:</strong></p>
    <p class="spy-players">Player${numSpies > 1 ? 's' : ''} ${spys.join(', ')}</p>
  `;

  revealBtn.classList.add('hidden');
  playAgainBtn.classList.remove('hidden');
}

// Show specific screen
function showScreen(screenName) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenName).classList.add('active');
}

// Reset game and return to setup
function resetGame() {
  totalPlayers = 5;
  numSpies = 1;
  currentWord = '';
  spys = [];
  currentPlayerIndex = 0;
  isFlipped = false;
  clearInterval(roundTimer);

  playersCount.textContent = totalPlayers;
  spiesCount.textContent = numSpies;
  revealBtn.classList.remove('hidden');
  playAgainBtn.classList.add('hidden');
  revealResult.classList.add('hidden');
  revealResult.innerHTML = '';
  card.classList.remove('flipped');

  showScreen('setup');
}
