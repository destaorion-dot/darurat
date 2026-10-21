import React, { useState, useEffect } from 'react';
import { Compass, Ship, Clock, Sparkles, HelpCircle, Volume2, VolumeX, Map, Maximize, Minimize } from 'lucide-react';

interface HeaderProps {
  activeTab: 'map' | 'timeline' | 'spices' | 'quiz';
  onTabChange: (tab: 'map' | 'timeline' | 'spices' | 'quiz') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  soundEnabled,
  onToggleSound
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-900/30 bg-[#09111c]/95 backdrop-blur-md shrink-0">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-4">
        {/* Brand / Title */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 shadow-md">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-base font-black tracking-wide text-white font-serif leading-none">
                Jejak Maritim Nusantara
              </h1>
              <span className="hidden md:inline rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300 uppercase tracking-wider">
                Mode PID Layar Sentuh
              </span>
            </div>
            <p className="text-[10px] text-amber-300/80 font-sans hidden sm:block mt-0.5">
              Alur Kedatangan &amp; Alasan Bangsa Asing ke Indonesia (1511 - 1602)
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={() => onTabChange('map')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              activeTab === 'map'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Map className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Peta PID</span>
            <span className="sm:hidden">Peta</span>
          </button>

          <button
            onClick={() => onTabChange('timeline')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              activeTab === 'timeline'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Garis Waktu</span>
            <span className="sm:hidden">Waktu</span>
          </button>

          <button
            onClick={() => onTabChange('spices')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              activeTab === 'spices'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Pusaka Rempah</span>
            <span className="sm:hidden">Rempah</span>
          </button>

          <button
            onClick={() => onTabChange('quiz')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              activeTab === 'quiz'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Kuis</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border transition ${
              soundEnabled
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                : 'border-slate-800 bg-slate-800/60 text-slate-500'
            }`}
            title={soundEnabled ? 'Matikan Suara Efek' : 'Nyalakan Suara Efek'}
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          </button>

          {/* Fullscreen for PID Interactive Display */}
          <button
            onClick={toggleFullscreen}
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/60 text-slate-300 hover:text-white transition"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh Proyektor / PID'}
          >
            {isFullscreen ? <Minimize className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />}
          </button>
        </nav>
      </div>
    </header>
  );
};
