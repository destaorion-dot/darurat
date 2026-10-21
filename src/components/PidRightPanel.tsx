import React, { useState } from 'react';
import { ForeignNation, CountryId } from '../types/history';
import { BANGSA_ASING, LATAR_BELAKANG, KESIMPULAN, TIMELINE_EVENTS, QUIZ_QUESTIONS } from '../data/historicalData';
import {
  Volume2,
  VolumeX,
  Compass,
  Ship,
  MapPin,
  Calendar,
  CheckCircle2,
  Scroll,
  Layers,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronRight,
  RotateCcw,
  Award
} from 'lucide-react';
import { speakIndonesianText, stopSpeaking, playClickSound, playShipBell, playArrivalChime } from '../utils/audio';
import confetti from 'canvas-confetti';

interface PidRightPanelProps {
  selectedNation: ForeignNation;
  onSelectNation: (id: CountryId) => void;
  soundEnabled: boolean;
  onRestartVoyage: () => void;
}

export const PidRightPanel: React.FC<PidRightPanelProps> = ({
  selectedNation,
  onSelectNation,
  soundEnabled,
  onRestartVoyage
}) => {
  const [activeTab, setActiveTab] = useState<'penjelasan' | 'latar' | 'timeline' | 'kesimpulan' | 'kuis'>('penjelasan');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Quick quiz state for PID
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const nations = Object.values(BANGSA_ASING);

  const handleNationClick = (id: CountryId) => {
    if (soundEnabled) {
      playClickSound(true);
      playShipBell(true);
    }
    onSelectNation(id);
    setActiveTab('penjelasan');
  };

  const toggleNarration = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      const textToRead = `${selectedNation.name}. ${selectedNation.tahunPentingText}. Jalur pelayaran: ${selectedNation.jalurUmumText}. Empat alasan datang: Pertama, ${selectedNation.alasanDatang[0]}. Kedua, ${selectedNation.alasanDatang[1]}. Ketiga, ${selectedNation.alasanDatang[2]}. Keempat, ${selectedNation.alasanDatang[3]}. Perkembangan: ${selectedNation.perkembanganText}`;
      setIsSpeaking(true);
      speakIndonesianText(textToRead, () => setIsSpeaking(false));
    }
  };

  const handleQuizAnswer = (idx: number) => {
    if (isAnswered) return;
    if (soundEnabled) playClickSound(true);
    setSelectedAnswer(idx);
    setIsAnswered(true);
    if (idx === QUIZ_QUESTIONS[quizIndex].correctAnswer) {
      setQuizScore((s) => s + 1);
      if (soundEnabled) playArrivalChime(true);
    }
  };

  const handleNextQuiz = () => {
    if (quizIndex < QUIZ_QUESTIONS.length - 1) {
      setQuizIndex((i) => i + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#0b1422] border-l border-amber-900/30 overflow-hidden select-none">
      {/* 1. TOP SECTION: BENDERA-BENDERA NEGARA ASING (KECIL KE SEDANG) */}
      <div className="shrink-0 border-b border-amber-900/20 bg-[#09101b] p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-sans flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 text-amber-400" />
            Pilih Bendera Bangsa Asing:
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Klik untuk layar sentuh PID</span>
        </div>

        {/* 4 Flag Cards Grid */}
        <div className="grid grid-cols-2 gap-2">
          {nations.map((nat) => {
            const isSelected = selectedNation.id === nat.id;
            return (
              <button
                key={nat.id}
                onClick={() => handleNationClick(nat.id)}
                className={`flex items-center gap-2.5 rounded-lg p-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-2 border-amber-400 bg-gradient-to-r from-amber-950/60 to-slate-900 shadow-md ring-1 ring-amber-400/40 scale-[1.01]'
                    : 'border border-slate-800 bg-[#0d1624] hover:border-slate-700 hover:bg-[#121f33]'
                }`}
              >
                {/* Visual Flag Display */}
                <div className="relative flex h-8 w-11 shrink-0 items-center justify-center overflow-hidden rounded border border-slate-700/60 shadow-sm">
                  {nat.id === 'portugis' && (
                    <div className="flex h-full w-full">
                      <div className="h-full w-2/5 bg-[#046A38]" />
                      <div className="h-full w-3/5 bg-[#DA291C]" />
                      <span className="absolute text-xs">🇵🇹</span>
                    </div>
                  )}
                  {nat.id === 'spanyol' && (
                    <div className="flex h-full w-full flex-col">
                      <div className="h-1/4 w-full bg-[#AA151B]" />
                      <div className="h-2/4 w-full bg-[#F1BF00] flex items-center justify-center">
                        <span className="text-xs">🇪🇸</span>
                      </div>
                      <div className="h-1/4 w-full bg-[#AA151B]" />
                    </div>
                  )}
                  {nat.id === 'belanda' && (
                    <div className="flex h-full w-full flex-col">
                      <div className="h-1/3 w-full bg-[#AE1C28]" />
                      <div className="h-1/3 w-full bg-[#FFFFFF] flex items-center justify-center">
                        <span className="text-xs">🇳🇱</span>
                      </div>
                      <div className="h-1/3 w-full bg-[#21468B]" />
                    </div>
                  )}
                  {nat.id === 'inggris' && (
                    <div className="relative flex h-full w-full items-center justify-center bg-[#012169]">
                      <div className="absolute h-full w-1.5 bg-[#FFFFFF]" />
                      <div className="absolute h-1.5 w-full bg-[#FFFFFF]" />
                      <div className="absolute h-full w-0.5 bg-[#C8102E]" />
                      <div className="absolute h-0.5 w-full bg-[#C8102E]" />
                      <span className="relative z-10 text-xs">🇬🇧</span>
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate font-serif">
                      {nat.name}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 font-semibold">
                      {nat.firstYear.split(' ')[0]}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {nat.firstIslandArrival.split('(')[0]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. COMPACT TAB BAR FOR CONTENT (PID FRIENDLY) */}
      <div className="shrink-0 flex items-center justify-between border-b border-amber-900/20 bg-[#070e17] px-3 py-1.5 text-xs">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('penjelasan')}
            className={`px-2.5 py-1 rounded-md font-semibold transition text-[11px] whitespace-nowrap ${
              activeTab === 'penjelasan'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Alur &amp; 4 Alasan
          </button>
          <button
            onClick={() => setActiveTab('latar')}
            className={`px-2 py-1 rounded-md font-semibold transition text-[11px] whitespace-nowrap ${
              activeTab === 'latar'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Latar Belakang
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-2 py-1 rounded-md font-semibold transition text-[11px] whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3. Garis Waktu
          </button>
          <button
            onClick={() => setActiveTab('kesimpulan')}
            className={`px-2 py-1 rounded-md font-semibold transition text-[11px] whitespace-nowrap ${
              activeTab === 'kesimpulan'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            4. Kesimpulan
          </button>
          <button
            onClick={() => setActiveTab('kuis')}
            className={`px-2 py-1 rounded-md font-semibold transition text-[11px] whitespace-nowrap ${
              activeTab === 'kuis'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            Kuis PID
          </button>
        </div>

        {/* Audio Speech Button */}
        <button
          onClick={toggleNarration}
          className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition ${
            isSpeaking
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 animate-pulse'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Dengarkan suara penjelasan"
        >
          {isSpeaking ? <VolumeX className="h-3.5 w-3.5 text-amber-400" /> : <Volume2 className="h-3.5 w-3.5 text-amber-400" />}
          <span className="hidden sm:inline">{isSpeaking ? 'Stop' : 'Suara'}</span>
        </button>
      </div>

      {/* 3. SCROLLABLE INNER BODY FOR EXPLANATIONS (FIT IN REMAINING HEIGHT) */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 custom-scrollbar">
        {/* TAB 1: PENJELASAN BANGSA ASING & 4 ALASAN */}
        {activeTab === 'penjelasan' && (
          <div className="space-y-3">
            {/* Header banner of selected country */}
            <div className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-[#122137] to-[#0c1626] p-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{selectedNation.flagEmoji}</span>
                  <div>
                    <h3 className="text-sm font-black text-white font-serif">
                      Bangsa {selectedNation.name}
                    </h3>
                    <p className="text-[10px] text-amber-300/80 font-mono">
                      {selectedNation.formalName}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onRestartVoyage}
                  className="flex items-center gap-1 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-200 hover:bg-amber-500/20 transition active:scale-95"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Pelayaran Ulang</span>
                </button>
              </div>

              {/* Pendaratan pertama pill */}
              <div className="mt-2.5 rounded-lg bg-black/40 p-2 border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-semibold text-slate-200 text-[11px]">
                    Pulau Pertama: <span className="text-amber-300">{selectedNation.firstIslandArrival}</span>
                  </span>
                </div>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300 font-mono">
                  {selectedNation.firstYear}
                </span>
              </div>
            </div>

            {/* Tahun Penting & Jalur Umum */}
            <div className="rounded-xl border border-slate-800 bg-[#09111e] p-3 space-y-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Tahun Penting:
                </span>
                <p className="text-xs text-white font-medium mt-0.5 leading-snug">
                  {selectedNation.tahunPentingText}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                  <Compass className="h-3 w-3" /> Jalur Umum:
                </span>
                <p className="text-[11px] text-cyan-200/90 font-mono mt-0.5 leading-relaxed">
                  {selectedNation.jalurUmumText}
                </p>
              </div>
            </div>

            {/* 4 Alasan Datang */}
            <div className="rounded-xl border border-amber-900/40 bg-[#0e192c] p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  4 Alasan Kedatangan:
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Kurikulum Sejarah</span>
              </div>

              <div className="space-y-2">
                {selectedNation.alasanDatang.map((alasan, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 rounded-lg bg-[#070e1a]/80 p-2 border border-slate-800 text-xs text-slate-200 leading-snug"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-amber-500/20 text-[10px] font-black text-amber-300 border border-amber-500/30">
                      {i + 1}
                    </span>
                    <span className="text-[11px] font-medium leading-relaxed">{alasan}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Perkembangan di Indonesia */}
            <div className="rounded-xl border border-slate-800 bg-[#09111e] p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                Perkembangan di Nusantara:
              </span>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed font-serif">
                {selectedNation.perkembanganText}
              </p>
              <div className="mt-2 text-[10px] text-amber-300/80 italic">
                ★ {selectedNation.interestingFact}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LATAR BELAKANG (RINGKAS & DIPERKECIL SESUAI PERMINTAAN) */}
        {activeTab === 'latar' && (
          <div className="space-y-2 text-xs">
            {/* Header Ringkas */}
            <div className="rounded-lg border border-amber-500/25 bg-[#0e1a2c] p-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-bold text-amber-300 font-serif uppercase tracking-wider">
                  1. Latar Belakang Kedatangan
                </h4>
                <span className="text-[9px] rounded bg-amber-500/20 text-amber-300 font-mono px-1">Ringkas</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-200 leading-snug">
                Nusantara kaya akan rempah (cengkih, pala, lada) yang sangat dibutuhkan di Eropa untuk bumbu, pengawet makanan musim dingin, dan obat-obatan.
              </p>
            </div>

            {/* 4 Poin Kunci Ringkas */}
            <div className="grid grid-cols-2 gap-1.5">
              <div className="rounded border border-slate-800 bg-[#09111e] p-1.5">
                <span className="text-[10px] font-bold text-amber-400">🌱 Rempah Melimpah</span>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">Hanya tumbuh subur di Nusantara, nihil di Eropa.</p>
              </div>
              <div className="rounded border border-slate-800 bg-[#09111e] p-1.5">
                <span className="text-[10px] font-bold text-amber-400">❄️ Pengawet Makanan</span>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">Pengawet daging beku dan bumbu mewah istana.</p>
              </div>
              <div className="rounded border border-slate-800 bg-[#09111e] p-1.5">
                <span className="text-[10px] font-bold text-amber-400">⚔️ Konstantinopel Jatuh</span>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">1453 jalur darat ditutup Utsmaniyah, rempah langka.</p>
              </div>
              <div className="rounded border border-slate-800 bg-[#09111e] p-1.5">
                <span className="text-[10px] font-bold text-amber-400">🧭 Jalur Laut Langsung</span>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">Mencari ke sumber asli demi potong perantara.</p>
              </div>
            </div>

            {/* 3 Rempah Sebaris */}
            <div className="rounded-lg border border-emerald-900/30 bg-emerald-950/20 p-2 text-[10px] flex items-center justify-between text-slate-300">
              <span>🌱 <strong>Cengkih:</strong> Ternate/Tidore</span>
              <span>🌰 <strong>Pala:</strong> Kep. Banda</span>
              <span>🫒 <strong>Lada:</strong> Banten/Sumatera</span>
            </div>
          </div>
        )}

        {/* TAB 3: GARIS WAKTU */}
        {activeTab === 'timeline' && (
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              3. Ringkasan Urutan Waktu (1511 - 1602)
            </span>

            <div className="space-y-2">
              {TIMELINE_EVENTS.map((evt, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectNation(evt.countryId)}
                  className="rounded-lg border border-slate-800 bg-[#09111e] p-2.5 transition hover:border-amber-500/40 hover:bg-[#0d1728] cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-bold text-amber-300 font-mono">
                      {evt.yearDisplay}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {evt.countryName}
                    </span>
                  </div>
                  <h5 className="mt-1 text-xs font-bold text-white font-serif">
                    {evt.title}
                  </h5>
                  <p className="mt-0.5 text-[10px] text-slate-300 leading-snug">
                    {evt.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-black/40 p-2 text-[10px] text-slate-400">
              <strong className="text-amber-300">Catatan:</strong> Tahun-tahun di atas adalah peristiwa penting, bukan berarti bangsa asing hanya datang sekali pada tahun tersebut.
            </div>
          </div>
        )}

        {/* TAB 4: KESIMPULAN */}
        {activeTab === 'kesimpulan' && (
          <div className="space-y-3">
            <div className="rounded-xl border border-amber-500/30 bg-[#0e1a2c] p-3">
              <h4 className="text-xs font-bold text-white font-serif uppercase tracking-wider text-amber-400">
                4. Kesimpulan Sejarah
              </h4>
              <p className="mt-1.5 text-xs text-slate-200 leading-relaxed font-serif">
                {KESIMPULAN.paragrafUtama}
              </p>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed font-serif">
                {KESIMPULAN.paragrafKedua}
              </p>
            </div>

            <div className="space-y-2">
              {KESIMPULAN.poinKunci.map((pk, idx) => (
                <div key={idx} className="rounded-lg border border-slate-800 bg-[#09111e] p-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    {pk.label}
                  </span>
                  <p className="mt-0.5 text-[11px] text-slate-300 leading-snug">
                    {pk.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: KUIS CEPAT PID UNTUK SISWA DI DEPAN KELAS */}
        {activeTab === 'kuis' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Kuis Evaluasi Cepat PID
              </span>
              {!quizFinished && (
                <span className="text-[10px] font-mono text-amber-300">
                  Soal {quizIndex + 1}/{QUIZ_QUESTIONS.length}
                </span>
              )}
            </div>

            {!quizFinished ? (
              <div className="space-y-2.5">
                <div className="rounded-lg bg-[#070e1a] p-2.5 border border-slate-800 text-xs font-bold text-white leading-snug">
                  {QUIZ_QUESTIONS[quizIndex].question}
                </div>

                <div className="space-y-1.5">
                  {QUIZ_QUESTIONS[quizIndex].options.map((opt, i) => {
                    const isCorrect = i === QUIZ_QUESTIONS[quizIndex].correctAnswer;
                    const isChosen = i === selectedAnswer;

                    let btnColor = 'bg-[#09111e] border-slate-800 text-slate-300 hover:border-slate-700';
                    if (isAnswered) {
                      if (isCorrect) btnColor = 'bg-emerald-950/80 border-emerald-500 text-emerald-100';
                      else if (isChosen) btnColor = 'bg-rose-950/80 border-rose-500 text-rose-100';
                      else btnColor = 'bg-[#060a12] border-slate-900 text-slate-600';
                    }

                    return (
                      <button
                        key={i}
                        disabled={isAnswered}
                        onClick={() => handleQuizAnswer(i)}
                        className={`w-full rounded-lg border p-2 text-left text-[11px] font-medium transition ${btnColor}`}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-2 text-[10px] text-amber-200">
                    <strong>Penjelasan:</strong> {QUIZ_QUESTIONS[quizIndex].explanation}
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={handleNextQuiz}
                        className="rounded bg-amber-500 px-3 py-1 text-[10px] font-bold text-slate-950 hover:bg-amber-400"
                      >
                        {quizIndex < QUIZ_QUESTIONS.length - 1 ? 'Soal Selanjutnya' : 'Lihat Hasil'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-amber-500/30 bg-[#0e1a2c] p-4 text-center">
                <Award className="h-8 w-8 text-amber-400 mx-auto mb-1" />
                <h5 className="text-sm font-bold text-white">Kuis Selesai!</h5>
                <p className="text-xl font-black text-amber-300 my-1 font-mono">
                  Skor: {quizScore} / {QUIZ_QUESTIONS.length}
                </p>
                <button
                  onClick={resetQuiz}
                  className="mt-2 rounded bg-slate-800 px-3 py-1 text-xs text-slate-200 hover:bg-slate-700"
                >
                  Ulangi Kuis
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
