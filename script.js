// WINDOW MANAGEMENT: DRAGGABLE FUNCTIONALITY
// Makes windows draggable by clicking and dragging the title bar
// Uses mouse events to track position and update window coordinates
// Constrains windows to stay within browser viewport boundaries
function makeDraggable(el) {
  let isDragging = false, offsetX, offsetY;
  const title = el.querySelector('.title-bar');

  title.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    el.style.zIndex = 1000;
  });

  document.addEventListener('mouseup', () => isDragging = false);

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      // Calculate new position
      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;
      
      // Get window dimensions
      const windowWidth = el.offsetWidth;
      const windowHeight = el.offsetHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Constrain to viewport boundaries
      // Minimum: keep at least 50px of title bar visible
      newLeft = Math.max(0, Math.min(newLeft, viewportWidth - Math.min(windowWidth, 50)));
      newTop = Math.max(0, Math.min(newTop, viewportHeight - 50));
      
      el.style.left = newLeft + 'px';
      el.style.top = newTop + 'px';
    }
  });
}

// APPLICATION INITIALIZATION
// Initialize all event listeners and functionality when DOM is fully loaded
// This is the main entry point for the application
document.addEventListener('DOMContentLoaded', () => {
  initializeWindows();
  initializeIcons();
  initializeStartMenu();
  initializeClock();
  initializeDateTimePanel();
  initializeRecycleBin();
  initializeKeyboardShortcuts();
});

// KEYBOARD SHORTCUTS
// Initialize keyboard shortcuts for accessibility and power users
// Delete key moves focused items to recycle bin
// Escape closes windows and menus
// Tab and arrow keys for navigation
function initializeKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Delete key - move focused item to recycle bin
    if (e.key === 'Delete') {
      const focusedIcon = document.activeElement;
      if (focusedIcon && focusedIcon.classList.contains('icon') && !focusedIcon.classList.contains('recycle-bin-icon')) {
        if (confirm(`Move "${focusedIcon.querySelector('span').textContent}" to Recycle Bin?`)) {
          moveToRecycleBin(focusedIcon);
        }
      }
    }
    
    // Arrow key navigation for icons
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      const focusedElement = document.activeElement;
      if (focusedElement && focusedElement.classList.contains('icon')) {
        e.preventDefault();
        const icons = Array.from(document.querySelectorAll('.icon'));
        const currentIndex = icons.indexOf(focusedElement);
        let newIndex = currentIndex;
        
        const columns = 4;
        
        if (e.key === 'ArrowRight') {
          newIndex = Math.min(currentIndex + 1, icons.length - 1);
        } else if (e.key === 'ArrowLeft') {
          newIndex = Math.max(currentIndex - 1, 0);
        } else if (e.key === 'ArrowDown') {
          newIndex = Math.min(currentIndex + columns, icons.length - 1);
        } else if (e.key === 'ArrowUp') {
          newIndex = Math.max(currentIndex - columns, 0);
        }
        
        if (newIndex !== currentIndex && icons[newIndex]) {
          icons[newIndex].focus();
        }
      }
    }
    
    // Escape key - close active window or start menu
    if (e.key === 'Escape') {
      const startMenu = document.getElementById('startMenu');
      if (startMenu && startMenu.style.display === 'block') {
        startMenu.style.display = 'none';
        document.querySelector('.start-button').classList.remove('active');
        return;
      }
      
      // Close topmost visible window
      const windows = Array.from(document.querySelectorAll('.window')).filter(w => w.style.display !== 'none');
      if (windows.length > 0) {
        const topWindow = windows[windows.length - 1];
        topWindow.style.display = 'none';
      }
    }
    
    // Global shortcuts
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
      e.preventDefault();
      openWindow(document.getElementById('settingsWindow'));
    }
    
    if (e.ctrlKey && e.shiftKey && e.key === 'B') {
      e.preventDefault();
      showBSOD();
    }
  });
}

