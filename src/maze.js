// Tipe tile
const TILE = {
  WALL:       1,
  FLOOR:      0,
  EXIT_REAL:  2,
  EXIT_FAKE:  3,
  ENEMY_SPAWN:4,
};

// Warna tiap tile (saat terang penuh)
const TILE_COLOR = {
  [TILE.WALL]:        '#050505',
  [TILE.FLOOR]:       '#3a3a3a',
  [TILE.EXIT_REAL]:   '#1a4a1a',
  [TILE.EXIT_FAKE]:   '#4a3a00',
  [TILE.ENEMY_SPAWN]: '#2a2a2a',
};

// Warna tanda pintu (ikon kecil di tengah tile)
const EXIT_ICON_COLOR = {
  [TILE.EXIT_REAL]: '#00ff44',
  [TILE.EXIT_FAKE]: '#00ff44',
};

const Maze = {
  data: null,   // level yang sedang aktif

  load(levelData) {
    this.data = levelData;
  },

  // Cek apakah tile di (x, y) bisa dilewati
  isWalkable(x, y) {
    const map = this.data.map;
    if (y < 0 || y >= map.length) return false;
    if (x < 0 || x >= map[0].length) return false;
    return map[y][x] !== TILE.WALL;
  },

  // Ambil tipe tile di koordinat (x, y)
  getTile(x, y) {
    const map = this.data.map;
    if (y < 0 || y >= map.length) return TILE.WALL;
    if (x < 0 || x >= map[0].length) return TILE.WALL;
    return map[y][x];
  },

  // Render semua tile dengan efek brightness dari lighting
  render(ctx, brightnessMap) {
    const { map, cellSize } = this.data;

    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[0].length; col++) {

        const brightness = brightnessMap[row]?.[col] ?? 0;
        if (brightness <= 0) continue; // tile gelap total, skip

        const tile = map[row][col];
        const baseColor = TILE_COLOR[tile] ?? TILE_COLOR[TILE.FLOOR];

        // Gambar tile dengan brightness
        ctx.fillStyle = applyBrightness(baseColor, brightness);
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);

        // Gambar ikon pintu kalau tile adalah exit
        if (tile === TILE.EXIT_REAL || tile === TILE.EXIT_FAKE) {
          const iconColor = EXIT_ICON_COLOR[tile];
          ctx.fillStyle = applyBrightness(iconColor, brightness);
          const padding = cellSize * 0.25;
          ctx.fillRect(
            col * cellSize + padding,
            row * cellSize + padding,
            cellSize - padding * 2,
            cellSize - padding * 2
          );

          // Label teks "KELUAR"
          ctx.fillStyle = applyBrightness('#ffffff', brightness * 0.8);
          ctx.font = `bold ${cellSize * 0.22}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            'EXIT',
            col * cellSize + cellSize / 2,
            row * cellSize + cellSize / 2
          );
        }
      }
    }
  },
};

// Helper: terapkan brightness ke warna hex
// brightness: 0.0 (gelap) → 1.0 (terang penuh)
function applyBrightness(hex, brightness) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const factor = Math.max(0, Math.min(1, brightness));
  return `rgb(${Math.floor(r*factor)},${Math.floor(g*factor)},${Math.floor(b*factor)})`;
}