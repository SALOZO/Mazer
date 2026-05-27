const Game = {
  canvas: null,
  ctx: null,
  state: 'menu',
  lives: 3,
  currentLevel: LEVEL_1,
  tick: 0,
  moveTimer: 0,
  moveDelay: 8,
  scale: 1,
  timeLeft: 0,      // ← detik tersisa
  lastSecondTick: 0, // ← untuk hitung detik
  eyeShown: false,  
  eyeTimer: null, 

  init() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx    = this.canvas.getContext('2d');

    const { map, cellSize } = this.currentLevel;
    this.canvas.width  = map[0].length * cellSize;
    this.canvas.height = map.length * cellSize;

    Keys.init();
    Audio.init();
    UI.init(this);

    this.state = 'menu';
    window.addEventListener('resize', () => this.resizeCanvas());
    requestAnimationFrame(() => this.loop());
  },

  resizeCanvas() {
    if (!this.currentLevel || (this.state !== 'playing' && this.state !== 'jumpscare')) return;

    const { map, cellSize } = this.currentLevel;
    const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    const maxW = window.innerWidth  - 32;
    const maxH = window.innerHeight - (isMobile ? 180 : 140);
    const mapW = map[0].length * cellSize;
    const mapH = map.length    * cellSize;
    const scale = Math.min(1, maxW / mapW, maxH / mapH);
    const finalW = Math.floor(mapW * scale);
    const finalH = Math.floor(mapH * scale);

    this.canvas.width  = finalW;
    this.canvas.height = finalH;
    this.canvas.style.width  = finalW + 'px';
    this.canvas.style.height = finalH + 'px';
    this.scale = scale;

    const hud = document.getElementById('hud');
    if (hud) {
      hud.style.width = finalW + 'px';
    }
  },

  startLevel(level) {
    this.currentLevel = level;
    this.lives        = level.lives;
    this.state        = 'playing';
    this.tick         = 0;
    this.moveTimer    = 0;
    this.timeLeft     = level.timeLimit ?? 120;
    this.lastSecondTick = 0;

    this.resizeCanvas();
    // Jalankan ulang resizeCanvas dengan sedikit delay untuk memastikan layout browser mobile sudah stabil setelah transisi screen
    setTimeout(() => this.resizeCanvas(), 50);

    Maze.load(level);
    Player.init(level.playerStart.x, level.playerStart.y);
    EnemyManager.init(level.map);
    UI.updateLives(this.lives);
    UI.updateLevel(level.id);
    UI.updateTimer(this.timeLeft);

    this.eyeShown = false;
    if (this.eyeTimer) clearTimeout(this.eyeTimer);
  },

  respawn() {
    const level = this.currentLevel;
    this.state  = 'playing';
    this.tick   = 0;
    this.lastSecondTick = 0;
    // Timer TIDAK direset saat respawn — terus hitung mundur
    Maze.load(level);
    Player.init(level.playerStart.x, level.playerStart.y);
    EnemyManager.init(level.map);
  },

  loop() {
    if (this.state === 'playing') {
      this.tick++;
      this.update();
    }
    this.render();
    requestAnimationFrame(() => this.loop());
  },

  update() {
    // Hitung mundur timer — kurangi 1 detik setiap 60 tick
    this.lastSecondTick++;
    if (!this.eyeShown && this.currentLevel.timeLimit - this.timeLeft >= 10) {
      this.eyeShown = true;
      this.showEyeFlash();
    }
    if (this.lastSecondTick >= 60) {
      this.lastSecondTick = 0;
      this.timeLeft--;
      UI.updateTimer(this.timeLeft);

      // Waktu habis → jumpscare lalu game over
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.lives = 0; // paksa lives 0 supaya langsung game over
        this.triggerJumpscare('Waktu habis!');
        return;
      }
    }

    // Gerak player
    this.moveTimer++;
    if (this.moveTimer >= this.moveDelay) {
      const dir = Keys.getDirection();
      if (dir) {
        this.moveTimer = 0;
        const tile = Player.tryMove(dir.dx, dir.dy);

        if (tile === TILE.EXIT_REAL) {
          this.state = 'win';
          Progress.unlockNext(this.currentLevel.id);
          UI.showWin(this.currentLevel.timeLimit - this.timeLeft);
          return;
        }
        if (tile === TILE.EXIT_FAKE) {
          this.triggerJumpscare('Itu bukan jalan keluar!');
          return;
        }
      }
    }

    EnemyManager.update();

    if (EnemyManager.checkCollision(Player.x, Player.y)) {
      this.triggerJumpscare('Kamu tertangkap!');
    }
  },

  triggerJumpscare(reason) {
    if (this.state === 'jumpscare') return; // cegah double trigger
    this.state = 'jumpscare';
    this.lives--;
    UI.updateLives(this.lives);
    Audio.stop('footstep');
    Audio.play('jumpscare');
    const self = this;
    Jumpscare.show(reason, () => {
      if (self.lives <= 0) {
        self.state = 'gameover';
        UI.showGameOver(reason);
      } else {
        self.respawn();
      }
    });
  },

  showEyeFlash() {
    const el  = document.getElementById('eye-flash');
    const img = document.getElementById('eye-img');

    // Muncul
    el.classList.remove('hidden');
    img.style.opacity = '1';

    this.eyeTimer = setTimeout(() => {
      img.style.opacity = '0';
      setTimeout(() => {
        el.classList.add('hidden');
      }, 100);
    }, 450);
  },

  render() {
    const { ctx, canvas, currentLevel } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (this.state === 'playing' || this.state === 'jumpscare') {
      const brightness = Lighting.compute(
        Player.x, Player.y,
        currentLevel.map,
        currentLevel.lightRadius
      );

      ctx.save();
      ctx.scale(this.scale, this.scale);
      Maze.render(ctx, brightness);
      EnemyManager.render(ctx, currentLevel.cellSize, brightness);
      Player.render(ctx, currentLevel.cellSize);
      ctx.restore();

      Lighting.renderVignette(ctx, canvas.width, canvas.height);
    }
  },

  handleMobileDir(dx, dy) {
    if (this.state !== 'playing') return;
    const tile = Player.tryMove(dx, dy);
    if (tile === TILE.EXIT_REAL) {
      this.state = 'win';
      Progress.unlockNext(this.currentLevel.id);
      UI.showWin(this.currentLevel.timeLimit - this.timeLeft);
    } else if (tile === TILE.EXIT_FAKE) {
      this.triggerJumpscare('Itu bukan jalan keluar!');
    } else if (EnemyManager.checkCollision(Player.x, Player.y)) {
      this.triggerJumpscare('Kamu tertangkap!');
    }
  },
};

window.addEventListener('load', () => Game.init());