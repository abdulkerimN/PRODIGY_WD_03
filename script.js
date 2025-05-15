const gameBoard = document.querySelector('.game-board');
const cells = document.querySelectorAll('[data-cell]');
const status = document.getElementById('status');
const resetButton = document.getElementById('resetButton');
const modeSelection = document.getElementById('modeSelection');
const gameContainer = document.getElementById('gameContainer');
const aiModeBtn = document.getElementById('aiMode');
const playerModeBtn = document.getElementById('playerMode');
const backToModeBtn = document.getElementById('backToMode');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
let isAITurn = false;
let isAIMode = false;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6] // Diagonals
];

function startGame(mode) {
    isAIMode = mode === 'ai';
    modeSelection.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    resetGame();
}

function handleCellClick(e) {
    if (isAITurn || !gameActive) return;

    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (gameState[cellIndex] !== '') return;

    makeMove(cellIndex);

    if (gameActive && isAIMode) {
        isAITurn = true;
        setTimeout(makeAIMove, 500);
    }
}

function makeMove(cellIndex) {
    gameState[cellIndex] = currentPlayer;
    cells[cellIndex].textContent = currentPlayer;
    cells[cellIndex].classList.add(currentPlayer.toLowerCase());

    if (checkWin()) {
        gameActive = false;
        status.textContent = `Player ${currentPlayer} wins!`;
        return;
    }

    if (checkDraw()) {
        gameActive = false;
        status.textContent = "Game ended in a draw!";
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `Player ${currentPlayer}'s turn`;
}

function makeAIMove() {
    if (!gameActive) return;
    
    // Simple AI: Find first empty cell
    const emptyCells = gameState.map((cell, index) => cell === '' ? index : null).filter(cell => cell !== null);
    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        makeMove(emptyCells[randomIndex]);
    }
    isAITurn = false;
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => gameState[index] === currentPlayer);
    });
}

function checkDraw() {
    return gameState.every(cell => cell !== '');
}

function resetGame() {
    currentPlayer = 'X';
    gameActive = true;
    isAITurn = false;
    gameState = ['', '', '', '', '', '', '', '', ''];
    status.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
}

function backToModeSelection() {
    gameContainer.classList.add('hidden');
    modeSelection.classList.remove('hidden');
}

// Event Listeners
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', resetGame);
aiModeBtn.addEventListener('click', () => startGame('ai'));
playerModeBtn.addEventListener('click', () => startGame('player'));
backToModeBtn.addEventListener('click', backToModeSelection);