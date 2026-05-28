const STORY = {
  // Monolog pembuka setiap level (typewriter effect)
  levels: {
    1: {
      title: "Level 1: Ruang Gelap (The Confused Mind)",
      monologue: [
        "Dingin... Sangat dingin.",
        "Gelap sekali di sini. Aku hanya mendengar suara 'piip... piip...' lambat yang bergaung sangat jauh, seperti detak jantung buatan.",
        "Di mana aku? Dan bayangan merah mengerikan apa yang berkeliaran di luar sana?",
        "Apakah mereka malaikat maut... atau kepingan masa lalu yang menolak aku lepaskan?",
        "Hanya senter kecil di genggamanku ini yang menuntunku mencari jalan keluar..."
      ],
      shards: [
        "Sebuah gaun pesta merah muda terlipat rapi. Ibu membelikannya khusus untuk ulang tahunku yang ke-17 minggu lalu. Aku masih ingat kehangatan pelukannya saat mencium keningku...",
        "Boneka beruang kecil dengan sebelah mata kancing yang hilang. Lily, adik kecilku, selalu memeluknya erat-erat setiap kali ia ketakutan mendengar gemuruh petir di luar rumah..."
      ]
    },
    2: {
      title: "Level 2: Lorong Panjang (The Corridor of Nostalgia)",
      monologue: [
        "Lorong-lorong ini... terasa begitu panjang dan sunyi.",
        "Bentuknya menyerupai koridor sekolahku dulu. Aku ingat sering berlari di sini bersama adikku, Lily.",
        "Lalu mengapa bayangan merah itu terus mengejarku? Suara derap mereka terasa dingin.",
        "Apakah mereka adalah dokter yang mencoba menyadarkanku, memaksaku kembali ke tubuh yang penuh luka?"
      ],
      shards: [
        "Sebuah bingkai foto keluarga kecil di atas perapian. Senyum Ayah begitu lebar saat merangkul kami bertiga di bawah guyuran salju pertama tahun lalu. Bahagia itu sederhana...",
        "Kertas rapor sekolahku dengan coretan bintang merah dari Ibu. Di sudut kanan bawah tertulis rapi: 'Putri kesayangan Ibu yang paling pintar dan berani.' Air mataku terasa menetes..."
      ]
    },
    3: {
      title: "Level 3: Labirin Terkutuk (The Harsh Reality)",
      monologue: [
        "Suara sirine ambulans terus berdengung keras di kepalaku, menyakitkan.",
        "Mengapa semua pintu bertuliskan 'EXIT' di sini terasa seperti jebakan?",
        "Kemarin sayup-sayup kudengar dokter bilang peluangku bertahan hidup sangat tipis.",
        "Apakah pintu keluar yang asli akan membawaku bangun ke kenyataan, atau justru membawaku pergi selamanya?"
      ],
      shards: [
        "Sebuah gantungan kunci mobil berbentuk anjing kecil milik Ayah. Dia begitu bangga membelinya untuk menemani perjalanan liburan musim panas keluarga kami...",
        "Sepotong tiket perjalanan ke pantai bertanggal 27 Mei. Hari itu... hari di mana rem mobil tiba-tiba blong di jalan menurun curam saat hujan lebat mengguyur bumi..."
      ]
    },
    4: {
      title: "Level 4: Kegelapan Abadi (The Fading Heartbeat)",
      monologue: [
        "Senter ini... sinarnya semakin meredup, sama seperti kesadaranku yang kian terkikis.",
        "Bayangan merah itu... mengapa langkah mereka mulai terasa akrab? Mengapa mereka tidak terasa berbahaya lagi?",
        "Langkah mereka terdengar seperti... detak langkah kaki Ayah saat ia berlari memelukku di kala aku menangis ketakutan."
      ],
      shards: [
        "Genggaman tangan yang dingin namun erat di dalam ambulans yang berguncang hebat. Itu tangan Ibu yang dipenuhi luka dan darah, berbisik lirih: 'Clara sayang, bertahanlah...'",
        "Di ruang UGD yang terang benderang dan kacau, aku mendengar dokter berteriak panik: 'Resusitasi jantung gagal! Mulai lakukan CPR pada pasien kedua! Jantungnya berhenti berdenyut!'"
      ]
    },
    5: {
      title: "Level 5: Mimpi Buruk (The Final Choice)",
      monologue: [
        "Ini adalah ujungnya. Batas terakhir dari memoriku yang hancur berkeping-keping.",
        "Jika aku dipaksa kembali melalui pintu keluar palsu, aku hanya akan diselamatkan sebagai jasad koma di kasur rumah sakit selamanya, sendirian.",
        "Tetapi jika aku melangkah ke arah pintu keluar sejati... aku bisa melepaskan semua rasa sakit ini.",
        "Aku harus memilih, Clara."
      ],
      shards: [
        "Monitor detak jantung yang berbunyi sangat lambat. Di sebelah kananku, ranjang Lily kosong melompong. Ranjang Ayah dan Ibu pun kosong. Mereka semua... sudah pergi mendahuluiku.",
        "Suara dokter yang berbicara lirih di luar tirai ICU: 'Hanya gadis kecil ini yang selamat dari kecelakaan fatal itu. Namun kerusakan otaknya terlalu parah... dia mungkin tidak akan pernah bangun lagi.'"
      ]
    },
    6: {
      title: "Level 6: Batas Ambang (The Lingering Voices)",
      monologue: [
        "Aku pikir... jika aku melangkah melewati pintu itu, semuanya akan berakhir. Namun jiwaku menolak menyerah.",
        "Kudengar sayup-sayup suara bibi dan paman menangis di sisi ranjangku. Mereka memohon agar aku tidak pergi... 'Clara, kamulah satu-satunya yang tersisa dari keluarga kita... jangan tinggalkan kami...'",
        "Koridor ini dipenuhi oleh gema tangisan mereka yang mencintaiku di dunia nyata. Rasa sakit di tubuhku begitu nyata, disengat kejutan defibrillator berulang kali.",
        "Apakah bertahan sebagai raga tak berdaya adalah bentuk cinta, ataukah melepaskan adalah keberanian sejati?"
      ],
      shards: [
        "Sebuah selimut wol rajutan merah yang hangat. Bibi membuatkannya untukku saat aku demam tinggi sewaktu kecil. Hangatnya masih terasa, seolah ia sedang mendekap tubuh komaku saat ini...",
        "Coretan spidol di dinding koridor rumah sakit: 'Cepat sembuh Clara, kami menunggumu bermain lagi.' Itu tulisan tangan teman-teman sekolahku. Begitu banyak cinta yang menahanku di dunia ini..."
      ]
    },
    7: {
      title: "Level 7: Pusaran Acceptance (The Final Farewell)",
      monologue: [
        "Ini adalah pusaran terakhir. Detak jantungku melambat hingga hampir sunyi.",
        "Kepingan memoriku bersatu kembali. Aku tahu apa yang harus kulakukan sekarang.",
        "Aku tidak lagi takut pada bayangan merah itu. Mereka bukanlah monster... mereka adalah batas akhir kekuatan raga fana ini yang memudar.",
        "Terima kasih telah berjuang begitu keras untuk menyelamatkanku, Dokter. Namun, keluargaku menungguku di sana.",
        "Maafkan aku, Bibi, Paman, dan teman-temanku... Aku harus pergi menemui Ayah, Ibu, dan Lily.",
        "Perjalanan panjang ini akhirnya selesai. Cahaya putih di depanku terasa begitu hangat..."
      ],
      shards: [
        "Suara hangat Ibu yang berbisik lembut di telingaku: 'Anakku sayang, jika raga ini sudah terlalu lelah untuk bertahan, tidurlah... Ibu selalu ada di sini bersamamu...'",
        "Sebuah senyuman damai di wajah Clara. Dia tidak lagi memegang senter kecilnya. Kegelapan ini tidak lagi menakutkan, melainkan menjadi jembatan menuju pelukan abadi keluarganya..."
      ]
    }
  },

  // Teks jumpscare yang relevan dengan trauma medis/kecelakaan
  jumpscares: [
    "SUARA TABRAKAN BERGEMA! Kaca mobil pecah berkeping-keping!",
    "ALAT KEJUT JANTUNG DISENTAKKAN! Tubuhmu tersengat aliran listrik!",
    "DOKTER BERTERIAK: 'Detak jantungnya melemah! Lakukan kompresi dada!'",
    "INGATAN TRAGIS MENYERANG! Kamu tersedot kembali ke ruang operasi yang dingin!"
  ],

  // Ending Cerita (Win Level 5)
  ending: {
    title: "AKHIR DARI LABIRIN",
    lines: [
      "Clara perlahan menutup matanya dengan damai di atas ranjang ICU.",
      "Garis hijau di layar monitor rumah sakit perlahan berubah menjadi lurus sempurna, diiringi bunyi dengung panjang yang sunyi...",
      "Dia tidak lagi tersesat di dalam kegelapan labirin pikirannya yang dingin.",
      "Di ujung pintu cahaya putih yang hangat, Ayah, Ibu, dan Lily telah menunggunya dengan senyuman terbaik mereka.",
      "Langkah kakinya menjadi ringan, berlari memeluk mereka yang telah lama dirindukannya.",
      "Selamat tidur, Clara... perjuanganmu telah selesai dengan sangat indah."
    ]
  }
};
