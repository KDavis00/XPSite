// Minesweeper Game
class Minesweeper {
  constructor(container) {
    this.container = container;
    this.rows = 9;
    this.cols = 9;
    this.mines = 10;
    this.grid = [];
    this.revealed = [];
    this.flagged = [];
    this.gameOver = false;
    this.firstClick = true;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="minesweeper-header">
        <div class="mine-counter">010</div>
        <button class="reset-btn">🙂</button>
        <div class="timer">000</div>
      </div>
      <div class="minesweeper-controls">
        <button class="hint-btn-mine">Hint</button>
      </div>
      <div class="minesweeper-grid"></div>
    `;
    
    this.gridElement = this.container.querySelector('.minesweeper-grid');
    this.counterElement = this.container.querySelector('.mine-counter');
    this.timerElement = this.container.querySelector('.timer');
    this.resetBtn = this.container.querySelector('.reset-btn');
    this.hintBtn = this.container.querySelector('.hint-btn-mine');
    
    this.resetBtn.addEventListener('click', () => this.reset());
    this.hintBtn.addEventListener('click', () => this.showHint());
    this.createGrid();
  }

  createGrid() {
    this.grid = [];
    this.revealed = [];
    this.flagged = [];
    this.gameOver = false;
    this.firstClick = true;
    this.gridElement.innerHTML = '';
    this.gridElement.style.gridTemplateColumns = `repeat(${this.cols}, 20px)`;
    
    for (let r = 0; r < this.rows; r++) {
      this.grid[r] = [];
      this.revealed[r] = [];
      this.flagged[r] = [];
      for (let c = 0; c < this.cols; c++) {
        this.grid[r][c] = 0;
        this.revealed[r][c] = false;
        this.flagged[r][c] = false;
        
        const cell = document.createElement('div');
        cell.className = 'mine-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;
        
        cell.addEventListener('click', () => this.handleClick(r, c));
        cell.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          this.handleRightClick(r, c);
        });
        
        this.gridElement.appendChild(cell);
      }
    }
    
    this.updateCounter();
  }

  placeMines(avoidRow, avoidCol) {
    let placed = 0;
    while (placed < this.mines) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      
      if (this.grid[r][c] !== -1 && (r !== avoidRow || c !== avoidCol)) {
        this.grid[r][c] = -1;
        placed++;
        
        // Update adjacent cells
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols && this.grid[nr][nc] !== -1) {
              this.grid[nr][nc]++;
            }
          }
        }
      }
    }
  }

  handleClick(r, c) {
    if (this.gameOver || this.revealed[r][c] || this.flagged[r][c]) return;
    
    if (this.firstClick) {
      this.placeMines(r, c);
      this.firstClick = false;
      this.startTimer();
    }
    
    if (this.grid[r][c] === -1) {
      this.revealMines();
      this.gameOver = true;
      this.resetBtn.textContent = '😵';
      return;
    }
    
    this.reveal(r, c);
    this.checkWin();
  }

  handleRightClick(r, c) {
    if (this.gameOver || this.revealed[r][c]) return;
    
    this.flagged[r][c] = !this.flagged[r][c];
    const cell = this.gridElement.children[r * this.cols + c];
    cell.textContent = this.flagged[r][c] ? '🚩' : '';
    this.updateCounter();
  }

  reveal(r, c) {
    if (r < 0 || r >= this.rows || c < 0 || c >= this.cols || this.revealed[r][c] || this.flagged[r][c]) {
      return;
    }
    
    this.revealed[r][c] = true;
    const cell = this.gridElement.children[r * this.cols + c];
    cell.classList.add('revealed');
    
    const value = this.grid[r][c];
    if (value > 0) {
      cell.textContent = value;
      cell.style.color = this.getNumberColor(value);
    } else if (value === 0) {
      // Reveal adjacent cells
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          this.reveal(r + dr, c + dc);
        }
      }
    }
  }

  revealMines() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c] === -1) {
          const cell = this.gridElement.children[r * this.cols + c];
          cell.classList.add('revealed');
          cell.textContent = '💣';
        }
      }
    }
  }

  checkWin() {
    let revealedCount = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.revealed[r][c]) revealedCount++;
      }
    }
    
    if (revealedCount === this.rows * this.cols - this.mines) {
      this.gameOver = true;
      this.resetBtn.textContent = '😎';
    }
  }

  updateCounter() {
    let flagCount = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.flagged[r][c]) flagCount++;
      }
    }
    const remaining = this.mines - flagCount;
    this.counterElement.textContent = remaining.toString().padStart(3, '0');
  }

  startTimer() {
    let seconds = 0;
    this.timerInterval = setInterval(() => {
      seconds++;
      if (seconds > 999) seconds = 999;
      this.timerElement.textContent = seconds.toString().padStart(3, '0');
    }, 1000);
  }

  getNumberColor(num) {
    const colors = ['', 'blue', 'green', 'red', 'darkblue', 'darkred', 'cyan', 'black', 'gray'];
    return colors[num] || 'black';
  }

  showHint() {
    if (this.gameOver || this.firstClick) {
      alert('Start playing first!');
      return;
    }

    // Find a safe cell to reveal
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (!this.revealed[r][c] && !this.flagged[r][c] && this.grid[r][c] !== -1) {
          const cell = this.gridElement.children[r * this.cols + c];
          cell.style.background = '#ffff99';
          setTimeout(() => {
            if (!this.revealed[r][c]) {
              cell.style.background = '#c0c0c0';
            }
          }, 1000);
          return;
        }
      }
    }
    alert('No safe cells found or all cells revealed!');
  }

  reset() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerElement.textContent = '000';
    this.resetBtn.textContent = '🙂';
    this.createGrid();
  }
}
