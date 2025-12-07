// NOTEPAD APPLICATION
// Simple text editor with basic functionality

const notepadApp = {
  currentFile: null,
  modified: false,

  init() {
    const textarea = document.getElementById('notepadTextarea');
    if (textarea) {
      textarea.addEventListener('input', () => {
        this.modified = true;
        this.updateTitle();
      });
    }
  },

  updateTitle() {
    const titleBar = document.querySelector('#notepadWindow .title');
    if (titleBar) {
      const fileName = this.currentFile || 'Untitled';
      const modifiedMark = this.modified ? '*' : '';
      titleBar.textContent = `${modifiedMark}${fileName} - Notepad`;
    }
  },

  newFile() {
    if (this.modified) {
      if (!confirm('You have unsaved changes. Create new file anyway?')) {
        return;
      }
    }
    const textarea = document.getElementById('notepadTextarea');
    if (textarea) {
      textarea.value = '';
      this.currentFile = null;
      this.modified = false;
      this.updateTitle();
    }
  },

  editMenu() {
    const menu = `Edit Menu:
- Cut (Ctrl+X)
- Copy (Ctrl+C)
- Paste (Ctrl+V)
- Select All (Ctrl+A)`;
    alert(menu);
  },

  formatMenu() {
    const menu = `Format Menu:
- Font: Courier New (Monospace)
- Size: 12px`;
    alert(menu);
  },

  saveFile() {
    const textarea = document.getElementById('notepadTextarea');
    if (!textarea) return;

    const content = textarea.value;
    const fileName = this.currentFile || 'document.txt';
    
    // Create a blob and download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);

    this.modified = false;
    this.updateTitle();
  }
};

// Initialize notepad when window opens
document.addEventListener('DOMContentLoaded', () => {
  notepadApp.init();
});
