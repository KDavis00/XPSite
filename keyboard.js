// ON-SCREEN KEYBOARD APPLICATION
// -------------------------------
// KEYBOARD LAYOUTS
// -------------------------------
const layouts = {
    us: [
        ["`","1","2","3","4","5","6","7","8","9","0","-","=","Backspace"],
        ["Tab","q","w","e","r","t","y","u","i","o","p","[","]","\\"],
        ["CapsLock","a","s","d","f","g","h","j","k","l",";","'","Enter"],
        ["Shift","z","x","c","v","b","n","m",",",".","/","Shift"],
        ["Ctrl","Alt","Space","Alt","Ctrl"]
    ],

    uk: [
        ["`","1","2","3","4","5","6","7","8","9","0","-","=","Backspace"],
        ["Tab","q","w","e","r","t","y","u","i","o","p","[","]","\\"],
        ["CapsLock","a","s","d","f","g","h","j","k","l",";","'","Enter"],
        ["Shift","z","x","c","v","b","n","m",",",".","/","Shift"],
        ["Ctrl","Alt","Space","Alt","Ctrl"]
    ],

    de: [
        ["^","1","2","3","4","5","6","7","8","9","0","ß","´","Backspace"],
        ["Tab","q","w","e","r","t","z","u","i","o","p","ü","+","#"],
        ["CapsLock","a","s","d","f","g","h","j","k","l","ö","ä","Enter"],
        ["Shift","<","y","x","c","v","b","n","m",",",".","-","Shift"],
        ["Ctrl","Alt","Space","Alt","Ctrl"]
    ],

    fr: [
        ["²","&","é","\"","'","(","-","è","_","ç","à",")","=","Backspace"],
        ["Tab","a","z","e","r","t","y","u","i","o","p","^","$","*"],
        ["CapsLock","q","s","d","f","g","h","j","k","l","m","ù","Enter"],
        ["Shift","<","w","x","c","v","b","n",",",";","!","Shift"],
        ["Ctrl","Alt","Space","Alt","Ctrl"]
    ],

    es: [
        ["º","1","2","3","4","5","6","7","8","9","0","'","¡","Backspace"],
        ["Tab","q","w","e","r","t","y","u","i","o","p","`","+","*"],
        ["CapsLock","a","s","d","f","g","h","j","k","l","ñ","´","Enter"],
        ["Shift","<","z","x","c","v","b","n","m",",",".","-","Shift"],
        ["Ctrl","Alt","Space","Alt","Ctrl"]
    ],

    it: [
        ["\\","1","2","3","4","5","6","7","8","9","0","'","ì","Backspace"],
        ["Tab","q","w","e","r","t","y","u","i","o","p","è","+","*"],
        ["CapsLock","a","s","d","f","g","h","j","k","l","ò","à","Enter"],
        ["Shift","<","z","x","c","v","b","n","m",",",".","-","Shift"],
        ["Ctrl","Alt","Space","Alt","Ctrl"]
    ],

    se: [
        ["§","1","2","3","4","5","6","7","8","9","0","+","´","Backspace"],
        ["Tab","q","w","e","r","t","y","u","i","o","p","å","¨","'"],
        ["CapsLock","a","s","d","f","g","h","j","k","l","ö","ä","Enter"],
        ["Shift","<","z","x","c","v","b","n","m",",",".","-","Shift"],
        ["Ctrl","Alt","Space","Alt","Ctrl"]
    ]
};

