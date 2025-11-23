// SETTINGS APPLICATION: MAIN CLASS
// Manages all accessibility and display settings for the portfolio
// Features:
// - High contrast mode for better visibility
// - Adjustable text and icon sizes
// - Reduced motion for users sensitive to animations
// - Screen reader support with ARIA labels
// - Keyboard navigation enhancements
// Settings are persisted in localStorage
class Settings {
  constructor() {
    this.settings = this.loadSettings();
    this.applySettings();
  }

  // Load settings from localStorage or use defaults
  // Merges saved settings with default values to handle new settings
  loadSettings() {
    const defaults = {
      theme: 'default', // default, dark, highContrast, highContrastLight
      highContrast: false,
      darkMode: false,
      textSize: 100,
      iconSize: 100,
      reducedMotion: false,
      screenReader: true,
      keyboardNav: true,
      focusIndicator: false,
      disableTransparency: false,
      cursorSize: 'normal', // normal, large, xl
      readingMode: false,
      colorBlindMode: 'none', // none, deuteranopia, protanopia, tritanopia
      rtlMode: false, // Right-to-left text direction
      backgroundColor: '#42477a', // Desktop background color
      previousBackgroundColor: null // Previous background color
    };
    
    const saved = localStorage.getItem('accessibilitySettings');
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  }

  // Save current settings to localStorage and apply them to the UI
  // Called whenever a setting is changed
  saveSettings() {
    localStorage.setItem('accessibilitySettings', JSON.stringify(this.settings));
    this.applySettings();
  }

  // Apply all settings to the document
  // Modifies CSS classes, styles, and DOM attributes based on settings
  applySettings() {
    const root = document.documentElement;
    
    // Remove all theme classes first
    root.classList.remove('high-contrast', 'high-contrast-light', 'dark-mode', 'theme-default');
    
    // Apply theme
    if (this.settings.theme === 'highContrast' || this.settings.highContrast) {
      root.classList.add('high-contrast');
      this.settings.theme = 'highContrast';
    } else if (this.settings.theme === 'highContrastLight') {
      root.classList.add('high-contrast-light');
      this.settings.theme = 'highContrastLight';
    } else if (this.settings.theme === 'dark' || this.settings.darkMode) {
      root.classList.add('dark-mode');
      this.settings.theme = 'dark';
    } else {
      root.classList.add('theme-default');
      this.settings.theme = 'default';
    }

    // Text Size - Scales all text using CSS zoom
    const zoomValue = this.settings.textSize / 100;
    document.body.style.zoom = zoomValue;

    // Icon Size - Dynamically resizes all desktop icons
    document.querySelectorAll('.icon img').forEach(img => {
      const baseSize = 32;
      const newSize = (baseSize * this.settings.iconSize / 100);
      img.style.width = newSize + 'px';
      img.style.height = newSize + 'px';
    });

    // Reduced Motion - Disables animations for accessibility
    if (this.settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Keyboard Navigation Indicators - Shows visible focus outline
    if (this.settings.focusIndicator) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }

    // Screen Reader Announcements - Enables ARIA support
    if (this.settings.screenReader) {
      this.enableScreenReaderMode();
    }

    // Disable Transparency - Removes transparency effects
    if (this.settings.disableTransparency) {
      root.classList.add('no-transparency');
    } else {
      root.classList.remove('no-transparency');
    }

    // Cursor Size - Enlarges mouse cursor
    root.classList.remove('cursor-large', 'cursor-xl');
    if (this.settings.cursorSize === 'large') {
      root.classList.add('cursor-large');
    } else if (this.settings.cursorSize === 'xl') {
      root.classList.add('cursor-xl');
    }

    // Reading Mode - Simplified layout with better spacing
    if (this.settings.readingMode) {
      root.classList.add('reading-mode');
    } else {
      root.classList.remove('reading-mode');
    }

    // Color Blind Modes - Apply color filters
    root.classList.remove('deuteranopia', 'protanopia', 'tritanopia');
    if (this.settings.colorBlindMode !== 'none') {
      root.classList.add(this.settings.colorBlindMode);
    }

    // RTL Mode - Right-to-left text direction
    if (this.settings.rtlMode) {
      root.setAttribute('dir', 'rtl');
      document.body.classList.add('rtl-mode');
    } else {
      root.setAttribute('dir', 'ltr');
      document.body.classList.remove('rtl-mode');
    }

    // Background Color - Custom desktop background
    if (this.settings.backgroundColor) {
      document.querySelector('.desktop').style.backgroundColor = this.settings.backgroundColor;
    }
  }

  // Enable screen reader support by adding ARIA attributes
  // Adds role, tabindex, and aria-modal attributes to interactive elements
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

