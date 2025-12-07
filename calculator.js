// CALCULATOR APPLICATION
const calculator = {
  display: null,
  currentValue: '0',
  previousValue: null,
  operation: null,
  waitingForOperand: false,
  memory: 0,
  scientificMode: false,

  init() {
    this.display = document.getElementById('calcDisplay');
    this.updateDisplay();
  },

  updateDisplay() {
    if (this.display) {
      this.display.textContent = this.currentValue;
    }
  },

  toggleScientificMode() {
    this.scientificMode = !this.scientificMode;
    const calcWindow = document.getElementById('calculatorWindow');
    if (calcWindow) {
      if (this.scientificMode) {
        calcWindow.style.width = '380px';
      } else {
        calcWindow.style.width = '230px';
      }
    }
    this.renderScientificPanel();
  },

  renderScientificPanel() {
    const calcContent = document.getElementById('calculatorContent');
    if (!calcContent) return;

    const sciPanel = document.getElementById('scientificPanel');
    if (this.scientificMode && !sciPanel) {
      const sciHTML = `
        <div id="scientificPanel" class="calc-scientific">
          <button class="calc-btn calc-sci" onclick="calculator.scientific('sin')">sin</button>
          <button class="calc-btn calc-sci" onclick="calculator.scientific('cos')">cos</button>
          <button class="calc-btn calc-sci" onclick="calculator.scientific('tan')">tan</button>
          <button class="calc-btn calc-sci" onclick="calculator.scientific('log')">log</button>
          
          <button class="calc-btn calc-sci" onclick="calculator.scientific('ln')">ln</button>
          <button class="calc-btn calc-sci" onclick="calculator.scientific('exp')">exp</button>
          <button class="calc-btn calc-sci" onclick="calculator.scientific('x²')">x²</button>
          <button class="calc-btn calc-sci" onclick="calculator.scientific('x³')">x³</button>
          
          <button class="calc-btn calc-sci" onclick="calculator.scientific('π')">π</button>
          <button class="calc-btn calc-sci" onclick="calculator.scientific('e')">e</button>
          <button class="calc-btn calc-sci" onclick="calculator.scientific('1/x')">1/x</button>
          <button class="calc-btn calc-sci" onclick="calculator.scientific('n!')">n!</button>
        </div>
      `;
      calcContent.insertAdjacentHTML('afterbegin', sciHTML);
    } else if (!this.scientificMode && sciPanel) {
      sciPanel.remove();
    }
  },

  scientific(func) {
    const x = parseFloat(this.currentValue);
    let result;

    switch (func) {
      case 'sin': result = Math.sin(x); break;
      case 'cos': result = Math.cos(x); break;
      case 'tan': result = Math.tan(x); break;
      case 'log': result = Math.log10(x); break;
      case 'ln': result = Math.log(x); break;
      case 'exp': result = Math.exp(x); break;
      case 'x²': result = x * x; break;
      case 'x³': result = x ** 3; break;
      case 'π': result = Math.PI; break;
      case 'e': result = Math.E; break;
      case '1/x': result = 1 / x; break;
      case 'n!': 
        result = 1;
        for (let i = 2; i <= x; i++) result *= i;
        break;
      default: return;
    }

    this.currentValue = String(result);
    this.waitingForOperand = true;
    this.updateDisplay();
  },

  inputNumber(num) {
    if (this.waitingForOperand) {
      this.currentValue = num;
      this.waitingForOperand = false;
    } else {
      this.currentValue = this.currentValue === '0' ? num : this.currentValue + num;
    }
    this.updateDisplay();
  },

  decimal() {
    if (this.waitingForOperand) {
      this.currentValue = '0.';
      this.waitingForOperand = false;
    } else if (this.currentValue.indexOf('.') === -1) {
      this.currentValue += '.';
    }
    this.updateDisplay();
  },

  clear() {
    this.currentValue = '0';
    this.previousValue = null;
    this.operation = null;
    this.waitingForOperand = false;
    this.updateDisplay();
  },

  clearEntry() {
    this.currentValue = '0';
    this.updateDisplay();
  },

  backspace() {
    if (!this.waitingForOperand) {
      this.currentValue = this.currentValue.length > 1 ? 
        this.currentValue.slice(0, -1) : '0';
      this.updateDisplay();
    }
  },

  plusMinus() {
    const value = parseFloat(this.currentValue);
    this.currentValue = String(-value);
    this.updateDisplay();
  },

  performOperation(nextOperation) {
    const inputValue = parseFloat(this.currentValue);

    if (this.previousValue === null) {
      this.previousValue = inputValue;
    } else if (this.operation) {
      const result = this.calculate(this.previousValue, inputValue, this.operation);
      this.currentValue = String(result);
      this.previousValue = result;
    }

    this.waitingForOperand = true;
    this.operation = nextOperation;
    this.updateDisplay();
  },

  calculate(firstOperand, secondOperand, operation) {
    switch (operation) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '*':
        return firstOperand * secondOperand;
      case '/':
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  },

  add() {
    this.performOperation('+');
  },

  subtract() {
    this.performOperation('-');
  },

  multiply() {
    this.performOperation('*');
  },

  divide() {
    this.performOperation('/');
  },

  equals() {
    const inputValue = parseFloat(this.currentValue);

    if (this.previousValue !== null && this.operation) {
      const result = this.calculate(this.previousValue, inputValue, this.operation);
      this.currentValue = String(result);
      this.previousValue = null;
      this.operation = null;
      this.waitingForOperand = true;
      this.updateDisplay();
    }
  },

  sqrt() {
    const value = parseFloat(this.currentValue);
    this.currentValue = String(Math.sqrt(value));
    this.waitingForOperand = true;
    this.updateDisplay();
  },

  percent() {
    const value = parseFloat(this.currentValue);
    this.currentValue = String(value / 100);
    this.updateDisplay();
  },

  reciprocal() {
    const value = parseFloat(this.currentValue);
    this.currentValue = String(1 / value);
    this.waitingForOperand = true;
    this.updateDisplay();
  },

  memoryClear() {
    this.memory = 0;
  },

  memoryRecall() {
    this.currentValue = String(this.memory);
    this.waitingForOperand = true;
    this.updateDisplay();
  },

  memoryStore() {
    this.memory = parseFloat(this.currentValue);
  },

  memoryAdd() {
    this.memory += parseFloat(this.currentValue);
  }
};

// Open calculator window
function openCalculator() {
  const calcWindow = document.getElementById('calculatorWindow');
  if (calcWindow) {
    calcWindow.style.display = 'block';
    bringToFront(calcWindow);
    addToTaskbar('calculatorWindow', 'Calculator');
    if (!calculator.display) {
      calculator.init();
    }
  }
}
