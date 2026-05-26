const Progress = {
  // Untuk tambah level baru
  LEVELS: [LEVEL_1, LEVEL_2, LEVEL_3,LEVEL_4,LEVEL_5],

  // Ambil progress dari localStorage
  load() {
    try {
      const saved = localStorage.getItem('mazer_progress');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    // Default: hanya level 1 yang terbuka
    return { unlockedLevel: 1 };
  },

  // Simpan progress ke localStorage
  save(data) {
    try {
      localStorage.setItem('mazer_progress', JSON.stringify(data));
    } catch(e) {}
  },

  // Unlock level berikutnya setelah menang
  unlockNext(currentLevelId) {
    const data = this.load();
    if (currentLevelId >= data.unlockedLevel) {
      data.unlockedLevel = currentLevelId + 1;
      this.save(data);
    }
  },

  // Cek apakah level tertentu sudah terbuka
  isUnlocked(levelId) {
    const data = this.load();
    return levelId <= data.unlockedLevel;
  },

  // Ambil data level berdasarkan id
  getLevel(id) {
    return this.LEVELS.find(l => l.id === id) ?? LEVEL_1;
  },
};