// RECYCLE BIN: INITIALIZATION
// Initialize recycle bin drag and drop functionality
// Sets up drop zones and loads previously deleted items from localStorage
function initializeRecycleBin() {
  const recycleBin = document.querySelector('.recycle-bin-icon');
  if (!recycleBin) return;
  
  recycleBin.addEventListener('dragover', (e) => {
    e.preventDefault();
    recycleBin.style.backgroundColor = 'rgba(0, 0, 139, 0.3)';
  });
  
  recycleBin.addEventListener('dragleave', () => {
    recycleBin.style.backgroundColor = '';
  });
  
  recycleBin.addEventListener('drop', (e) => {
    e.preventDefault();
    recycleBin.style.backgroundColor = '';
    // Handle drop if needed
  });
  
  // Load saved recycle bin state
  loadRecycleBinState();
}

// WINDOW CONTROLS: INITIALIZATION
// Initialize all window controls (close, minimize, maximize)
// Makes windows draggable and sets up button event handlers
function initializeWindows() {
  const windows = document.querySelectorAll('.window');
  windows.forEach(win => {
    makeDraggable(win);

    win.querySelector('.close').addEventListener('click', () => {
      win.style.display = 'none';
      removeFromTaskbar(win.id);
    });
    win.querySelector('.minimize').addEventListener('click', () => {
      win.style.display = 'none';
    });
    win.querySelector('.maximize').addEventListener('click', () => {
      if (win.classList.contains('maximized')) {
        // Restore
        win.classList.remove('maximized');
        win.style.width = win.dataset.originalWidth || '400px';
        win.style.height = win.dataset.originalHeight || 'auto';
        win.style.left = win.dataset.originalLeft || '100px';
        win.style.top = win.dataset.originalTop || '100px';
      } else {
        // Maximize
        win.dataset.originalWidth = win.style.width || '400px';
        win.dataset.originalHeight = win.style.height || 'auto';
        win.dataset.originalLeft = win.style.left || '100px';
        win.dataset.originalTop = win.style.top || '100px';
        
        win.classList.add('maximized');
        win.style.width = '100%';
        win.style.height = 'calc(100vh - 30px)';
        win.style.left = '0';
        win.style.top = '0';
      }
    });
  });
}

