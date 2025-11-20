// Settings Application
class Settings {
  constructor() {
    this.settings = this.loadSettings();
    this.applySettings();
  }

  loadSettings() {
    const defaults = {
      highContrast: false,
      textSize: 100,
      iconSize: 100,
      reducedMotion: false,
      screenReader: true,
      keyboardNav: true,
      focusIndicator: true
    };
    
    const saved = localStorage.getItem('accessibilitySettings');
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  }

  saveSettings() {
    localStorage.setItem('accessibilitySettings', JSON.stringify(this.settings));
    this.applySettings();
  }

  applySettings() {
    const root = document.documentElement;
    
    // High Contrast Mode
    if (this.settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Text Size
    root.style.fontSize = this.settings.textSize + '%';

    // Icon Size
    document.querySelectorAll('.icon img').forEach(img => {
      const baseSize = 32;
      const newSize = (baseSize * this.settings.iconSize / 100);
      img.style.width = newSize + 'px';
      img.style.height = newSize + 'px';
    });

    // Reduced Motion
    if (this.settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Keyboard Navigation Indicators
    if (this.settings.focusIndicator) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }

    // Screen Reader Announcements
    if (this.settings.screenReader) {
      this.enableScreenReaderMode();
    }
  }

  enableScreenReaderMode() {
    // Add ARIA labels where needed
    document.querySelectorAll('.icon').forEach(icon => {
      if (!icon.hasAttribute('role')) {
        icon.setAttribute('role', 'button');
        icon.setAttribute('tabindex', '0');
      }
    });

    document.querySelectorAll('.window').forEach(win => {
      if (!win.hasAttribute('role')) {
        win.setAttribute('role', 'dialog');
        win.setAttribute('aria-modal', 'true');
      }
    });
  }

  updateSetting(key, value) {
    this.settings[key] = value;
    this.saveSettings();
  }
}

// Settings Window Content
function initSettings() {
  const settingsContent = document.getElementById('settingsContent');
  if (!settingsContent) return;

  settingsContent.innerHTML = `
    <div class="settings-container">
      <div class="settings-sidebar">
        <div class="settings-tab active" data-tab="display">
          <img src="Windows 2000/Settings.ico" alt="">
          Display
        </div>
        <div class="settings-tab" data-tab="themes">
          <img src="Windows 2000/Paint.ico" alt="">
          Themes
        </div>
        <div class="settings-tab" data-tab="desktop">
          <img src="Windows 2000/Folder Closed.ico" alt="">
          Desktop
        </div>
        <div class="settings-tab" data-tab="screensaver">
          <img src="Windows 2000/Default Document.ico" alt="">
          Screen Saver
        </div>
        <div class="settings-tab" data-tab="about">
          <img src="Windows 2000/Help.ico" alt="">
          About
        </div>
      </div>
      <div class="settings-content">
        <div class="settings-panel active" id="displayPanel">
          <h3>Display Settings</h3>
          <div class="settings-group">
            <label>Screen Resolution</label>
            <select class="settings-select">
              <option>800 x 600 pixels</option>
              <option selected>1024 x 768 pixels</option>
              <option>1280 x 1024 pixels</option>
              <option>1920 x 1080 pixels</option>
            </select>
          </div>
          <div class="settings-group">
            <label>Color Quality</label>
            <select class="settings-select">
              <option>16 bit</option>
              <option selected>32 bit</option>
            </select>
          </div>
        </div>
        
        <div class="settings-panel" id="themesPanel">
          <h3>Theme Settings</h3>
          <div class="settings-group">
            <label>Desktop Background</label>
            <select class="settings-select" id="backgroundSelect">
              <option value="default">Windows 2000 Default (Teal)</option>
              <option value="bliss">Bliss (Green Hills)</option>
              <option value="blue">Azure Blue</option>
              <option value="black">Black</option>
            </select>
            <button class="win-button" onclick="applyBackground()">Apply</button>
          </div>
          <div class="settings-group">
            <label>Window Color</label>
            <select class="settings-select">
              <option selected>Classic Windows</option>
              <option>High Contrast</option>
              <option>Desert</option>
            </select>
          </div>
        </div>
        
        <div class="settings-panel" id="desktopPanel">
          <h3>Desktop Icons</h3>
          <div class="settings-group">
            <label class="settings-checkbox">
              <input type="checkbox" checked> My Computer
            </label>
            <label class="settings-checkbox">
              <input type="checkbox" checked> Recycle Bin
            </label>
            <label class="settings-checkbox">
              <input type="checkbox" checked> Internet Explorer
            </label>
            <label class="settings-checkbox">
              <input type="checkbox"> My Network Places
            </label>
          </div>
        </div>
        
        <div class="settings-panel" id="screensaverPanel">
          <h3>Screen Saver</h3>
          <div class="settings-group">
            <label>Screen Saver</label>
            <select class="settings-select">
              <option>(None)</option>
              <option>3D Flying Objects</option>
              <option>3D Text</option>
              <option>Blank</option>
              <option selected>Starfield</option>
            </select>
          </div>
          <div class="settings-group">
            <label>Wait: <span id="waitMinutes">10</span> minutes</label>
            <input type="range" min="1" max="60" value="10" oninput="document.getElementById('waitMinutes').textContent = this.value">
          </div>
        </div>
        
        <div class="settings-panel" id="aboutPanel">
          <h3>About Windows 2000</h3>
          <div class="about-info">
            <img src="img/k_ded.png" alt="Logo" style="max-width: 100px; margin-bottom: 10px;">
            <p><strong>Microsoft Windows 2000</strong></p>
            <p>Professional Edition</p>
            <p>Version 5.0 (Build 2195)</p>
            <hr>
            <p><strong>Portfolio Site</strong></p>
            <p>Created by: Kae Davis</p>
            <p>A nostalgic Windows 2000 themed portfolio</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Tab switching
  document.querySelectorAll('.settings-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab + 'Panel').classList.add('active');
    });
  });
}

function applyBackground() {
  const select = document.getElementById('backgroundSelect');
  const desktop = document.querySelector('.desktop');
  
  switch(select.value) {
    case 'bliss':
      desktop.style.background = 'linear-gradient(180deg, #5a9fd4 0%, #306998 100%)';
      break;
    case 'blue':
      desktop.style.background = '#5a9fd4';
      break;
    case 'black':
      desktop.style.background = '#000';
      break;
    default:
      desktop.style.background = 'linear-gradient(135deg, #1e5799 0%, #2989d8 50%, #207cca 100%)';
  }
}

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSettings);
} else {
  initSettings();
}

// Initialize Settings
function initSettings() {
  const settingsWindow = document.getElementById('settingsWindow');
  if (settingsWindow.dataset.initialized) return;
  settingsWindow.dataset.initialized = 'true';

  const settingsApp = new Settings();
  const content = settingsWindow.querySelector('.window-content');

  content.innerHTML = `
    <div class="settings-container">
      <div class="settings-sidebar">
        <div class="settings-nav-item active" data-tab="accessibility">
          <span>♿</span> Accessibility
        </div>
        <div class="settings-nav-item" data-tab="shortcuts">
          <span>⌨️</span> Keyboard Shortcuts
        </div>
        <div class="settings-nav-item" data-tab="display">
          <span>🖥️</span> Display
        </div>
        <div class="settings-nav-item" data-tab="about">
          <span>ℹ️</span> About
        </div>
      </div>
      
      <div class="settings-content">
        <div class="settings-tab active" id="accessibility-tab">
          <h2>Accessibility Options</h2>
          <p class="settings-description">Make this portfolio easier to use</p>
          
          <div class="settings-section">
            <h3>Visual</h3>
            
            <div class="setting-item">
              <label class="setting-label">
                <input type="checkbox" id="highContrast" ${settingsApp.settings.highContrast ? 'checked' : ''}>
                <span class="setting-name">High Contrast Mode</span>
              </label>
              <p class="setting-desc">Increases contrast between text and background</p>
            </div>

            <div class="setting-item">
              <div class="setting-name">Text Size: <span id="textSizeValue">${settingsApp.settings.textSize}%</span></div>
              <input type="range" id="textSize" min="75" max="200" step="5" value="${settingsApp.settings.textSize}" class="setting-slider">
              <p class="setting-desc">Adjust text size across the entire site</p>
            </div>

            <div class="setting-item">
              <div class="setting-name">Icon Size: <span id="iconSizeValue">${settingsApp.settings.iconSize}%</span></div>
              <input type="range" id="iconSize" min="50" max="150" step="10" value="${settingsApp.settings.iconSize}" class="setting-slider">
              <p class="setting-desc">Adjust desktop icon size</p>
            </div>

            <div class="setting-item">
              <label class="setting-label">
                <input type="checkbox" id="focusIndicator" ${settingsApp.settings.focusIndicator ? 'checked' : ''}>
                <span class="setting-name">Show Focus Indicators</span>
              </label>
              <p class="setting-desc">Highlights focused elements for keyboard navigation</p>
            </div>
          </div>

          <div class="settings-section">
            <h3>Motion</h3>
            
            <div class="setting-item">
              <label class="setting-label">
                <input type="checkbox" id="reducedMotion" ${settingsApp.settings.reducedMotion ? 'checked' : ''}>
                <span class="setting-name">Reduce Motion</span>
              </label>
              <p class="setting-desc">Minimizes animations and transitions</p>
            </div>
          </div>

          <div class="settings-section">
            <h3>Assistive Technologies</h3>
            
            <div class="setting-item">
              <label class="setting-label">
                <input type="checkbox" id="screenReader" ${settingsApp.settings.screenReader ? 'checked' : ''}>
                <span class="setting-name">Screen Reader Support</span>
              </label>
              <p class="setting-desc">Adds ARIA labels for screen reader compatibility</p>
            </div>

            <div class="setting-item">
              <label class="setting-label">
                <input type="checkbox" id="keyboardNav" ${settingsApp.settings.keyboardNav ? 'checked' : ''}>
                <span class="setting-name">Keyboard Navigation</span>
              </label>
              <p class="setting-desc">Enable full keyboard control (Tab, Enter, Arrow keys)</p>
            </div>
          </div>

          <div class="settings-actions">
            <button class="settings-btn" onclick="resetSettings()">Reset to Defaults</button>
          </div>
        </div>

        <div class="settings-tab" id="shortcuts-tab">
          <h2>Keyboard Shortcuts</h2>
          <p class="settings-description">Navigate and control the portfolio with your keyboard</p>
          
          <div class="settings-section">
            <h3>Desktop & Windows</h3>
            <div class="shortcut-list">
              <div class="shortcut-item">
                <span class="shortcut-key">Tab</span>
                <span class="shortcut-desc">Navigate between desktop icons and buttons</span>
              </div>
              <div class="shortcut-item">
                <span class="shortcut-key">Enter</span>
                <span class="shortcut-desc">Open selected icon or activate button</span>
              </div>
              <div class="shortcut-item">
                <span class="shortcut-key">Esc</span>
                <span class="shortcut-desc">Close active window or menu</span>
              </div>
              <div class="shortcut-item">
                <span class="shortcut-key">Arrow Keys</span>
                <span class="shortcut-desc">Navigate through menus and options</span>
              </div>
            </div>
          </div>

          <div class="settings-section">
            <h3>Accessibility</h3>
            <div class="shortcut-list">
              <div class="shortcut-item">
                <span class="shortcut-key">Ctrl + Plus</span>
                <span class="shortcut-desc">Increase text size</span>
              </div>
              <div class="shortcut-item">
                <span class="shortcut-key">Ctrl + Minus</span>
                <span class="shortcut-desc">Decrease text size</span>
              </div>
              <div class="shortcut-item">
                <span class="shortcut-key">Ctrl + 0</span>
                <span class="shortcut-desc">Reset text size to default</span>
              </div>
            </div>
          </div>

          <div class="settings-section">
            <h3>Special Actions</h3>
            <div class="shortcut-list">
              <div class="shortcut-item">
                <span class="shortcut-key">Ctrl + Shift + B</span>
                <span class="shortcut-desc">Show Blue Screen of Death easter egg</span>
              </div>
              <div class="shortcut-item">
                <span class="shortcut-key">Ctrl + Shift + S</span>
                <span class="shortcut-desc">Open Settings window</span>
              </div>
              <div class="shortcut-item">
                <span class="shortcut-key">Alt + F4</span>
                <span class="shortcut-desc">Close active window (classic shortcut)</span>
              </div>
            </div>
          </div>
        </div>

        <div class="settings-tab" id="display-tab">
          <h2>Display Settings</h2>
          <p class="settings-description">Customize the appearance</p>
          
          <div class="settings-section">
            <h3>Theme</h3>
            <div class="setting-item">
              <p class="setting-name">Classic Windows 2000 Theme</p>
              <p class="setting-desc">The authentic retro experience</p>
            </div>
          </div>
        </div>

        <div class="settings-tab" id="about-tab">
          <h2>About This Portfolio</h2>
          <div class="settings-section">
            <h3>System Information</h3>
            <p><strong>Portfolio Version:</strong> Windows 2000 Edition v1.0</p>
            <p><strong>Built with:</strong> HTML5, CSS3, JavaScript</p>
            <p><strong>Design:</strong> Classic Windows 2000 UI</p>
            <p><strong>Features:</strong> Accessibility, Games, Interactive Portfolio</p>
            <br>
            <p><strong>© 2025</strong> - Built with ❤️ and nostalgia</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Tab switching
  content.querySelectorAll('.settings-nav-item').forEach(navItem => {
    navItem.addEventListener('click', () => {
      const tabName = navItem.dataset.tab;
      
      // Update nav
      content.querySelectorAll('.settings-nav-item').forEach(item => 
        item.classList.remove('active')
      );
      navItem.classList.add('active');
      
      // Update content
      content.querySelectorAll('.settings-tab').forEach(tab => 
        tab.classList.remove('active')
      );
      content.querySelector(`#${tabName}-tab`).classList.add('active');
    });
  });

  // Checkbox handlers
  content.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      settingsApp.updateSetting(e.target.id, e.target.checked);
      
      // Show confirmation
      showNotification(`Setting updated: ${e.target.nextElementSibling.textContent}`);
    });
  });

  // Range slider handlers
  const textSizeSlider = content.querySelector('#textSize');
  const iconSizeSlider = content.querySelector('#iconSize');

  if (textSizeSlider) {
    textSizeSlider.addEventListener('input', (e) => {
      content.querySelector('#textSizeValue').textContent = e.target.value + '%';
    });
    
    textSizeSlider.addEventListener('change', (e) => {
      settingsApp.updateSetting('textSize', parseInt(e.target.value));
      showNotification(`Text size: ${e.target.value}%`);
    });
  }

  if (iconSizeSlider) {
    iconSizeSlider.addEventListener('input', (e) => {
      content.querySelector('#iconSizeValue').textContent = e.target.value + '%';
    });
    
    iconSizeSlider.addEventListener('change', (e) => {
      settingsApp.updateSetting('iconSize', parseInt(e.target.value));
      showNotification(`Icon size: ${e.target.value}%`);
    });
  }

  // Store settings instance
  settingsWindow.settingsApp = settingsApp;
}

