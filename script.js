// WINDOW MANAGEMENT: DRAGGABLE FUNCTIONALITY
function makeDraggable(el) {
  let isDragging = false, offsetX, offsetY;
  const title = el.querySelector('.title-bar');

  if (!title) return;

  title.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    bringToFront(el);
  });

  document.addEventListener('mouseup', () => (isDragging = false));

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;

      const windowWidth = el.offsetWidth;
      const windowHeight = el.offsetHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const taskbarHeight = 32;

      newLeft = Math.max(0, Math.min(newLeft, viewportWidth - Math.min(windowWidth, 50)));
      newTop = Math.max(0, Math.min(newTop, viewportHeight - taskbarHeight - windowHeight));

      el.style.left = newLeft + 'px';
      el.style.top = newTop + 'px';
    }
  });
}

// APPLICATION INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  initializeWindows();
  initializeIcons();
  initializeStartMenu();
  initializeClock();
  initializeDateTimePanel();
  initializeRecycleBin();
  initializeKeyboardShortcuts();
  initializeInputTracking();
});

// KEYBOARD SHORTCUTS
function initializeKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Delete') {
      const focusedIcon = document.activeElement;
      if (focusedIcon && focusedIcon.classList.contains('icon') && !focusedIcon.classList.contains('recycle-bin-icon')) {
        if (confirm(`Move "${focusedIcon.querySelector('span').textContent}" to Recycle Bin?`)) {
          moveToRecycleBin(focusedIcon);
        }
      }
    }

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

    if (e.key === 'Escape') {
      const startMenu = document.getElementById('startMenu');
      if (startMenu && startMenu.style.display === 'block') {
        startMenu.style.display = 'none';
        const startBtn = document.querySelector('.start-button');
        if (startBtn) startBtn.classList.remove('active');
        return;
      }

      const windows = Array.from(document.querySelectorAll('.window')).filter((w) => w.style.display !== 'none');
      if (windows.length > 0) {
        const topWindow = windows[windows.length - 1];
        topWindow.style.display = 'none';
        removeFromTaskbar(topWindow.id);
      }
    }

    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
      e.preventDefault();
      openWindow('settingsWindow');
    }

    if (e.ctrlKey && e.shiftKey && e.key === 'B') {
      e.preventDefault();
      if (typeof showBSOD === 'function') showBSOD();
    }
  });
}

// INPUT TRACKING FOR ON-SCREEN KEYBOARD
function initializeInputTracking() {
  document.addEventListener('focusin', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      window.lastFocusedInput = e.target;
    }
  });

  const firstInput = document.querySelector('input[type="text"], textarea');
  if (firstInput) {
    window.lastFocusedInput = firstInput;
  }
}

// RECYCLE BIN INITIALIZATION
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
  });

  loadRecycleBinState();
}

// WINDOW CONTROLS INITIALIZATION
function initializeWindows() {
  const windows = document.querySelectorAll('.window');
  windows.forEach((win) => {
    makeDraggable(win);

    const closeBtn = win.querySelector('.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        win.style.display = 'none';
        removeFromTaskbar(win.id);
      });
    }

    const minBtn = win.querySelector('.minimize');
    if (minBtn) {
      minBtn.addEventListener('click', () => {
        win.style.display = 'none';
      });
    }

    const maxBtn = win.querySelector('.maximize');
    if (maxBtn) {
      maxBtn.addEventListener('click', () => {
        if (win.classList.contains('maximized')) {
          win.classList.remove('maximized');
          win.style.width = win.dataset.originalWidth || '400px';
          win.style.height = win.dataset.originalHeight || 'auto';
          win.style.left = win.dataset.originalLeft || '100px';
          win.style.top = win.dataset.originalTop || '100px';
        } else {
          win.dataset.originalWidth = win.style.width || '400px';
          win.dataset.originalHeight = win.style.height || 'auto';
          win.dataset.originalLeft = win.style.left || '100px';
          win.dataset.originalTop = win.style.top || '100px';

          const taskbarHeight = 32;
          win.classList.add('maximized');
          win.style.width = '100%';
          win.style.height = `calc(100vh - ${taskbarHeight}px)`;
          win.style.left = '0';
          win.style.top = '0';
        }
      });
    }
  });
}

