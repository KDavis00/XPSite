// Boot Sequence
function showBootSequence() {
  const bootScreen = document.createElement('div');
  bootScreen.id = 'bootScreen';
  bootScreen.innerHTML = `
    <div class="boot-content">
      <div class="boot-logo">
        <img src="img/k_ded.png" alt="Logo" class="boot-image">
        <h1>Microsoft Windows 2000</h1>
        <p>Professional</p>
      </div>
      <div class="boot-progress">
        <div class="boot-bar"></div>
      </div>
      <div class="boot-text">Starting Windows...</div>
    </div>
  `;
  document.body.appendChild(bootScreen);

  setTimeout(() => {
    bootScreen.querySelector('.boot-text').textContent = 'Loading system files...';
  }, 1000);

  setTimeout(() => {
    bootScreen.querySelector('.boot-text').textContent = 'Initializing desktop...';
  }, 2000);

  setTimeout(() => {
    bootScreen.style.opacity = '0';
    setTimeout(() => {
      bootScreen.remove();
      playStartupSound();
    }, 500);
  }, 3000);

  setTimeout(() => {
        bootScreen.style.display = 'none';
        // Show settings window on boot
        const settingsWindow = document.getElementById('settingsWindow');
        if (settingsWindow) {
            settingsWindow.style.display = 'block';
            settingsWindow.style.left = 'calc(100vw - 680px)'; // Position on the right
            settingsWindow.style.top = '50px';
            bringToFront(settingsWindow);
            updateTaskbar();
        }
    }, 3000);
}

function playStartupSound() {
  // Optional: Add Windows startup sound
  console.log('🔊 Windows startup sound!');
}

// Right-Click Context Menu
let contextMenu = null;

function createContextMenu() {
  contextMenu = document.createElement('div');
  contextMenu.id = 'contextMenu';
  contextMenu.className = 'context-menu';
  contextMenu.innerHTML = `
    <div class="context-item" data-action="refresh">
      <span class="context-icon">🔄</span>
      <span>Refresh</span>
    </div>
    <div class="context-divider"></div>
    <div class="context-item" data-action="bsod">
      <span class="context-icon">💀</span>
      <span>Blue Screen (Easter Egg)</span>
    </div>
    <div class="context-divider"></div>
    <div class="context-item" data-action="properties">
      <span class="context-icon">📋</span>
      <span>Properties</span>
    </div>
  `;
  document.body.appendChild(contextMenu);

  // Add click handlers
  contextMenu.querySelectorAll('.context-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const action = item.dataset.action;
      handleContextAction(action);
      hideContextMenu();
    });
  });
}

function showContextMenu(x, y) {
  if (!contextMenu) createContextMenu();
  
  contextMenu.style.left = x + 'px';
  contextMenu.style.top = y + 'px';
  contextMenu.style.display = 'block';
}

function hideContextMenu() {
  if (contextMenu) {
    contextMenu.style.display = 'none';
  }
}

function handleContextAction(action) {
  switch(action) {
    case 'refresh':
      location.reload();
      break;
    case 'properties':
      showProperties();
      break;
    case 'bsod':
      showBSOD();
      break;
  }
}

function showProperties() {
  alert('Windows 2000 Portfolio\n\nDeveloper: Your Name\nVersion: 1.0\nBuilt with: HTML, CSS, JavaScript\n\n© 2025');
}

// Desktop right-click
document.addEventListener('DOMContentLoaded', () => {
  const desktop = document.querySelector('.desktop');
  
  desktop.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showContextMenu(e.pageX, e.pageY);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.context-menu')) {
      hideContextMenu();
    }
  });

  // Show boot sequence on every page load
  showBootSequence();
});

// Shutdown sequence
function shutdown() {
  const shutdownScreen = document.createElement('div');
  shutdownScreen.id = 'shutdownScreen';
  shutdownScreen.innerHTML = `
    <div class="shutdown-content">
      <h2>Windows is shutting down...</h2>
      <div class="shutdown-spinner"></div>
    </div>
  `;
  document.body.appendChild(shutdownScreen);

  setTimeout(() => {
    shutdownScreen.querySelector('h2').textContent = 'It\'s now safe to turn off your computer';
    shutdownScreen.querySelector('.shutdown-spinner').remove();
    
    // Add the classic shutdown message
    const shutdownMsg = document.createElement('div');
    shutdownMsg.className = 'shutdown-message';
    shutdownMsg.innerHTML = `
      <div class="shutdown-box">
        <p>Thank you for visiting my portfolio!</p>
        <button onclick="window.close()" class="shutdown-btn">Close Tab</button>
      </div>
    `;
    shutdownScreen.querySelector('.shutdown-content').appendChild(shutdownMsg);
  }, 2000);
}

// Blue Screen of Death Easter Egg
function showBSOD() {
  const bsod = document.createElement('div');
  bsod.id = 'bsodScreen';
  
  const skills = [
    'EXCEPTIONAL_JAVASCRIPT_SKILLS',
    'ADVANCED_CSS_MASTERY',
    'REACT_EXPERTISE_OVERFLOW',
    'NODE_JS_PROFICIENCY',
    'PYTHON_WIZARD_MODE',
    'DATABASE_NINJA_DETECTED',
    'API_INTEGRATION_GENIUS',
    'PROBLEM_SOLVING_EXCELLENCE'
  ];
  
  const randomSkill = skills[Math.floor(Math.random() * skills.length)];
  
  bsod.innerHTML = `
    <div class="bsod-content">
      <h1>Windows</h1>
      <p>A skill exception has been detected and the developer has been showcased to prevent damage to your hiring team.</p>
      
      <p>The skill that caused this:</p>
      <p class="bsod-error">${randomSkill}</p>
      
      <p>If this is the first time you've seen this developer, consider hiring them immediately.
If you've seen this developer before, then you already know they're amazing.</p>
      
      <p>Technical information:</p>
      
      <p>*** STOP: 0x0000007B (0xF00DC0DE, 0xDEADBEEF, 0xC0FFEE00, 0x1337BABE)</p>
      
      <div class="bsod-skills">
        <p>LOADED SKILLS:</p>
        <p>JavaScript - TypeScript - React - Node.js - Python - HTML/CSS</p>
        <p>Git - REST APIs - Databases - Agile - Problem Solving</p>
      </div>
      
      <p class="bsod-footer">Press any key to hire this developer... or click anywhere to continue.</p>
    </div>
  `;
  
  document.body.appendChild(bsod);
  
  // Click anywhere to close
  bsod.addEventListener('click', () => {
    bsod.remove();
  });
  
  // Press any key to close
  const keyHandler = (e) => {
    bsod.remove();
    document.removeEventListener('keydown', keyHandler);
  };
  document.addEventListener('keydown', keyHandler);
}

// Add keyboard shortcut for BSOD (Ctrl+Shift+B)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'B') {
    showBSOD();
  }
});
