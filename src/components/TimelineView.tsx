import React, { useState } from 'react';
import { TIMELINE_EVENTS } from '../data/historicalData';
import { TimelineEvent, CountryId } from '../types/history';
import { Calendar, Ship, MapPin, ChevronRight, Filter } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface TimelineViewProps {
  onSelectCountry: (countryId: CountryId) => void;
  soundEnabled: boolean;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  onSelectCountry,
  soundEnabled
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredEvents =
    selectedCategory === 'all'
      ? TIMELINE_EVENTS
      : TIMELINE_EVENTS.filter((e) => e.countryId === selectedCategory);

  const handleCountryJump = (countryId: CountryId) => {
    if (soundEnabled) playClickSound(true);
    onSelectCountry(countryId);
  };

  return (
    <div className="w-full rounded-2xl border border-amber-900/30 bg-[#0c1626] p-5 sm:p-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
            Urutan Kronologis Sejarah (1511 - 1602)
          </span>
          <h3 className="text-xl font-bold text-white font-serif">
            Ringkasan Garis Waktu Kedatangan Bangsa Asing
          </h3>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setSelectedCategory('portugis')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              selectedCategory === 'portugis'
                ? 'bg-emerald-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🇵🇹 Portugis
          </button>
          <button
            onClick={() => setSelectedCategory('spanyol')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              selectedCategory === 'spanyol'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🇪🇸 Spanyol
          </button>
          <button
            onClick={() => setSelectedCategory('belanda')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              selectedCategory === 'belanda'
                ? 'bg-sky-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🇳🇱 Belanda
          </button>
          <button
            onClick={() => setSelectedCategory('inggris')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              selectedCategory === 'inggris'
                ? 'bg-rose-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🇬🇧 Inggris
          </button>
        </div>
      </div>

      {/* Timeline Stepper */}
      <div className="relative mt-8 space-y-8 before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:w-0.5 before:-translate-x-1/2 before:bg-gradient-to-b before:from-amber-500/80 before:via-slate-700 before:to-transparent">
        {filteredEvents.map((evt, idx) => {
          const isEven = idx % 2 === 0;

          const badgeColor =
            evt.countryId === 'portugis'
              ? 'border-emerald-500/50 text-emerald-300 bg-emerald-950/60'
              : evt.countryId === 'spanyol'
              ? 'border-amber-500/50 text-amber-300 bg-amber-950/60'
              : evt.countryId === 'belanda'
              ? 'border-sky-500/50 text-sky-300 bg-sky-950/60'
              : 'border-rose-500/50 text-rose-300 bg-rose-950/60';

          return (
            <div
              key={idx}
              className={`relative flex flex-col sm:flex-row items-start ${
                isEven ? 'sm:flex-row-reverse' : ''
              } group`}
            >
              {/* Year Pin in Center */}
              <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-amber-400 bg-[#09111e] text-xs font-black text-amber-300 shadow-lg z-10">
                <Calendar className="h-4 w-4" />
              </div>

              {/* Event Content Card */}
              <div
                className={`ml-10 sm:ml-0 w-full sm:w-[calc(50%-2rem)] ${
                  isEven ? 'sm:mr-auto sm:text-right' : 'sm:ml-auto sm:text-left'
                }`}
              >
                <div className="rounded-xl border border-slate-800 bg-[#09111e]/90 p-4 transition-all duration-300 hover:border-amber-500/40 hover:bg-[#0d1626]">
                  <div
                    className={`flex items-center gap-2 mb-1.5 ${
                      isEven ? 'sm:justify-end' : 'sm:justify-start'
                    }`}
                  >
                    <span className={`rounded-md border px-2 py-0.5 text-xs font-bold font-mono ${badgeColor}`}>
                      Tahun {evt.yearDisplay}
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      {evt.countryName}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white font-serif group-hover:text-amber-200 transition-colors">
                    {evt.title}
                  </h4>

                  <div
                    className={`mt-1 flex items-center gap-1 text-xs text-amber-400/80 ${
                      isEven ? 'sm:justify-end' : 'sm:justify-start'
                    }`}
                  >
                    <MapPin className="h-3 w-3" />
                    <span>{evt.location}</span>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    {evt.description}
                  </p>

                  <div
                    className={`mt-3 flex items-center ${
                      isEven ? 'sm:justify-end' : 'sm:justify-start'
                    }`}
                  >
                    <button
                      onClick={() => handleCountryJump(evt.countryId)}
                      className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
                    >
                      <Ship className="h-3.5 w-3.5" />
                      <span>Lihat Rute di Peta</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Historical Note */}
      <div className="mt-8 rounded-xl border border-amber-900/30 bg-[#070f1a] p-4 text-xs text-slate-400 leading-relaxed">
        <span className="font-bold text-amber-300">Catatan Penting: </span>
        Tahun-tahun di atas menunjukkan peristiwa penting pembuka sejarah, bukan berarti seluruh bangsa datang hanya satu kali pada tahun tersebut. Jalur dan kedatangan berlangsung melalui serangkaian ekspedisi pelayaran besar yang membawa misi dagang, diplomatik, hingga militer.
      </div>
    </div>
  );
};
