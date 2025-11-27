// Classic 9x9 Sudoku with difficulty levels, hints, and validation

let sudokuBoard = [];
let sudokuSolution = [];
let sudokuDifficulty = 'medium';

function initSudoku() {
  const container = document.getElementById('sudokuGame');
  container.innerHTML = `
    <div class="sudoku-header">
      <button class="win-button" onclick="newSudokuGame()">New Game</button>
      <select class="win-select" id="sudokuDifficulty" onchange="changeDifficulty()">
        <option value="easy">Easy</option>
        <option value="medium" selected>Medium</option>
        <option value="hard">Hard</option>
        <option value="expert">Expert</option>
      </select>
      <button class="win-button" onclick="getHint()">Hint</button>
      <button class="win-button" onclick="checkSudoku()">Check</button>
    </div>
    <div class="sudoku-board-container">
      <div class="sudoku-board" id="sudokuBoard"></div>
    </div>
    <div class="sudoku-status" id="sudokuStatus">Click "New Game" to start!</div>
  `;
  newSudokuGame();
}

function changeDifficulty() {
  const select = document.getElementById('sudokuDifficulty');
  sudokuDifficulty = select.value;
}

function newSudokuGame() {
  generateSudoku();
}

function generateSudoku() {
  // Generate valid board and create puzzle
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillBoard(board);
  
  // Store solution
  sudokuSolution = board.map(row => [...row]);
  
  // Create puzzle by removing cells based on difficulty
  sudokuBoard = board.map(row => [...row]);
  const cellsToRemove = {
    easy: 30,
    medium: 40,
    hard: 50,
    expert: 60
  };
  removeCells(sudokuBoard, cellsToRemove[sudokuDifficulty]);
  
  renderSudoku(sudokuBoard);
  updateStatus(`${sudokuDifficulty.charAt(0).toUpperCase() + sudokuDifficulty.slice(1)} puzzle - Good luck!`);
}

// Generate valid Sudoku board using backtracking
function fillBoard(board) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        // Shuffle numbers for randomness
        shuffleArray(numbers);
        
        for (let num of numbers) {
          if (isValidPlacement(board, i, j, num)) {
            board[i][j] = num;
            
            if (fillBoard(board)) {
              return true;
            }
            
            board[i][j] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function isValidPlacement(board, row, col, num) {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false;
  }
  
  // Check column
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  
  return true;
}

// Remove cells to create puzzle
function removeCells(board, count) {
  const cells = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      cells.push([r, c]);
    }
  }
  
  // Shuffle cells
  shuffleArray(cells);
  
  for (let i = 0; i < count && i < cells.length; i++) {
    const [r, c] = cells[i];
    board[r][c] = 0;
  }
}

// Render Sudoku board to DOM
function renderSudoku(board) {
  const container = document.getElementById('sudokuBoard');
  container.innerHTML = '';
  
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement('input');
      cell.className = 'sudoku-cell';
      cell.maxLength = 1;
      cell.dataset.row = r;
      cell.dataset.col = c;
      
      // Add box borders
      if (c % 3 === 0 && c !== 0) cell.classList.add('left-border');
      if (r % 3 === 0 && r !== 0) cell.classList.add('top-border');
      
      if (board[r][c] !== 0) {
        cell.value = board[r][c];
        cell.classList.add('fixed');
        cell.disabled = true;
      } else {
        cell.addEventListener('input', handleInput);
        cell.addEventListener('keydown', handleKeydown);
      }
      
      container.appendChild(cell);
    }
  }
}

function handleInput(e) {
  const value = e.target.value;
  
  // Only allow numbers 1-9
  if (value && (!/^[1-9]$/.test(value))) {
    e.target.value = '';
    return;
  }
  
  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);
  
  if (value) {
    const num = parseInt(value);
    sudokuBoard[row][col] = num;
    
    // Check if placement is valid
    if (!isValidPlacement(sudokuBoard, row, col, num)) {
      e.target.classList.add('invalid');
    } else {
      e.target.classList.remove('invalid');
    }
    
    // Check if puzzle is complete
    checkCompletion();
  } else {
    sudokuBoard[row][col] = 0;
    e.target.classList.remove('invalid');
  }
}

function handleKeydown(e) {
  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);
  
  let newRow = row;
  let newCol = col;
  
  switch(e.key) {
    case 'ArrowUp':
      newRow = row > 0 ? row - 1 : row;
      e.preventDefault();
      break;
    case 'ArrowDown':
      newRow = row < 8 ? row + 1 : row;
      e.preventDefault();
      break;
    case 'ArrowLeft':
      newCol = col > 0 ? col - 1 : col;
      e.preventDefault();
      break;
    case 'ArrowRight':
      newCol = col < 8 ? col + 1 : col;
      e.preventDefault();
      break;
    case 'Backspace':
    case 'Delete':
      e.target.value = '';
      sudokuBoard[row][col] = 0;
      e.target.classList.remove('invalid');
      return;
  }
  
  if (newRow !== row || newCol !== col) {
    const cells = document.querySelectorAll('.sudoku-cell');
    const targetCell = Array.from(cells).find(
      cell => cell.dataset.row == newRow && cell.dataset.col == newCol
    );
    if (targetCell && !targetCell.disabled) {
      targetCell.focus();
      targetCell.select();
    }
  }
}

function checkCompletion() {
  // Check if board is full
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (sudokuBoard[r][c] === 0) return;
    }
  }
  
  // Check if solution is correct
  if (isBoardValid()) {
    updateStatus('🎉 Congratulations! You solved it!');
    setTimeout(() => {
      alert('Congratulations! You solved the Sudoku puzzle!');
    }, 100);
  }
}

function checkSudoku() {
  if (isBoardValid()) {
    updateStatus('✓ All filled cells are valid!');
  } else {
    updateStatus('✗ There are errors in your solution');
  }
}

function isBoardValid() {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const num = sudokuBoard[r][c];
      if (num !== 0) {
        // Temporarily remove number to check validity
        sudokuBoard[r][c] = 0;
        const valid = isValidPlacement(sudokuBoard, r, c, num);
        sudokuBoard[r][c] = num;
        
        if (!valid) return false;
      }
    }
  }
  return true;
}

function getHint() {
  // Find an empty cell and fill it with the correct number
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (sudokuBoard[r][c] === 0) {
        const correctNum = sudokuSolution[r][c];
        sudokuBoard[r][c] = correctNum;
        
        // Re-render and highlight the hint cell
        renderSudoku(sudokuBoard);
        
        const cells = document.querySelectorAll('.sudoku-cell');
        const hintCell = Array.from(cells).find(
          cell => cell.dataset.row == r && cell.dataset.col == c
        );
        if (hintCell) {
          hintCell.classList.add('hint-cell');
          setTimeout(() => {
            hintCell.classList.remove('hint-cell');
          }, 2000);
          hintCell.focus();
        }
        
        updateStatus(`Hint: Placed ${correctNum} at row ${r + 1}, column ${c + 1}`);
        checkCompletion();
        return;
      }
    }
  }
  
  updateStatus('No hints available - puzzle complete!');
}

function updateStatus(message) {
  const status = document.getElementById('sudokuStatus');
  if (status) {
    status.textContent = message;
  }
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('sudokuGame')) {
      initSudoku();
    }
  });
} else {
  if (document.getElementById('sudokuGame')) {
    initSudoku();
  }
}