// DESKTOP ICONS: INITIALIZATION & INTERACTION
// Initialize desktop icon functionality including:
// - Drag and drop to move icons around the desktop
// - Double-click to open windows
// - Keyboard navigation (Enter/Space to activate)
// - Drag to recycle bin to delete
function initializeIcons() {
  const icons = document.querySelectorAll('.icon');
  const recycleBin = document.querySelector('.recycle-bin-icon');
  
  // Position icons in a 4-column grid on initial load
  const columns = 4;
  const iconWidth = 100;
  const iconHeight = 110;
  const gapX = 15;
  const gapY = 15;
  const startX = 20;
  const startY = 20;
  
  icons.forEach((icon, index) => {
    // Skip icons that already have saved positions OR are manually positioned
    if (icon.classList.contains('positioned') || (icon.style.left && icon.style.top)) {
      return;
    }
    
    const col = index % columns;
    const row = Math.floor(index / columns);
    const left = startX + (col * (iconWidth + gapX));
    const top = startY + (row * (iconHeight + gapY));
    
    icon.style.left = left + 'px';
    icon.style.top = top + 'px';
  });
  
  icons.forEach(icon => {
    let isDragging = false, offsetX, offsetY;

    icon.addEventListener('mousedown', (e) => {
      if (icon.classList.contains('recycle-bin-icon')) return; // Don't drag recycle bin
      isDragging = true;
      
      // Get offset from icon's current position
      offsetX = e.clientX - icon.offsetLeft;
      offsetY = e.clientY - icon.offsetTop;
      
      icon.style.zIndex = 1000;
      icon.classList.add('dragging');
      icon.classList.add('positioned');
    });

    document.addEventListener('mouseup', (e) => {
      if (isDragging) {
        // Check if dropped on recycle bin
        if (recycleBin && isOverElement(e, recycleBin) && !icon.classList.contains('recycle-bin-icon')) {
          moveToRecycleBin(icon);
        }
        // Icon stays where dropped (already absolutely positioned)
      }
      isDragging = false;
      icon.style.zIndex = '';
      icon.classList.remove('dragging');
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        icon.style.left = e.clientX - offsetX + 'px';
        icon.style.top = e.clientY - offsetY + 'px';
        
        // Highlight recycle bin when hovering over it
        if (recycleBin && isOverElement(e, recycleBin)) {
          recycleBin.style.backgroundColor = 'rgba(0, 0, 139, 0.3)';
        } else if (recycleBin) {
          recycleBin.style.backgroundColor = '';
        }
      }
    });

    // Shared function to open window from icon
    // Handles both double-click and keyboard activation (Enter/Space)
    // Initializes window content on first open for performance
    const openIconWindow = () => {
      const winId = icon.dataset.window;
      if (!winId) return;
      
      const win = document.getElementById(winId);
      win.style.display = 'block';
      addToTaskbar(winId, icon.querySelector('span').textContent);
      
      // Initialize portfolio windows
      if (winId === 'aboutWindow' && !win.dataset.initialized) {
        initAboutMe(document.getElementById('aboutContent'));
        win.dataset.initialized = 'true';
      } else if (winId === 'contactWindow' && !win.dataset.initialized) {
        initContactForm(document.getElementById('contactContent'));
        win.dataset.initialized = 'true';
      } else if (winId === 'msnWindow' && !win.dataset.initialized) {
        initMSNWidget(document.getElementById('msnContent'));
        win.dataset.initialized = 'true';
      } else if (winId === 'paintWindow' && !win.dataset.initialized) {
        new Paint(document.getElementById('paintContent'));
        win.dataset.initialized = 'true';
      } else if (winId === 'projectsWindow' && !win.dataset.initialized) {
        initProjectsFolder(document.getElementById('projectsContent'));
        win.dataset.initialized = 'true';
      } else if (winId === 'settingsWindow' && !win.dataset.initialized) {
        initSettings();
        win.dataset.initialized = 'true';
      }
    };

    icon.addEventListener('dblclick', openIconWindow);

    // Keyboard support (Enter or Space)
    icon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openIconWindow();
      }
    });
  });
  
  // Focus first icon on load for immediate keyboard navigation
  if (icons.length > 0) {
    icons[0].focus();
  }
}

// START MENU: INITIALIZATION & INTERACTION
// Initialize Windows 2000 style start menu
// Handles button clicks, keyboard navigation, and menu item actions
function initializeStartMenu() {
  const startButton = document.querySelector('.start-button');
  const startMenu = document.getElementById('startMenu');
  
  const toggleStartMenu = () => {
    const isOpen = startMenu.style.display === 'block';
    startMenu.style.display = isOpen ? 'none' : 'block';
    startButton.setAttribute('aria-expanded', !isOpen);
    
    if (isOpen) {
      startButton.classList.remove('active');
    } else {
      startButton.classList.add('active');
    }
  };

  startButton.addEventListener('click', toggleStartMenu);

  // Keyboard support for start button
  startButton.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && startMenu.style.display === 'block') {
      toggleStartMenu();
    }
  });

  // Close start menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
      startMenu.style.display = 'none';
      startButton.classList.remove('active');
    }
  });

  // Start menu game items click handlers
  const gameMenuItems = document.querySelectorAll('.start-menu li[data-window]');
  gameMenuItems.forEach(item => {
    item.addEventListener('click', () => {
      const winId = item.dataset.window;
      const win = document.getElementById(winId);
      if (win) {
        win.style.display = 'block';
        addToTaskbar(winId, item.textContent);
        startMenu.style.display = 'none';
        startButton.classList.remove('active');
        
        // Initialize games when opened
        if (winId === 'minesweeperWindow' && !win.dataset.initialized) {
          const container = document.getElementById('minesweeperGame');
          new Minesweeper(container);
          win.dataset.initialized = 'true';
        } else if (winId === 'solitaireWindow' && !win.dataset.initialized) {
          const container = document.getElementById('solitaireGame');
          new Solitaire(container);
          win.dataset.initialized = 'true';
        } else if (winId === 'settingsWindow' && !win.dataset.initialized) {
          initSettings();
          win.dataset.initialized = 'true';
        }
      }
    });
  });
}

