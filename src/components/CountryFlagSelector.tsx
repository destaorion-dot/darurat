import React from 'react';
import { BANGSA_ASING } from '../data/historicalData';
import { ForeignNation, CountryId } from '../types/history';
import { Ship, Anchor, ArrowRight, Compass, Sparkles } from 'lucide-react';
import { playClickSound, playShipBell } from '../utils/audio';

interface CountryFlagSelectorProps {
  selectedNationId: CountryId | null;
  onSelectNation: (id: CountryId) => void;
  soundEnabled: boolean;
}

export const CountryFlagSelector: React.FC<CountryFlagSelectorProps> = ({
  selectedNationId,
  onSelectNation,
  soundEnabled
}) => {
  const nations = Object.values(BANGSA_ASING);

  const handleSelect = (id: CountryId) => {
    if (soundEnabled) {
      playClickSound(true);
      playShipBell(true);
    }
    onSelectNation(id);
  };

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400 font-sans">
            Langkah 1: Pilih Bendera Bangsa Asing
          </span>
          <h3 className="text-base font-bold text-slate-100 font-serif">
            Klik Negara untuk Memberangkatkan Kapal ke Pulau Tujuannya
          </h3>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-amber-300/70">
          <Compass className="h-3.5 w-3.5 text-amber-400" />
          4 Ekspedisi Pelayaran Abad XVI-XVII
        </span>
      </div>

      {/* Grid of 4 Foreign Countries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {nations.map((nation) => {
          const isSelected = selectedNationId === nation.id;

          return (
            <button
              key={nation.id}
              onClick={() => handleSelect(nation.id)}
              className={`group relative text-left rounded-xl p-4 transition-all duration-300 border backdrop-blur-md cursor-pointer ${
                isSelected
                  ? 'border-amber-400/90 bg-gradient-to-b from-[#1c2c44] to-[#121e30] shadow-lg shadow-amber-500/10 scale-[1.02] ring-2 ring-amber-400/30'
                  : 'border-slate-800 bg-[#0d1624]/80 hover:border-slate-600/70 hover:bg-[#132035]/90 hover:scale-[1.01]'
              }`}
            >
              {/* Active selection glow pill */}
              {isSelected && (
                <div className="absolute -top-2.5 right-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-2.5 py-0.5 text-[10px] font-bold text-slate-950 shadow-md flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Sedang Berlayar</span>
                </div>
              )}

              {/* Flag & Header info */}
              <div className="flex items-center gap-3">
                {/* Visual Flag Display */}
                <div className="relative flex h-12 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-700/60 shadow-md">
                  {/* National Flag Stripes */}
                  {nation.id === 'portugis' && (
                    <div className="flex h-full w-full">
                      <div className="h-full w-2/5 bg-[#046A38]" />
                      <div className="h-full w-3/5 bg-[#DA291C]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-base">🇵🇹</span>
                      </div>
                    </div>
                  )}

                  {nation.id === 'spanyol' && (
                    <div className="flex h-full w-full flex-col">
                      <div className="h-1/4 w-full bg-[#AA151B]" />
                      <div className="h-2/4 w-full bg-[#F1BF00] flex items-center justify-center">
                        <span className="text-base">🇪🇸</span>
                      </div>
                      <div className="h-1/4 w-full bg-[#AA151B]" />
                    </div>
                  )}

                  {nation.id === 'belanda' && (
                    <div className="flex h-full w-full flex-col">
                      <div className="h-1/3 w-full bg-[#AE1C28]" />
                      <div className="h-1/3 w-full bg-[#FFFFFF] flex items-center justify-center">
                        <span className="text-base">🇳🇱</span>
                      </div>
                      <div className="h-1/3 w-full bg-[#21468B]" />
                    </div>
                  )}

                  {nation.id === 'inggris' && (
                    <div className="relative flex h-full w-full items-center justify-center bg-[#012169]">
                      <div className="absolute h-full w-2 bg-[#FFFFFF]" />
                      <div className="absolute h-2 w-full bg-[#FFFFFF]" />
                      <div className="absolute h-full w-1 bg-[#C8102E]" />
                      <div className="absolute h-1 w-full bg-[#C8102E]" />
                      <span className="relative z-10 text-base">🇬🇧</span>
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors font-serif">
                      {nation.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-amber-400 font-semibold font-mono">
                    Tiba: {nation.firstYear}
                  </p>
                </div>
              </div>

              {/* Destination Pill */}
              <div className="mt-3 rounded-lg bg-black/40 p-2.5 border border-white/5">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Anchor className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                  <span className="text-slate-400">Pulau Pertama:</span>
                </div>
                <div className="mt-0.5 text-xs font-semibold text-slate-200 truncate">
                  {nation.firstIslandArrival}
                </div>
              </div>

              {/* Footer action prompt */}
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <Ship className="h-3 w-3 text-slate-500" />
                  {nation.shipType.split('&')[0]}
                </span>
                <span className={`font-semibold flex items-center gap-1 transition-transform ${
                  isSelected ? 'text-amber-300 translate-x-1' : 'text-slate-500 group-hover:text-slate-300'
                }`}>
                  Berlayar <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