// DESKTOP ICONS INITIALIZATION
function initializeIcons() {
  const icons = document.querySelectorAll('.icon');
  const recycleBin = document.querySelector('.recycle-bin-icon');

  const columns = 4;
  const iconWidth = 100;
  const iconHeight = 110;
  const gapX = 15;
  const gapY = 15;
  const startX = 20;
  const startY = 20;

  icons.forEach((icon, index) => {
    if (icon.classList.contains('positioned') || (icon.style.left && icon.style.top)) {
      return;
    }

    const col = index % columns;
    const row = Math.floor(index / columns);
    const left = startX + col * (iconWidth + gapX);
    const top = startY + row * (iconHeight + gapY);

    icon.style.left = left + 'px';
    icon.style.top = top + 'px';
  });

  icons.forEach((icon) => {
    let isDragging = false, offsetX, offsetY;

    icon.addEventListener('mousedown', (e) => {
      if (icon.classList.contains('recycle-bin-icon')) return;
      isDragging = true;

      offsetX = e.clientX - icon.offsetLeft;
      offsetY = e.clientY - icon.offsetTop;

      icon.style.zIndex = 1000;
      icon.classList.add('dragging');
      icon.classList.add('positioned');
    });

    document.addEventListener('mouseup', (e) => {
      if (isDragging) {
        if (recycleBin && isOverElement(e, recycleBin) && !icon.classList.contains('recycle-bin-icon')) {
          moveToRecycleBin(icon);
        }
      }
      isDragging = false;
      icon.style.zIndex = '';
      icon.classList.remove('dragging');
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        icon.style.left = e.clientX - offsetX + 'px';
        icon.style.top = e.clientY - offsetY + 'px';

        if (recycleBin && isOverElement(e, recycleBin)) {
          recycleBin.style.backgroundColor = 'rgba(0, 0, 139, 0.3)';
        } else if (recycleBin) {
          recycleBin.style.backgroundColor = '';
        }
      }
    });

    const handleOpen = () => {
      const winId = icon.dataset.window;
      if (winId) {
        openWindow(winId);
      }
    };

    icon.addEventListener('dblclick', handleOpen);

    icon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen();
      }
    });
  });

  if (icons.length > 0) {
    icons[0].focus();
  }
}

// START MENU INITIALIZATION
function initializeStartMenu() {
  const startButton = document.querySelector('.start-button');
  const startMenu = document.getElementById('startMenu');

  if (!startButton || !startMenu) return;

  const toggleStartMenu = () => {
    const isOpen = startMenu.style.display === 'block';
    startMenu.style.display = isOpen ? 'none' : 'block';
    startButton.setAttribute('aria-expanded', !isOpen);
    startButton.classList.toggle('active', !isOpen);
  };

  startButton.addEventListener('click', toggleStartMenu);

  startButton.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && startMenu.style.display === 'block') {
      toggleStartMenu();
    }
  });

  document.addEventListener('click', (e) => {
    if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
      startMenu.style.display = 'none';
      startButton.classList.remove('active');
    }
  });

  const gameMenuItems = document.querySelectorAll('.start-menu [data-window]');
  gameMenuItems.forEach((item) => {
    item.addEventListener('click', () => {
      const winId = item.dataset.window;
      if (winId) {
        openWindow(winId);
        startMenu.style.display = 'none';
        startButton.classList.remove('active');
      }
    });
  });
}

