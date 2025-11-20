const mediaPlayer = {
  video: null,
  seekbar: null,
  volume: null,
  logo: null,

  init() {
    this.video = document.getElementById('mediaVideo');
    this.seekbar = document.getElementById('seekbar');
    this.volume = document.getElementById('volume');
    this.logo = document.getElementById('mediaLogo');

    if (!this.video) return;

    // Event listeners
    this.video.addEventListener('timeupdate', () => this.updateSeekbar());
    this.video.addEventListener('loadedmetadata', () => this.updateInfo());
    this.video.addEventListener('play', () => this.onPlay());
    this.video.addEventListener('pause', () => this.onPause());
    this.video.addEventListener('ended', () => this.onStop());
    
    this.seekbar.addEventListener('input', (e) => this.seek(e.target.value));
    this.volume.addEventListener('input', (e) => this.setVolume(e.target.value));

    // Set initial volume
    this.video.volume = 0.5;
    
    // Show logo initially
    this.showLogo();
  },

  showLogo() {
    if (this.logo && this.video) {
      this.logo.style.display = 'block';
      this.video.style.display = 'none';
    }
  },

  hideLogo() {
    if (this.logo && this.video) {
      this.logo.style.display = 'none';
      this.video.style.display = 'block';
    }
  },

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

  pause() {
    this.video.pause();
  },

  stop() {
    this.video.pause();
    this.video.currentTime = 0;
    this.showLogo();
    this.updateInfo();
  },

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

  updateSeekbar() {
    if (this.video.duration) {
      const value = (this.video.currentTime / this.video.duration) * 100;
      this.seekbar.value = value;
    }
  },

  updateInfo() {
    const fileName = this.video.src ? this.video.src.split('/').pop() : '';
    
    document.getElementById('mediaShow').textContent = '';
    document.getElementById('mediaClip').textContent = fileName || 'No media loaded';
    document.getElementById('mediaAuthor').textContent = '';
    document.getElementById('mediaCopyright').textContent = '';
  },

  seek(value) {
    const time = (value / 100) * this.video.duration;
    this.video.currentTime = time;
  },

  setVolume(value) {
    this.video.volume = value / 100;
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => mediaPlayer.init(), 100);
  });
} else {
  setTimeout(() => mediaPlayer.init(), 100);
}