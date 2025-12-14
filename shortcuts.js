// Global keyboard shortcuts (centralized)
// Ctrl+Shift+B -> BSOD (calls showBSOD from bsod.js)
// Ctrl+Shift+S -> Open settings window
// Ctrl+Shift+N -> Create sticky note

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'B') {
    if (typeof showBSOD === 'function') {
      showBSOD();
    }
    return;
  }
  if (e.ctrlKey && e.shiftKey && e.key === 'S') {
    const settingsWindow = document.getElementById('settingsWindow');
    if (settingsWindow && typeof openWindow === 'function') {
      openWindow(settingsWindow);
    }
    return;
  }
  if (e.ctrlKey && e.shiftKey && e.key === 'N') {
    if (typeof createStickyNote === 'function') {
      createStickyNote();
    }
    return;
  }
});
