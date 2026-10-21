import { ForeignNation, TimelineEvent, SpiceItem, QuizQuestion } from '../types/history';

export const LATAR_BELAKANG = {
  judul: 'Latar Belakang Kedatangan Bangsa Asing ke Indonesia',
  ringkasan: 'Indonesia sejak dahulu dikenal sebagai wilayah yang kaya akan rempah-rempah, seperti cengkih, pala, dan lada. Rempah-rempah sangat dibutuhkan di Eropa untuk bumbu masakan, pengawet makanan, dan bahan obat-obatan.',
  faktorUtama: [
    {
      judul: 'Kekayaan Rempah-Rempah Nusantara',
      deskripsi: 'Nusantara merupakan penghasil utama cengkih (Ternate & Tidore), pala (Kepulauan Banda), dan lada (Banten & Sumatera) yang tidak dapat tumbuh di iklim dingin Eropa.',
      icon: 'sparkles'
    },
    {
      judul: 'Kebutuhan Vital di Benua Eropa',
      deskripsi: 'Rempah-rempah digunakan sebagai bahan pengawet daging selama musim dingin, bumbu masakan mewah kaum bangsawan, serta ramuan obat-obatan herbal.',
      icon: 'flame'
    },
    {
      judul: 'Terganggunya Jalur Perdagangan Darat',
      deskripsi: 'Jatuhnya Konstantinopel ke Kesultanan Utsmaniyah pada tahun 1453 menyebabkan jalur perdagangan darat dan laut Mediterania tertutup serta harga rempah melonjak drastis.',
      icon: 'shield-alert'
    },
    {
      judul: 'Misi Penjelajahan Samudra Langsung',
      deskripsi: 'Bangsa-bangsa Eropa terdorong mencari jalur laut langsung ke Asia dan Kepulauan Nusantara untuk memotong perantara dagang dan memperoleh keuntungan maksimal.',
      icon: 'compass'
    }
  ]
};

