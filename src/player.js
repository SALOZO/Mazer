const Player = {
  x: 1,
  y: 1,
  moving: false,   // cooldown supaya tidak meluncur

  init(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.moving = false;
  },

  // Coba gerak ke arah (dx, dy)
  // Return tipe tile yang dituju (untuk cek interaksi)
  tryMove(dx, dy) {
    const nx = this.x + dx;
    const ny = this.y + dy;

    if (!Maze.isWalkable(nx, ny)) return null; // nabrak dinding

    this.x = nx;
    this.y = ny;
    return Maze.getTile(nx, ny);
  },

  render(ctx, cellSize) {
    const cx = this.x * cellSize + cellSize / 2;
    const cy = this.y * cellSize + cellSize / 2;
    const r  = cellSize / 2 - 6;

    // Lingkaran biru — body player
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = '#4af';
    ctx.fill();

    // Titik putih di tengah
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  },
};

// ====== Input keyboard ======
const Keys = {
  pressed: {},

  init() {
    window.addEventListener('keydown', (e) => {
      // Cegah scroll halaman saat main
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) {
        e.preventDefault();
      }
      this.pressed[e.key] = true;
    });
    window.addEventListener('keyup', (e) => {
      this.pressed[e.key] = false;
    });
  },

  // Ambil arah gerak dari input, return {dx, dy} atau null
  getDirection() {
    if (this.pressed['ArrowUp']    || this.pressed['w'] || this.pressed['W']) return { dx: 0,  dy: -1 };
    if (this.pressed['ArrowDown']  || this.pressed['s'] || this.pressed['S']) return { dx: 0,  dy:  1 };
    if (this.pressed['ArrowLeft']  || this.pressed['a'] || this.pressed['A']) return { dx: -1, dy:  0 };
    if (this.pressed['ArrowRight'] || this.pressed['d'] || this.pressed['D']) return { dx: 1,  dy:  0 };
    return null;
  },
};