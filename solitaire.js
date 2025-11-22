// SOLITAIRE GAME (KLONDIKE)
// A classic Klondike Solitaire implementation
// Features:
// - Standard 52-card deck
// - Stock, waste, foundation, and tableau piles
// - Drag and drop card movement
// - Click to select/move cards
// - Hint system
// - Win detection
class Solitaire {
  // Initialize game state with empty piles
  constructor(container) {
    this.container = container;
    this.deck = [];
    this.stock = [];
    this.waste = [];
    this.foundations = [[], [], [], []];
    this.tableau = [[], [], [], [], [], [], []];
    this.selected = null;
    this.selectedSource = null;
    this.init();
  }

  // Create the game UI layout
  // Top row: stock/waste piles and foundations
  // Bottom: 7 tableau columns
  init() {
    this.container.innerHTML = `
      <div class="solitaire-header">
        <button class="new-game-btn">New Game</button>
        <button class="hint-btn">Hint</button>
      </div>
      <div class="solitaire-top">
        <div class="stock-waste-container">
          <div class="stock-pile pile" data-pile="stock"></div>
          <div class="waste-pile pile" data-pile="waste"></div>
        </div>
        <div class="spacer"></div>
        <div class="foundations-container">
          <div class="foundation pile" data-foundation="0"></div>
          <div class="foundation pile" data-foundation="1"></div>
          <div class="foundation pile" data-foundation="2"></div>
          <div class="foundation pile" data-foundation="3"></div>
        </div>
      </div>
      <div class="solitaire-tableau">
        <div class="tableau-pile" data-tableau="0"></div>
        <div class="tableau-pile" data-tableau="1"></div>
        <div class="tableau-pile" data-tableau="2"></div>
        <div class="tableau-pile" data-tableau="3"></div>
        <div class="tableau-pile" data-tableau="4"></div>
        <div class="tableau-pile" data-tableau="5"></div>
        <div class="tableau-pile" data-tableau="6"></div>
      </div>
    `;

    this.container.querySelector('.new-game-btn').addEventListener('click', () => this.newGame());
    this.container.querySelector('.hint-btn').addEventListener('click', () => this.showHint());
    this.setupEventListeners();
    this.newGame();
  }

  setupEventListeners() {
    this.container.querySelector('[data-pile="stock"]').addEventListener('click', () => this.drawCard());
  }

  createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    this.deck = [];
    
