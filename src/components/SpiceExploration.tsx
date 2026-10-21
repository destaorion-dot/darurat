import React, { useState } from 'react';
import { SPICES } from '../data/historicalData';
import { SpiceItem } from '../types/history';
import { Sparkles, MapPin, DollarSign, Utensils, CheckCircle2 } from 'lucide-react';

export const SpiceExploration: React.FC = () => {
  const [selectedSpice, setSelectedSpice] = useState<SpiceItem>(SPICES[0]);

  return (
    <div className="w-full rounded-2xl border border-amber-900/30 bg-[#0c1626] p-5 sm:p-6 shadow-2xl">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
          Emas Hijau Nusantara
        </span>
        <h3 className="text-xl font-bold text-white font-serif">
          Harta Karun Rempah: Alasan Utama Bangsa Eropa Mengarungi Samudra
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          Mengapa rempah-rempah Nusantara diburu hingga memicu perlombaan maritim dunia?
        </p>
      </div>

      {/* Spice Selector Tabs */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SPICES.map((spice) => {
          const isSelected = selectedSpice.id === spice.id;
          return (
            <button
              key={spice.id}
              onClick={() => setSelectedSpice(spice)}
              className={`flex items-center gap-3 rounded-xl p-3.5 text-left transition-all border ${
                isSelected
                  ? 'border-emerald-400 bg-emerald-950/40 shadow-lg ring-1 ring-emerald-400/40'
                  : 'border-slate-800 bg-[#09111e] hover:border-slate-700'
              }`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black/40 text-2xl border border-white/10">
                {spice.icon}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white truncate font-serif">
                  {spice.name.split('(')[0]}
                </h4>
                <p className="text-[11px] text-emerald-400 font-mono italic">
                  {spice.latinName}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Spice Detailed Profile */}
      <div className="mt-5 rounded-xl border border-emerald-500/20 bg-gradient-to-br from-[#0e1d2e] to-[#09121e] p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selectedSpice.icon}</span>
            <div>
              <h4 className="text-lg font-bold text-white font-serif">
                {selectedSpice.name}
              </h4>
              <p className="text-xs text-emerald-400 font-mono italic">
                {selectedSpice.latinName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs text-emerald-300">
            <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Asal Daerah: {selectedSpice.originRegions.join(', ')}</span>
          </div>
        </div>

        <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-200">
          {selectedSpice.description}
        </p>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Uses in Europe */}
          <div className="rounded-lg bg-black/40 p-4 border border-white/5">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Utensils className="h-4 w-4" />
              <span>Manfaat Utama di Eropa Abad XVI</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {selectedSpice.europeanUses.map((use, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{use}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Historical value */}
          <div className="rounded-lg bg-black/40 p-4 border border-white/5">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <DollarSign className="h-4 w-4" />
              <span>Nilai Ekonomi &amp; Sejarah</span>
            </div>
            <p className="text-xs leading-relaxed text-amber-200 font-medium">
              {selectedSpice.historicalValue}
            </p>
            <div className="mt-2 text-[11px] text-slate-400">
              Ketiadaan perantara darat pasca jatuhnya Konstantinopel (1453) melipatgandakan keuntungan hingga 1.000% bagi kapal yang selamat kembali ke Eropa.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