// GENERIC FUNCTION TO OPEN AND INITIALIZE ANY WINDOW BY ID
function openWindow(windowId) {
  const win = document.getElementById(windowId);
  if (!win) return;

  win.style.display = 'block';
  bringToFront(win);

  // Position window if opening for the first time
  if (!win.dataset.positioned) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const windowWidth = win.offsetWidth || 300;
    const windowHeight = win.offsetHeight || 250;
    const taskbarHeight = 32;

    let left, top;

    if (windowId === 'settingsWindow') {
      left = viewportWidth - windowWidth;
      top = 0;
    } else {
      left = Math.max(0, (viewportWidth - windowWidth) / 2);
      top = Math.max(0, (viewportHeight - taskbarHeight - windowHeight) / 2);
    }

    win.style.left = left + 'px';
    win.style.top = top + 'px';
    win.dataset.positioned = 'true';
  }

  const titleElement = win.querySelector('.title');
  const windowTitle = titleElement ? titleElement.textContent : windowId;
  addToTaskbar(windowId, windowTitle);

  // Initialize content on first open
  if (windowId === 'aboutWindow' && !win.dataset.initialized) {
    if (typeof initAboutMe === 'function') initAboutMe(document.getElementById('aboutContent'));
    win.dataset.initialized = 'true';
  } else if (windowId === 'contactWindow' && !win.dataset.initialized) {
    if (typeof initContactForm === 'function') initContactForm(document.getElementById('contactContent'));
    win.dataset.initialized = 'true';
  } else if (windowId === 'msnWindow' && !win.dataset.initialized) {
    if (typeof initMSNWidget === 'function') initMSNWidget(document.getElementById('msnContent'));
    win.dataset.initialized = 'true';
  } else if (windowId === 'paintWindow' && !win.dataset.initialized) {
    if (typeof Paint === 'function') new Paint(document.getElementById('paintContent'));
    win.dataset.initialized = 'true';
  } else if (windowId === 'solitaireWindow' && !win.dataset.initialized) {
    const container = document.getElementById('solitaireGame');
    if (container && typeof Solitaire === 'function') {
      new Solitaire(container);
      win.dataset.initialized = 'true';
    }
  } else if (windowId === 'sudokuWindow' && !win.dataset.initialized) {
    const container = document.getElementById('sudokuGame');
    if (container && typeof Sudoku === 'function') {
      new Sudoku(container);
      win.dataset.initialized = 'true';
    }
  } else if (windowId === 'projectsWindow' && !win.dataset.initialized) {
    if (typeof initProjectsFolder === 'function') initProjectsFolder(document.getElementById('projectsContent'));
    win.dataset.initialized = 'true';
  } else if (windowId === 'settingsWindow' && !win.dataset.initialized) {
    if (typeof initSettings === 'function') initSettings();
    win.dataset.initialized = 'true';
  } else if (windowId === 'musicPlayerWindow' && !win.dataset.initialized) {
    initMusicPlayer();
    win.dataset.initialized = 'true';
  }
}

// ACCESSORY WINDOW SHORTCUT HELPERS
function openCalculator() {
  openWindow('calculatorWindow');
}

function openOnScreenKeyboard() {
  openWindow('oskWindow');
}

function openSystemInfo() {
  const settingsWindow = document.getElementById('settingsWindow');
  const aboutTab = document.querySelector('[data-tab="about"]');

  if (settingsWindow) {
    openWindow('settingsWindow');
    if (aboutTab) aboutTab.click();
  }
}

function openSettings() {
  openWindow('settingsWindow');
}

// MEDIA PLAYBACK: VIDEO PLAYER
function playVideo(url) {
  const mediaWindow = document.getElementById('mediaPlayerWindow');
  const video = document.getElementById('mediaVideo');

  if (mediaWindow && video) {
    openWindow('mediaPlayerWindow');

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let embedUrl = url;
      if (url.includes('watch?v=')) {
        const videoId = url.split('watch?v=')[1].split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }

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

      const clip = document.getElementById('mediaClip');
      const author = document.getElementById('mediaAuthor');
      const copyright = document.getElementById('mediaCopyright');
      if (clip) clip.textContent = 'Featured Video';
      if (author) author.textContent = 'YouTube';
      if (copyright) copyright.textContent = '© Media';
    } else {
      const iframe = document.querySelector('.media-logo iframe');
      if (iframe) iframe.style.display = 'none';
      video.style.display = 'block';
      video.src = url;
      video.load();

      if (typeof mediaPlayer !== 'undefined' && mediaPlayer.play) {
        if (mediaPlayer.hideLogo) mediaPlayer.hideLogo();
        mediaPlayer.play();
      }

      const fileName = url.split('/').pop();
      const clip = document.getElementById('mediaClip');
      if (clip) clip.textContent = fileName;
    }
  }
}

