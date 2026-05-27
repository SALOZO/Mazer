const UI = {
  game: null,
  totalLevels: 5,
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

      // Setup active observer
      this.setupCardObserver(levelGrid);
      
      // Setup drag and wheel scrolling
      this.initLevelGridScroll(levelGrid);
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

    const prevBtn = document.getElementById('btn-prev-level');
    const nextBtn = document.getElementById('btn-next-level');
    if (prevBtn) {
      prevBtn.onclick = () => {
        this.navigateLevelGrid('prev');
      };
    }
    if (nextBtn) {
      nextBtn.onclick = () => {
        this.navigateLevelGrid('next');
      };
    }

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
        if (this.isDragging) {
          this.isDragging = false;
          return;
        }
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
    this.scrollToLatestLevel();
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

  setupCardObserver(grid) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    }, {
      root: grid,
      threshold: 0.6
    });

    const cards = grid.querySelectorAll('.level-card');
    cards.forEach(card => observer.observe(card));
  },

  initLevelGridScroll(grid) {
    let isDown = false;
    let startX;
    let scrollLeft;
    this.isDragging = false;

    grid.addEventListener('mousedown', (e) => {
      isDown = true;
      this.isDragging = false;
      grid.classList.add('grabbing');
      startX = e.pageX - grid.offsetLeft;
      scrollLeft = grid.scrollLeft;
    });

    grid.addEventListener('mouseleave', () => {
      isDown = false;
      grid.classList.remove('grabbing');
    });

    grid.addEventListener('mouseup', () => {
      setTimeout(() => {
        isDown = false;
        grid.classList.remove('grabbing');
      }, 0);
    });

    grid.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - grid.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(x - startX) > 5) {
        this.isDragging = true;
      }
      grid.scrollLeft = scrollLeft - walk;
    });

    let wheelTimeout = null;
    grid.addEventListener('wheel', (e) => {
      const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;
      if (delta !== 0) {
        e.preventDefault();
        if (!wheelTimeout) {
          const direction = delta > 0 ? 'next' : 'prev';
          this.navigateLevelGrid(direction);
          wheelTimeout = setTimeout(() => {
            wheelTimeout = null;
          }, 400); // 400ms throttle to match the smooth scroll animation
        }
      }
    }, { passive: false });
  },

  navigateLevelGrid(direction) {
    const grid = document.getElementById('level-grid');
    if (!grid) return;

    const activeCards = Array.from(grid.querySelectorAll('.level-card.active'));
    if (activeCards.length > 0) {
      const gridCenter = grid.getBoundingClientRect().left + grid.offsetWidth / 2;
      let closestCard = activeCards[0];
      let minDiff = Infinity;
      activeCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const diff = Math.abs(cardCenter - gridCenter);
        if (diff < minDiff) {
          minDiff = diff;
          closestCard = card;
        }
      });

      const currentId = parseInt(closestCard.id.replace('level-card-', ''), 10);
      const targetId = direction === 'next' ? currentId + 1 : currentId - 1;
      if (targetId >= 1 && targetId <= this.maxLevelsGame) {
        this.scrollToLevel(targetId);
      }
    }
  },

  scrollToLevel(id) {
    const targetCard = document.getElementById(`level-card-${id}`);
    if (targetCard) {
      targetCard.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  },

  scrollToLatestLevel() {
    const levelGrid = document.getElementById('level-grid');
    if (!levelGrid) return;

    let latestId = 1;
    for (let i = 1; i <= this.totalLevels; i++) {
      if (Progress.isUnlocked(i)) {
        latestId = i;
      }
    }

    const targetCard = document.getElementById(`level-card-${latestId}`);
    if (targetCard) {
      setTimeout(() => {
        targetCard.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }, 100);
    }
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