export const BANGSA_ASING: Record<string, ForeignNation> = {
  portugis: {
    id: 'portugis',
    name: 'Portugis',
    formalName: 'Kerajaan Portugal (Reino de Portugal)',
    flagEmoji: '🇵🇹',
    flagColors: ['#046A38', '#DA291C', '#FFD700'],
    coatOfArmsSymbol: 'Esfera Armilar & Quinas',
    motto: 'Visita Interiora Terrae',
    badgeColor: 'bg-emerald-900/80 text-emerald-200 border-emerald-600/40',
    accentColor: '#10b981',
    firstYear: '1511 - 1512',
    firstIslandArrival: 'Kepulauan Maluku (Ternate & Hitu)',
    primaryPort: 'Malaka (1511) lalu Ternate & Banda (1512)',
    expeditionLeaders: ['Afonso de Albuquerque (Malaka)', 'Francisco Serrão', 'António de Abreu'],
    shipType: 'Karavel & Nau (Karaka Portugis)',
    routeSummary: ['Eropa', 'Pantai Barat Afrika', 'Tanjung Harapan', 'India (Goa)', 'Malaka (1511)', 'Maluku (1512)'],
    jalurUmumText: 'Eropa -> pantai barat Afrika -> Tanjung Harapan -> India -> Malaka -> Maluku.',
    tahunPentingText: '1511 menaklukkan Malaka; pada 1512 ekspedisi Portugis tiba di Maluku.',
    alasanDatang: [
      'Mencari sumber rempah-rempah, terutama cengkih dan pala.',
      'Menguasai jalur perdagangan di Asia.',
      'Memperoleh keuntungan dari perdagangan.',
      'Menyebarkan agama Katolik melalui kegiatan misi (3G: Gold, Glory, Gospel).'
    ],
    perkembanganText: 'Portugis berusaha menguasai perdagangan rempah-rempah di Maluku dan membangun hubungan maupun persaingan dengan kerajaan setempat. Di Ternate, Portugis sempat mendirikan Benteng Kastela (São João Baptista) sebelum akhirnya diusir oleh Sultan Baabullah pada tahun 1575.',
    interestingFact: 'Ekspedisi António de Abreu dan Francisco Serrão pada tahun 1512 menjadi kapal Eropa pertama yang menginjakkan kaki langsung di "Kepulauan Rempah" (The Spice Islands).',
    svgRoute: {
      id: 'route-portugis',
      title: 'Rute Pelayaran Portugis ke Maluku',
      pathD: 'M 60 210 Q 140 215 195 235 Q 260 290 350 340 Q 520 380 670 340 Q 730 310 785 270',
      startPoint: { x: 60, y: 210, label: 'Dari India (Goa)' },
      intermediatePoints: [
        { x: 195, y: 235, label: 'Malaka (1511)' },
        { x: 350, y: 340, label: 'Laut Jawa' },
        { x: 670, y: 340, label: 'Laut Banda' }
      ],
      firstArrivalPoint: {
        x: 785,
        y: 270,
        islandName: 'Kepulauan Maluku (Ternate & Banda)',
        portName: 'Pelabuhan Ternate & Kepulauan Banda',
        year: '1512 M',
        description: 'Armada Francisco Serrão tiba di Maluku dan diterima oleh Sultan Ternate untuk bersekutu mengamankan perdagangan cengkih.'
      },
      approachDirection: 'Dari Barat melalui Selat Malaka'
    }
  },

  spanyol: {
    id: 'spanyol',
    name: 'Spanyol',
    formalName: 'Kemaharajaan Spanyol (Imperio Español)',
    flagEmoji: '🇪🇸',
    flagColors: ['#AA151B', '#F1BF00'],
    coatOfArmsSymbol: 'Plus Ultra & León/Castilla',
    motto: 'Plus Ultra (Lebih Jauh ke Seberang)',
    badgeColor: 'bg-amber-900/80 text-amber-200 border-amber-600/40',
    accentColor: '#f59e0b',
    firstYear: '1521',
    firstIslandArrival: 'Kepulauan Maluku (Tidore)',
    primaryPort: 'Pelabuhan Kesultanan Tidore',
    expeditionLeaders: ['Ferdinand Magellan (Magelhaens)', 'Juan Sebastián Elcano'],
    shipType: 'Nao Victoria & Trinidad (Galiung Spanyol)',
    routeSummary: ['Eropa', 'Samudra Atlantik', 'Amerika Selatan & Selat Magellan', 'Samudra Pasifik', 'Filipina', 'Maluku (1521)'],
    jalurUmumText: 'Eropa -> Samudra Atlantik -> Amerika Selatan dan Selat Magellan -> Samudra Pasifik -> Filipina -> Maluku.',
    tahunPentingText: 'Ekspedisi Spanyol mencapai wilayah Maluku pada 1521.',
    alasanDatang: [
      'Mencari rempah-rempah dan jalur perdagangan ke Asia.',
      'Menyaingi Portugis dalam perdagangan.',
      'Memperluas pengaruh kerajaan Spanyol.',
      'Menyebarkan agama Katolik.'
    ],
    perkembanganText: 'Spanyol bersaing sengit dengan Portugis di Maluku. Portugis bersekutu dengan Kesultanan Ternate, sedangkan Spanyol bersekutu dengan Kesultanan Tidore. Persaingan tersebut kemudian diatur melalui Perjanjian Saragosa (1529), di mana Spanyol harus meninggalkan Maluku dan memusatkan pengaruhnya di Filipina, sementara Portugis tetap di Maluku.',
    interestingFact: 'Kapal Victoria di bawah Juan Sebastián Elcano berhasil kembali ke Spanyol dengan muatan penuh cengkih Tidore, menyelesaikan pelayaran keliling bumi pertama dalam sejarah manusia.',
    svgRoute: {
      id: 'route-spanyol',
      title: 'Rute Pelayaran Spanyol Mengarungi Pasifik ke Tidore',
      pathD: 'M 980 50 Q 920 110 860 150 Q 820 180 782 248',
      startPoint: { x: 980, y: 50, label: 'Dari Samudra Pasifik & Filipina' },
      intermediatePoints: [
        { x: 860, y: 150, label: 'Laut Pasifik Utara' },
        { x: 820, y: 180, label: 'Utara Halmahera' }
      ],
      firstArrivalPoint: {
        x: 782,
        y: 248,
        islandName: 'Kepulauan Maluku (Tidore)',
        portName: 'Pelabuhan Kesultanan Tidore',
        year: '1521 M',
        description: 'Sisa ekspedisi Magellan dipimpin Juan Sebastián Elcano tiba di Tidore dan disambut oleh Sultan Al-Mansur.'
      },
      approachDirection: 'Dari Timur Laut melalui Samudra Pasifik'
    }
  },

  belanda: {
    id: 'belanda',
    name: 'Belanda',
    formalName: 'Republik Tujuh Belanda Serikat (Republiek der Zeven Verenigde Nederlanden)',
    flagEmoji: '🇳🇱',
    flagColors: ['#AE1C28', '#FFFFFF', '#21468B'],
    coatOfArmsSymbol: 'Singa Belanda & VOC Monogram',
    motto: 'Je Maintiendrai',
    badgeColor: 'bg-sky-900/80 text-sky-200 border-sky-600/40',
    accentColor: '#38bdf8',
    firstYear: '1596',
    firstIslandArrival: 'Pulau Jawa (Kesultanan Banten)',
    primaryPort: 'Pelabuhan Karangantu, Banten',
    expeditionLeaders: ['Cornelis de Houtman', 'Gerrit van Beuningen'],
    shipType: 'Spiegelretourschip & Fluyt (Kapal Dagang Belanda)',
    routeSummary: ['Belanda', 'Pantai Barat Afrika', 'Tanjung Harapan', 'Samudra Hindia', 'Selat Sunda', 'Banten (1596)'],
    jalurUmumText: 'Belanda -> pantai barat Afrika -> Tanjung Harapan -> Samudra Hindia -> Banten.',
    tahunPentingText: 'Ekspedisi Belanda yang dipimpin Cornelis de Houtman tiba di Banten pada 1596.',
    alasanDatang: [
      'Membeli rempah-rempah langsung dari sumbernya.',
      'Mendapatkan keuntungan besar dari perdagangan.',
      'Mengurangi ketergantungan pada perantara perdagangan.',
      'Memperluas kekuasaan dan pengaruh Belanda di Asia.'
    ],
    perkembanganText: 'Pada 1602 Belanda membentuk kongsi dagang VOC (Vereenigde Oostindische Compagnie) untuk memperkuat perdagangan dan menghindari persaingan antarpedagang Belanda sendiri. VOC kemudian menerapkan hak monopoli (octrooi), pelayaran Hongi, ekstirpasi rempah, dan campur tangan dalam urusan politik kerajaan-kerajaan Nusantara sehingga berkembang menjadi kekuasaan kolonial yang berlangsung berabad-abad.',
    interestingFact: 'Ekspedisi pertama Belanda menempuh jalur berbahaya menghindari Selat Malaka yang dijaga Portugis, memilih berlayar lurus menyeberangi Samudra Hindia langsung ke Selat Sunda.',
    svgRoute: {
      id: 'route-belanda',
      title: 'Rute Pelayaran Cornelis de Houtman ke Banten',
      pathD: 'M 140 560 Q 210 520 260 480 Q 295 450 325 422',
      startPoint: { x: 140, y: 560, label: 'Dari Samudra Hindia (Tanjung Harapan)' },
      intermediatePoints: [
        { x: 260, y: 480, label: 'Samudra Hindia Selatan' },
        { x: 295, y: 450, label: 'Selat Sunda' }
      ],
      firstArrivalPoint: {
        x: 325,
        y: 422,
        islandName: 'Pulau Jawa (Banten)',
        portName: 'Pelabuhan Karangantu, Kesultanan Banten',
        year: '1596 M',
        description: 'Empat kapal Belanda bersandar di Banten. Meskipun awalnya disambut, sikap kasar de Houtman memicu konflik dengan penguasa Banten.'
      },
      approachDirection: 'Dari Barat Daya melalui Samudra Hindia dan Selat Sunda'
    }
  },

  inggris: {
    id: 'inggris',
    name: 'Inggris',
    formalName: 'Kerajaan Inggris (Kingdom of England) & EIC',
    flagEmoji: '🇬🇧',
    flagColors: ['#012169', '#C8102E', '#FFFFFF'],
    coatOfArmsSymbol: 'Singa Inggris & Salib St. George',
    motto: 'Dieu et mon droit',
    badgeColor: 'bg-rose-900/80 text-rose-200 border-rose-600/40',
    accentColor: '#f43f5e',
    firstYear: '1600 - 1602',
    firstIslandArrival: 'Sumatera (Aceh) & Jawa (Banten) hingga Maluku (Pulau Run)',
    primaryPort: 'Pelabuhan Banten & Pos Dagang Banda',
    expeditionLeaders: ['Sir James Lancaster', 'Sir Henry Middleton'],
    shipType: 'East Indiaman & Galleon',
    routeSummary: ['Inggris', 'Mengitari Tanjung Harapan', 'Samudra Hindia', 'Aceh & Banten (1602)', 'Kepulauan Rempah (Banda)'],
    jalurUmumText: 'Inggris -> mengitari Tanjung Harapan -> Samudra Hindia -> pelabuhan-pelabuhan perdagangan di Asia, termasuk wilayah Nusantara.',
    tahunPentingText: 'Pedagang Inggris mulai aktif akhir abad ke-16; perusahaan dagang Inggris, East India Company (EIC), dibentuk pada 1600.',
    alasanDatang: [
      'Membeli dan memperdagangkan rempah-rempah.',
      'Bersaing dengan Portugis, Spanyol, dan Belanda.',
      'Mencari keuntungan serta memperluas jaringan dagang.',
      'Memperluas pengaruh Inggris di Asia.'
    ],
    perkembanganText: 'Inggris mendirikan pos dagang di sejumlah wilayah, termasuk Banten, Kepulauan Banda (khususnya Pulau Run), dan kemudian Fort Marlborough di Bengkulu. Pengaruhnya di Indonesia berubah-ubah karena persaingan ketat dengan Belanda. Salah satu peristiwa bersejarah adalah Traktat Breda (1667), di mana Inggris menukar Pulau Run yang kaya pala dengan wilayah Nieuw Amsterdam (sekarang Manhattan, New York) milik Belanda.',
    interestingFact: 'Pulau Run di Maluku yang berukuran kecil sempat menjadi sengketa global paling sengit antara armada Inggris dan VOC karena monopoli buah pala.',
    svgRoute: {
      id: 'route-inggris',
      title: 'Rute Pelayaran James Lancaster (EIC) ke Banten & Maluku',
      pathD: 'M 100 460 Q 180 430 250 440 Q 300 435 340 422 Q 520 440 680 400 Q 770 380 840 370',
      startPoint: { x: 100, y: 460, label: 'Dari Samudra Hindia' },
      intermediatePoints: [
        { x: 250, y: 440, label: 'Pendekatan Selat Sunda' },
        { x: 340, y: 422, label: 'Pos Dagang Banten (1602)' },
        { x: 680, y: 400, label: 'Laut Flores / Banda' }
      ],
      firstArrivalPoint: {
        x: 840,
        y: 370,
        islandName: 'Kepulauan Banda (Pulau Run & Ai)',
        portName: 'Pos Dagang EIC di Kepulauan Banda',
        year: '1602 M',
        description: 'Armada EIC Inggris di bawah Sir James Lancaster mendirikan loji dagang di Banten, lalu Sir Henry Middleton berlayar ke Banda memperebutkan pala.'
      },
      approachDirection: 'Dari Samudra Hindia menuju Banten & Maluku'
    }
  }
};

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: 1511,
    yearDisplay: '1511',
    countryId: 'portugis',
    countryName: 'Portugis',
    title: 'Penaklukan Malaka oleh Afonso de Albuquerque',
    location: 'Selat Malaka',
    description: 'Armada Portugis menaklukkan Kesultanan Malaka, pusat perniagaan rempah tersibuk di Asia Tenggara, membuka gerbang pelayaran langsung ke Kepulauan Nusantara.',
    category: 'penaklukan'
  },
  {
    year: 1512,
    yearDisplay: '1512',
    countryId: 'portugis',
    countryName: 'Portugis',
    title: 'Ekspedisi Portugis Pertama Tiba di Maluku',
    location: 'Kepulauan Maluku (Ternate & Hitu/Banda)',
    description: 'Ekspedisi António de Abreu dan Francisco Serrão tiba di Kepulauan Maluku. Ternate menyambut Portugis untuk membina persekutuan dagang cengkih.',
    category: 'kedatangan'
  },
  {
    year: 1521,
    yearDisplay: '1521',
    countryId: 'spanyol',
    countryName: 'Spanyol',
    title: 'Ekspedisi Spanyol Mencapai Tidore, Maluku',
    location: 'Kepulauan Maluku (Kesultanan Tidore)',
    description: 'Kapal armada Ferdinand Magellan yang dipimpin Juan Sebastián Elcano berlabuh di Tidore dari arah Samudra Pasifik, menyulut persaingan sengit dengan Portugis.',
    category: 'kedatangan'
  },
  {
    year: 1529,
    yearDisplay: '1529',
    countryId: 'spanyol',
    countryName: 'Spanyol & Portugis',
    title: 'Perjanjian Saragosa',
    location: 'Saragosa, Spanyol',
    description: 'Perjanjian garis batas belahan bumi timur ditandatangani. Spanyol menyerahkan hak atas Maluku dengan ganti rugi 350.000 dukat dan memusatkan diri di Filipina.',
    category: 'perjanjian'
  },
  {
    year: 1596,
    yearDisplay: '1596',
    countryId: 'belanda',
    countryName: 'Belanda',
    title: 'Cornelis de Houtman Mendarat di Banten',
    location: 'Pelabuhan Karangantu, Banten',
    description: 'Ekspedisi empat kapal Belanda pertama kali tiba di Pulau Jawa melalui Selat Sunda untuk mencari lada dan rempah tanpa melalui perantara Lisabon.',
    category: 'kedatangan'
  },
  {
    year: 1600,
    yearDisplay: '1600',
    countryId: 'inggris',
    countryName: 'Inggris',
    title: 'Pembentukan East India Company (EIC)',
    location: 'London, Kerajaan Inggris',
    description: 'Ratu Elizabeth I memberikan piagam kerajaan untuk pembentukan kongsi dagang EIC guna memonopoli perniagaan di Hindia Timur dan menyaingi bangsa Eropa lainnya.',
    category: 'perusahaan_dagang'
  },
  {
    year: 1602,
    yearDisplay: '1602',
    countryId: 'belanda',
    countryName: 'Belanda',
    title: 'Pembentukan Kongsi Dagang VOC',
    location: 'Amsterdam, Republik Belanda',
    description: 'Belanda membentuk VOC (Vereenigde Oostindische Compagnie) dengan hak octrooi (membuat tentara, mencetak uang, dan menyatakan perang) yang memicu era kolonialisme.',
    category: 'perusahaan_dagang'
  },
  {
    year: 1602,
    yearDisplay: '1602 (Nov)',
    countryId: 'inggris',
    countryName: 'Inggris',
    title: 'Sir James Lancaster Membuka Pos Dagang di Banten',
    location: 'Banten & Kepulauan Rempah',
    description: 'Armada pertama EIC tiba di Aceh dan mendirikan pos dagang (loji) di Banten sebelum melanjutkan misi pencarian pala ke Kepulauan Banda.',
    category: 'kedatangan'
  }
];