// MEDIA PLAYBACK: VIDEO PLAYER
// Play video in the media player window
// Supports both YouTube URLs (converted to embeds) and direct video files
function playVideo(url) {
  // Open media player window
  const mediaWindow = document.getElementById('mediaPlayerWindow');
  const video = document.getElementById('mediaVideo');
  
  if (mediaWindow && video) {
    // Show the window
    mediaWindow.style.display = 'block';
    bringToFront(mediaWindow);
    addToTaskbar('mediaPlayerWindow', 'Media Player');
    
    // Check if it's a YouTube URL
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // Convert YouTube watch URL to embed URL
      let embedUrl = url;
      if (url.includes('watch?v=')) {
        const videoId = url.split('watch?v=')[1].split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      
      // For YouTube, we'll need to embed it differently
      video.style.display = 'none';
      const mediaScreen = document.querySelector('.media-logo');
      let iframe = mediaScreen.querySelector('iframe');
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '200px';
        iframe.style.border = 'none';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.setAttribute('allowfullscreen', '');
        mediaScreen.appendChild(iframe);
      }
      iframe.src = embedUrl;
      iframe.style.display = 'block';
      
      // Update info
      document.getElementById('mediaClip').textContent = 'Never Gonna Give You Up';
      document.getElementById('mediaAuthor').textContent = 'Rick Astley';
      document.getElementById('mediaCopyright').textContent = '© 1987';
    } else {
      // Regular video file
      const iframe = document.querySelector('.media-logo iframe');
      if (iframe) iframe.style.display = 'none';
      video.style.display = 'block';
      video.src = url;
      video.load();
      
      if (typeof mediaPlayer !== 'undefined' && mediaPlayer.play) {
        mediaPlayer.hideLogo();
        mediaPlayer.play();
      }
      
      // Update info
      const fileName = url.split('/').pop();
      document.getElementById('mediaClip').textContent = fileName;
      document.getElementById('mediaAuthor').textContent = '';
        document.getElementById('mediaCopyright').textContent = '';
      }
    }
  }

// WINDOW Z-INDEX MANAGEMENT
// Bring a window to the front by adjusting z-index
// Resets all other windows to background layer
function bringToFront(window) {
  const allWindows = document.querySelectorAll('.window');
  allWindows.forEach(w => w.style.zIndex = '1');
  window.style.zIndex = '1000';
}

// Update taskbar
function updateTaskbar() {
  // Function to update taskbar state if needed
}

// TASKBAR: WINDOW MANAGEMENT
// Add a window to the taskbar when opened
// Creates a clickable taskbar button to restore the window
function addToTaskbar(id, name) {
  const taskbarItems = document.querySelector('.taskbar-items');
  if (!document.querySelector(`#task-${id}`)) {
    const span = document.createElement('span');
    span.id = `task-${id}`;
    span.textContent = name;
    span.addEventListener('click', () => {
      const win = document.getElementById(id);
      win.style.display = 'block';
    });
    taskbarItems.appendChild(span);
  }
}

function removeFromTaskbar(id) {
  const span = document.querySelector(`#task-${id}`);
  if (span) span.remove();
}

// TASKBAR CLOCK: REAL-TIME DISPLAY
// Initialize and update the taskbar clock every second
// Displays current time in 12-hour format
function initializeClock() {
  function updateClock() {
    const clock = document.getElementById('clock');
    const now = new Date();
    clock.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }
  setInterval(updateClock, 1000);
  updateClock();
}

// DATE/TIME PANEL: DETAILED TIME DISPLAY
// Initialize the detailed date/time panel that appears when clicking the clock
// Shows analog clock, digital time, and calendar
function initializeDateTimePanel() {
  const datetimePanel = document.getElementById('datetimePanel');
  const clockElement = document.getElementById('clock');

  clockElement.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = datetimePanel.style.display === 'block';
    datetimePanel.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
      updateDateTime();
      drawAnalogClock();
    }
  });

  // Close panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!datetimePanel.contains(e.target) && e.target !== clockElement) {
      datetimePanel.style.display = 'none';
    }
  });

  // Update analog clock every second when panel is open
  setInterval(() => {
    if (datetimePanel.style.display === 'block') {
      drawAnalogClock();
      updateDateTime();
    }
  }, 1000);

  // IE address bar - navigate on Enter key
  const addressBar = document.getElementById('ieAddressBar');
  if (addressBar) {
    addressBar.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        navigateIE();
      }
    });
  }
}