  // Update a single setting and save to localStorage
  // Key: setting name (e.g., 'highContrast')
  // Value: new value for the setting
  updateSetting(key, value) {
    this.settings[key] = value;
    this.saveSettings();
  }
}

// SETTINGS WINDOW: UI INITIALIZATION
// Initialize the settings window with tabs and controls
// Creates a multi-tab interface for accessibility options, keyboard shortcuts, display, and about info
function initSettings() {
  const settingsWindow = document.getElementById('settingsWindow');
  if (settingsWindow.dataset.initialized) return;
  settingsWindow.dataset.initialized = 'true';

  const settingsApp = new Settings();
  const content = document.getElementById('settingsContent');
  
  if (!content) return;

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
              <div class="setting-name">Text Size</div>
              <select id="textSize" class="setting-select">
                <option value="75" ${settingsApp.settings.textSize === 75 ? 'selected' : ''}>75% - Small</option>
                <option value="85" ${settingsApp.settings.textSize === 85 ? 'selected' : ''}>85%</option>
                <option value="100" ${settingsApp.settings.textSize === 100 ? 'selected' : ''}>100% - Normal</option>
                <option value="110" ${settingsApp.settings.textSize === 110 ? 'selected' : ''}>110%</option>
                <option value="125" ${settingsApp.settings.textSize === 125 ? 'selected' : ''}>125% - Large</option>
                <option value="150" ${settingsApp.settings.textSize === 150 ? 'selected' : ''}>150% - Extra Large</option>
                <option value="175" ${settingsApp.settings.textSize === 175 ? 'selected' : ''}>175%</option>
                <option value="200" ${settingsApp.settings.textSize === 200 ? 'selected' : ''}>200% - Huge</option>
              </select>
              <p class="setting-desc">Adjust text size across the entire site</p>
            </div>

            <div class="setting-item">
              <div class="setting-name">Icon Size</div>
              <select id="iconSize" class="setting-select">
                <option value="50" ${settingsApp.settings.iconSize === 50 ? 'selected' : ''}>50% - Tiny</option>
                <option value="75" ${settingsApp.settings.iconSize === 75 ? 'selected' : ''}>75% - Small</option>
                <option value="100" ${settingsApp.settings.iconSize === 100 ? 'selected' : ''}>100% - Normal</option>
                <option value="125" ${settingsApp.settings.iconSize === 125 ? 'selected' : ''}>125% - Large</option>
                <option value="150" ${settingsApp.settings.iconSize === 150 ? 'selected' : ''}>150% - Extra Large</option>
              </select>
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
              <div class="shortcut-item">
                <span class="shortcut-key">Ctrl + Z</span>
                <span class="shortcut-desc">Undo changes (in Paint and other apps)</span>
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
              <div class="setting-name">Color Theme</div>
              <select id="themeSelect" class="setting-select">
                <option value="default" ${settingsApp.settings.theme === 'default' ? 'selected' : ''}>Windows 2000 Classic</option>
                <option value="dark" ${settingsApp.settings.theme === 'dark' ? 'selected' : ''}>Dark Mode</option>
                <option value="highContrast" ${settingsApp.settings.theme === 'highContrast' ? 'selected' : ''}>High Contrast (Dark)</option>
                <option value="highContrastLight" ${settingsApp.settings.theme === 'highContrastLight' ? 'selected' : ''}>High Contrast (Light)</option>
              </select>
              <p class="setting-desc">Choose your preferred color theme</p>
            </div>
          </div>

          <div class="settings-section">
            <h3>Visual Effects</h3>
            <div class="setting-item">
              <label>
                <input type="checkbox" id="disableTransparency" ${settingsApp.settings.disableTransparency ? 'checked' : ''}>
                <span>Disable Transparency</span>
              </label>
              <p class="setting-desc">Remove transparency effects for better contrast</p>
            </div>
            <div class="setting-item">
              <label>
                <input type="checkbox" id="readingMode" ${settingsApp.settings.readingMode ? 'checked' : ''}>
                <span>Reading Mode</span>
              </label>
              <p class="setting-desc">Simplified layout with increased spacing and margins</p>
            </div>
            <div class="setting-item">
              <label>
                <input type="checkbox" id="rtlMode" ${settingsApp.settings.rtlMode ? 'checked' : ''}>
                <span>Right-to-Left (RTL)</span>
              </label>
              <p class="setting-desc">Enable right-to-left text direction for RTL languages</p>
            </div>
          </div>

          <div class="settings-section">
            <h3>Cursor Size</h3>
            <div class="setting-item">
              <div class="setting-name">Mouse Cursor</div>
              <select id="cursorSizeSelect" class="setting-select">
                <option value="normal" ${settingsApp.settings.cursorSize === 'normal' ? 'selected' : ''}>Normal</option>
                <option value="large" ${settingsApp.settings.cursorSize === 'large' ? 'selected' : ''}>Large</option>
                <option value="xl" ${settingsApp.settings.cursorSize === 'xl' ? 'selected' : ''}>Extra Large</option>
              </select>
              <p class="setting-desc">Enlarge the mouse cursor for better visibility</p>
            </div>
          </div>

          <div class="settings-section">
            <h3>Color Blind Mode</h3>
            <div class="setting-item">
              <div class="setting-name">Color Filter</div>
              <select id="colorBlindModeSelect" class="setting-select">
                <option value="none" ${settingsApp.settings.colorBlindMode === 'none' ? 'selected' : ''}>None</option>
                <option value="deuteranopia" ${settingsApp.settings.colorBlindMode === 'deuteranopia' ? 'selected' : ''}>Deuteranopia (Red-Green)</option>
                <option value="protanopia" ${settingsApp.settings.colorBlindMode === 'protanopia' ? 'selected' : ''}>Protanopia (Red-Blind)</option>
                <option value="tritanopia" ${settingsApp.settings.colorBlindMode === 'tritanopia' ? 'selected' : ''}>Tritanopia (Blue-Yellow)</option>
              </select>
              <p class="setting-desc">Apply color filters for color blindness accessibility</p>
            </div>
          </div>

          <div class="settings-section">
            <h3>Background Color</h3>
            <div class="setting-item">
              <div class="setting-name">Desktop Background</div>
              <div style="display: flex; gap: 10px; align-items: center; margin: 10px 0;">
                <input type="color" id="backgroundColorPicker" value="${settingsApp.settings.backgroundColor}" style="width: 60px; height: 30px; cursor: pointer; border: 2px inset #808080;">
                <button id="resetBackgroundColor" class="win-button" style="padding: 4px 12px;">Reset to Default</button>
                ${settingsApp.settings.previousBackgroundColor ? `<button id="usePreviousColor" class="win-button" style="padding: 4px 12px; background: ${settingsApp.settings.previousBackgroundColor};" title="Previous: ${settingsApp.settings.previousBackgroundColor}">Use Previous</button>` : ''}
              </div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;">
                <button class="color-preset" data-color="#42477a" style="width: 40px; height: 40px; background: #42477a; border: 2px outset #fff; cursor: pointer;" title="Slate Blue (Default)"></button>
                <button class="color-preset" data-color="#008080" style="width: 40px; height: 40px; background: #008080; border: 2px outset #fff; cursor: pointer;" title="Teal"></button>
                <button class="color-preset" data-color="#000080" style="width: 40px; height: 40px; background: #000080; border: 2px outset #fff; cursor: pointer;" title="Navy Blue"></button>
                <button class="color-preset" data-color="#800000" style="width: 40px; height: 40px; background: #800000; border: 2px outset #fff; cursor: pointer;" title="Maroon"></button>
                <button class="color-preset" data-color="#008000" style="width: 40px; height: 40px; background: #008000; border: 2px outset #fff; cursor: pointer;" title="Green"></button>
                <button class="color-preset" data-color="#808080" style="width: 40px; height: 40px; background: #808080; border: 2px outset #fff; cursor: pointer;" title="Gray"></button>
                <button class="color-preset" data-color="#800080" style="width: 40px; height: 40px; background: #800080; border: 2px outset #fff; cursor: pointer;" title="Purple"></button>
                <button class="color-preset" data-color="#000000" style="width: 40px; height: 40px; background: #000000; border: 2px outset #fff; cursor: pointer;" title="Black"></button>
              </div>
              <p class="setting-desc">Choose a custom color for your desktop background</p>
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
      
      // If high contrast is unchecked, reset theme to default
      if (e.target.id === 'highContrast' && !e.target.checked) {
        settingsApp.settings.theme = 'default';
        const themeSelect = content.querySelector('#themeSelect');
        if (themeSelect) {
          themeSelect.value = 'default';
        }
        settingsApp.applySettings();
        settingsApp.saveSettings();
      }
      
      // Apply settings immediately for visual changes
      settingsApp.applySettings();
      
      // Show confirmation
      showNotification(`Setting updated: ${e.target.nextElementSibling.textContent}`);
    });
  });

  // Range slider handlers
  const textSizeSelect = content.querySelector('#textSize');
  const iconSizeSelect = content.querySelector('#iconSize');
  const themeSelect = content.querySelector('#themeSelect');

  if (textSizeSelect) {
    textSizeSelect.value = settingsApp.settings.textSize;
    textSizeSelect.addEventListener('change', (e) => {
      settingsApp.settings.textSize = parseInt(e.target.value);
      settingsApp.applySettings();
      settingsApp.saveSettings();
      showNotification('Text size: ' + e.target.options[e.target.selectedIndex].text);
    });
  }

  if (iconSizeSelect) {
    iconSizeSelect.value = settingsApp.settings.iconSize;
    iconSizeSelect.addEventListener('change', (e) => {
      settingsApp.settings.iconSize = parseInt(e.target.value);
      settingsApp.applySettings();
      settingsApp.saveSettings();
      showNotification('Icon size: ' + e.target.options[e.target.selectedIndex].text);
    });
  }

  // Theme selector
  if (themeSelect) {
    themeSelect.value = settingsApp.settings.theme;
    themeSelect.addEventListener('change', (e) => {
      settingsApp.settings.theme = e.target.value;
      settingsApp.settings.highContrast = e.target.value === 'highContrast';
      settingsApp.settings.darkMode = e.target.value === 'dark';
      settingsApp.applySettings();
      settingsApp.saveSettings();
      showNotification('Theme changed to ' + e.target.options[e.target.selectedIndex].text);
    });
  }

  // Cursor size selector
  const cursorSizeSelect = content.querySelector('#cursorSizeSelect');
  if (cursorSizeSelect) {
    cursorSizeSelect.value = settingsApp.settings.cursorSize;
    cursorSizeSelect.addEventListener('change', (e) => {
      settingsApp.settings.cursorSize = e.target.value;
      settingsApp.applySettings();
      settingsApp.saveSettings();
      showNotification('Cursor size: ' + e.target.options[e.target.selectedIndex].text);
    });
  }

  // Color blind mode selector
  const colorBlindModeSelect = content.querySelector('#colorBlindModeSelect');
  if (colorBlindModeSelect) {
    colorBlindModeSelect.value = settingsApp.settings.colorBlindMode;
    colorBlindModeSelect.addEventListener('change', (e) => {
      settingsApp.settings.colorBlindMode = e.target.value;
      settingsApp.applySettings();
      settingsApp.saveSettings();
      showNotification('Color filter: ' + e.target.options[e.target.selectedIndex].text);
    });
  }

  // Background color picker
  const backgroundColorPicker = content.querySelector('#backgroundColorPicker');
  if (backgroundColorPicker) {
    backgroundColorPicker.addEventListener('input', (e) => {
      // Save current color as previous before changing
      if (settingsApp.settings.backgroundColor !== e.target.value) {
        settingsApp.settings.previousBackgroundColor = settingsApp.settings.backgroundColor;
      }
      settingsApp.settings.backgroundColor = e.target.value;
      settingsApp.applySettings();
      settingsApp.saveSettings();
    });
    backgroundColorPicker.addEventListener('change', (e) => {
      showNotification('Background color changed');
    });
  }

  // Reset background color button
  const resetBackgroundBtn = content.querySelector('#resetBackgroundColor');
  if (resetBackgroundBtn) {
    resetBackgroundBtn.addEventListener('click', () => {
      settingsApp.settings.backgroundColor = '#42477a';
      settingsApp.applySettings();
      settingsApp.saveSettings();
      if (backgroundColorPicker) {
        backgroundColorPicker.value = '#42477a';
      }
      showNotification('Background color reset to default');
    });
  }

  // Color preset buttons
  content.querySelectorAll('.color-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.color;
      settingsApp.settings.backgroundColor = color;
      settingsApp.applySettings();
      settingsApp.saveSettings();
      if (backgroundColorPicker) {
        backgroundColorPicker.value = color;
      }
      showNotification('Background color changed');
    });
  });

  // Store settings instance
  settingsWindow.settingsApp = settingsApp;
}

// Reset all settings to default values
// Clears localStorage and reinitializes the settings window
function resetSettings() {
  if (confirm('Reset all accessibility settings to defaults?')) {
    localStorage.removeItem('accessibilitySettings');
    const settingsWindow = document.getElementById('settingsWindow');
    settingsWindow.dataset.initialized = '';
    initSettings();
    showNotification('Settings reset to defaults');
  }
}

// Display a temporary notification message
// Shows a toast-style notification that auto-dismisses after 2 seconds
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

// GLOBAL KEYBOARD SHORTCUTS
// Add global keyboard shortcuts for quick access to features
// Ctrl+Shift+B: Show BSOD easter egg
// Ctrl+Shift+S: Open settings
// Alt+F4: Close active window
// Ctrl+Plus/Minus: Adjust text size
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

// GLOBAL SETTINGS INSTANCE
// Initialize Settings instance globally for use across the application
const globalSettings = new Settings();
