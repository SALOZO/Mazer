const UI = {
  game: null,

  init(gameRef) {
    this.game = gameRef;
    Jumpscare.init();

    document.getElementById('screen-splash').onclick = () => {
      document.getElementById('screen-splash').classList.add('hidden');
      document.getElementById('screen-menu').classList.remove('hidden');
      Audio.play('menu');
    };

    document.getElementById('btn-start').onclick = () => {
      this.goLevelSelect();  // ← ke pilih level, bukan langsung game
      // Musik menu tetap jalan, tidak dihentikan
    };
    // Pilih level → kembali ke menu
    document.getElementById('btn-back').onclick = () => {
      this.showScreen('screen-menu');
    };

    // Klik level 1
    document.getElementById('level-card-1').onclick = () => {
      if (!Progress.isUnlocked(1)) return;
      Audio.stop('menu');
      this.showScreen('screen-game');
      this.game.startLevel(Progress.getLevel(1));
    };

    document.getElementById('level-card-2').onclick = () => {
      if (!Progress.isUnlocked(2)) return;
      Audio.stop('menu');
      this.showScreen('screen-game');
      this.game.startLevel(Progress.getLevel(2));
    };

    // document.getElementById('btn-start').onclick  = () => this.startGame();
    document.getElementById('btn-retry').onclick  = () => this.retry();
    document.getElementById('btn-menu').onclick   = () => this.goMenu();
    document.getElementById('btn-next').onclick   = () => this.goLevelSelect();
    document.getElementById('btn-menu-win').onclick = () => this.goMenu();

    // Tombol mobile
    document.getElementById('ctrl-up').addEventListener('touchstart',    (e) => { e.preventDefault(); this.game.handleMobileDir(0,-1); });
    document.getElementById('ctrl-down').addEventListener('touchstart',  (e) => { e.preventDefault(); this.game.handleMobileDir(0,1); });
    document.getElementById('ctrl-left').addEventListener('touchstart',  (e) => { e.preventDefault(); this.game.handleMobileDir(-1,0); });
    document.getElementById('ctrl-right').addEventListener('touchstart', (e) => { e.preventDefault(); this.game.handleMobileDir(1,0); });
  },

  showScreen(id) {
    ['screen-menu','screen-game','screen-gameover','screen-win','screen-levels'].forEach(s => {
      document.getElementById(s).classList.add('hidden');
    });
    document.getElementById(id).classList.remove('hidden');
  },

  startGame() {
    Audio.stop('menu'); 
    this.showScreen('screen-game');
    this.game.startLevel(LEVEL_1);
  },

  retry() {
    this.showScreen('screen-game');
    this.game.startLevel(this.game.currentLevel);
  },

  goLevelSelect() {
    this.refreshLevelCards(); 
    this.showScreen('screen-levels');
    if (!Audio.muted) Audio.play('menu');
  },

  refreshLevelCards() {
    [1, 2].forEach(id => {
      const card   = document.getElementById(`level-card-${id}`);
      const status = document.getElementById(`level-status-${id}`);
      if (!card) return;

      if (Progress.isUnlocked(id)) {
        card.classList.remove('locked');
        if (status) status.textContent = 'TERSEDIA';
      } else {
        card.classList.add('locked');
        if (status) status.textContent = 'TERKUNCI';
      }
    });
  },

  goMenu() {
    this.showScreen('screen-menu');
    this.game.state = 'menu';
    if (!Audio.muted) Audio.play('menu');
  },

  updateLives(lives) {
    const icons = ['♡ ♡ ♡','♥ ♡ ♡','♥ ♥ ♡','♥ ♥ ♥'];
    document.getElementById('hud-lives').textContent = icons[lives] ?? '♡ ♡ ♡';
  },

  updateLevel(id) {
    document.getElementById('hud-level').textContent = `Level ${id}`;
  },

  showGameOver(reason) {
    this.showScreen('screen-gameover');
    document.getElementById('gameover-msg').textContent = reason;
  },

  showWin(ticks) {
    this.showScreen('screen-win');
    const detik = Math.floor(ticks / 60);
    document.getElementById('win-msg').textContent = `Waktu: ${detik} detik`;
  },
};