// IMAGE VIEWER WINDOW
function openImageViewer(imagePath, imageName) {
  const viewerWindow = document.getElementById('imageViewerWindow');
  const viewerTitle = document.getElementById('imageViewerTitle');
  const viewerImg = document.getElementById('imageViewerImg');

  if (viewerWindow && viewerTitle && viewerImg) {
    viewerTitle.textContent = imageName;
    viewerImg.src = imagePath;
    viewerImg.alt = imageName;
    openWindow('imageViewerWindow');
  }
}

// WINDOW Z-INDEX MANAGEMENT
document.addEventListener('click', (e) => {
  const win = e.target.closest('.window');
  const stickyNote = e.target.closest('.sticky-note');

  if (win && win.style.display !== 'none') {
    bringToFront(win);
  } else if (stickyNote) {
    bringNoteToFront(stickyNote);
  }
});

function bringToFront(win) {
  const allWindows = document.querySelectorAll('.window');
  const allNotes = document.querySelectorAll('.sticky-note');

  allWindows.forEach((w) => (w.style.zIndex = '1'));
  allNotes.forEach((n) => (n.style.zIndex = '100'));

  win.style.zIndex = '1000';
}

function bringNoteToFront(note) {
  const allWindows = document.querySelectorAll('.window');
  const allNotes = document.querySelectorAll('.sticky-note');

  allWindows.forEach((w) => (w.style.zIndex = '1'));
  allNotes.forEach((n) => (n.style.zIndex = '100'));

  note.style.zIndex = '1000';
}

// TASKBAR: WINDOW MANAGEMENT
function addToTaskbar(id, name) {
  const taskbarItems = document.querySelector('.taskbar-items');
  if (!taskbarItems) return;

  if (!document.querySelector(`#task-${id}`)) {
    const span = document.createElement('span');
    span.id = `task-${id}`;
    span.textContent = name;
    span.addEventListener('click', () => {
      const win = document.getElementById(id);
      if (win) {
        if (win.style.display === 'none') {
          win.style.display = 'block';
          bringToFront(win);
        } else {
          win.style.display = 'none';
        }
      }
    });

    span.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showTaskbarContextMenu(e, id, name);
    });

    taskbarItems.appendChild(span);
  }
}

function showTaskbarContextMenu(e, windowId, windowName) {
  const existingMenu = document.querySelector('.taskbar-context-menu');
  if (existingMenu) existingMenu.remove();

  const menu = document.createElement('div');
  menu.className = 'taskbar-context-menu context-menu';
  menu.style.position = 'fixed';
  menu.style.left = e.clientX + 'px';
  menu.style.bottom = '34px';
  menu.style.zIndex = '100000';

  const win = document.getElementById(windowId);
  const isMinimized = win ? win.style.display === 'none' : false;

  menu.innerHTML = `
    <div class="context-item" data-action="restore">${isMinimized ? 'Restore' : 'Minimize'}</div>
    <div class="context-item" data-action="maximize">Maximize</div>
    <div class="context-divider"></div>
    <div class="context-item" data-action="close">Close</div>
  `;

  menu.querySelectorAll('.context-item').forEach((item) => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      if (win) {
        if (action === 'restore') {
          if (isMinimized) {
            win.style.display = 'block';
            bringToFront(win);
          } else {
            win.style.display = 'none';
          }
        } else if (action === 'maximize') {
          win.style.display = 'block';
          bringToFront(win);
          const maximizeBtn = win.querySelector('.maximize');
          if (maximizeBtn) maximizeBtn.click();
        } else if (action === 'close') {
          const closeBtn = win.querySelector('.close');
          if (closeBtn) closeBtn.click();
        }
      }
      menu.remove();
    });
  });

  document.body.appendChild(menu);

  const closeMenu = (event) => {
    if (!menu.contains(event.target)) {
      menu.remove();
      document.removeEventListener('click', closeMenu);
    }
  };
  setTimeout(() => document.addEventListener('click', closeMenu), 10);
}

