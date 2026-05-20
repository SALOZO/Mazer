const UI = {
  game: null,
  totalLevels: 3,
  maxLevelsGame: 20,

  init(gameRef) {
    this.game = gameRef;
    Jumpscare.init();

    const levelGrid = document.getElementById('level-grid');
    if (levelGrid) {
      levelGrid.innerHTML = ''; // Pastikan bersih terlebih dahulu
      
      for (let i = 1; i <= this.maxLevelsGame; i++) {
        // Buat element card
        const card = document.createElement('div');
        card.className = 'level-card';
        card.id = `level-card-${i}`;

        // Buat nomor level
        const numSpan = document.createElement('span');
        numSpan.className = 'level-num';
        numSpan.textContent = i;

        // Buat status level
        const statusSpan = document.createElement('span');
        statusSpan.className = 'level-status';
        statusSpan.id = `level-status-${i}`;

        // Masukkan komponen ke dalam kartu, lalu masukkan kartu ke grid
        card.appendChild(numSpan);
        card.appendChild(statusSpan);
        levelGrid.appendChild(card);
      }
    }

    document.getElementById('screen-splash').onclick = () => {
      document.getElementById('screen-splash').classList.add('hidden');
      document.getElementById('popup-tutorial').classList.remove('hidden');
      document.getElementById('screen-menu').classList.remove('hidden');
      Audio.play('menu');
    };

    document.getElementById('btn-tutorial-close').onclick = () => {
      document.getElementById('popup-tutorial').classList.add('hidden');
      document.getElementById('screen-menu').classList.remove('hidden');
    };

    document.getElementById('btn-start').onclick = () => {
      this.goLevelSelect();
    };
    // Pilih level → kembali ke menu
    document.getElementById('btn-back').onclick = () => {
      this.showScreen('screen-menu');
    };

        // Tombol info
    document.getElementById('btn-info').onclick = () => {
      document.getElementById('popup-info').classList.remove('hidden');
    };

    // Tutup popup
    document.getElementById('popup-close').onclick = () => {
      document.getElementById('popup-info').classList.add('hidden');
    };

    // Klik di luar popup juga menutup
    document.getElementById('popup-info').onclick = (e) => {
      if (e.target.id === 'popup-info') {
        document.getElementById('popup-info').classList.add('hidden');
      }
    };

    if (levelGrid) {
      levelGrid.onclick = (e) => {
        const card = e.target.closest('.level-card');
        if (!card) return;

        const id = parseInt(card.id.replace('level-card-', ''), 10);

        // Jika level berstatus Coming Soon atau dikunci oleh sistem, abaikan klik
        if (card.classList.contains('coming-soon') || !Progress.isUnlocked(id)) {
          e.preventDefault();
          return;
        }

        Audio.stop('menu');
        this.showScreen('screen-game');
        this.game.startLevel(Progress.getLevel(id));
      };
    }

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

    const btnInfo = document.getElementById('btn-info');
      if (id === 'screen-game') {
        btnInfo.classList.add('hidden');
      } else {
        btnInfo.classList.remove('hidden');
      }
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
    // Ambil semua elemen HTML yang id-nya diawali dengan 'level-card-'
    const allCards = document.querySelectorAll('[id^="level-card-"]');

    allCards.forEach(card => {
      const id = parseInt(card.id.replace('level-card-', ''), 10);
      const status = document.getElementById(`level-status-${id}`);
      
      // Reset class bawaan dulu agar tidak menumpuk saat refresh
      card.classList.remove('locked', 'coming-soon');

      if (id > this.totalLevels) {
        // Otomatis jadi Coming Soon jika angka id melewati totalLevels yang rilis
        card.classList.add('locked', 'coming-soon');
        if (status) status.textContent = 'COMING SOON';
      } else if (!Progress.isUnlocked(id)) {
        // Otomatis terkunci jika belum di-unlock di Progress player
        card.classList.add('locked');
        if (status) status.textContent = 'TERKUNCI';
      } else {
        // Terbuka dan siap dimainkan
        if (status) status.textContent = ''; // Atau dikosongkan/diisi skor
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

  updateTimer(seconds) {
    const menit = Math.floor(seconds / 60);
    const detik = seconds % 60;
    const str   = `${menit}:${detik.toString().padStart(2, '0')}`;
    const el    = document.getElementById('hud-timer');
    el.textContent = str;

    // Warna merah berkedip kalau sisa waktu kurang dari 15 detik
    if (seconds <= 15) {
      el.style.color = '#f00';
      el.style.animation = 'pulse 0.5s infinite';
    } else if (seconds <= 30) {
      el.style.color = '#fa4';
      el.style.animation = 'none';
    } else {
      el.style.color = '#aaa';
      el.style.animation = 'none';
    }
  },

  showGameOver(reason) {
    this.showScreen('screen-gameover');
    document.getElementById('gameover-msg').textContent = reason;
  },

  // showWin(ticks) {
  //   this.showScreen('screen-win');
  //   const detik = Math.floor(ticks / 60);
  //   document.getElementById('win-msg').textContent = `Waktu: ${detik} detik`;
  // },

  showWin(detikDipakai) {
    Audio.stop('footstep');
    this.showScreen('screen-win');
    document.getElementById('win-msg').textContent = `Waktu: ${detikDipakai} detik`;
  },
};