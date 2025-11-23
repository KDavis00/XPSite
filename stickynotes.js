// STICKY NOTES APPLICATION
// Classic Windows sticky notes for desktop reminders

class StickyNotes {
  constructor() {
    this.notes = [];
    this.noteIdCounter = 0;
    this.loadNotes();
  }

  // Create a new sticky note
  createNote(content = '', x = null, y = null) {
    const noteId = this.noteIdCounter++;
    
    // Random pastel colors
    const colors = ['#fff740', '#ffb3ba', '#bae1ff', '#baffc9', '#ffdfba', '#e0bbff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Default position if not specified
    if (x === null || y === null) {
      x = 100 + (this.notes.length * 30);
      y = 100 + (this.notes.length * 30);
    }
    
    const note = {
      id: noteId,
      content: content,
      x: x,
      y: y,
      color: color,
      width: 200,
      height: 200
    };
    
    this.notes.push(note);
    this.renderNote(note);
    this.saveNotes();
    
    return note;
  }

  // Render a sticky note to the DOM
  renderNote(note) {
    const noteEl = document.createElement('div');
    noteEl.className = 'sticky-note';
    noteEl.id = `sticky-note-${note.id}`;
    noteEl.style.left = note.x + 'px';
    noteEl.style.top = note.y + 'px';
    noteEl.style.width = note.width + 'px';
    noteEl.style.height = note.height + 'px';
    noteEl.style.backgroundColor = note.color;
    
    noteEl.innerHTML = `
      <div class="sticky-note-header">
        <button class="sticky-note-color" title="Change color">🎨</button>
        <button class="sticky-note-close" title="Delete note">×</button>
      </div>
      <textarea class="sticky-note-content" placeholder="Type your note here...">${note.content}</textarea>
    `;
    
    document.body.appendChild(noteEl);
    
    // Make draggable
    this.makeDraggable(noteEl, note);
    
    // Save on content change
    const textarea = noteEl.querySelector('.sticky-note-content');
    textarea.addEventListener('input', (e) => {
      note.content = e.target.value;
      this.saveNotes();
    });
    
    // Close button
    noteEl.querySelector('.sticky-note-close').addEventListener('click', () => {
      this.deleteNote(note.id);
    });
    
    // Color button
    noteEl.querySelector('.sticky-note-color').addEventListener('click', () => {
      this.changeNoteColor(note);
    });
  }

  // Make note draggable
  makeDraggable(element, note) {
    const header = element.querySelector('.sticky-note-header');
    let isDragging = false;
    let currentX, currentY, initialX, initialY;
    
    header.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('sticky-note-close') || 
          e.target.classList.contains('sticky-note-color')) {
        return;
      }
      
      isDragging = true;
      initialX = e.clientX - note.x;
      initialY = e.clientY - note.y;
      
      element.style.zIndex = this.getTopZIndex() + 1;
    });
    
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        
        element.style.left = currentX + 'px';
        element.style.top = currentY + 'px';
        
        note.x = currentX;
        note.y = currentY;
      }
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        this.saveNotes();
      }
    });
  }

  // Change note color
  changeNoteColor(note) {
    const colors = ['#fff740', '#ffb3ba', '#bae1ff', '#baffc9', '#ffdfba', '#e0bbff'];
    let currentIndex = colors.indexOf(note.color);
    currentIndex = (currentIndex + 1) % colors.length;
    note.color = colors[currentIndex];
    
    const noteEl = document.getElementById(`sticky-note-${note.id}`);
    noteEl.style.backgroundColor = note.color;
    
    this.saveNotes();
  }

  // Delete a note
  deleteNote(noteId) {
    const noteEl = document.getElementById(`sticky-note-${noteId}`);
    if (noteEl) {
      noteEl.remove();
    }
    
    this.notes = this.notes.filter(n => n.id !== noteId);
    this.saveNotes();
  }

  // Get highest z-index
  getTopZIndex() {
    const notes = document.querySelectorAll('.sticky-note');
    let maxZ = 1000;
    notes.forEach(note => {
      const z = parseInt(window.getComputedStyle(note).zIndex) || 1000;
      if (z > maxZ) maxZ = z;
    });
    return maxZ;
  }

  // Save notes to localStorage
  saveNotes() {
    localStorage.setItem('stickyNotes', JSON.stringify(this.notes));
  }

  // Load notes from localStorage
  loadNotes() {
    const saved = localStorage.getItem('stickyNotes');
    if (saved) {
      try {
        this.notes = JSON.parse(saved);
        this.noteIdCounter = Math.max(...this.notes.map(n => n.id), 0) + 1;
        this.notes.forEach(note => this.renderNote(note));
      } catch (e) {
        console.error('Failed to load sticky notes:', e);
        this.notes = [];
      }
    }
  }

  // Delete all notes
  clearAll() {
    if (confirm('Delete all sticky notes?')) {
      this.notes.forEach(note => {
        const noteEl = document.getElementById(`sticky-note-${note.id}`);
        if (noteEl) noteEl.remove();
      });
      this.notes = [];
      this.saveNotes();
    }
  }
}

// Initialize sticky notes app
let stickyNotesApp;

function initStickyNotes() {
  if (!stickyNotesApp) {
    stickyNotesApp = new StickyNotes();
  }
}

// Create new note function (exposed globally)
function createStickyNote() {
  if (!stickyNotesApp) {
    initStickyNotes();
  }
  stickyNotesApp.createNote();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initStickyNotes();
});