const onScreenKeyboard = {
  capsLock: false,
  shift: false,
  ctrl: false,
  alt: false,
  currentLayout: 'us',

  init() {
    this.renderLayout();
    // Set the dropdown to match current layout
    const select = document.getElementById('keyboardLayoutSelect');
    if (select) {
      select.value = this.currentLayout;
    }
  },

  changeLayout(layoutName) {
    if (this.layouts[layoutName]) {
      this.currentLayout = layoutName;
      this.renderLayout();
    }
  },

  renderLayout() {
    const oskContent = document.getElementById('oskContent');
    if (!oskContent) return;

    const layout = layouts[this.currentLayout];
    if (!layout) return;

    let layoutHTML = '';
    
    layout.forEach((row, rowIndex) => {
      layoutHTML += '<div class="osk-row">';
      
      row.forEach(key => {
        const keyClass = this.getKeyClass(key);
        const displayKey = this.applyCase(key);
        const dataKey = key === 'Space' ? ' ' : key;
        
        layoutHTML += `<button class="osk-key ${keyClass}" data-key="${dataKey}">${displayKey}</button>`;
      });
      
      layoutHTML += '</div>';
    });

    oskContent.innerHTML = layoutHTML;

    // Add event listeners to all keys
    const keys = oskContent.querySelectorAll('.osk-key');
    keys.forEach(key => {
      key.addEventListener('click', (e) => {
        e.preventDefault();
        const keyValue = key.getAttribute('data-key');
        this.handleKeyPress(keyValue, key);
      });
    });

    this.highlightStates();
  },

  applyCase(key) {
    if (["Tab","Enter","Backspace","Shift","Ctrl","Alt","CapsLock","Space"].includes(key)) {
      if (key === "CapsLock") return "Caps";
      if (key === "Backspace") return "←";
      if (key === "Space") return "";
      return key;
    }

    if (this.shift ^ this.capsLock) {
      return key.toUpperCase();
    } else {
      return key.toLowerCase();
    }
  },

  refreshKeys() {
    const keys = document.querySelectorAll('.osk-key');
    keys.forEach(k => {
      const original = k.getAttribute('data-key');
      k.textContent = this.applyCase(original);
    });
  },

  highlightStates() {
    const keys = document.querySelectorAll('.osk-key');
    
    keys.forEach(key => key.classList.remove('osk-active'));

    if (this.capsLock) {
      document.querySelectorAll('[data-key="CapsLock"]').forEach(k => k.classList.add('osk-active'));
    }

    if (this.shift) {
      document.querySelectorAll('[data-key="Shift"]').forEach(k => k.classList.add('osk-active'));
    }
  },

  getKeyClass(key) {
    let classes = [];
    
    if (key === 'Backspace' || key === 'Tab' || key === '\\' || key === '#') {
      classes.push('osk-wide');
    }
    if (key === 'CapsLock') {
      classes.push('osk-caps');
    }
    if (key === 'Enter') {
      classes.push('osk-enter');
    }
    if (key === 'Shift') {
      classes.push('osk-shift');
    }
    if (key === 'Ctrl') {
      classes.push('osk-ctrl');
    }
    if (key === 'Alt') {
      classes.push('osk-alt');
    }
    if (key === 'Space') {
      classes.push('osk-space');
    }
    
    return classes.join(' ');
  },



  toggleLayout() {
    const layoutKeys = Object.keys(this.layouts);
    const currentIndex = layoutKeys.indexOf(this.currentLayout);
    const nextIndex = (currentIndex + 1) % layoutKeys.length;
    this.currentLayout = layoutKeys[nextIndex];
    this.renderLayout();
  },

  openRegionalSettings() {
    const layoutNames = {
      us: 'US English (QWERTY)',
      uk: 'UK English (QWERTY)',
      de: 'German (QWERTZ)',
      fr: 'French (AZERTY)',
      es: 'Spanish (QWERTY)'
    };
    
    let message = 'Select keyboard layout:\n\n';
    Object.keys(this.layouts).forEach(key => {
      const indicator = key === this.currentLayout ? '• ' : '  ';
      message += `${indicator}${layoutNames[key]}\n`;
    });
    message += '\nClick "Keyboard" menu to cycle through layouts.';
    
    alert(message);
  },

  handleKeyPress(keyValue, keyElement) {
    // Get the active focused element, or use a global input tracker
    let activeElement = document.activeElement;
    
    // If no active element, try to find the last clicked input/textarea
    if (!activeElement || (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA')) {
      // Store reference to last focused input globally
      if (!window.lastFocusedInput) {
        // Try to find any input on the page
        const inputs = document.querySelectorAll('input[type="text"], textarea');
        if (inputs.length > 0) {
          activeElement = inputs[0];
          activeElement.focus();
        }
      } else {
        activeElement = window.lastFocusedInput;
        if (activeElement && document.body.contains(activeElement)) {
          activeElement.focus();
        }
      }
    }
    
    // Toggle special keys
    if (keyValue === 'CapsLock') {
      this.capsLock = !this.capsLock;
      this.refreshKeys();
      this.highlightStates();
      return;
    }

    if (keyValue === 'Shift') {
      this.shift = !this.shift;
      this.refreshKeys();
      this.highlightStates();
      return;
    }
    
    if (keyValue === 'NumLock') {
      this.numLock = !this.numLock;
      keyElement.classList.toggle('osk-active', this.numLock);
      return;
    }

    if (keyValue === 'Ctrl') {
      this.ctrl = !this.ctrl;
      keyElement.classList.toggle('osk-active', this.ctrl);
      return;
    }

    if (keyValue === 'Alt') {
      this.alt = !this.alt;
      keyElement.classList.toggle('osk-active', this.alt);
      return;
    }

    // Handle special keys
    if (keyValue === 'Backspace') {
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        const start = activeElement.selectionStart;
        const end = activeElement.selectionEnd;
        if (start !== end) {
          activeElement.value = activeElement.value.substring(0, start) + activeElement.value.substring(end);
          activeElement.selectionStart = activeElement.selectionEnd = start;
        } else if (start > 0) {
          activeElement.value = activeElement.value.substring(0, start - 1) + activeElement.value.substring(start);
          activeElement.selectionStart = activeElement.selectionEnd = start - 1;
        }
        activeElement.dispatchEvent(new Event('input', { bubbles: true }));
      }
      return;
    }

    if (keyValue === 'Enter') {
      if (activeElement && activeElement.tagName === 'TEXTAREA') {
        this.insertText('\n');
      }
      return;
    }

    if (keyValue === 'Tab') {
      if (activeElement) {
        const focusableElements = document.querySelectorAll('input, textarea, button, a');
        const currentIndex = Array.from(focusableElements).indexOf(activeElement);
        if (currentIndex !== -1 && currentIndex < focusableElements.length - 1) {
          focusableElements[currentIndex + 1].focus();
        }
      }
      return;
    }

    // Arrow keys
    if (keyValue.startsWith('Arrow')) {
      return; // Arrow keys handled by browser
    }

    // Ignore ctrl and alt
    if (['Ctrl', 'Alt'].includes(keyValue)) {
      return;
    }

    // Letter / character input
    const char = this.applyCase(keyValue);
    this.insertText(char);

    // SHIFT releases after one key like a real keyboard
    if (this.shift) {
      this.shift = false;
      this.refreshKeys();
      this.highlightStates();
    }
  },

  insertText(text) {
    const activeElement = document.activeElement;
    
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      const value = activeElement.value;
      
      activeElement.value = value.substring(0, start) + text + value.substring(end);
      activeElement.selectionStart = activeElement.selectionEnd = start + text.length;
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
};

// Open on-screen keyboard window
function openOnScreenKeyboard() {
  const oskWindow = document.getElementById('oskWindow');
  if (oskWindow) {
    oskWindow.style.display = 'block';
    bringToFront(oskWindow);
    addToTaskbar('oskWindow', 'On-Screen Keyboard');
    if (!onScreenKeyboard.initialized) {
      onScreenKeyboard.init();
      onScreenKeyboard.initialized = true;
    }
  }
}
