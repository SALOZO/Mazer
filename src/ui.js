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

    document.getElementById('btn-start').onclick  = () => this.startGame();
    document.getElementById('btn-retry').onclick  = () => this.retry();
    document.getElementById('btn-menu').onclick   = () => this.goMenu();
    document.getElementById('btn-next').onclick   = () => this.retry();
    document.getElementById('btn-menu-win').onclick = () => this.goMenu();

    // Tombol mobile
    document.getElementById('ctrl-up').addEventListener('touchstart',    (e) => { e.preventDefault(); this.game.handleMobileDir(0,-1); });
    document.getElementById('ctrl-down').addEventListener('touchstart',  (e) => { e.preventDefault(); this.game.handleMobileDir(0,1); });
    document.getElementById('ctrl-left').addEventListener('touchstart',  (e) => { e.preventDefault(); this.game.handleMobileDir(-1,0); });
    document.getElementById('ctrl-right').addEventListener('touchstart', (e) => { e.preventDefault(); this.game.handleMobileDir(1,0); });
  },

  showScreen(id) {
    ['screen-menu','screen-game','screen-gameover','screen-win'].forEach(s => {
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

  goMenu() {
    Audio.stop('background');
    this.showScreen('screen-menu');
    this.game.state = 'menu';
    Audio.play('menu');
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