// CALENDAR GENERATION
// Generate a monthly calendar view showing current date highlighted
// Creates a table with day headers and properly aligned dates
function generateCalendar() {
  const calendar = document.getElementById('calendar');
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  let html = '<table><tr>';
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  days.forEach(day => html += `<th>${day}</th>`);
  html += '</tr><tr>';
  
  for (let i = 0; i < firstDay; i++) {
    html += '<td></td>';
  }
  
  let day = 1;
  for (let i = firstDay; day <= daysInMonth; i++) {
    if (i % 7 === 0 && i !== 0) {
      html += '</tr><tr>';
    }
    const isToday = day === today ? ' class="today"' : '';
    html += `<td${isToday}>${day}</td>`;
    day++;
  }
  
  while (html.split('<td').length - 1 < 42) {
    html += '<td></td>';
  }
  
  html += '</tr></table>';
  if (calendar) {
    calendar.innerHTML = html;
  }
}

// ANALOG CLOCK RENDERING
// Draw an analog clock on canvas with hour and minute hands
// Updates every second to show current time
function drawAnalogClock() {
  const canvas = document.getElementById('analogClock');
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 70;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw clock face
  ctx.fillStyle = '#c0c0c0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw outer circle with dots
  ctx.strokeStyle = '#00aaaa';
  ctx.lineWidth = 2;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Draw hour markers
  ctx.fillStyle = '#808080';
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 - 90) * Math.PI / 180;
    const x = centerX + Math.cos(angle) * (radius - 10);
    const y = centerY + Math.sin(angle) * (radius - 10);
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  // Draw hour hand
  const hourAngle = ((hours + minutes / 60) * 30 - 90) * Math.PI / 180;
  ctx.strokeStyle = '#004040';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + Math.cos(hourAngle) * (radius - 40), centerY + Math.sin(hourAngle) * (radius - 40));
  ctx.stroke();
  
  // Draw minute hand
  const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * Math.PI / 180;
  ctx.strokeStyle = '#00aaaa';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + Math.cos(minuteAngle) * (radius - 20), centerY + Math.sin(minuteAngle) * (radius - 20));
  ctx.stroke();
  
  // Draw center dot
  ctx.fillStyle = '#004040';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
  ctx.fill();
}

// Update digital time
function updateDateTime() {
  const now = new Date();
  const digitalTime = document.getElementById('digitalTime');
  digitalTime.textContent = now.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', second:'2-digit', hour12: true});
  generateCalendar();
}

// IE Navigation function
function navigateIE() {
  const addressBar = document.getElementById('ieAddressBar');
  const iframe = document.getElementById('ieFrame');
  let url = addressBar.value.trim();
  
  // Add https:// if no protocol specified
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  iframe.src = url;
}

// MY COMPUTER: EXPLORER FUNCTIONS
// Navigate to system information in the Settings window
function openSystemInfo() {
  const settingsWindow = document.getElementById('settingsWindow');
  const aboutTab = document.querySelector('[data-tab="about"]');
  
  if (settingsWindow && aboutTab) {
    settingsWindow.style.display = 'block';
    bringToFront(settingsWindow);
    updateTaskbar(settingsWindow);
    
    // Click the About tab
    aboutTab.click();
  }
}

function openSettings() {
  const settingsWindow = document.getElementById('settingsWindow');
  
  if (settingsWindow) {
    settingsWindow.style.display = 'block';
    bringToFront(settingsWindow);
    updateTaskbar(settingsWindow);
  }
}

