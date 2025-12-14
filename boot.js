// BOOT SEQUENCE: WINDOWS 2000 STARTUP
// Displays a nostalgic Windows 2000 boot animation when page loads
// Shows logo, loading bar, and status messages
// Automatically opens Settings window after boot completes
function showBootSequence() {
  const bootScreen = document.createElement('div');
  bootScreen.id = 'bootScreen';
  bootScreen.innerHTML = `
    <div class="boot-content">
      <div class="boot-logo">
        <img src="img/k_ded.png" alt="Logo" class="boot-image">
        <h1>Windows Kae00</h1>
        <p>Aspiring Professional</p>
      </div>
      <div class="boot-progress">
        <div class="boot-bar boot-bar-1"></div>
        <div class="boot-bar boot-bar-2"></div>
        <div class="boot-bar boot-bar-3"></div>
        <div class="boot-bar boot-bar-4"></div>
        <div class="boot-bar boot-bar-5"></div>
      </div>
      <div class="boot-text">Starting Windows...</div>
    </div>
  `;
  document.body.appendChild(bootScreen);

  // Boot sequence timing:
  // 0s: Initial screen
  // 1s: Loading system files message
  setTimeout(() => {
    bootScreen.querySelector('.boot-text').textContent = 'Loading system files...';
  }, 1000);

  setTimeout(() => {
    bootScreen.querySelector('.boot-text').textContent = 'Initializing desktop...';
  }, 2000);

  // 3s: Fade out boot screen and initialize desktop
  setTimeout(() => {
    bootScreen.style.opacity = '0';
    setTimeout(() => {
      bootScreen.remove();
      playStartupSound();
      
      // Create welcome sticky note on boot
      if (!stickyNotesApp) {
        initStickyNotes();
      }
      
      // Always show welcome note on boot (clears previous notes)
      // Clear any existing notes first to ensure only one welcome note
      stickyNotesApp.notes.forEach(note => {
        const noteEl = document.getElementById(`sticky-note-${note.id}`);
        if (noteEl) noteEl.remove();
      });
      stickyNotesApp.notes = [];
      
      const welcomeContent = `Welcome to Windows Kae00! 👋

Keyboard Shortcuts:
━━━━━━━━━━━━━━━━━
⚙️  Settings: Ctrl+Shift+S
📝  New Note: Ctrl+Shift+N

Tips:
• Double-click icons to open
• Right-click for menu
• Drag windows to move
• Click 🎨 to change colors

Enjoy exploring!`;
      
      const note = stickyNotesApp.createNote(
        welcomeContent,
        window.innerWidth - 270, // Position on right side
        20 // Top margin
      );
      note.color = '#bae1ff'; // Blue color for welcome note
      note.width = 250;
      note.height = 320; // Taller to fit all content
      const noteEl = document.getElementById(`sticky-note-${note.id}`);
      if (noteEl) {
        noteEl.style.backgroundColor = note.color;
        noteEl.style.width = note.width + 'px';
        noteEl.style.height = note.height + 'px';
      }
      stickyNotesApp.saveNotes();
    }, 500);
  }, 3000);
}

// Play Windows startup sound (placeholder for future implementation)
function playStartupSound() {
  // Optional: Add Windows startup sound
  // Could add audio here in the future
}

// RIGHT-CLICK CONTEXT MENU
// Creates a Windows 2000 style right-click context menu
// Shows options like Refresh and Properties when right-clicking desktop

let contextMenu = null;

// Create the context menu element with menu items
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

// Show context menu at specified coordinates
function showContextMenu(x, y) {
  if (!contextMenu) createContextMenu();
  
  contextMenu.style.left = x + 'px';
  contextMenu.style.top = y + 'px';
  contextMenu.style.display = 'block';
}

// Hide the context menu
function hideContextMenu() {
  if (contextMenu) {
    contextMenu.style.display = 'none';
  }
}

// Handle context menu item clicks
// Actions: refresh (reload page), properties (show info), bsod (easter egg)
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

// Show portfolio properties/information in an alert
function showProperties() {
  alert('Windows 2000 Portfolio\n\nDeveloper: Your Name\nVersion: 1.0\nBuilt with: HTML, CSS, JavaScript\n\n© 2025');
}

// DESKTOP EVENT LISTENERS
// Set up right-click menu and other desktop interactions
document.addEventListener('DOMContentLoaded', () => {
  const desktop = document.querySelector('.desktop');
  
  desktop.addEventListener('contextmenu', (e) => {
    // Only show custom context menu on desktop area, not on other elements
    if (e.target === desktop || e.target.classList.contains('desktop')) {
      e.preventDefault();
      showContextMenu(e.pageX, e.pageY);
    }
    // Allow browser context menu on all other elements
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.context-menu')) {
      hideContextMenu();
    }
  });

  // Show boot sequence on every page load
  showBootSequence();
});

// SHUTDOWN SEQUENCE
// Displays a classic Windows 2000 shutdown animation
// Shows "shutting down" message followed by "safe to turn off" screen
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

// BLUE SCREEN OF DEATH (BSOD) EASTER EGG
// A fun easter egg that displays a "Blue Screen of Death"
// Instead of showing errors, it showcases the developer's skills!
// Activated by Ctrl+Shift+B keyboard shortcut
function showBSOD() {
  const bsod = document.createElement('div');
  bsod.id = 'bsodScreen';
  
  // List of "error codes" that are actually developer skills
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
  
  // Pick a random skill to display as the "error"
  const randomSkill = skills[Math.floor(Math.random() * skills.length)];
  
  // Create BSOD screen with humorous "error" message showcasing skills
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
  
  // Click anywhere to close the BSOD
  bsod.addEventListener('click', () => {
    bsod.remove();
  });
  
  // Press any key to close the BSOD
  const keyHandler = (e) => {
    bsod.remove();
    document.removeEventListener('keydown', keyHandler);
  };
  document.addEventListener('keydown', keyHandler);
}

// KEYBOARD SHORTCUTS
// Ctrl+Shift+B triggers the Blue Screen of Death easter egg
// Ctrl+Shift+S opens Settings window
// Ctrl+Shift+N creates a new sticky note
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'B') {
    showBSOD();
  }
  if (e.ctrlKey && e.shiftKey && e.key === 'S') {
    const settingsWindow = document.getElementById('settingsWindow');
    if (settingsWindow) {
      openWindow(settingsWindow);
    }
  }
  if (e.ctrlKey && e.shiftKey && e.key === 'N') {
    createStickyNote();
  }
});