function removeFromTaskbar(id) {
  const span = document.querySelector(`#task-${id}`);
  if (span) span.remove();
}

// TASKBAR CLOCK: REAL-TIME DISPLAY
function initializeClock() {
  function updateClock() {
    const clock = document.getElementById('clock');
    if (!clock) return;

    const clockTime = clock.querySelector('.clock-time');
    const clockDate = clock.querySelector('.clock-date');
    const now = new Date();

    if (clockTime) {
      clockTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    if (clockDate) {
      const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
      if (settings.showTaskbarDate) {
        clockDate.style.display = 'block';
        clockDate.textContent = now.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' });
      } else {
        clockDate.style.display = 'none';
      }
    }
  }
  setInterval(updateClock, 1000);
  updateClock();
  window.updateClockDisplay = updateClock;
}

// DATE/TIME PANEL: DETAILED TIME DISPLAY
function initializeDateTimePanel() {
  const datetimePanel = document.getElementById('datetimePanel');
  const clockElement = document.getElementById('clock');

  if (!datetimePanel || !clockElement) return;

  clockElement.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = datetimePanel.style.display === 'block';
    datetimePanel.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
      updateDateTime();
      drawAnalogClock();
    }
  });

  document.addEventListener('click', (e) => {
    if (!datetimePanel.contains(e.target) && e.target !== clockElement) {
      datetimePanel.style.display = 'none';
    }
  });

  setInterval(() => {
    if (datetimePanel.style.display === 'block') {
      drawAnalogClock();
      updateDateTime();
    }
  }, 1000);

  const monthSelect = document.getElementById('monthSelect');
  const yearSelect = document.getElementById('yearSelect');
  if (monthSelect) monthSelect.addEventListener('change', generateCalendar);
  if (yearSelect) yearSelect.addEventListener('change', generateCalendar);

  const taskbarDateCheckbox = document.getElementById('taskbarDateCheckbox');
  if (taskbarDateCheckbox) {
    const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
    taskbarDateCheckbox.checked = settings.showTaskbarDate || false;

    taskbarDateCheckbox.addEventListener('change', (e) => {
      const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
      settings.showTaskbarDate = e.target.checked;
      localStorage.setItem('accessibilitySettings', JSON.stringify(settings));

      if (typeof window.updateClockDisplay === 'function') {
        window.updateClockDisplay();
      }
    });
  }

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
function generateCalendar() {
  const calendar = document.getElementById('calendar');
  const monthSelect = document.getElementById('monthSelect');
  const yearSelect = document.getElementById('yearSelect');

  if (!calendar) return;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const today = now.getDate();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const selectedMonth = monthSelect ? months.indexOf(monthSelect.value) : currentMonth;
  const selectedYear = yearSelect ? parseInt(yearSelect.value) : currentYear;

  const year = selectedYear !== -1 ? selectedYear : currentYear;
  const month = selectedMonth !== -1 ? selectedMonth : currentMonth;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let html = '<table class="calendar"><tr>';
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  days.forEach((day) => (html += `<th>${day}</th>`));
  html += '</tr><tr>';

  for (let i = 0; i < firstDay; i++) {
    html += '<td></td>';
  }

  let day = 1;
  for (let i = firstDay; day <= daysInMonth; i++) {
    if (i % 7 === 0 && i !== 0) {
      html += '</tr><tr>';
    }
    const isToday = day === today && month === currentMonth && year === currentYear ? ' class="today"' : '';
    html += `<td${isToday}>${day}</td>`;
    day++;
  }

  while (html.split('<td').length - 1 < 42) {
    html += '<td></td>';
  }

  html += '</tr></table>';
  calendar.innerHTML = html;
}