// Generic function to open any window by ID
// Initializes window content on first open
// Adds window to taskbar
function openWindow(windowId) {
  const win = document.getElementById(windowId);
  
  if (!win) return;
  
  win.style.display = 'block';
  
  // Get the window title from the title bar
  const titleElement = win.querySelector('.title');
  const windowTitle = titleElement ? titleElement.textContent : windowId;
  addToTaskbar(windowId, windowTitle);
  
  // Initialize windows that need it
  if (windowId === 'aboutWindow' && !win.dataset.initialized) {
    initAboutMe(document.getElementById('aboutContent'));
    win.dataset.initialized = 'true';
  } else if (windowId === 'contactWindow' && !win.dataset.initialized) {
    initContactForm(document.getElementById('contactContent'));
    win.dataset.initialized = 'true';
  } else if (windowId === 'msnWindow' && !win.dataset.initialized) {
    initMSNWidget(document.getElementById('msnContent'));
    win.dataset.initialized = 'true';
  } else if (windowId === 'paintWindow' && !win.dataset.initialized) {
    new Paint(document.getElementById('paintContent'));
    win.dataset.initialized = 'true';
  } else if (windowId === 'projectsWindow' && !win.dataset.initialized) {
    initProjectsFolder(document.getElementById('projectsContent'));
    win.dataset.initialized = 'true';
  } else if (windowId === 'settingsWindow' && !win.dataset.initialized) {
    initSettings();
    win.dataset.initialized = 'true';
  } else if (windowId === 'musicPlayerWindow' && !win.dataset.initialized) {
    initMusicPlayer();
    win.dataset.initialized = 'true';
  }
}

// MUSIC PLAYER: AUDIO PLAYBACK
// Initialize the music player with playback controls
// Supports play/pause, seek, and volume control
function initMusicPlayer() {
  const audio = document.getElementById('musicAudio');
  const playBtn = document.getElementById('musicPlayBtn');
  const seekbar = document.getElementById('musicSeekbar');
  const volumeSlider = document.getElementById('musicVolume');
  const currentTimeDisplay = document.getElementById('musicCurrentTime');
  const durationDisplay = document.getElementById('musicDuration');

  let isPlaying = false;

  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      playBtn.textContent = '▶';
      playBtn.title = 'Play';
      isPlaying = false;
    } else {
      // For demo purposes, you can set a sample audio URL here
      if (!audio.src) {
        audio.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
        document.getElementById('musicTitle').textContent = 'Sample Track';
        document.getElementById('musicArtist').textContent = 'Demo Artist';
      }
      audio.play();
      playBtn.textContent = '⏸';
      playBtn.title = 'Pause';
      isPlaying = true;
    }
  });

  // Update seekbar as audio plays
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      seekbar.value = (audio.currentTime / audio.duration) * 100;
      currentTimeDisplay.textContent = formatTime(audio.currentTime);
      durationDisplay.textContent = formatTime(audio.duration);
    }
  });

  // Seek functionality
  seekbar.addEventListener('input', () => {
    if (audio.duration) {
      audio.currentTime = (seekbar.value / 100) * audio.duration;
    }
  });

  // Volume control
  volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value / 100;
  });

  // Format time helper
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Reset button when track ends
  audio.addEventListener('ended', () => {
    playBtn.textContent = '▶';
    playBtn.title = 'Play';
    isPlaying = false;
    seekbar.value = 0;
  });
}

// RECYCLE BIN: FULL FUNCTIONALITY
// Implements a complete recycle bin system similar to Windows:
// - Stores deleted items temporarily
// - Allows restoration of deleted items
// - Permanent deletion option
// - Persists state in localStorage
// - Drag and drop support

// Store deleted items in memory
let recycleBinItems = [];

// Load recycle bin state from localStorage on page load
// Restores previously deleted items so they persist across sessions
// Re-hides the original desktop icons that were in the recycle bin
function loadRecycleBinState() {
  const saved = localStorage.getItem('recycleBinItems');
  if (saved) {
    try {
      const savedItems = JSON.parse(saved);
      savedItems.forEach(item => {
        // Find the element by matching name and class
        const element = Array.from(document.querySelectorAll('.icon')).find(el => {
          const span = el.querySelector('span');
          return span && span.textContent === item.name;
        });
        
        if (element) {
          // Hide the element
          element.style.display = 'none';
          element.dataset.inRecycleBin = 'true';
          
          // Restore to recycleBinItems with the actual element reference
          recycleBinItems.push({
            ...item,
            originalElement: element
          });
        }
      });
      updateRecycleBinDisplay();
    } catch (e) {
      console.error('Error loading recycle bin state:', e);
    }
  }
}