    for (let suit of suits) {
      for (let i = 0; i < values.length; i++) {
        this.deck.push({
          suit: suit,
          value: values[i],
          rank: i + 1,
          color: (suit === '♥' || suit === '♦') ? 'red' : 'black',
          faceUp: false
        });
      }
    }
  }

  // Shuffle the deck using Fisher-Yates algorithm
  shuffle() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  // Start a new game
  // Creates and shuffles deck, deals cards to tableau (1-7 cards per column)
  // Top card in each tableau column is face-up
  newGame() {
    this.createDeck();
    this.shuffle();
    this.stock = [...this.deck];
    this.waste = [];
    this.foundations = [[], [], [], []];
    this.tableau = [[], [], [], [], [], [], []];
    this.selected = null;
    this.selectedSource = null;
    
    // Deal tableau: Column 1 gets 1 card, column 2 gets 2 cards, etc.
    // Only the top card in each column is face-up
    for (let i = 0; i < 7; i++) {
      for (let j = i; j < 7; j++) {
        const card = this.stock.pop();
        card.faceUp = (i === j);
        this.tableau[j].push(card);
      }
    }
    
    this.render();
    this.setupDragDrop();
  }

  // Draw card from stock to waste pile
  // If stock is empty, recycle waste pile back to stock
  drawCard() {
    if (this.stock.length > 0) {
      const card = this.stock.pop();
      card.faceUp = true;
      this.waste.push(card);
    } else if (this.waste.length > 0) {
      // Reset stock from waste
      while (this.waste.length > 0) {
        const card = this.waste.pop();
        card.faceUp = false;
        this.stock.push(card);
      }
    }
    this.render();
    this.setupDragDrop();
  }

  // Check if a card can be placed on a tableau pile
  // Rules: Must alternate colors and be one rank lower
  // Only Kings can be placed on empty tableau piles
  canPlaceOnTableau(card, targetPile) {
    if (targetPile.length === 0) {
      return card.rank === 13; // Only Kings on empty piles
    }
    const topCard = targetPile[targetPile.length - 1];
    return topCard.color !== card.color && topCard.rank === card.rank + 1;
  }

  // Check if a card can be placed on a foundation pile
  // Rules: Must be same suit and one rank higher
  // Only Aces can start a foundation pile
  canPlaceOnFoundation(card, foundationPile) {
    if (foundationPile.length === 0) {
      return card.rank === 1; // Only Aces on empty foundations
    }
    const topCard = foundationPile[foundationPile.length - 1];
    return topCard.suit === card.suit && topCard.rank === card.rank - 1;
  }

  // Move a card from one location to another
  // Handles removing from source and adding to destination
  // Flips the next card in tableau if needed
  moveCard(card, from, to, fromIndex) {
    if (from === 'waste') {
      this.waste.pop();
    } else if (from.startsWith('tableau')) {
      const pileIndex = parseInt(from.split('-')[1]);
      this.tableau[pileIndex].splice(fromIndex);
      // Flip top card if exists
      if (this.tableau[pileIndex].length > 0) {
        this.tableau[pileIndex][this.tableau[pileIndex].length - 1].faceUp = true;
      }
    }

    if (to.startsWith('foundation')) {
      const foundIndex = parseInt(to.split('-')[1]);
      this.foundations[foundIndex].push(card);
    } else if (to.startsWith('tableau')) {
      const pileIndex = parseInt(to.split('-')[1]);
      this.tableau[pileIndex].push(card);
    }

    this.selected = null;
    this.selectedSource = null;
    this.render();
    this.checkWin();
  }

  // Check if the game has been won
  // Win condition: All 52 cards are in the foundation piles
  checkWin() {
    const totalInFoundations = this.foundations.reduce((sum, pile) => sum + pile.length, 0);
    if (totalInFoundations === 52) {
      setTimeout(() => alert('You Win! 🎉'), 100);
    }
  }

  // Provide a hint to the player
  // Suggests moving waste or tableau cards to foundations
  showHint() {
    // Simple hint: try to move waste card to foundation
    if (this.waste.length > 0) {
      const card = this.waste[this.waste.length - 1];
      for (let i = 0; i < 4; i++) {
        if (this.canPlaceOnFoundation(card, this.foundations[i])) {
          alert(`Try moving ${card.value}${card.suit} from waste to foundation!`);
          return;
        }
      }
    }
    
    // Check tableau to foundation
    for (let i = 0; i < 7; i++) {
      if (this.tableau[i].length > 0) {
        const card = this.tableau[i][this.tableau[i].length - 1];
        if (card.faceUp) {
          for (let j = 0; j < 4; j++) {
            if (this.canPlaceOnFoundation(card, this.foundations[j])) {
              alert(`Try moving ${card.value}${card.suit} from tableau ${i + 1} to foundation!`);
              return;
            }
          }
        }
      }
    }
    
    alert('No obvious moves. Try drawing from the stock!');
  }

  // Render the entire game state to the DOM
  // Updates stock, waste, foundations, and tableau piles
  render() {
    // Render stock pile - shows card back or recycle icon when empty
    const stockEl = this.container.querySelector('[data-pile="stock"]');
    stockEl.innerHTML = this.stock.length > 0 ? '<div class="card card-back"></div>' : '<div class="card-empty">↻</div>';
    
    // Render waste pile - shows top card if any
    const wasteEl = this.container.querySelector('[data-pile="waste"]');
    wasteEl.innerHTML = '';
    if (this.waste.length > 0) {
      const topCard = this.waste[this.waste.length - 1];
      const cardEl = this.createCardElement(topCard);
      cardEl.addEventListener('click', () => this.selectCard(topCard, 'waste', this.waste.length - 1));
      wasteEl.appendChild(cardEl);
    }
    
    // Render foundations - 4 piles for each suit (Ace to King)
    for (let i = 0; i < 4; i++) {
      const foundEl = this.container.querySelector(`[data-foundation="${i}"]`);
      foundEl.innerHTML = '';
      foundEl.onclick = () => this.handleFoundationClick(i);
      
      if (this.foundations[i].length > 0) {
        const topCard = this.foundations[i][this.foundations[i].length - 1];
        foundEl.appendChild(this.createCardElement(topCard));
      } else {
        const placeholder = document.createElement('div');
        placeholder.className = 'card-placeholder';
        foundEl.appendChild(placeholder);
      }
    }
    
    // Render tableau - 7 columns with cascading cards
    for (let i = 0; i < 7; i++) {
      const tabEl = this.container.querySelector(`[data-tableau="${i}"]`);
      tabEl.innerHTML = '';
      tabEl.onclick = (e) => {
        if (e.target === tabEl || e.target.classList.contains('card-placeholder')) {
          this.handleTableauClick(i, -1);
        }
      };
      
      if (this.tableau[i].length === 0) {
        const placeholder = document.createElement('div');
        placeholder.className = 'card-placeholder';
        tabEl.appendChild(placeholder);
      } else {
        this.tableau[i].forEach((card, idx) => {
          const cardEl = this.createCardElement(card);
          cardEl.style.top = `${idx * 25}px`;
          if (card.faceUp) {
            cardEl.addEventListener('click', (e) => {
              e.stopPropagation();
              this.selectCard(card, `tableau-${i}`, idx);
            });
          }
          tabEl.appendChild(cardEl);
        });
      }
    }
  }

  // Handle card selection for click-based movement
  // First click selects, second click attempts to place
  selectCard(card, source, index) {
    if (this.selected) {
      // Try to place selected card
      if (source.startsWith('foundation')) {
        const foundIndex = parseInt(source.split('-')[1]);
        if (this.canPlaceOnFoundation(this.selected, this.foundations[foundIndex])) {
          this.moveCard(this.selected, this.selectedSource, source, this.selectedIndex);
        }
      } else if (source.startsWith('tableau')) {
        const pileIndex = parseInt(source.split('-')[1]);
        if (this.canPlaceOnTableau(this.selected, this.tableau[pileIndex])) {
          // Move selected card(s)
          const fromPile = parseInt(this.selectedSource.split('-')[1]);
          const cards = this.tableau[fromPile].slice(this.selectedIndex);
          this.tableau[fromPile].splice(this.selectedIndex);
          if (this.tableau[fromPile].length > 0) {
            this.tableau[fromPile][this.tableau[fromPile].length - 1].faceUp = true;
          }
          this.tableau[pileIndex].push(...cards);
          this.selected = null;
          this.selectedSource = null;
          this.render();
        }
      }
      this.selected = null;
      this.selectedSource = null;
      this.render();
    } else {
      // Select card
      this.selected = card;
      this.selectedSource = source;
      this.selectedIndex = index;
    }
  }

  handleFoundationClick(index) {
    if (this.selected && this.canPlaceOnFoundation(this.selected, this.foundations[index])) {
      this.moveCard(this.selected, this.selectedSource, `foundation-${index}`, this.selectedIndex);
    }
  }

  handleTableauClick(pileIndex, cardIndex) {
    if (this.selected) {
      if (this.canPlaceOnTableau(this.selected, this.tableau[pileIndex])) {
        if (this.selectedSource === 'waste') {
          const card = this.waste.pop();
          this.tableau[pileIndex].push(card);
        } else if (this.selectedSource.startsWith('tableau')) {
          const fromPile = parseInt(this.selectedSource.split('-')[1]);
          const cards = this.tableau[fromPile].slice(this.selectedIndex);
          this.tableau[fromPile].splice(this.selectedIndex);
          if (this.tableau[fromPile].length > 0) {
            this.tableau[fromPile][this.tableau[fromPile].length - 1].faceUp = true;
          }
          this.tableau[pileIndex].push(...cards);
        }
        this.selected = null;
        this.selectedSource = null;
        this.render();
        this.checkWin();
      }
    }
  }

  // Create a DOM element for a playing card
  // Shows card back if face-down, or suit/value if face-up
  // Enables dragging for face-up cards
  createCardElement(card) {
    const cardEl = document.createElement('div');
    cardEl.draggable = true;
    
    if (!card.faceUp) {
      cardEl.className = 'card card-back';
      cardEl.draggable = false;
    } else {
      // Face-up card: show value, suit, and enable dragging
      cardEl.className = `card card-${card.color}`;
      cardEl.innerHTML = `
        <div class="card-corner">
          <div class="card-value-small">${card.value}</div>
          <div class="card-suit-small">${card.suit}</div>
        </div>
        <div class="card-suit-large">${card.suit}</div>
      `;
      
      // Drag events
      cardEl.addEventListener('dragstart', (e) => {
        this.draggedCard = card;
        this.draggedSource = this.findCardSource(card);
        e.dataTransfer.effectAllowed = 'move';
        cardEl.style.opacity = '0.5';
      });
      
      cardEl.addEventListener('dragend', (e) => {
        cardEl.style.opacity = '1';
      });
    }
    return cardEl;
  }

  // Find where a card is currently located
  // Returns object with type (waste/tableau) and pile/index information
  findCardSource(card) {
    // Find where the card is
    if (this.waste.length > 0 && this.waste[this.waste.length - 1] === card) {
      return { type: 'waste', index: this.waste.length - 1 };
    }
    
    for (let i = 0; i < 7; i++) {
      const idx = this.tableau[i].indexOf(card);
      if (idx !== -1 && this.tableau[i][idx].faceUp) {
        return { type: 'tableau', pile: i, index: idx };
      }
    }
    
    return null;
  }

  // Set up drag and drop event handlers
  // Enables dragging cards to foundations and tableau piles
  setupDragDrop() {
    // Foundation drop zones
    for (let i = 0; i < 4; i++) {
      const foundEl = this.container.querySelector(`[data-foundation="${i}"]`);
      
      foundEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      });
      
      foundEl.addEventListener('drop', (e) => {
        e.preventDefault();
        if (this.draggedCard && this.draggedSource) {
          if (this.canPlaceOnFoundation(this.draggedCard, this.foundations[i])) {
            this.performMove(this.draggedSource, { type: 'foundation', pile: i });
          }
        }
      });
    }
    
    // Tableau drop zones
    for (let i = 0; i < 7; i++) {
      const tabEl = this.container.querySelector(`[data-tableau="${i}"]`);
      
      tabEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      });
      
      tabEl.addEventListener('drop', (e) => {
        e.preventDefault();
        if (this.draggedCard && this.draggedSource) {
          if (this.canPlaceOnTableau(this.draggedCard, this.tableau[i])) {
            this.performMove(this.draggedSource, { type: 'tableau', pile: i });
          }
        }
      });
    }
  }

  // Execute a card move from source to destination
  // Handles moving single cards or sequences (tableau to tableau)
  // Flips hidden cards when tableau columns are revealed
  performMove(source, dest) {
    if (source.type === 'waste') {
      const card = this.waste.pop();
      if (dest.type === 'foundation') {
        this.foundations[dest.pile].push(card);
      } else {
        this.tableau[dest.pile].push(card);
      }
    } else if (source.type === 'tableau') {
      const cards = this.tableau[source.pile].splice(source.index);
      if (dest.type === 'foundation' && cards.length === 1) {
        this.foundations[dest.pile].push(cards[0]);
      } else if (dest.type === 'tableau') {
        this.tableau[dest.pile].push(...cards);
      }
      
      // Flip top card
      if (this.tableau[source.pile].length > 0) {
        this.tableau[source.pile][this.tableau[source.pile].length - 1].faceUp = true;
      }
    }
    
    this.draggedCard = null;
    this.draggedSource = null;
    this.render();
    this.setupDragDrop();
    this.checkWin();
  }
}