function resetSettings() {
  if (confirm('Reset all accessibility settings to defaults?')) {
    localStorage.removeItem('accessibilitySettings');
    const settingsWindow = document.getElementById('settingsWindow');
    settingsWindow.dataset.initialized = '';
    initSettings();
    showNotification('Settings reset to defaults');
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'settings-notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Add keyboard shortcut for BSOD (Ctrl+Shift+B)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'B') {
    showBSOD();
  }
  
  // Ctrl+Shift+S for Settings
  if (e.ctrlKey && e.shiftKey && e.key === 'S') {
    e.preventDefault();
    const settingsWindow = document.getElementById('settingsWindow');
    if (settingsWindow) {
      settingsWindow.style.display = 'block';
      if (!settingsWindow.dataset.initialized) {
        initSettings();
        settingsWindow.dataset.initialized = 'true';
      }
    }
  }
  
  // Alt+F4 to close active window
  if (e.altKey && e.key === 'F4') {
    e.preventDefault();
    const activeWindow = document.querySelector('.window[style*="display: block"]');
    if (activeWindow) {
      activeWindow.style.display = 'none';
    }
  }
  
  // Ctrl+ Plus/Minus for text size
  if (e.ctrlKey && (e.key === '+' || e.key === '=')) {
    e.preventDefault();
    const settingsApp = new Settings();
    const newSize = Math.min(200, settingsApp.settings.textSize + 10);
    settingsApp.updateSetting('textSize', newSize);
    showNotification(`Text size: ${newSize}%`);
  }
  
  if (e.ctrlKey && e.key === '-') {
    e.preventDefault();
    const settingsApp = new Settings();
    const newSize = Math.max(75, settingsApp.settings.textSize - 10);
    settingsApp.updateSetting('textSize', newSize);
    showNotification(`Text size: ${newSize}%`);
  }
  
  if (e.ctrlKey && e.key === '0') {
    e.preventDefault();
    const settingsApp = new Settings();
    settingsApp.updateSetting('textSize', 100);
    showNotification('Text size reset to 100%');
  }
});

// Initialize on page load and show keyboard shortcuts by default
document.addEventListener('DOMContentLoaded', () => {
  const settings = new Settings();
  
  // Open keyboard shortcuts guide on first visit
  if (!sessionStorage.getItem('shortcutsShown')) {
    setTimeout(() => {
      const settingsWindow = document.getElementById('settingsWindow');
      if (settingsWindow) {
        settingsWindow.style.display = 'block';
        if (!settingsWindow.dataset.initialized) {
          initSettings();
          settingsWindow.dataset.initialized = 'true';
        }
        // Switch to shortcuts tab
        setTimeout(() => {
          const shortcutsTab = settingsWindow.querySelector('[data-tab="shortcuts"]');
          if (shortcutsTab) {
            shortcutsTab.click();
          }
        }, 100);
      }
      sessionStorage.setItem('shortcutsShown', 'true');
    }, 1000);
  }
});