// Save recycle bin state to localStorage
// Persists deleted items across browser sessions
// Only saves essential data (not DOM references)
function saveRecycleBinState() {
  const itemsToSave = recycleBinItems.map(item => ({
    id: item.id,
    position: item.position,
    name: item.name,
    icon: item.icon,
    isDesktopIcon: item.isDesktopIcon
  }));
  localStorage.setItem('recycleBinItems', JSON.stringify(itemsToSave));
}

// Check if mouse event coordinates are over a target element
// Used to detect when dragging an item over the recycle bin
// Returns true if the mouse position is within the element's bounding rectangle
function isOverElement(event, targetElement) {
  const rect = targetElement.getBoundingClientRect();
  return (
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom
  );
}

// Move item to recycle bin (soft delete)
// Stores item data including position, name, icon, and DOM reference
// Hides the element from desktop but doesn't remove it from DOM
// Saves state to localStorage for persistence
function moveToRecycleBin(element) {
  // Store item data
  const itemData = {
    id: Date.now(),
    html: element.outerHTML,
    position: {
      left: element.style.left,
      top: element.style.top
    },
    name: element.querySelector('span').textContent,
    icon: element.querySelector('img').src,
    isDesktopIcon: element.classList.contains('icon'),
    originalElement: element
  };
  
  recycleBinItems.push(itemData);
  
  // Hide the element
  element.style.display = 'none';
  element.dataset.inRecycleBin = 'true';
  
  // Update recycle bin display
  updateRecycleBinDisplay();
  
  // Save to localStorage
  saveRecycleBinState();
  
  // Show notification
  console.log(`"${itemData.name}" moved to Recycle Bin`);
}

// Update recycle bin window display
// Shows all deleted items as file icons in the recycle bin window
// Displays empty message if no items are present
// Attaches event handlers for restore and permanent delete actions
function updateRecycleBinDisplay() {
  const content = document.getElementById('recycleBinContent');
  const emptyMessage = document.getElementById('recycleBinEmpty');
  
  if (recycleBinItems.length === 0) {
    emptyMessage.style.display = 'block';
    // Remove all file icons
    const fileIcons = content.querySelectorAll('.file-icon');
    fileIcons.forEach(icon => icon.remove());
  } else {
    emptyMessage.style.display = 'none';
    
    // Clear existing items
    const existingIcons = content.querySelectorAll('.file-icon');
    existingIcons.forEach(icon => icon.remove());
    
    // Add items to recycle bin
    recycleBinItems.forEach((item, index) => {
      const fileIcon = document.createElement('div');
      fileIcon.className = 'file-icon';
      fileIcon.dataset.recycleId = item.id;
      fileIcon.innerHTML = `
        <img src="${item.icon}" alt="${item.name}">
        <span>${item.name}</span>
      `;
      
      // Right-click context menu for restore/delete
      fileIcon.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showRecycleItemMenu(e, item.id);
      });
      
      // Double-click to restore
      fileIcon.addEventListener('dblclick', () => {
        restoreItem(item.id);
      });
      
      content.appendChild(fileIcon);
    });
  }
}

