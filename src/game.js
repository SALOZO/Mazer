const Game = {
  canvas: null,
  ctx: null,
  state: 'menu',    // menu | playing | jumpscare | gameover | win
  lives: 3,
  currentLevel: LEVEL_1,
  tick: 0,
  moveTimer: 0,
  moveDelay: 8,     // tick jeda antar gerak (anti-spam)

  init() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx    = this.canvas.getContext('2d');

    const { map, cellSize } = this.currentLevel;
    this.canvas.width  = map[0].length * cellSize;
    this.canvas.height = map.length    * cellSize;

    Keys.init();
    UI.init(this);

    // Jangan startLevel di sini — tunggu tombol MULAI ditekan
    this.state = 'menu';
    requestAnimationFrame(() => this.loop());
  },

  startLevel(level) {
    this.currentLevel = level;
    this.lives        = level.lives;
    this.state        = 'playing';
    this.tick         = 0;

    Maze.load(level);
    Player.init(level.playerStart.x, level.playerStart.y);
    EnemyManager.init(level.map);
    UI.updateLives(this.lives);
    UI.updateLevel(level.id);
  },

  respawn() {
    const level = this.currentLevel;
    Player.init(level.playerStart.x, level.playerStart.y);
    EnemyManager.init(level.map);
    this.state = 'playing';
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
    // Gerak player dengan jeda
    this.moveTimer++;
    if (this.moveTimer >= this.moveDelay) {
      const dir = Keys.getDirection();
      if (dir) {
        this.moveTimer = 0;
        const tile = Player.tryMove(dir.dx, dir.dy);

        if (tile === TILE.EXIT_REAL) {
          this.state = 'win';
          UI.showWin(this.tick);
          return;
        }
        if (tile === TILE.EXIT_FAKE) {
          this.triggerJumpscare('Itu bukan jalan keluar!');
          return;
        }
      }
    }

    // Update musuh
    EnemyManager.update();

    // Cek tabrakan musuh & player
    if (EnemyManager.checkCollision(Player.x, Player.y)) {
      this.triggerJumpscare('Kamu tertangkap!');
    }
  },

  triggerJumpscare(reason) {
    this.state = 'jumpscare';
    this.lives--;
    UI.updateLives(this.lives);
    Jumpscare.show(reason, () => {
      if (this.lives <= 0) {
        this.state = 'gameover';
        UI.showGameOver(reason);
      } else {
        this.respawn();
      }
    });
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
      Maze.render(ctx, brightness);
      EnemyManager.render(ctx, currentLevel.cellSize, brightness);
      Player.render(ctx, currentLevel.cellSize);
      Lighting.renderVignette(ctx, canvas.width, canvas.height);
    }
  },

  handleMobileDir(dx, dy) {
    if (this.state !== 'playing') return;
    const tile = Player.tryMove(dx, dy);
    if (tile === TILE.EXIT_REAL) {
      this.state = 'win';
      UI.showWin(this.tick);
    } else if (tile === TILE.EXIT_FAKE) {
      this.triggerJumpscare('Itu bukan jalan keluar!');
    } else if (EnemyManager.checkCollision(Player.x, Player.y)) {
      this.triggerJumpscare('Kamu tertangkap!');
    }
  },
}

window.addEventListener('load', () => Game.init());