// ANALOG CLOCK RENDERING
function drawAnalogClock() {
  const canvas = document.getElementById('analogClock');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 70;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#c0c0c0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#00aaaa';
  ctx.lineWidth = 2;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#808080';
  for (let i = 0; i < 12; i++) {
    const angle = ((i * 30 - 90) * Math.PI) / 180;
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

  const hourAngle = ((hours + minutes / 60) * 30 - 90) * Math.PI / 180;
  ctx.strokeStyle = '#004040';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + Math.cos(hourAngle) * (radius - 40), centerY + Math.sin(hourAngle) * (radius - 40));
  ctx.stroke();

  const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * Math.PI / 180;
  ctx.strokeStyle = '#00aaaa';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + Math.cos(minuteAngle) * (radius - 20), centerY + Math.sin(minuteAngle) * (radius - 20));
  ctx.stroke();

  ctx.fillStyle = '#004040';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
  ctx.fill();
}

function updateDateTime() {
  const now = new Date();
  const digitalTime = document.getElementById('digitalTime');
  if (digitalTime) {
    digitalTime.textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
  }
  generateCalendar();

  const monthSelect = document.getElementById('monthSelect');
  const yearSelect = document.getElementById('yearSelect');
  if (monthSelect && yearSelect) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    monthSelect.value = months[now.getMonth()];
    yearSelect.value = now.getFullYear().toString();
  }
}

// IE NAVIGATION
function navigateIE() {
  const addressBar = document.getElementById('ieAddressBar');
  const iframe = document.getElementById('ieFrame');
  if (!addressBar || !iframe) return;

  let url = addressBar.value.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  iframe.src = url;
}

// MUSIC PLAYER
function initMusicPlayer() {
  const audio = document.getElementById('musicAudio');
  const playBtn = document.getElementById('musicPlayBtn');
  const seekbar = document.getElementById('musicSeekbar');
  const volumeSlider = document.getElementById('musicVolume');
  const currentTimeDisplay = document.getElementById('musicCurrentTime');
  const durationDisplay = document.getElementById('musicDuration');

  if (!audio || !playBtn) return;

  let isPlaying = false;

  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      playBtn.textContent = '▶';
      playBtn.title = 'Play';
      isPlaying = false;
    } else {
      if (!audio.src) {
        audio.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
        const title = document.getElementById('musicTitle');
        const artist = document.getElementById('musicArtist');
        if (title) title.textContent = 'Sample Track';
        if (artist) artist.textContent = 'Demo Artist';
      }
      audio.play();
      playBtn.textContent = '⏸';
      playBtn.title = 'Pause';
      isPlaying = true;
    }
  });

  audio.addEventListener('timeupdate', () => {
    if (audio.duration && seekbar) {
      seekbar.value = (audio.currentTime / audio.duration) * 100;
      if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(audio.currentTime);
      if (durationDisplay) durationDisplay.textContent = formatTime(audio.duration);
    }
  });

  if (seekbar) {
    seekbar.addEventListener('input', () => {
      if (audio.duration) {
        audio.currentTime = (seekbar.value / 100) * audio.duration;
      }
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      audio.volume = volumeSlider.value / 100;
    });
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  audio.addEventListener('ended', () => {
    playBtn.textContent = '▶';
    playBtn.title = 'Play';
    isPlaying = false;
    if (seekbar) seekbar.value = 0;
  });
}

// RECYCLE BIN SYSTEM
let recycleBinItems = [];