export const SPICES: SpiceItem[] = [
  {
    id: 'cengkih',
    name: 'Cengkih (Cloves)',
    latinName: 'Syzygium aromaticum',
    icon: '🌱',
    originRegions: ['Ternate', 'Tidore', 'Makian', 'Motir', 'Bacan (Maluku Utara)'],
    description: 'Kuncup bunga kering yang wangi harum semerbak, sangat langka pada abad ke-16 dan hanya tumbuh di lereng gunung vulkanik kepulauan Maluku Utara.',
    europeanUses: [
      'Bumbu utama olahan daging dan sup bangsawan Eropa',
      'Antiseptik kuat & pereda sakit gigi herbal',
      'Bahan penangkal aroma busuk saat wabah Pes di Eropa'
    ],
    historicalValue: 'Satu karung cengkih di Eropa bernilai setara kapal kecil berisi batangan perak.'
  },
  {
    id: 'pala',
    name: 'Pala & Fuli (Nutmeg & Mace)',
    latinName: 'Myristica fragrans',
    icon: '🌰',
    originRegions: ['Kepulauan Banda (Pulau Run, Neira, Ai, Banda Besar)'],
    description: 'Buah tropis yang menghasilkan dua komoditas bernilai tinggi sekaligus: biji pala dan selaput merah yang menyelimutinya (fuli/mace). Hanya endemik di Kepulauan Banda.',
    europeanUses: [
      'Bahan pengawet daging selama musim dingin bersalju',
      'Obat penenang, gangguan pencernaan, dan tonik kesehatan',
      'Simbol kemewahan pesta perjamuan istana kerajaan Eropa'
    ],
    historicalValue: 'Harganya pernah melebihi emas dalam berat yang sama. Memicu pertukaran Pulau Run dengan Pulau Manhattan di Amerika.'
  },
  {
    id: 'lada',
    name: 'Lada Hitam & Putih (Black & White Pepper)',
    latinName: 'Piper nigrum',
    icon: '🫒',
    originRegions: ['Banten', 'Sumatera (Aceh & Lampung)', 'Kalimantan'],
    description: 'Disebut sebagai "Emas Hitam" (Black Gold). Komoditas bumbu perasa pedas paling banyak diperdagangkan di jalur sutra maritim Nusantara.',
    europeanUses: [
      'Menyamarkan aroma daging buruan yang diawetkan',
      'Stimulan nafsu makan dan penghangat tubuh di musim dingin',
      'Alat pembayaran pajak dan mata uang darurat di beberapa kota Eropa'
    ],
    historicalValue: 'Diperdagangkan ribuan ton setiap tahun di pelabuhan Banten dan Selat Malaka.'
  }
];

