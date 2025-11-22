// PAINT APPLICATION
// A simple MS Paint-style drawing application
// Features:
// - Multiple drawing tools (pencil, brush, eraser, line, rectangle, circle)
// - Color picker with preset palette
// - Adjustable line widths
// - Clear canvas
// - Save drawing as PNG image
class Paint {
  // Initialize paint application
  // Sets up canvas, tools, and default drawing state
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.isDrawing = false;
    this.currentColor = '#000000';
    this.currentTool = 'pencil';
    this.lineWidth = 2;
    this.startX = 0;
    this.startY = 0;
    this.snapshot = null;
    this.init();
  }

  // Create the paint UI: toolbar with tools, color picker, and canvas
  init() {
    this.container.innerHTML = `
      <div class="paint-toolbar">
        <div class="paint-tools">
          <button class="tool-btn active" data-tool="pencil">✏️ Pencil</button>
          <button class="tool-btn" data-tool="brush">🖌️ Brush</button>
          <button class="tool-btn" data-tool="eraser">🧹 Eraser</button>
          <button class="tool-btn" data-tool="line">📏 Line</button>
          <button class="tool-btn" data-tool="rectangle">⬜ Rectangle</button>
          <button class="tool-btn" data-tool="circle">⭕ Circle</button>
        </div>
        <div class="paint-colors">
          <input type="color" id="colorPicker" value="#000000">
          <div class="color-palette">
            <div class="color-preset" style="background: #000000" data-color="#000000"></div>
            <div class="color-preset" style="background: #ffffff" data-color="#ffffff"></div>
            <div class="color-preset" style="background: #808080" data-color="#808080"></div>
            <div class="color-preset" style="background: #c0c0c0" data-color="#c0c0c0"></div>
            <div class="color-preset" style="background: #ff0000" data-color="#ff0000"></div>
            <div class="color-preset" style="background: #800000" data-color="#800000"></div>
            <div class="color-preset" style="background: #ffff00" data-color="#ffff00"></div>
            <div class="color-preset" style="background: #808000" data-color="#808000"></div>
            <div class="color-preset" style="background: #00ff00" data-color="#00ff00"></div>
            <div class="color-preset" style="background: #008000" data-color="#008000"></div>
            <div class="color-preset" style="background: #00ffff" data-color="#00ffff"></div>
            <div class="color-preset" style="background: #008080" data-color="#008080"></div>
            <div class="color-preset" style="background: #0000ff" data-color="#0000ff"></div>
            <div class="color-preset" style="background: #000080" data-color="#000080"></div>
            <div class="color-preset" style="background: #ff00ff" data-color="#ff00ff"></div>
            <div class="color-preset" style="background: #800080" data-color="#800080"></div>
            <div class="color-preset" style="background: #ffa500" data-color="#ffa500"></div>
            <div class="color-preset" style="background: #ffc0cb" data-color="#ffc0cb"></div>
            <div class="color-preset" style="background: #a52a2a" data-color="#a52a2a"></div>
            <div class="color-preset" style="background: #00ff7f" data-color="#00ff7f"></div>
          </div>
        </div>
        <div class="paint-actions">
          <button class="action-btn" id="clearCanvas">Clear</button>
          <button class="action-btn" id="saveImage">Save</button>
        </div>
        <div class="canvas-size-controls">
          <label>Width: <input type="number" id="canvasWidth" value="500" min="100" max="2000" step="10"></label>
          <label>Height: <input type="number" id="canvasHeight" value="400" min="100" max="2000" step="10"></label>
          <button class="action-btn" id="resizeCanvas">Resize</button>
        </div>
      </div>
      <canvas id="paintCanvas" width="500" height="400"></canvas>
    `;

    this.canvas = document.getElementById('paintCanvas');
    this.ctx = this.canvas.getContext('2d');
    // Fill canvas with white background (instead of transparent)
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.setupEventListeners();
  }

  // Set up all event listeners for tools, colors, and canvas interactions
  setupEventListeners() {
    // Tool selection - Updates active tool and UI state
    this.container.querySelectorAll('.tool-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.container.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTool = btn.dataset.tool;
      });
    });

    // Color selection from picker input
    document.getElementById('colorPicker').addEventListener('change', (e) => {
      this.currentColor = e.target.value;
    });

    // Preset color palette selection
    this.container.querySelectorAll('.color-preset').forEach(preset => {
      preset.addEventListener('click', (e) => {
        this.currentColor = preset.dataset.color;
        document.getElementById('colorPicker').value = this.currentColor;
      });
    });

    // Canvas drawing events
    // mousedown: Start drawing
    this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
    // mousemove: Continue drawing if mouse is pressed
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    // mouseup/mouseleave: Stop drawing
    this.canvas.addEventListener('mouseup', () => this.stopDrawing());
    this.canvas.addEventListener('mouseleave', () => this.stopDrawing());

    // Action buttons - Clear and Save
    document.getElementById('clearCanvas').addEventListener('click', () => this.clear());
    document.getElementById('saveImage').addEventListener('click', () => this.save());
    
    // Canvas resize functionality
    document.getElementById('resizeCanvas').addEventListener('click', () => this.resizeCanvas());
  }

  // Start drawing operation
  // Records starting position and saves canvas state for shape tools
  startDrawing(e) {
    this.isDrawing = true;
    const rect = this.canvas.getBoundingClientRect();
    this.startX = e.clientX - rect.left;
    this.startY = e.clientY - rect.top;
    this.lastX = this.startX;
    this.lastY = this.startY;
    
    // Save canvas state for shape tools (line, rectangle, circle)
    // Allows preview while dragging without affecting existing drawing
    if (['line', 'rectangle', 'circle'].includes(this.currentTool)) {
      this.snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  // Draw on canvas based on current tool
  // Handles freehand drawing (pencil, brush, eraser) and shape tools
  draw(e) {
    if (!this.isDrawing) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set drawing style based on current tool
    this.ctx.strokeStyle = this.currentTool === 'eraser' ? '#ffffff' : this.currentColor;
    this.ctx.fillStyle = this.currentColor;
    this.ctx.lineWidth = this.currentTool === 'brush' ? 8 : this.currentTool === 'eraser' ? 20 : 2;
    this.ctx.lineCap = 'round';

    // Freehand drawing tools - Draw continuous line segments
    if (this.currentTool === 'pencil' || this.currentTool === 'brush' || this.currentTool === 'eraser') {
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.lastX = x;
      this.lastY = y;
    } else if (this.currentTool === 'line') {
      // Line tool - Restore canvas and draw line from start to current position
      this.ctx.putImageData(this.snapshot, 0, 0);
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    } else if (this.currentTool === 'rectangle') {
      // Rectangle tool - Restore canvas and draw rectangle
      this.ctx.putImageData(this.snapshot, 0, 0);
      this.ctx.beginPath();
      this.ctx.rect(this.startX, this.startY, x - this.startX, y - this.startY);
      this.ctx.stroke();
    } else if (this.currentTool === 'circle') {
      // Circle tool - Restore canvas and draw circle with radius based on distance
      this.ctx.putImageData(this.snapshot, 0, 0);
      this.ctx.beginPath();
      const radius = Math.sqrt(Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2));
      this.ctx.arc(this.startX, this.startY, radius, 0, 2 * Math.PI);
      this.ctx.stroke();
    }
  }

  // Stop the drawing operation
  stopDrawing() {
    this.isDrawing = false;
  }

  // Clear the entire canvas and fill with white
  clear() {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Save the canvas as a PNG image file
  // Creates a download link and triggers it automatically
  save() {
    const link = document.createElement('a');
    link.download = 'my-drawing.png';
    link.href = this.canvas.toDataURL();
    link.click();
  }

  // Resize the canvas to new dimensions
  // Preserves existing drawing by copying it to the resized canvas
  resizeCanvas() {
    const newWidth = parseInt(document.getElementById('canvasWidth').value);
    const newHeight = parseInt(document.getElementById('canvasHeight').value);
    
    // Validate dimensions
    if (newWidth < 100 || newWidth > 2000 || newHeight < 100 || newHeight > 2000) {
      alert('Canvas dimensions must be between 100 and 2000 pixels');
      return;
    }
    
    // Save current canvas content
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    
    // Resize canvas
    this.canvas.width = newWidth;
    this.canvas.height = newHeight;
    
    // Fill with white background
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Restore previous content
    this.ctx.putImageData(imageData, 0, 0);
  }
}
