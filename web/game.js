import { PrologServer, GolangServer } from "./api.js";
import { SudokuGrid, sudokuCompletedEvent, sudokuNotCompletedEvent } from "./sudoku.js";


// Elements
const sudokuGrid = document.getElementById('sudoku-grid');
const newGameButton = document.getElementById('new-game');
const checkButton = document.getElementById('check');
const solveButton = document.getElementById('solve');
const selectDifficultyModal = document.getElementById('select-difficulty');
const difficultyButtons = document.querySelectorAll('.difficulty-button');
const exitModalButton = document.getElementById('exit-button');
const gameStatusLabel = document.getElementById('game-status');

// Styles
const trivialDifficulty = 'trivial-difficulty';
const easyDifficultyId = 'easy-difficulty';
const mediumDifficultyId = 'medium-difficulty';
const hardDifficultyId = 'hard-difficulty';

// Objects
const server = new GolangServer();
const grid = new SudokuGrid(sudokuGrid);

// New Game Button Event
newGameButton.addEventListener('click', async () => {
    selectDifficultyModal.style.display = "block";
});

checkButton.addEventListener('click', async () => {
    if (grid.grid) {
        if (await server.checkSolution(grid.grid)) {
            gameStatusLabel.textContent = 'All correct!';
            gameStatusLabel.style.color = '#42cf42';

            grid.showAllCorrect();

            checkButton.disabled = true;
            solveButton.disabled = true;
        } else {
            gameStatusLabel.textContent = "Some are not correct."
            gameStatusLabel.style.color = '#fc605d';

            const correctGrid = await server.solveSudoku(grid.initialGrid);
            grid.compareResults(correctGrid);
        }
    }
});

solveButton.addEventListener('click', async () => {
    const puzzle = await server.solveSudoku(grid.initialGrid);
    grid.showSolved(puzzle);
    checkButton.disabled = true;
    solveButton.disabled = true;
});
  
difficultyButtons.forEach(btn => {
    btn.onclick = async function() {
        var gameDifficultyId = btn.id;

        var n;
        if (gameDifficultyId == trivialDifficulty) {
            n = 1;
        } else if (gameDifficultyId == easyDifficultyId) {
            n = 30;
        } else if (gameDifficultyId == mediumDifficultyId) {
            n = 40;
        } else if (gameDifficultyId == hardDifficultyId) {
            n = 50;
        } else {
            n = 1
        }

        var puzzle = await server.generateGrid(n);
        puzzle = grid.removeNSlots(puzzle, n);
        grid.draw(puzzle);

        solveButton.disabled = false;
        gameStatusLabel.textContent = '';
        
        selectDifficultyModal.style.display = "none";
    }
});

window.onclick = function(event) {
    if (event.target == selectDifficultyModal) {
        closeModal();
    }
}

exitModalButton.addEventListener('click', () => {
    closeModal();
});

function closeModal() {
    selectDifficultyModal.style.display = "none";
}

document.addEventListener(sudokuCompletedEvent, function(e) {
    checkButton.disabled = false;
});

document.addEventListener(sudokuNotCompletedEvent, function(e) {
    checkButton.disabled = true;
});

checkButton.disabled = true;
solveButton.disabled = true;
grid.draw(null);
