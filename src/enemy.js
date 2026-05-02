const EnemyManager = {
  enemies: [],

  init(map) {
    this.enemies = [];
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[0].length; col++) {
        if (map[row][col] === TILE.ENEMY_SPAWN) {
          this.enemies.push({
            x: col, y: row,
            dx: 1, dy: 0,   // arah gerak awal
            timer: 0,
            moveInterval: 20, // tick per langkah
          });
        }
      }
    }
  },

  update() {
    for (const e of this.enemies) {
      e.timer++;
      if (e.timer < e.moveInterval) continue;
      e.timer = 0;

      const nx = e.x + e.dx;
      const ny = e.y + e.dy;

      // Coba lurus dulu
      if (Maze.isWalkable(nx, ny)) {
        e.x = nx;
        e.y = ny;
      } else {
        // Kalau nabrak, ganti arah random
        const dirs = [{dx:1,dy:0},{dx:-1,dy:0},{dx:0,dy:1},{dx:0,dy:-1}];
        const valid = dirs.filter(d => Maze.isWalkable(e.x + d.dx, e.y + d.dy));
        if (valid.length > 0) {
          const chosen = valid[Math.floor(Math.random() * valid.length)];
          e.dx = chosen.dx;
          e.dy = chosen.dy;
          e.x += e.dx;
          e.y += e.dy;
        }
      }
    }
  },

  // Cek apakah ada musuh yang menabrak player
  checkCollision(playerX, playerY) {
    return this.enemies.some(e => e.x === playerX && e.y === playerY);
  },

  render(ctx, cellSize, brightnessMap) {
    for (const e of this.enemies) {
      const brightness = brightnessMap[e.y]?.[e.x] ?? 0;
      if (brightness <= 0.05) continue; // musuh gelap, tidak terlihat

      const cx = e.x * cellSize + cellSize / 2;
      const cy = e.y * cellSize + cellSize / 2;
      const r  = cellSize / 2 - 6;

      // Lingkaran merah
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 30, 30, ${brightness})`;
      ctx.fill();

      // Simbol X
      ctx.fillStyle = `rgba(255,255,255,${brightness})`;
      ctx.font = `bold ${cellSize * 0.4}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('X', cx, cy + 1);
    }
  },
};