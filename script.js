// Draggable windows
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
      el.style.left = e.clientX - offsetX + 'px';
      el.style.top = e.clientY - offsetY + 'px';
    }
  });
}

// Windows
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

// Desktop icons draggable and double-click to open
const icons = document.querySelectorAll('.icon');
icons.forEach(icon => {
  let isDragging = false, offsetX, offsetY;

  icon.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - icon.offsetLeft;
    offsetY = e.clientY - icon.offsetTop;
  });

  document.addEventListener('mouseup', () => isDragging = false);

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      icon.style.left = e.clientX - offsetX + 'px';
      icon.style.top = e.clientY - offsetY + 'px';
    }
  });

  icon.addEventListener('dblclick', () => {
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
  });
});

// Start menu toggle
const startButton = document.querySelector('.start-button');
const startMenu = document.getElementById('startMenu');
startButton.addEventListener('click', () => {
  const isOpen = startMenu.style.display === 'block';
  startMenu.style.display = isOpen ? 'none' : 'block';
  
  if (isOpen) {
    startButton.classList.remove('active');
  } else {
    startButton.classList.add('active');
  }
});

// Close start menu when clicking outside
document.addEventListener('click', (e) => {
  if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
    startMenu.style.display = 'none';
    startButton.classList.remove('active');
  }
});
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

// Bring window to front
function bringToFront(window) {
  const allWindows = document.querySelectorAll('.window');
  allWindows.forEach(w => w.style.zIndex = '1');
  window.style.zIndex = '1000';
}

// Update taskbar
function updateTaskbar() {
  // Function to update taskbar state if needed
}

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

// Taskbar
const taskbarItems = document.querySelector('.taskbar-items');
function addToTaskbar(id, name) {
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

// Clock
function updateClock() {
  const clock = document.getElementById('clock');
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}
setInterval(updateClock, 1000);
updateClock();

// Date/Time Panel
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

// Generate calendar
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
  

// Draw analog clock
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

// Update analog clock every second when panel is open
setInterval(() => {
  if (datetimePanel.style.display === 'block') {
    drawAnalogClock();
    updateDateTime();
  }
}, 1000);

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

// IE address bar - navigate on Enter key
document.addEventListener('DOMContentLoaded', () => {
  const addressBar = document.getElementById('ieAddressBar');
  if (addressBar) {
    addressBar.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        navigateIE();
      }
    });
  }
});
