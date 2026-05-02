const Lighting = {

  compute(playerX, playerY, map, lightRadius) {
    const rows = map.length;
    const cols = map[0].length;

    // Buat grid brightness, semua gelap dulu
    const brightness = [];
    for (let r = 0; r < rows; r++) {
      brightness[r] = new Array(cols).fill(0);
    }

    // Tile tempat player selalu terang penuh
    brightness[playerY][playerX] = 1;

    // Tembak sinar ke segala arah (semakin banyak sudut, semakin halus)
    const RAY_COUNT = 360;
    const STEP      = 0.4;  // seberapa halus tiap sinar melangkah (lebih kecil = lebih akurat)

    for (let i = 0; i < RAY_COUNT; i++) {
      const angle = (i / RAY_COUNT) * Math.PI * 2;
      const cos   = Math.cos(angle);
      const sin   = Math.sin(angle);

      let rx = playerX + 0.5;  // mulai dari tengah tile player
      let ry = playerY + 0.5;

      for (let dist = 0; dist < lightRadius; dist += STEP) {
        rx += cos * STEP;
        ry += sin * STEP;

        const tileX = Math.floor(rx);
        const tileY = Math.floor(ry);

        // Keluar dari batas map
        if (tileY < 0 || tileY >= rows || tileX < 0 || tileX >= cols) break;

        // Hitung brightness berdasarkan jarak
        const b = Math.pow(1 - dist / lightRadius, 0.8);

        // Update hanya kalau lebih terang dari nilai sebelumnya
        if (b > brightness[tileY][tileX]) {
          brightness[tileY][tileX] = b;
        }

        // Sinar berhenti saat menabrak dinding
        if (map[tileY][tileX] === TILE.WALL) {
          // Tetap terangi dinding yang kena sinar (supaya dinding terlihat)
          break;
        }
      }
    }

    return brightness;
  },

  renderVignette(ctx, canvasW, canvasH) {
    const gradient = ctx.createRadialGradient(
      canvasW / 2, canvasH / 2, canvasH * 0.2,
      canvasW / 2, canvasH / 2, canvasH * 0.85
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasW, canvasH);
  },
};