function loadRecycleBinState() {
  const saved = localStorage.getItem('recycleBinItems');
  if (saved) {
    try {
      const savedItems = JSON.parse(saved);
      savedItems.forEach((item) => {
        const element = Array.from(document.querySelectorAll('.icon')).find((el) => {
          const span = el.querySelector('span');
          return span && span.textContent === item.name;
        });

        if (element) {
          element.style.display = 'none';
          element.dataset.inRecycleBin = 'true';
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

function saveRecycleBinState() {
  const itemsToSave = recycleBinItems.map((item) => ({
    id: item.id,
    position: item.position,
    name: item.name,
    icon: item.icon,
    isDesktopIcon: item.isDesktopIcon
  }));
  localStorage.setItem('recycleBinItems', JSON.stringify(itemsToSave));
}

function isOverElement(event, targetElement) {
  const rect = targetElement.getBoundingClientRect();
  return (
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom
  );
}

function moveToRecycleBin(element) {
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
  element.style.display = 'none';
  element.dataset.inRecycleBin = 'true';
  updateRecycleBinDisplay();
  saveRecycleBinState();
}

function updateRecycleBinDisplay() {
  const content = document.getElementById('recycleBinContent');
  const emptyMessage = document.getElementById('recycleBinEmpty');
  if (!content) return;

  if (recycleBinItems.length === 0) {
    if (emptyMessage) emptyMessage.style.display = 'block';
    const fileIcons = content.querySelectorAll('.file-icon');
    fileIcons.forEach((icon) => icon.remove());
  } else {
    if (emptyMessage) emptyMessage.style.display = 'none';

    const existingIcons = content.querySelectorAll('.file-icon');
    existingIcons.forEach((icon) => icon.remove());

    recycleBinItems.forEach((item) => {
      const fileIcon = document.createElement('div');
      fileIcon.className = 'file-icon';
      fileIcon.dataset.recycleId = item.id;
      fileIcon.innerHTML = `
        <img src="${item.icon}" alt="${item.name}">
        <span>${item.name}</span>
      `;

      fileIcon.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showRecycleItemMenu(e, item.id);
      });

      fileIcon.addEventListener('dblclick', () => {
        restoreItem(item.id);
      });

      content.appendChild(fileIcon);
    });
  }
}

function showRecycleItemMenu(event, itemId) {
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

  setTimeout(() => {
    document.addEventListener('click', function closeMenu() {
      menu.remove();
      document.removeEventListener('click', closeMenu);
    });
  }, 100);
}

function restoreItem(itemId) {
  const itemIndex = recycleBinItems.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) return;

  const item = recycleBinItems[itemIndex];

  if (item.originalElement) {
    item.originalElement.style.display = '';
    if (item.position && item.position.left && item.position.top) {
      item.originalElement.style.position = 'absolute';
      item.originalElement.style.left = item.position.left;
      item.originalElement.style.top = item.position.top;
      item.originalElement.classList.add('positioned');
    } else {
      item.originalElement.style.position = '';
      item.originalElement.style.left = '';
      item.originalElement.style.top = '';
      item.originalElement.classList.remove('positioned');
    }
    delete item.originalElement.dataset.inRecycleBin;
  }

  recycleBinItems.splice(itemIndex, 1);
  updateRecycleBinDisplay();
  saveRecycleBinState();
}

function deleteItemPermanently(itemId) {
  if (!confirm('Are you sure you want to permanently delete this item?')) return;

  const itemIndex = recycleBinItems.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) return;

  const item = recycleBinItems[itemIndex];
  if (item.originalElement && item.originalElement.parentNode) {
    item.originalElement.remove();
  }

  recycleBinItems.splice(itemIndex, 1);
  updateRecycleBinDisplay();
  saveRecycleBinState();
}

function emptyRecycleBin() {
  if (recycleBinItems.length === 0) {
    alert('Recycle Bin is already empty.');
    return;
  }

  if (!confirm('Are you sure you want to permanently delete all items in the Recycle Bin?')) return;

  recycleBinItems.forEach((item) => {
    if (item.originalElement && item.originalElement.parentNode) {
      item.originalElement.remove();
    }
  });

  recycleBinItems = [];
  updateRecycleBinDisplay();
  saveRecycleBinState();
}

function restoreAllItems() {
  if (recycleBinItems.length === 0) {
    alert('Recycle Bin is empty.');
    return;
  }

  const itemsToRestore = [...recycleBinItems];
  itemsToRestore.forEach((item) => {
    restoreItem(item.id);
  });
}