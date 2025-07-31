document.addEventListener('DOMContentLoaded', () => {
  // load or initialize score
  let score = JSON.parse(localStorage.getItem('score')) || {
    wins: 0,
    losses: 0,
    ties: 0
  };

  const scoreEl = document.querySelector('.js-score');
  const resultEl = document.querySelector('.js-result');
  const movesEl = document.querySelector('.js-moves');
  const autoPlayButton =
    document.querySelector('.js-auto-button') ||
    document.querySelector('.js-auto-play-button');
  const resetBtn = document.querySelector('.js-reset-button');
  const rockBtn = document.querySelector('.js-rock-button');
  const paperBtn = document.querySelector('.js-paper-button');
  const scissorsBtn = document.querySelector('.js-scissors-button');

  let isAutoPlaying = false;
  let intervalId;

  function updateScoreElement() {
    if (scoreEl) {
      scoreEl.textContent = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
    }
  }

  function updateAutoPlayLabel() {
    if (autoPlayButton) {
      autoPlayButton.textContent = isAutoPlaying ? 'Stop autoplay' : 'Auto Play';
    }
  }

  function pickComputerMove() {
    const randomNumber = Math.random();
    if (randomNumber < 1 / 3) {
      return 'rock';
    } else if (randomNumber < 2 / 3) {
      return 'paper';
    } else {
      return 'scissors';
    }
  }

  function playGame(playerMove) {
    const computerMove = pickComputerMove();
    let result = '';

    if (playerMove === 'scissors') {
      if (computerMove === 'rock') {
        result = 'You lose.';
      } else if (computerMove === 'paper') {
        result = 'You win.';
      } else {
        result = 'Tie.';
      }
    } else if (playerMove === 'paper') {
      if (computerMove === 'rock') {
        result = 'You win.';
      } else if (computerMove === 'paper') {
        result = 'Tie.';
      } else {
        result = 'You lose.';
      }
    } else if (playerMove === 'rock') {
      if (computerMove === 'rock') {
        result = 'Tie.';
      } else if (computerMove === 'paper') {
        result = 'You lose.';
      } else {
        result = 'You win.';
      }
    }

    if (result === 'You win.') {
      score.wins++;
    } else if (result === 'You lose.') {
      score.losses++;
    } else {
      score.ties++;
    }

    localStorage.setItem('score', JSON.stringify(score));

    if (resultEl) resultEl.textContent = result;

    if (movesEl) {
      const playerImg = `<img src="images/${playerMove}-emoji.png" class="move-icon" alt="${playerMove}" onerror="this.replaceWith('${playerMove}')">`;
      const computerImg = `<img src="images/${computerMove}-emoji.png" class="move-icon" alt="${computerMove}" onerror="this.replaceWith('${computerMove}')">`;
      movesEl.innerHTML = `You ${playerImg} ${computerImg} Computer`;
    }

    updateScoreElement();
  }

  function startAutoPlay() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => {
      const playerMove = pickComputerMove();
      playGame(playerMove);
    }, 1000);
    isAutoPlaying = true;
    updateAutoPlayLabel();
    if (autoPlayButton) autoPlayButton.classList.add('playing');
  }

  function stopAutoPlay() {
    clearInterval(intervalId);
    intervalId = undefined;
    isAutoPlaying = false;
    updateAutoPlayLabel();
    if (autoPlayButton) autoPlayButton.classList.remove('playing');
  }

  function autoPlay() {
    if (!isAutoPlaying) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
  }

  // initial render
  updateScoreElement();
  updateAutoPlayLabel();

  // Event bindings
  if (autoPlayButton) {
    autoPlayButton.addEventListener('click', autoPlay);
  }
  if (rockBtn) {
    rockBtn.addEventListener('click', () => playGame('rock'));
  }
  if (paperBtn) {
    paperBtn.addEventListener('click', () => playGame('paper'));
  }
  if (scissorsBtn) {
    scissorsBtn.addEventListener('click', () => playGame('scissors'));
  }

  document.body.addEventListener('keydown', (event) => {
    if (event.key === 'r') {
      playGame('rock');
    } else if (event.key === 'p') {
      playGame('paper');
    } else if (event.key === 's') {
      playGame('scissors');
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      score = { wins: 0, losses: 0, ties: 0 };
      localStorage.setItem('score', JSON.stringify(score));
      updateScoreElement();
      if (resultEl) resultEl.textContent = '';
      if (movesEl) movesEl.textContent = '';
      // do not auto-stop unless user explicitly clicks stop button
    });
  }
});
