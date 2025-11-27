// Windows Media Player-style video player with controls and seekbar
const mediaPlayer = {
  video: null,
  seekbar: null,
  volume: null,
  logo: null,

  // Initialize player with event listeners and controls
  init() {
    this.video = document.getElementById('mediaVideo');
    this.seekbar = document.getElementById('seekbar');
    this.volume = document.getElementById('volume');
    this.logo = document.getElementById('mediaLogo');

    if (!this.video) return;

    // Video event listeners
    this.video.addEventListener('timeupdate', () => this.updateSeekbar());
    // Update info when media loads
    this.video.addEventListener('loadedmetadata', () => this.updateInfo());
    // Update UI on playback state changes
    this.video.addEventListener('play', () => this.onPlay());
    this.video.addEventListener('pause', () => this.onPause());
    this.video.addEventListener('ended', () => this.showLogo());
    
    // Seekbar control
    this.seekbar.addEventListener('input', (e) => this.seek(e.target.value));
    // Volume: Adjust audio level (0-100)
    this.volume.addEventListener('input', (e) => this.setVolume(e.target.value));

    // Set initial volume to 50%
    this.video.volume = 0.5;
    
    // Show logo screen initially (Windows Media Player style)
    this.showLogo();
  },

  // Show Windows Media Player logo screen
  showLogo() {
    if (this.logo && this.video) {
      this.logo.style.display = 'block';
      this.video.style.display = 'none';
    }
  },

  // Hide logo and show video
  hideLogo() {
    if (this.logo && this.video) {
      this.logo.style.display = 'none';
      this.video.style.display = 'block';
    }
  },

  // Play video (loads sample if none loaded)
  play() {
    if (this.video.src) {
      this.video.play();
      this.hideLogo();
    } else {
      // Load a sample video if none is loaded
      this.video.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
      this.video.load();
      this.video.play();
      this.hideLogo();
    }
  },

  // Pause video playback
  pause() {
    this.video.pause();
  },

  // Stop playback and reset to beginning
  stop() {
    this.video.pause();
    this.video.currentTime = 0;
    this.showLogo();
    this.updateInfo();
  },

  // Callback when video starts playing
  // Updates the media information display
  onPlay() {
    this.updateInfo();
  },

  onPause() {
    this.updateInfo();
  },

  onStop() {
    this.showLogo();
    this.updateInfo();
  },

  // Update seekbar position based on current playback time
  // Calculates percentage and updates the range input value
  updateSeekbar() {
    if (this.video.duration) {
      const value = (this.video.currentTime / this.video.duration) * 100;
      this.seekbar.value = value;
    }
  },

  // Update media information display
  // Shows filename and clears other metadata fields
  updateInfo() {
    const fileName = this.video.src ? this.video.src.split('/').pop() : '';
    
    document.getElementById('mediaShow').textContent = '';
    document.getElementById('mediaClip').textContent = fileName || 'No media loaded';
    document.getElementById('mediaAuthor').textContent = '';
    document.getElementById('mediaCopyright').textContent = '';
  },

  // Seek to a specific position in the video
  // Value is a percentage (0-100) of total duration
  seek(value) {
    const time = (value / 100) * this.video.duration;
    this.video.currentTime = time;
  },

  // Set audio volume level
  // Value ranges from 0 (muted) to 100 (full volume)
  setVolume(value) {
    this.video.volume = value / 100;
  }
};

// MEDIA PLAYER INITIALIZATION
// Initialize when DOM is ready
// Uses a small delay to ensure all elements are properly loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => mediaPlayer.init(), 100);
  });
} else {
  setTimeout(() => mediaPlayer.init(), 100);
}