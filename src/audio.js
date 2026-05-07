const Audio = {

  sounds: {},
  muted: false,

  files: {
    menu: 'assets/sounds/menu.mp3',
    jumpscare:  'assets/sounds/jumpscare.mp3',
    footstep:   'assets/sounds/footstep.mp3',
  },

  init() {
    for (const [key, src] of Object.entries(this.files)) {
      const audio = new window.Audio(src);

      if (key === 'menu') {
        audio.loop   = true;  
        audio.volume = 0.4;    
      }

      if (key === 'footstep') {
        audio.volume = 0.3;
      }

      if (key === 'jumpscare') {
        audio.volume = 0.8;    
      }

      this.sounds[key] = audio;
    }
  },

  play(key) {
    if (this.muted) return;
    const sound = this.sounds[key];
    if (!sound) return;


    sound.currentTime = 0;
    sound.play().catch(() => {
    });
  },

  stop(key) {
    const sound = this.sounds[key];
    if (!sound) return;
    sound.pause();
    sound.currentTime = 0;
  },

  playWithVolume(key, volume) {
    if (this.muted) return;
    const sound = this.sounds[key];
    if (!sound) return;
    sound.volume      = Math.max(0, Math.min(1, volume));
    sound.currentTime = 0;
    sound.play().catch(() => {});
  },

  // Pause background tanpa reset posisi
  pauseBackground() {
    this.sounds['background']?.pause();
  },

  resumeBackground() {
    if (this.muted) return;
    this.sounds['background']?.play().catch(() => {});
  },

  // Toggle mute semua suara
  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.pauseBackground();
    } else {
      this.resumeBackground();
    }
    return this.muted;
  },
};