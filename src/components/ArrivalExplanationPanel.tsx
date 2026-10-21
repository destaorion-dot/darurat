import React, { useState } from 'react';
import { ForeignNation, CountryId } from '../types/history';
import { LATAR_BELAKANG, KESIMPULAN } from '../data/historicalData';
import {
  Volume2,
  VolumeX,
  Compass,
  Ship,
  MapPin,
  Calendar,
  CheckCircle2,
  Scroll,
  Sparkles,
  Layers,
  ArrowRight,
  Shield,
  HelpCircle
} from 'lucide-react';
import { speakIndonesianText, stopSpeaking } from '../utils/audio';

interface ArrivalExplanationPanelProps {
  nation: ForeignNation;
  onSelectOtherNation: (id: CountryId) => void;
  onOpenQuiz: () => void;
}

export const ArrivalExplanationPanel: React.FC<ArrivalExplanationPanelProps> = ({
  nation,
  onSelectOtherNation,
  onOpenQuiz
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'detail' | 'latar' | 'kesimpulan'>('detail');

  const toggleNarration = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      const textToRead = `${nation.name}. ${nation.tahunPentingText}. Jalur pelayaran: ${nation.jalurUmumText}. Alasan datang: Pertama, ${nation.alasanDatang[0]}. Kedua, ${nation.alasanDatang[1]}. Ketiga, ${nation.alasanDatang[2]}. Keempat, ${nation.alasanDatang[3]}. Perkembangan: ${nation.perkembanganText}`;
      setIsSpeaking(true);
      speakIndonesianText(textToRead, () => setIsSpeaking(false));
    }
  };

  return (
    <div className="w-full rounded-2xl border border-amber-900/30 bg-[#0c1626] p-5 sm:p-6 shadow-2xl">
      {/* Sub-nav tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('detail')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === 'detail'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Ship className="h-3.5 w-3.5" />
            <span>Alur &amp; Alasan {nation.name}</span>
          </button>
          <button
            onClick={() => setActiveTab('latar')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === 'latar'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scroll className="h-3.5 w-3.5" />
            <span>1. Latar Belakang Rempah</span>
          </button>
          <button
            onClick={() => setActiveTab('kesimpulan')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === 'kesimpulan'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>4. Kesimpulan Sejarah</span>
          </button>
        </div>

        {/* Audio Narration Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleNarration}
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition shadow-sm ${
              isSpeaking
                ? 'border-amber-400 bg-amber-500/20 text-amber-200 animate-pulse'
                : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
            title="Dengarkan narasi suara bahasa Indonesia"
          >
            {isSpeaking ? <VolumeX className="h-3.5 w-3.5 text-amber-400" /> : <Volume2 className="h-3.5 w-3.5 text-amber-400" />}
            <span>{isSpeaking ? 'Hentikan Narasi' : 'Dengarkan Narasi Suara'}</span>
          </button>

          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Uji Pemahaman (Kuis)</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: DETAIL BANGSA ASING */}
      {activeTab === 'detail' && (
        <div className="mt-5 space-y-6">
          {/* Nation Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-amber-500/20 bg-gradient-to-r from-[#111f33] via-[#0e192a] to-[#12223a] p-4 sm:p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-black/40 text-4xl border border-white/10 shadow-inner">
                {nation.flagEmoji}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white font-serif tracking-wide">
                    Bangsa {nation.name}
                  </h3>
                  <span className="rounded-md bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[11px] font-bold text-amber-300">
                    {nation.firstYear}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-serif italic mt-0.5">
                  {nation.formalName} · {nation.motto ? `"${nation.motto}"` : ''}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  <span className="flex items-center gap-1 text-amber-300 font-medium">
                    <MapPin className="h-3.5 w-3.5" />
                    Pendaratan Pertama: {nation.firstIslandArrival}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Ship className="h-3.5 w-3.5" />
                    Jenis Kapal: {nation.shipType}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Switch to other nations */}
            <div className="flex items-center gap-1.5 self-start md:self-auto text-xs">
              <span className="text-[11px] text-slate-400 mr-1">Beralih:</span>
              {(['portugis', 'spanyol', 'belanda', 'inggris'] as CountryId[]).map((cId) => (
                <button
                  key={cId}
                  onClick={() => onSelectOtherNation(cId)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition ${
                    nation.id === cId
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'border border-slate-700 bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {cId.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Tahun Penting & Jalur Umum */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Tahun Penting Card */}
            <div className="rounded-xl border border-slate-800 bg-[#09111e]/90 p-4">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Calendar className="h-4 w-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-sans">
                  Tahun Penting Kedatangan
                </h4>
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed font-serif">
                {nation.tahunPentingText}
              </p>
              <div className="mt-3 rounded-lg bg-black/30 p-2.5 border border-white/5 text-xs text-slate-300">
                <span className="text-amber-400 font-bold">Tokoh Ekspedisi Utama: </span>
                {nation.expeditionLeaders.join(', ')}
              </div>
            </div>

            {/* Jalur Umum Pelayaran Card */}
            <div className="rounded-xl border border-slate-800 bg-[#09111e]/90 p-4">
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <Compass className="h-4 w-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-sans">
                  Jalur Umum Pelayaran Samudra
                </h4>
              </div>
              <p className="text-xs text-cyan-200/90 font-mono mb-3 leading-relaxed">
                {nation.jalurUmumText}
              </p>
              {/* Breadcrumb visual route */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                {nation.routeSummary.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <span className="rounded bg-slate-800/80 px-2 py-0.5 text-slate-200 border border-slate-700/50">
                      {step}
                    </span>
                    {idx < nation.routeSummary.length - 1 && (
                      <ArrowRight className="h-3 w-3 text-amber-400/70" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Alasan Datang ke Indonesia (4 Poin Utama) */}
          <div className="rounded-xl border border-amber-900/40 bg-gradient-to-b from-[#131f33] to-[#0c1524] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                  Landasan Kedatangan
                </span>
                <h4 className="text-base font-bold text-white font-serif">
                  4 Alasan Utama Kedatangan Bangsa {nation.name} ke Nusantara
                </h4>
              </div>
              <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-mono text-amber-300">
                Sesuai Kurikulum Sejarah
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {nation.alasanDatang.map((alasan, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-[#09111e]/70 p-3.5 transition hover:border-amber-500/40 hover:bg-[#0c1626]"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-xs font-black text-amber-300 border border-amber-500/30">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed">
                      {alasan}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Perkembangan di Nusantara */}
          <div className="rounded-xl border border-slate-800 bg-[#09111e]/90 p-5">
            <div className="flex items-center gap-2 text-rose-400 mb-2">
              <Shield className="h-4 w-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider font-sans">
                Perkembangan dan Dampak di Indonesia
              </h4>
            </div>
            <p className="text-sm leading-relaxed text-slate-300 font-serif">
              {nation.perkembanganText}
            </p>

            {/* Interesting historical highlight */}
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-200">
              <Sparkles className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300">Fakta Penting: </span>
                {nation.interestingFact}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: LATAR BELAKANG */}
      {activeTab === 'latar' && (
        <div className="mt-5 space-y-5">
          <div className="rounded-xl border border-amber-500/20 bg-[#101b2d] p-5">
            <h3 className="text-lg font-bold text-white font-serif">
              {LATAR_BELAKANG.judul}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-amber-100/90 font-serif">
              {LATAR_BELAKANG.ringkasan}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LATAR_BELAKANG.faktorUtama.map((faktor, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-[#09111e] p-4 transition hover:border-amber-500/30"
              >
                <div className="flex items-center gap-2 text-amber-400 mb-1.5 font-serif font-bold text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>{faktor.judul}</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-300">
                  {faktor.deskripsi}
                </p>
              </div>
            ))}
          </div>

          {/* Three Spices summary */}
          <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
              Tiga Komoditas Rempah Pusaka Nusantara:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-lg bg-black/40 p-3 border border-emerald-500/20">
                <span className="text-base">🌱</span>
                <div className="font-bold text-white mt-1">Cengkih (Maluku Utara)</div>
                <div className="text-slate-400 mt-0.5">Ternate, Tidore, Makian, Motir, Bacan</div>
              </div>
              <div className="rounded-lg bg-black/40 p-3 border border-amber-500/20">
                <span className="text-base">🌰</span>
                <div className="font-bold text-white mt-1">Pala &amp; Fuli (Banda)</div>
                <div className="text-slate-400 mt-0.5">Pulau Run, Neira, Ai, Banda Besar</div>
              </div>
              <div className="rounded-lg bg-black/40 p-3 border border-sky-500/20">
                <span className="text-base">🫒</span>
                <div className="font-bold text-white mt-1">Lada (Banten &amp; Sumatera)</div>
                <div className="text-slate-400 mt-0.5">Kesultanan Banten, Lampung, Aceh</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: KESIMPULAN */}
      {activeTab === 'kesimpulan' && (
        <div className="mt-5 space-y-5">
          <div className="rounded-xl border border-amber-500/20 bg-gradient-to-r from-[#12223a] to-[#0c1626] p-5">
            <h3 className="text-lg font-bold text-white font-serif">
              {KESIMPULAN.judul}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-200 font-serif">
              {KESIMPULAN.paragrafUtama}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300 font-serif">
              {KESIMPULAN.paragrafKedua}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {KESIMPULAN.poinKunci.map((poin, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-[#09111e] p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  {poin.label}
                </span>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">
                  {poin.text}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0a1422] p-4 text-xs text-slate-400">
            <span className="font-bold text-slate-200">Catatan Sejarah: </span>
            Tahun-tahun pendaratan menunjukkan peristiwa penting pembuka hubungan dagang, bukan berarti seluruh bangsa datang hanya satu kali. Kedatangan berlangsung melalui ekspedisi bergelombang yang kian memperkuat cengkeraman kolonial di Nusantara.
          </div>
        </div>
      )}
    </div>
  );
};
