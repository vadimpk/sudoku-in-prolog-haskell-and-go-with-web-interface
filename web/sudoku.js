// Styles
const lightGrayColor = 'rgba(211,211,211,0.2)';
const darkGreyColor = 'rgba(180,180,180,0.2)';
const defaultCellBorder = '1px solid #ccc';
const keyCellBorderWidth = '2px';
const keyCellBorderColor = 'black';
const disabledCellFontFamily = 'Titillium Web, sans-serif';
const disabledCellFontWeight = '700';
const inputCellFontFamily = 'Titillium Web, sans-serif';
const inputCellFontWeight = '300';
const inputCellFontStyle = 'italic';
const cellGreenBackground = 'rgba(171, 245, 171, 0.4)';
const cellRedBackground = 'rgba(255, 204, 203, 0.4)';

// Events
export const sudokuCompletedEvent = 'completedSudoku';
export const sudokuNotCompletedEvent = 'notCompletedSudoku';

export class SudokuGrid {
    constructor(element) {
        this.emptyCells = 0;

        this.gridElement = element;
        this.grid = [];
        this.initialGrid = [];
    }

    draw(grid) {
        if (grid != null) {
            this.grid = grid;
            this.initialGrid = this.deepCopy2DArray(grid);
        }
        
        this.emptyCells = 0;
        this.gridElement.innerHTML = ''; // Clear previous grid
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('input');
                cell.setAttribute('type', 'text');
                cell.classList.add('sudoku-cell');
                cell.maxLength = 1; // Only allow single digit
                cell.dataset.row = row;
                cell.dataset.col = col;

                // Chess-like pattern
                if ((row % 2 === 0 && col % 2 === 0) || (row % 2 === 1 && col % 2 === 1)) {
                    cell.style.backgroundColor = lightGrayColor;
                } else {
                    cell.style.backgroundColor = darkGreyColor;
                }

                cell.style.border = defaultCellBorder;
                if (row % 3 === 0) {
                    cell.style.borderTopWidth = keyCellBorderWidth;
                    cell.style.borderTopColor = keyCellBorderColor;
                }
                if (col % 3 === 0) {
                    cell.style.borderLeftWidth = keyCellBorderWidth;
                    cell.style.borderLeftColor = keyCellBorderColor;
                }
                if (row === 8) {
                    cell.style.borderBottomWidth = keyCellBorderWidth;
                    cell.style.borderBottomColor = keyCellBorderColor;
                } 
                if (col === 8) {
                    cell.style.borderRightWidth = keyCellBorderWidth;
                    cell.style.borderRightColor = keyCellBorderColor;
                }
    

                if (this.grid[row] && this.grid[row][col] > 0) { // Assuming 0 is an empty cell
                    cell.value = this.grid[row][col];
                    cell.disabled = true; // Disable cell if it's part of the puzzle
                    cell.style.fontFamily = disabledCellFontFamily;
                    cell.style.fontWeight = disabledCellFontWeight;
                } else {
                    cell.addEventListener('input', this.handleCellInput.bind(this));
                    cell.addEventListener('keydown', this.handleCellKeyEvent.bind(this));
                    this.emptyCells += 1;
                    cell.style.fontWeight = inputCellFontWeight;
                    cell.style.fontFamily = inputCellFontFamily;
                    cell.style.fontStyle = inputCellFontStyle;
                }

                this.gridElement.appendChild(cell);
            }
        }
    }

    deepCopy2DArray(array) {
        return array.map(innerArray => {
            if (Array.isArray(innerArray)) {
                return this.deepCopy2DArray(innerArray); // Recurse for nested arrays
            }
            return innerArray;
        });
    }

    removeNSlots(grid, n) {
        grid = this.flatten2DArray(grid);
        var removedIndexes = [];
        for (let i = 0; i < n; i++) {
            let pos = this.generateRandomNumber(0, 9 * 9 - 1, removedIndexes)
            grid[pos] = null;
            removedIndexes.push(pos);
        }

        grid = this.unflattenArray(grid, 9, 9);
        return grid;
    }

    flatten2DArray(array2D) {
        return array2D.reduce((acc, currRow) => acc.concat(currRow), []);
    }

    unflattenArray(array1D, rows, cols) {
        if (array1D.length !== rows * cols) {
            throw new Error("The dimensions do not match the length of the array to be unflattened.");
        }
    
        const array2D = [];
        for (let i = 0; i < rows; i++) {
            const start = i * cols;
            const end = start + cols;
            array2D.push(array1D.slice(start, end));
        }
        return array2D;
    }

    generateRandomNumber(min, max, blacklist = []) {
        const allowedNumbers = Array.from({ length: max - min + 1 }, (_, i) => min + i).filter(n => !blacklist.includes(n));

        if (allowedNumbers.length === 0) {
            throw new Error("No available numbers in the range excluding the blacklist.");
        }

        const randomIndex = Math.floor(Math.random() * allowedNumbers.length);

        return allowedNumbers[randomIndex];
    }

    removeEmptyCell() {
        this.emptyCells--;
        if (this.emptyCells == 0) {
            document.dispatchEvent(new CustomEvent(sudokuCompletedEvent));
        }
    }

    addEmptyCell() {
        this.emptyCells++;
        if (this.emptyCells == 1) { // if number of empty cells became 1 (from zero), send an event.
            document.dispatchEvent(new CustomEvent(sudokuNotCompletedEvent));
        }
    }

    handleCellInput(e) {
        const input = e.target.value;
        const row = e.target.dataset.row;
        const col = e.target.dataset.col;
    
        // Validate input
        if (input && !/^[1-9]$/.test(input)) {
            e.target.value = ''; // Clear input if it's not a valid number
            return;
        }

        if (input == null || input == '') {
            this.addEmptyCell();
        }
    
        // Update puzzle array (optional, depends on your game logic)
        this.grid[row][col] = parseInt(input) || 0;
        this.removeEmptyCell();
    }

    handleCellKeyEvent(e) {
        const row = e.target.dataset.row;
        const col = e.target.dataset.col;
        if (e.key === 'Delete' || e.key === 'Backspace') {
            e.target.value = '';
            e.preventDefault();

            this.grid[row][col] = null;
            this.addEmptyCell();
        } else if (e.key >= 1 && e.key <= 9) {
            const value = e.target.value;
            
            e.target.value = parseInt(e.key) || 0;
            this.grid[row][col] = parseInt(e.key) || 0;;
            e.preventDefault();

            if (value == '') { // if value was empty before
                this.removeEmptyCell();
            }
        }
    }

    showAllCorrect() {
        const children = this.gridElement.children;

        for (let i = 0; i < children.length; i++) {
            var cell = children[i];
            if (!cell.disabled) {
                cell.style.backgroundColor = cellGreenBackground;
                cell.disabled = true;
            }
        }
    }

    compareResults(correctGrid) {
        const children = this.gridElement.children;
        
        for (let i = 0; i < children.length; i++) {
            var cell = children[i];
            const correctCell = correctGrid[cell.dataset.row][cell.dataset.col];
            
            if (!cell.disabled) {
                if (correctCell == cell.value) {
                    cell.style.backgroundColor = cellGreenBackground;
                    cell.disabled = true;
                } else {
                    cell.style.backgroundColor = cellRedBackground;
                }
            }
        }
    }

    showSolved(solved) {
        const children = this.gridElement.children;
        
        for (let i = 0; i < children.length; i++) {
            var cell = children[i];
            if (this.initialGrid[cell.dataset.row][cell.dataset.col] == null) {
                cell.value = solved[cell.dataset.row][cell.dataset.col];
                cell.style.backgroundColor = cellGreenBackground;
            } 
        }
    }
}