// Show context menu for recycle bin items
// Displays options to restore or permanently delete an item
// Positioned at mouse cursor location
// Auto-closes when clicking elsewhere
function showRecycleItemMenu(event, itemId) {
  // Remove existing menu if any
  const existingMenu = document.getElementById('recycleItemMenu');
  if (existingMenu) existingMenu.remove();
  
  const menu = document.createElement('div');
  menu.id = 'recycleItemMenu';
  menu.className = 'context-menu';
  menu.style.cssText = `
    position: fixed;
    left: ${event.clientX}px;
    top: ${event.clientY}px;
    z-index: 10000;
  `;
  menu.innerHTML = `
    <div class="context-item" onclick="restoreItem(${itemId})">
      <span class="context-icon">↶</span>
      <span>Restore</span>
    </div>
    <div class="context-divider"></div>
    <div class="context-item" onclick="deleteItemPermanently(${itemId})">
      <span class="context-icon">🗑️</span>
      <span>Delete Permanently</span>
    </div>
  `;
  
  document.body.appendChild(menu);
  
  // Close menu when clicking elsewhere
  setTimeout(() => {
    document.addEventListener('click', function closeMenu() {
      menu.remove();
      document.removeEventListener('click', closeMenu);
    });
  }, 100);
}

// Restore item from recycle bin to desktop
// Makes the original element visible again at its previous position
// Removes item from recycle bin array and updates display
// Saves updated state to localStorage
function restoreItem(itemId) {
  const itemIndex = recycleBinItems.findIndex(item => item.id === itemId);
  if (itemIndex === -1) return;
  
  const item = recycleBinItems[itemIndex];
  
  // Restore the original element
  if (item.originalElement) {
    item.originalElement.style.display = '';
    // If it had position data, restore as positioned; otherwise return to grid
    if (item.position && item.position.left && item.position.top) {
      item.originalElement.style.position = 'absolute';
      item.originalElement.style.left = item.position.left;
      item.originalElement.style.top = item.position.top;
      item.originalElement.classList.add('positioned');
    } else {
      // Return to grid layout
      item.originalElement.style.position = '';
      item.originalElement.style.left = '';
      item.originalElement.style.top = '';
      item.originalElement.classList.remove('positioned');
    }
    delete item.originalElement.dataset.inRecycleBin;
  }
  
  // Remove from recycle bin
  recycleBinItems.splice(itemIndex, 1);
  updateRecycleBinDisplay();
  
  // Save to localStorage
  saveRecycleBinState();
  
  console.log(`"${item.name}" restored from Recycle Bin`);
}

// Delete item permanently from recycle bin
// Removes the item completely from DOM and memory
// Requires user confirmation before deletion
// Cannot be undone - item is lost forever
function deleteItemPermanently(itemId) {
  const confirmed = confirm('Are you sure you want to permanently delete this item?');
  if (!confirmed) return;
  
  const itemIndex = recycleBinItems.findIndex(item => item.id === itemId);
  if (itemIndex === -1) return;
  
  const item = recycleBinItems[itemIndex];
  
  // Permanently remove the element from DOM
  if (item.originalElement && item.originalElement.parentNode) {
    item.originalElement.remove();
  }
  
  // Remove from recycle bin
  recycleBinItems.splice(itemIndex, 1);
  updateRecycleBinDisplay();
  
  // Save to localStorage
  saveRecycleBinState();
  
  console.log(`"${item.name}" permanently deleted`);
}

// Empty entire recycle bin
// Permanently deletes all items in the recycle bin
// Requires user confirmation
// Removes all items from DOM and clears localStorage
function emptyRecycleBin() {
  if (recycleBinItems.length === 0) {
    alert('Recycle Bin is already empty.');
    return;
  }
  
  const confirmed = confirm('Are you sure you want to permanently delete all items in the Recycle Bin?');
  if (!confirmed) return;
  
  // Permanently delete all items
  recycleBinItems.forEach(item => {
    if (item.originalElement && item.originalElement.parentNode) {
      item.originalElement.remove();
    }
  });
  
  recycleBinItems = [];
  updateRecycleBinDisplay();
  
  // Save to localStorage
  saveRecycleBinState();
  
  console.log('Recycle Bin emptied');
}

// Restore all items from recycle bin to desktop
// Iterates through all items and restores each one
// Returns desktop to state before deletions
function restoreAllItems() {
  if (recycleBinItems.length === 0) {
    alert('Recycle Bin is empty.');
    return;
  }
  
  const itemsToRestore = [...recycleBinItems];
  itemsToRestore.forEach(item => {
    restoreItem(item.id);
  });
  
  console.log('All items restored from Recycle Bin');
}

