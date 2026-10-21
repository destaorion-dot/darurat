import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ForeignNation, CountryId } from '../types/history';
import { Anchor, Navigation, Compass, ZoomIn, ZoomOut, RotateCcw, Volume2, Sparkles, MapPin, Eye } from 'lucide-react';
import { playArrivalChime } from '../utils/audio';

interface NauticalMapProps {
  selectedNation: ForeignNation | null;
  onSelectNation: (nationId: CountryId) => void;
  showAllRoutes: boolean;
  onToggleShowAllRoutes: () => void;
  showSpiceMarkers: boolean;
  onToggleSpiceMarkers: () => void;
  soundEnabled: boolean;
  onOpenDetails: () => void;
  onSwitchToRealMaps?: () => void;
}

export const NauticalMap: React.FC<NauticalMapProps> = ({
  selectedNation,
  onSelectNation,
  showAllRoutes,
  onToggleShowAllRoutes,
  showSpiceMarkers,
  onToggleSpiceMarkers,
  soundEnabled,
  onOpenDetails,
  onSwitchToRealMaps
}) => {
  // Animation progress along path (0 to 1)
  const [shipProgress, setShipProgress] = useState<number>(0);
  const [isSailing, setIsSailing] = useState<boolean>(false);
  const [shipCoords, setShipCoords] = useState<{ x: number; y: number; angle: number }>({ x: 0, y: 0, angle: 0 });
  const [hasArrived, setHasArrived] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeHoverPoint, setActiveHoverPoint] = useState<string | null>(null);

  const pathRef = useRef<SVGPathElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Focus zoom on arrival destination when nation is selected
  useEffect(() => {
    if (!selectedNation) {
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
      setShipProgress(0);
      setIsSailing(false);
      setHasArrived(false);
      return;
    }

    // Reset and start voyage animation
    setShipProgress(0);
    setHasArrived(false);
    setIsSailing(true);
    startTimeRef.current = null;

    // Smart pan/zoom towards arrival area
    const target = selectedNation.svgRoute.firstArrivalPoint;
    if (selectedNation.id === 'portugis' || selectedNation.id === 'spanyol') {
      // Focus on Maluku & Eastern Archipelago
      setZoomLevel(1.25);
      setPanOffset({ x: -120, y: -40 });
    } else if (selectedNation.id === 'belanda') {
      // Focus on Sunda Strait & Banten
      setZoomLevel(1.35);
      setPanOffset({ x: 120, y: -60 });
    } else {
      // Focus on Java & Maluku route
      setZoomLevel(1.15);
      setPanOffset({ x: -40, y: -30 });
    }
  }, [selectedNation]);

  // Smooth Ship Sailing Engine along SVG Path
  useEffect(() => {
    if (!isSailing || !selectedNation || !pathRef.current) return;

    const path = pathRef.current;
    const pathLength = path.getTotalLength();
    const duration = 5200; // 5.2 seconds sailing time for cinematic feel

    const animateShip = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const rawProgress = Math.min(elapsed / duration, 1);

      // Ease-in-out cubic for realistic ship acceleration & deceleration
      const progress =
        rawProgress < 0.5
          ? 4 * rawProgress * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;

      setShipProgress(progress);

      // Calculate coordinates and orientation angle
      const currentDistance = progress * pathLength;
      const point = path.getPointAtLength(currentDistance);

      // Calculate tangent angle for ship heading
      const delta = 3;
      const nextDist = Math.min(currentDistance + delta, pathLength);
      const prevDist = Math.max(currentDistance - delta, 0);
      const nextPoint = path.getPointAtLength(nextDist);
      const prevPoint = path.getPointAtLength(prevDist);

      const dx = nextPoint.x - prevPoint.x;
      const dy = nextPoint.y - prevPoint.y;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      setShipCoords({ x: point.x, y: point.y, angle });

      if (rawProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateShip);
      } else {
        setIsSailing(false);
        setHasArrived(true);
        if (soundEnabled) {
          playArrivalChime(true);
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateShip);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSailing, selectedNation, soundEnabled]);

  const restartVoyage = () => {
    if (!selectedNation) return;
    setShipProgress(0);
    setHasArrived(false);
    setIsSailing(true);
    startTimeRef.current = null;
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden rounded-xl border border-amber-900/30 bg-[#0d1724] shadow-2xl">
      {/* Map Header Toolbar - Compact for PID */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-900/20 bg-[#0b131e]/95 px-3 py-2 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Compass className="h-4 w-4 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold tracking-wider text-amber-100 uppercase font-serif leading-none">
              Peta Pelayaran Bangsa Asing ke Nusantara
            </h2>
            <div className="flex items-center gap-1.5 text-[10px] text-amber-300/70 font-sans mt-0.5">
              <span>{selectedNation ? `Rute Kapal: ${selectedNation.name} (${selectedNation.firstYear})` : 'Klik bendera di sebelah kanan'}</span>
            </div>
          </div>
        </div>

        {/* Map Control Buttons */}
        <div className="flex items-center gap-1.5 text-xs">
          {/* Replay Voyage */}
          {selectedNation && (
            <button
              onClick={restartVoyage}
              className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 font-medium text-amber-200 transition hover:bg-amber-500/20 active:scale-95"
              title="Ulangi pelayaran kapal"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Putar Ulang Kapal</span>
            </button>
          )}

          {/* Switch to Real Satellite Maps */}
          {onSwitchToRealMaps && (
            <button
              onClick={onSwitchToRealMaps}
              className="flex items-center gap-1.5 rounded-lg border border-blue-500/50 bg-blue-500/20 px-2.5 py-1.5 font-bold text-blue-200 hover:bg-blue-500/30 transition shadow-sm"
              title="Hubungkan ke Peta Satelit / Google Maps Nyata"
            >
              <span className="text-xs">🛰️</span>
              <span>Terhubung ke Maps</span>
            </button>
          )}

          {/* Toggle All Routes */}
          <button
            onClick={onToggleShowAllRoutes}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium transition ${
              showAllRoutes
                ? 'border-cyan-500/50 bg-cyan-500/20 text-cyan-200'
                : 'border-slate-700/60 bg-slate-800/40 text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            <Navigation className="h-3.5 w-3.5" />
            <span>Semua Rute ({showAllRoutes ? 'Aktif' : 'Nonaktif'})</span>
          </button>

          {/* Toggle Spice Locations */}
          <button
            onClick={onToggleSpiceMarkers}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium transition ${
              showSpiceMarkers
                ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-200'
                : 'border-slate-700/60 bg-slate-800/40 text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Peta Rempah ({showSpiceMarkers ? 'Aktif' : 'Nonaktif'})</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center rounded-lg border border-slate-700/60 bg-slate-800/40 p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2.2))}
              className="p-1.5 text-slate-300 hover:text-white transition"
              title="Perbesar Peta"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.9))}
              className="p-1.5 text-slate-300 hover:text-white transition"
              title="Perkecil Peta"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={resetView}
              className="px-2 py-1 text-[11px] text-slate-400 hover:text-amber-300 transition"
              title="Reset Tampilan"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Container - Fills available screen height on PID */}
      <div className="relative flex-1 w-full min-h-0 select-none bg-[#0c1929] overflow-hidden">
        {/* Ocean Background Texture & Waves */}
        <div className="absolute inset-0 bg-radial-gradient from-[#14283f] via-[#0c1a2c] to-[#07111e] opacity-90 pointer-events-none" />

        <svg
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: '55% 55%'
          }}
        >
          <defs>
            {/* Graticule grid pattern */}
            <pattern id="nautical-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#224263" strokeWidth="0.5" strokeOpacity="0.25" strokeDasharray="3,3" />
            </pattern>

            {/* Rhumb lines radial */}
            <radialGradient id="compass-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>

            {/* Glow filters for routes */}
            <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-sky" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-rose" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Ship shadow */}
            <filter id="ship-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Graticule Grid */}
          <rect width="1200" height="600" fill="url(#nautical-grid)" />

          {/* Vintage Latitude/Longitude Coordinates */}
          <g className="text-[10px] fill-slate-500 font-mono opacity-40 select-none">
            <text x="30" y="40">06°00&apos; U</text>
            <text x="30" y="270">00°00&apos; KHATULISTIWA (EQUATOR)</text>
            <text x="30" y="520">08°30&apos; S</text>
            <text x="140" y="585">95° BT</text>
            <text x="450" y="585">110° BT</text>
            <text x="780" y="585">128° BT</text>
            <text x="1080" y="585">140° BT</text>
          </g>

          {/* Equator Line */}
          <line x1="0" y1="265" x2="1200" y2="265" stroke="#d97706" strokeWidth="0.8" strokeDasharray="6,4" strokeOpacity="0.3" />

          {/* Nautical Water Names */}
          <g className="fill-[#537a9f] font-serif tracking-widest text-[11px] opacity-75 uppercase italic select-none">
            <text x="120" y="520" className="text-[13px] font-bold tracking-[0.25em]">SAMUDRA HINDIA</text>
            <text x="890" y="90" className="text-[13px] font-bold tracking-[0.25em]">SAMUDRA PASIFIK</text>
            <text x="180" y="210" className="text-[9px]">Selat Malaka</text>
            <text x="270" y="445" className="text-[9px]">Selat Sunda</text>
            <text x="430" y="390" className="text-[10px]">Laut Jawa</text>
            <text x="680" y="430" className="text-[10px]">Laut Flores</text>
            <text x="760" y="345" className="text-[11px] fill-amber-300 font-bold tracking-wider">Laut Banda (Pusat Pala)</text>
            <text x="720" y="235" className="text-[10px] fill-amber-300 font-bold">Laut Maluku (Pusat Cengkih)</text>
            <text x="750" y="145" className="text-[9px]">Laut Sulawesi</text>
          </g>

          {/* INDONESIAN ARCHIPELAGO ISLAND LANDMASSES */}
          {/* Base Island Style: Historical Warm Ochre/Earth Tones with subtle coastline stroke */}
          <g id="landmasses" className="transition-all duration-300">
            {/* SEMENANJUNG MALAYA (MALAYSIA & MALAKA) */}
            <path
              d="M 120 120 Q 150 140 180 180 Q 200 210 220 230 L 230 250 L 210 255 Q 185 230 160 170 Q 140 140 120 120 Z"
              fill="#27382d"
              stroke="#526e5a"
              strokeWidth="1.2"
              className="hover:fill-[#324939] transition-colors"
            />
            {/* Text Malaka */}
            <text x="200" y="225" fill="#fef08a" fontSize="10" fontWeight="bold" fontFamily="serif">Malaka</text>

            {/* SUMATERA */}
            {/* Aceh in North-West down to Lampung in South-East */}
            <path
              d="M 130 215 
                 Q 160 210 185 240 
                 Q 215 280 240 310 
                 Q 265 340 285 385 
                 L 290 415 
                 L 265 410 
                 Q 235 365 210 330 
                 Q 180 290 150 255 
                 Q 130 235 125 220 
                 Z"
              fill="#2c4232"
              stroke="#5f8869"
              strokeWidth="1.4"
              className="hover:fill-[#38533f] transition-colors cursor-pointer"
            />
            {/* Pulau Nias & Mentawai */}
            <ellipse cx="140" cy="275" rx="4" ry="12" fill="#2c4232" stroke="#5f8869" strokeWidth="0.8" transform="rotate(-30 140 275)" />
            <ellipse cx="170" cy="325" rx="5" ry="16" fill="#2c4232" stroke="#5f8869" strokeWidth="0.8" transform="rotate(-35 170 325)" />
            {/* Pulau Bangka & Belitung */}
            <ellipse cx="285" cy="335" rx="10" ry="18" fill="#2c4232" stroke="#5f8869" strokeWidth="0.8" transform="rotate(25 285 335)" />
            <circle cx="318" cy="345" r="7" fill="#2c4232" stroke="#5f8869" strokeWidth="0.8" />

            <text x="180" y="305" fill="#e2e8f0" fontSize="12" fontWeight="bold" fontFamily="serif" opacity="0.85">SUMATERA</text>

            {/* PULAU JAWA */}
            {/* Banten on West, Sunda Kelapa/Batavia, Central Java, East Java */}
            <path
              d="M 315 422 
                 Q 335 418 360 422 
                 Q 400 425 435 423 
                 Q 480 425 515 435 
                 L 535 448 
                 L 525 455 
                 Q 470 450 425 450 
                 Q 380 445 340 445 
                 Q 320 440 310 435 
                 Z"
              fill="#344e3b"
              stroke="#689673"
              strokeWidth="1.5"
              className="hover:fill-[#3f5f48] transition-colors cursor-pointer"
            />
            {/* Pulau Madura */}
            <ellipse cx="495" cy="425" rx="18" ry="6" fill="#344e3b" stroke="#689673" strokeWidth="0.8" transform="rotate(-5 495 425)" />

            <text x="400" y="440" fill="#e2e8f0" fontSize="12" fontWeight="bold" fontFamily="serif" opacity="0.85">JAWA</text>

            {/* BALI, LOMBOK, SUMBAWA, FLORES, TIMOR */}
            {/* Bali */}
            <circle cx="548" cy="455" r="6.5" fill="#344e3b" stroke="#689673" strokeWidth="0.8" />
            <text x="542" y="470" fill="#cbd5e1" fontSize="8">Bali</text>
            {/* Lombok */}
            <circle cx="568" cy="457" r="6" fill="#344e3b" stroke="#689673" strokeWidth="0.8" />
            {/* Sumbawa */}
            <path d="M 585 455 Q 605 450 625 458 L 620 464 Q 600 460 585 462 Z" fill="#344e3b" stroke="#689673" strokeWidth="0.8" />
            {/* Flores */}
            <path d="M 640 455 Q 675 452 705 457 L 700 463 Q 670 460 640 462 Z" fill="#344e3b" stroke="#689673" strokeWidth="0.8" />
            <text x="660" y="472" fill="#cbd5e1" fontSize="8">Flores</text>
            {/* Sumba */}
            <ellipse cx="650" cy="480" rx="14" ry="7" fill="#344e3b" stroke="#689673" strokeWidth="0.8" transform="rotate(-10 650 480)" />
            {/* Timor */}
            <ellipse cx="735" cy="475" rx="24" ry="9" fill="#344e3b" stroke="#689673" strokeWidth="0.8" transform="rotate(20 735 475)" />
            <text x="730" y="495" fill="#cbd5e1" fontSize="8">Timor</text>

            {/* KALIMANTAN (BORNEO) */}
            <path
              d="M 370 270 
                 Q 400 230 450 220 
                 Q 500 220 535 240 
                 Q 545 280 535 320 
                 Q 510 360 480 370 
                 Q 440 375 410 365 
                 Q 375 345 365 310 
                 Z"
              fill="#2f4636"
              stroke="#628c6c"
              strokeWidth="1.5"
              className="hover:fill-[#3b5844] transition-colors cursor-pointer"
            />
            <text x="430" y="295" fill="#e2e8f0" fontSize="13" fontWeight="bold" fontFamily="serif" opacity="0.85">KALIMANTAN</text>

            {/* SULAWESI */}
            {/* Characteristic 4-legged shape */}
            <path
              d="M 625 245 
                 Q 655 240 685 240 
                 L 695 248 
                 Q 660 258 640 270 
                 Q 655 285 680 295 
                 L 670 305 
                 Q 645 295 635 290 
                 Q 645 315 670 340 
                 L 660 350 
                 Q 630 325 625 305 
                 Q 615 335 610 375 
                 L 598 375 
                 Q 605 325 615 285 
                 Q 610 265 625 245 
                 Z"
              fill="#2e4434"
              stroke="#608a6b"
              strokeWidth="1.3"
              className="hover:fill-[#3a5642] transition-colors cursor-pointer"
            />
            <text x="618" y="300" fill="#e2e8f0" fontSize="12" fontWeight="bold" fontFamily="serif" opacity="0.85">SULAWESI</text>

            {/* KEPULAUAN MALUKU UTARA (TERNATE, TIDORE, HALMAHERA) */}
            {/* Halmahera - distinctive cross shape */}
            <path
              d="M 780 200 
                 Q 795 190 810 210 
                 L 815 235 
                 Q 825 240 840 245 
                 L 835 255 
                 Q 815 250 805 252 
                 L 810 280 
                 L 798 280 
                 Q 795 255 785 245 
                 Q 765 245 755 248 
                 L 755 238 
                 Q 775 235 780 200 
                 Z"
              fill="#3e5b44"
              stroke="#f59e0b"
              strokeWidth="1.6"
              className="cursor-pointer"
            />
            {/* Ternate & Tidore (Tiny volcanic islands with high historical significance) */}
            <g id="ternate-tidore" className="cursor-pointer group">
              {/* Ternate */}
              <circle cx="778" cy="236" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              {/* Tidore */}
              <circle cx="782" cy="248" r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
              <text x="735" y="228" fill="#fef08a" fontSize="11" fontWeight="bold" fontFamily="serif" className="drop-shadow-md">
                Ternate (1512 🇵🇹)
              </text>
              <text x="735" y="260" fill="#fef08a" fontSize="11" fontWeight="bold" fontFamily="serif" className="drop-shadow-md">
                Tidore (1521 🇪🇸)
              </text>
            </g>

            {/* KEPULAUAN MALUKU TENGAH & SELATAN (SERAM, AMBON, BANDA) */}
            {/* Pulau Seram */}
            <path d="M 800 325 Q 835 320 865 330 L 860 342 Q 830 335 800 338 Z" fill="#3e5b44" stroke="#7eb78b" strokeWidth="1.2" />
            <text x="825" y="335" fill="#f8fafc" fontSize="8">Seram</text>
            {/* Ambon */}
            <ellipse cx="808" cy="348" rx="6" ry="4" fill="#3e5b44" stroke="#7eb78b" strokeWidth="1" />
            <text x="778" y="352" fill="#cbd5e1" fontSize="8">Ambon</text>

            {/* KEPULAUAN BANDA (PULAU RUN, NEIRA, AI - PUSAT PALA) */}
            <g id="kepulauan-banda" className="cursor-pointer">
              <circle cx="838" cy="368" r="7" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="848" cy="373" r="5" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.2" />
              <text x="856" y="372" fill="#fef08a" fontSize="11" fontWeight="bold" fontFamily="serif" className="drop-shadow-md">
                Kep. Banda (Pala 🇬🇧 🇳🇱)
              </text>
            </g>

            {/* KEPULAUAN PAPUA */}
            <path
              d="M 900 270 
                 Q 915 255 930 265 
                 Q 950 285 930 310 
                 Q 945 320 970 315 
                 Q 1020 310 1070 330 
                 Q 1120 350 1150 380 
                 L 1140 430 
                 Q 1090 440 1030 420 
                 Q 980 400 950 380 
                 Q 930 360 915 330 
                 Q 900 300 900 270 
                 Z"
              fill="#2b4031"
              stroke="#598163"
              strokeWidth="1.5"
              className="hover:fill-[#38533f] transition-colors cursor-pointer"
            />
            <text x="1000" y="370" fill="#e2e8f0" fontSize="14" fontWeight="bold" fontFamily="serif" opacity="0.85">PAPUA</text>

            {/* FILIPINA SELATAN (MINDANAO) - KONTEKS KEDATANGAN SPANYOL */}
            <path
              d="M 740 100 Q 770 90 790 110 Q 800 135 780 150 Q 755 140 740 100 Z"
              fill="#223328"
              stroke="#44614e"
              strokeWidth="1"
              opacity="0.7"
            />
            <text x="745" y="125" fill="#94a3b8" fontSize="9" fontStyle="italic">Filipina (Mindanao)</text>
          </g>

          {/* SPICE OVERLAY MARKERS (If toggled on) */}
          {showSpiceMarkers && (
            <g id="spice-markers">
              {/* Cengkih in Ternate & Tidore */}
              <g transform="translate(760, 210)" className="animate-bounce">
                <rect x="-10" y="-12" width="75" height="20" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1" opacity="0.9" />
                <text x="0" y="2" fill="#6ee7b7" fontSize="10" fontWeight="bold">🌱 Cengkih Asli</text>
              </g>

              {/* Pala in Banda */}
              <g transform="translate(820, 395)" className="animate-bounce">
                <rect x="-10" y="-12" width="68" height="20" rx="4" fill="#78350f" stroke="#f59e0b" strokeWidth="1" opacity="0.9" />
                <text x="0" y="2" fill="#fde68a" fontSize="10" fontWeight="bold">🌰 Pala &amp; Fuli</text>
              </g>

              {/* Lada in Banten & Sumatera */}
              <g transform="translate(290, 400)">
                <rect x="-10" y="-12" width="65" height="20" rx="4" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" opacity="0.9" />
                <text x="0" y="2" fill="#e2e8f0" fontSize="10" fontWeight="bold">🫒 Lada Hitam</text>
              </g>
              <g transform="translate(140, 240)">
                <rect x="-10" y="-12" width="65" height="20" rx="4" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" opacity="0.9" />
                <text x="0" y="2" fill="#e2e8f0" fontSize="10" fontWeight="bold">🫒 Lada Aceh</text>
              </g>
            </g>
          )}

          {/* HISTORICAL ARRIVAL PORTS / LANDING SITES (PULSING PINS) */}
          <g id="historical-ports">
            {/* 1. MALAKA (1511 Portugis) */}
            <g
              transform="translate(210, 240)"
              className="cursor-pointer group"
              onClick={() => onSelectNation('portugis')}
            >
              <circle r="12" fill="#10b981" fillOpacity="0.2" className="animate-ping" />
              <circle r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              <rect x="-42" y="10" width="84" height="22" rx="4" fill="#042f2e" stroke="#10b981" strokeWidth="0.8" opacity="0.9" />
              <text x="0" y="24" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="bold">Malaka (1511 🇵🇹)</text>
            </g>

            {/* 2. MALUKU: TERNATE & TIDORE (1512 Portugis & 1521 Spanyol) */}
            <g
              transform="translate(782, 248)"
              className="cursor-pointer group"
              onClick={() => onSelectNation('spanyol')}
            >
              <circle r="14" fill="#f59e0b" fillOpacity="0.25" className="animate-ping" />
              <circle r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
              <rect x="-55" y="-32" width="110" height="24" rx="4" fill="#451a03" stroke="#f59e0b" strokeWidth="1" opacity="0.95" />
              <text x="0" y="-16" textAnchor="middle" fill="#fde68a" fontSize="9" fontWeight="bold">Maluku (1512 🇵🇹 / 1521 🇪🇸)</text>
            </g>

            {/* 3. BANTEN (1596 Belanda & 1602 Inggris) */}
            <g
              transform="translate(325, 422)"
              className="cursor-pointer group"
              onClick={() => onSelectNation('belanda')}
            >
              <circle r="14" fill="#38bdf8" fillOpacity="0.25" className="animate-ping" />
              <circle r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
              <rect x="-60" y="10" width="120" height="24" rx="4" fill="#082f49" stroke="#38bdf8" strokeWidth="1" opacity="0.95" />
              <text x="0" y="25" textAnchor="middle" fill="#bae6fd" fontSize="9" fontWeight="bold">Banten (1596 🇳🇱 / 1602 🇬🇧)</text>
            </g>

            {/* 4. KEPULAUAN BANDA (1602 Inggris EIC & VOC) */}
            <g
              transform="translate(840, 370)"
              className="cursor-pointer group"
              onClick={() => onSelectNation('inggris')}
            >
              <circle r="12" fill="#f43f5e" fillOpacity="0.25" className="animate-ping" />
              <circle r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
              <rect x="-48" y="10" width="96" height="22" rx="4" fill="#4c0519" stroke="#f43f5e" strokeWidth="0.8" opacity="0.9" />
              <text x="0" y="24" textAnchor="middle" fill="#fecdd3" fontSize="9" fontWeight="bold">Banda / Run (1602 🇬🇧)</text>
            </g>
          </g>

          {/* ALL ROUTES BACKGROUND PREVIEW (If showAllRoutes is enabled) */}
          {showAllRoutes && (
            <g id="all-routes-preview" opacity="0.5">
              {/* Portugis */}
              <path
                d="M 60 210 Q 140 215 195 235 Q 260 290 350 340 Q 520 380 670 340 Q 730 310 785 270"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="5,5"
              />
              {/* Spanyol */}
              <path
                d="M 980 50 Q 920 110 860 150 Q 820 180 782 248"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="5,5"
              />
              {/* Belanda */}
              <path
                d="M 140 560 Q 210 520 260 480 Q 295 450 325 422"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeDasharray="5,5"
              />
              {/* Inggris */}
              <path
                d="M 100 460 Q 180 430 250 440 Q 300 435 340 422 Q 520 440 680 400 Q 770 380 840 370"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
                strokeDasharray="5,5"
              />
            </g>
          )}

          {/* SELECTED NATION ACTIVE ROUTE */}
          {selectedNation && (
            <g id="active-selected-route">
              {/* Base track glow */}
              <path
                d={selectedNation.svgRoute.pathD}
                fill="none"
                stroke={selectedNation.accentColor}
                strokeWidth="6"
                strokeOpacity="0.2"
                strokeLinecap="round"
              />

              {/* Master Route Path for coordinate measurement */}
              <path
                ref={pathRef}
                d={selectedNation.svgRoute.pathD}
                fill="none"
                stroke={selectedNation.accentColor}
                strokeWidth="2.5"
                strokeDasharray="6,4"
                strokeLinecap="round"
                className="transition-all"
              />

              {/* Origin indicator banner */}
              <g transform={`translate(${selectedNation.svgRoute.startPoint.x}, ${selectedNation.svgRoute.startPoint.y})`}>
                <rect x="-10" y="-22" width="160" height="24" rx="4" fill="#0f172a" stroke={selectedNation.accentColor} strokeWidth="1.2" opacity="0.95" />
                <text x="10" y="-6" fill="#f8fafc" fontSize="10" fontWeight="bold">
                  {selectedNation.flagEmoji} {selectedNation.svgRoute.startPoint.label}
                </text>
              </g>

              {/* Intermediate breadcrumbs */}
              {selectedNation.svgRoute.intermediatePoints.map((pt, idx) => (
                <g key={idx} transform={`translate(${pt.x}, ${pt.y})`}>
                  <circle r="4" fill={selectedNation.accentColor} stroke="#ffffff" strokeWidth="1" />
                  <rect x="6" y="-14" width="90" height="18" rx="3" fill="#0f172a" stroke="#475569" strokeWidth="0.8" opacity="0.9" />
                  <text x="12" y="-2" fill="#cbd5e1" fontSize="9" fontWeight="500">{pt.label}</text>
                </g>
              ))}

              {/* Arrival Target Landing Marker */}
              <g transform={`translate(${selectedNation.svgRoute.firstArrivalPoint.x}, ${selectedNation.svgRoute.firstArrivalPoint.y})`}>
                <circle r="22" fill={selectedNation.accentColor} fillOpacity="0.25" className="animate-ping" />
                <circle r="9" fill={selectedNation.accentColor} stroke="#ffffff" strokeWidth="2.5" />
                <Anchor className="h-4 w-4 text-white -translate-x-2 -translate-y-2 pointer-events-none" />

                {/* Callout box when ship is sailing or arrived */}
                <g transform="translate(15, -45)">
                  <rect x="0" y="0" width="190" height="58" rx="6" fill="#0a1120" stroke={selectedNation.accentColor} strokeWidth="1.8" filter="url(#ship-shadow)" />
                  <text x="10" y="18" fill="#fde047" fontSize="11" fontWeight="bold" fontFamily="serif">
                    ★ PENDARATAN PERTAMA
                  </text>
                  <text x="10" y="34" fill="#ffffff" fontSize="11" fontWeight="600">
                    {selectedNation.svgRoute.firstArrivalPoint.islandName}
                  </text>
                  <text x="10" y="48" fill="#94a3b8" fontSize="9">
                    Tahun: {selectedNation.svgRoute.firstArrivalPoint.year} · {selectedNation.name}
                  </text>
                </g>
              </g>
            </g>
          )}

          {/* ANIMATED HISTORICAL SAILING SHIP (Galleon / Caravel) */}
          {selectedNation && (
            <g
              transform={`translate(${shipCoords.x}, ${shipCoords.y}) rotate(${shipCoords.angle})`}
              filter="url(#ship-shadow)"
              className="cursor-pointer transition-transform"
            >
              {/* Ship Wake / Water Ripple Bubbles */}
              <ellipse cx="-16" cy="0" rx="10" ry="4" fill="#ffffff" opacity="0.3" className="animate-pulse" />
              <ellipse cx="-26" cy="0" rx="14" ry="6" fill="#67e8f9" opacity="0.15" />

              {/* Ship Hull (Wooden Galleon) */}
              <path
                d="M -16 6 L -10 11 L 18 10 L 25 0 L 18 -10 L -10 -11 L -16 -6 Z"
                fill="#854d0e"
                stroke="#451a03"
                strokeWidth="1.2"
              />
              {/* Deck Details */}
              <rect x="-8" y="-7" width="22" height="14" rx="2" fill="#a16207" stroke="#713f12" strokeWidth="0.8" />
              <rect x="-14" y="-5" width="6" height="10" rx="1" fill="#713f12" />

              {/* Masts */}
              <line x1="-3" y1="-14" x2="-3" y2="14" stroke="#451a03" strokeWidth="1.6" />
              <line x1="10" y1="-12" x2="10" y2="12" stroke="#451a03" strokeWidth="1.4" />

              {/* Billowing Canvas Sails */}
              <path d="M -4 -13 Q 5 -8 -4 -3 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
              <path d="M -4 3 Q 5 8 -4 13 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
              <path d="M 9 -11 Q 16 -6 9 -2 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
              <path d="M 9 2 Q 16 6 9 11 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />

              {/* Royal Nation Flag at Stern */}
              <g transform="translate(-16, 0)">
                <line x1="0" y1="0" x2="-8" y2="0" stroke="#000000" strokeWidth="0.8" />
                <rect x="-14" y="-5" width="7" height="5" rx="0.5" fill={selectedNation.accentColor} stroke="#ffffff" strokeWidth="0.4" />
              </g>

              {/* Bowsprit (front spar) */}
              <line x1="25" y1="0" x2="33" y2="0" stroke="#713f12" strokeWidth="1.4" />

              {/* Nation Name Label Floating Above Ship */}
              <g transform="rotate(-90) translate(0, -22)" className="pointer-events-none select-none">
                <rect x="-42" y="-9" width="84" height="17" rx="3" fill="#090d16" stroke={selectedNation.accentColor} strokeWidth="1" opacity="0.9" />
                <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                  {selectedNation.flagEmoji} Kapal {selectedNation.name}
                </text>
              </g>
            </g>
          )}

          {/* VINTAGE COMPASS ROSE (MAWAR KOMPAS) */}
          <g transform="translate(1080, 480)" className="select-none opacity-85">
            <circle r="44" fill="#09131f" stroke="#b45309" strokeWidth="1.5" strokeDasharray="3,3" />
            <circle r="38" fill="url(#compass-glow)" stroke="#78350f" strokeWidth="0.8" />
            <circle r="22" fill="#0b1726" stroke="#b45309" strokeWidth="1" />

            {/* 8 Principal Points (North, NE, East, SE, South, SW, West, NW) */}
            {/* North Point (Ornate Gold Fleur-de-lis style) */}
            <path d="M 0 0 L -7 -14 L 0 -36 L 7 -14 Z" fill="#d97706" stroke="#78350f" strokeWidth="0.8" />
            <path d="M 0 0 L 0 -36 L 7 -14 Z" fill="#fef08a" />
            {/* South Point */}
            <path d="M 0 0 L -6 14 L 0 34 L 6 14 Z" fill="#92400e" stroke="#78350f" strokeWidth="0.8" />
            <path d="M 0 0 L 0 34 L 6 14 Z" fill="#b45309" />
            {/* East Point */}
            <path d="M 0 0 L 14 -6 L 34 0 L 14 6 Z" fill="#92400e" stroke="#78350f" strokeWidth="0.8" />
            <path d="M 0 0 L 34 0 L 14 6 Z" fill="#b45309" />
            {/* West Point */}
            <path d="M 0 0 L -14 -6 L -34 0 L -14 6 Z" fill="#92400e" stroke="#78350f" strokeWidth="0.8" />
            <path d="M 0 0 L -34 0 L -14 6 Z" fill="#b45309" />

            {/* Intermediate corner rays */}
            <path d="M 0 0 L 12 -12 L 24 -24 Z" stroke="#d97706" strokeWidth="1" />
            <path d="M 0 0 L -12 -12 L -24 -24 Z" stroke="#d97706" strokeWidth="1" />
            <path d="M 0 0 L 12 12 L 24 24 Z" stroke="#d97706" strokeWidth="1" />
            <path d="M 0 0 L -12 12 L -24 24 Z" stroke="#d97706" strokeWidth="1" />

            <circle cx="0" cy="0" r="4" fill="#fbbf24" stroke="#451a03" strokeWidth="1" />
            <text x="0" y="-40" textAnchor="middle" fill="#fef08a" fontSize="12" fontWeight="bold" fontFamily="serif">U</text>
            <text x="40" y="4" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontFamily="serif">T</text>
            <text x="0" y="46" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontFamily="serif">S</text>
            <text x="-40" y="4" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontFamily="serif">B</text>
          </g>

          {/* VINTAGE NAUTICAL MILE SCALE BAR */}
          <g transform="translate(60, 560)" className="select-none text-[9px] fill-slate-400 font-serif">
            <rect x="0" y="0" width="40" height="4" fill="#ffffff" />
            <rect x="40" y="0" width="40" height="4" fill="#000000" />
            <rect x="80" y="0" width="40" height="4" fill="#ffffff" />
            <rect x="120" y="0" width="40" height="4" fill="#000000" />
            <rect x="0" y="0" width="160" height="4" fill="none" stroke="#64748b" strokeWidth="0.8" />
            <text x="0" y="-3">0</text>
            <text x="80" y="-3">250</text>
            <text x="160" y="-3">500 Mil Laut (Nautical Miles)</text>
          </g>
        </svg>

        {/* ARRIVAL CELEBRATION NOTIFICATION BANNER (When ship lands) */}
        <AnimatePresence>
          {hasArrived && selectedNation && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-3 left-3 max-w-xs sm:max-w-sm rounded-xl border border-amber-500/50 bg-[#0a1320]/95 p-3 shadow-2xl backdrop-blur-md z-30"
            >
              <div className="flex items-start gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-xl border border-amber-500/30">
                  {selectedNation.flagEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Armada Telah Berlabuh!
                    </span>
                    <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300 font-mono">
                      {selectedNation.svgRoute.firstArrivalPoint.year}
                    </span>
                  </div>
                  <h4 className="mt-0.5 text-xs sm:text-sm font-bold text-white font-serif truncate">
                    {selectedNation.name} tiba di {selectedNation.firstIslandArrival}
                  </h4>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-300 line-clamp-2">
                    {selectedNation.svgRoute.firstArrivalPoint.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] text-amber-300 font-medium">
                      👉 Lihat penjelasan lengkap di panel kanan
                    </span>
                    <button
                      onClick={restartVoyage}
                      className="ml-auto rounded border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-300 hover:text-white transition"
                    >
                      Putar Lagi
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SAILING PROGRESS BAR (Visible while sailing) */}
        {isSailing && selectedNation && (
          <div className="absolute top-4 left-4 rounded-lg border border-amber-500/30 bg-[#09111e]/90 px-3 py-2 text-xs backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 text-amber-200">
              <span className="flex items-center gap-1.5">
                <Navigation className="h-3.5 w-3.5 animate-spin text-amber-400" />
                Kapal {selectedNation.name} sedang berlayar...
              </span>
              <span className="font-mono text-amber-400">{Math.round(shipProgress * 100)}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-48 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-75"
                style={{ width: `${shipProgress * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