export const KESIMPULAN = {
  judul: 'Kesimpulan Perjalanan Sejarah Bangsa Asing di Nusantara',
  paragrafUtama: 'Pada awalnya, bangsa-bangsa Eropa datang ke Indonesia terutama untuk mencari dan memperdagangkan rempah-rempah. Mereka juga ingin memperoleh keuntungan, menguasai jalur perdagangan, memperluas pengaruh politik, dan dalam beberapa kasus menyebarkan agama.',
  paragrafKedua: 'Namun persaingan dagang antarbangsa asing (Portugis, Spanyol, Belanda, dan Inggris) kemudian berkembang menjadi monopoli perdagangan, campur tangan politik dalam suksesi kerajaan-kerajaan lokal, pembangunan benteng militer, hingga akhirnya melahirkan masa penjajahan kolonial yang panjang di berbagai wilayah Nusantara.',
  poinKunci: [
    { label: 'Motivasi Awal', text: 'Perdagangan murni mencari rempah (cengkih, pala, lada) langsung dari sumbernya.' },
    { label: 'Semboyan 3G', text: 'Gold (Kekayaan dagang), Glory (Kejayaan/Kekuasaan wilayah), Gospel (Penyebaran agama).' },
    { label: 'Eskalasi Konflik', text: 'Dari sewa tanah pos dagang menjadi pendirian benteng, monopoli sepihak, dan campur tangan perang saudara.' },
    { label: 'Warisan Sejarah', text: 'Melahirkan perlawanan gigih pahlawan Nusantara (Sultan Baabullah, Sultan Ageng Tirtayasa, Sultan Hasanuddin) dan kesadaran persatuan nasional.' }
  ]
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Di kota atau pelabuhan manakah ekspedisi Belanda yang dipimpin Cornelis de Houtman pertama kali mendarat pada tahun 1596?',
    options: ['Pelabuhan Banten (Jawa)', 'Kepulauan Banda (Maluku)', 'Pelabuhan Sunda Kelapa', 'Pelabuhan Malaka'],
    correctAnswer: 0,
    explanation: 'Cornelis de Houtman berlayar melintasi Samudra Hindia dan Selat Sunda, kemudian tiba pertama kali di Pelabuhan Karangantu, Kesultanan Banten pada tahun 1596.'
  },
  {
    id: 2,
    question: 'Bangsa Eropa manakah yang pertama kali berhasil menaklukkan Malaka pada tahun 1511 dan mencapai Maluku pada tahun 1512?',
    options: ['Inggris', 'Spanyol', 'Portugis', 'Belanda'],
    correctAnswer: 2,
    explanation: 'Portugis di bawah pimpinan Afonso de Albuquerque menaklukkan Malaka pada 1511, dan armada Francisco Serrão tiba di Maluku pada 1512.'
  },
  {
    id: 3,
    question: 'Mengapa rempah-rempah Nusantara seperti cengkih dan pala sangat dibutuhkan oleh bangsa Eropa?',
    options: [
      'Sebagai bahan peledak senjata meriam',
      'Untuk bumbu masakan, pengawet makanan musim dingin, dan bahan obat-obatan',
      'Sebagai bahan utama pencelup kain tenun sutra',
      'Untuk bahan pakan ternak di pelayaran samudra'
    ],
    correctAnswer: 1,
    explanation: 'Di Eropa, rempah-rempah sangat dibutuhkan untuk bumbu masakan bergengsi, mengawetkan daging saat musim dingin membekukan peternakan, serta sebagai ramuan obat-obatan berharga tinggi.'
  },
  {
    id: 4,
    question: 'Jalur pelayaran unik apakah yang ditempuh oleh ekspedisi Spanyol (Magellan - Elcano) untuk sampai ke Maluku pada 1521?',
    options: [
      'Melalui Selat Malaka dari arah Laut Merah',
      'Mengitari benua Afrika melalui Tanjung Harapan',
      'Melintasi Samudra Atlantik, Selat Magellan di Amerika Selatan, lalu mengarungi Samudra Pasifik',
      'Melintasi Laut Mediterania dan Teluk Persia'
    ],
    correctAnswer: 2,
    explanation: 'Spanyol mengambil arah barat: menyeberangi Samudra Atlantik, menembus ujung selatan benua Amerika (Selat Magellan), mengarungi Samudra Pasifik, singgah di Filipina, lalu tiba di Tidore (Maluku).'
  },
  {
    id: 5,
    question: 'Kongsi dagang apakah yang dibentuk oleh Belanda pada tahun 1602 untuk memonopoli perdagangan rempah di Nusantara?',
    options: [
      'East India Company (EIC)',
      'Vereenigde Oostindische Compagnie (VOC)',
      'Casa da Índia',
      'Compagnie des Indes Orientales'
    ],
    correctAnswer: 1,
    explanation: 'Pada 1602 Belanda membentuk VOC (Vereenigde Oostindische Compagnie) untuk mempersatukan pedagang Belanda, mencegah perang harga, dan menerapkan monopoli dagang serta hak istimewa (octrooi).'
  },
  {
    id: 6,
    question: 'Berdasarkan Perjanjian Saragosa (1529), bagaimana pembagian wilayah persaingan antara Portugis dan Spanyol?',
    options: [
      'Spanyol menguasai Jawa, Portugis menguasai Sumatera',
      'Spanyol memusatkan pengaruh di Filipina dan meninggalkan Maluku, sedangkan Portugis tetap di Maluku',
      'Keduanya sepakat membagi dua Kepulauan Banda secara damai',
      'Portugis menyerahkan seluruh Nusantara kepada Inggris'
    ],
    correctAnswer: 1,
    explanation: 'Perjanjian Saragosa menetapkan batas bumi timur. Spanyol harus meninggalkan Maluku dan memusatkan pengaruh di Filipina, sedangkan Maluku dikuasai monopoli dagang Portugis.'
  }
];
