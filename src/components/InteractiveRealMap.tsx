import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { ForeignNation, CountryId } from '../types/history';
import { ExternalLink, Layers, Navigation, RotateCcw, ZoomIn, ZoomOut, Compass } from 'lucide-react';
import { playArrivalChime } from '../utils/audio';

// Real-world coordinates for historical landing sites and voyage waypoints
export const REAL_WAYPOINTS: Record<string, { lat: number; lng: number; name: string; desc: string; googleMapsUrl: string }> = {
  malaka: {
    lat: 2.1896,
    lng: 102.2501,
    name: 'Selat & Pelabuhan Malaka',
    desc: 'Ditaklukkan Portugis (1511) di bawah Afonso de Albuquerque, membuka gerbang laut ke Nusantara.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=2.1896,102.2501'
  },
  banten: {
    lat: -6.0274,
    lng: 106.1558,
    name: 'Pelabuhan Karangantu, Kesultanan Banten',
    desc: 'Tempat pendaratan pertama 4 kapal Belanda pimpinan Cornelis de Houtman (1596) & pos dagang Inggris (1602).',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pelabuhan+Karangantu+Banten'
  },
  ternate: {
    lat: 0.7712,
    lng: 127.3204,
    name: 'Ternate & Benteng Kastela (Maluku)',
    desc: 'Pendaratan pertama armada Portugis Francisco Serrão (1512) mencari cengkih, bersekutu dengan Sultan Ternate.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Benteng+Kastela+Ternate'
  },
  tidore: {
    lat: 0.6865,
    lng: 127.4042,
    name: 'Kesultanan Tidore (Maluku)',
    desc: 'Pendaratan ekspedisi Spanyol pimpinan Juan Sebastián Elcano (1521) setelah menyeberangi Samudra Pasifik.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kedaton+Kesultanan+Tidore'
  },
  banda: {
    lat: -4.5262,
    lng: 129.9042,
    name: 'Kepulauan Banda & Pulau Run (Maluku)',
    desc: 'Satu-satunya sumber buah pala & fuli dunia abad ke-16. Diperebutkan armada Inggris (EIC) dan VOC Belanda.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Banda+Neira+Maluku'
  },
  aceh: {
    lat: 5.5483,
    lng: 95.3238,
    name: 'Kesultanan Aceh Darussalam',
    desc: 'Pusat perdagangan lada dan persinggahan ekspedisi Inggris Sir James Lancaster (1602).',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Banda+Aceh'
  }
};

// Real geographic route lines [lat, lng]
export const REAL_ROUTES: Record<CountryId, [number, number][]> = {
  portugis: [
    [10.0, 75.0],    // Samudra Hindia dari India (Goa)
    [5.0, 90.0],
    [2.1896, 102.2501], // Malaka (1511)
    [-1.0, 105.0],
    [-5.0, 112.0],   // Laut Jawa
    [-6.5, 120.0],   // Laut Flores
    [-4.0, 126.0],   // Laut Banda
    [0.7712, 127.3204] // Ternate (Maluku 1512)
  ],
  spanyol: [
    [14.0, 135.0],   // Samudra Pasifik
    [10.0, 130.0],   // Laut Filipina Timur
    [6.0, 128.0],    // Selatan Mindanao
    [2.5, 128.5],    // Utara Halmahera
    [0.6865, 127.4042] // Tidore (Maluku 1521)
  ],
  belanda: [
    [-15.0, 90.0],   // Samudra Hindia dari Tanjung Harapan
    [-10.0, 100.0],
    [-7.0, 104.5],   // Pendekatan Selat Sunda
    [-5.9, 105.8],   // Masuk Selat Sunda
    [-6.0274, 106.1558] // Pelabuhan Karangantu Banten (1596)
  ],
  inggris: [
    [-12.0, 92.0],   // Samudra Hindia
    [-8.0, 100.0],
    [-6.0274, 106.1558], // Banten (1602 pos EIC)
    [-6.5, 115.0],
    [-6.0, 124.0],
    [-4.5262, 129.9042] // Kepulauan Banda (Pulau Run 1602)
  ]
};

interface InteractiveRealMapProps {
  selectedNation: ForeignNation;
  onSelectNation: (id: CountryId) => void;
  soundEnabled: boolean;
  onSwitchToAntiqueView: () => void;
}

export const InteractiveRealMap: React.FC<InteractiveRealMapProps> = ({
  selectedNation,
  onSelectNation,
  soundEnabled,
  onSwitchToAntiqueView
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const shipMarkerRef = useRef<L.Marker | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [mapLayerType, setMapLayerType] = useState<'satellite' | 'street' | 'dark'>('satellite');
  const [activeTileLayer, setActiveTileLayer] = useState<L.TileLayer | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Centered on the Indonesian Archipelago
    const map = L.map(mapContainerRef.current, {
      center: [-2.5, 118.0],
      zoom: 5,
      minZoom: 4,
      maxZoom: 16,
      zoomControl: false
    });

    mapInstanceRef.current = map;

    // Default tile layer: Esri World Imagery (Real Satellite)
    const satLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '© Esri, Maxar, Earthstar Geographics',
        maxZoom: 17
      }
    ).addTo(map);

    setActiveTileLayer(satLayer);

    // Add historical landing markers on real coordinates
    Object.entries(REAL_WAYPOINTS).forEach(([key, wp]) => {
      const isNationDest =
        (selectedNation.id === 'belanda' && key === 'banten') ||
        (selectedNation.id === 'portugis' && (key === 'ternate' || key === 'malaka')) ||
        (selectedNation.id === 'spanyol' && key === 'tidore') ||
        (selectedNation.id === 'inggris' && (key === 'banten' || key === 'banda'));

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="position:relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 30px; height: 30px; border-radius: 50%; background: ${isNationDest ? '#f59e0b' : '#38bdf8'}; opacity: 0.35; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 20px; height: 20px; border-radius: 50%; background: ${isNationDest ? '#d97706' : '#0284c7'}; border: 2px solid #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; font-size: 11px;">
              ⚓
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const popupContent = `
        <div style="font-family: sans-serif; color: #0f172a; padding: 4px; max-width: 240px;">
          <h4 style="font-weight: bold; font-size: 13px; margin: 0 0 4px 0; color: #1e293b;">${wp.name}</h4>
          <p style="font-size: 11px; margin: 0 0 8px 0; line-height: 1.4; color: #475569;">${wp.desc}</p>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px;">
            <span style="font-size: 10px; color: #64748b; font-family: monospace;">${wp.lat.toFixed(3)}°, ${wp.lng.toFixed(3)}°</span>
            <a href="${wp.googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 11px; font-weight: bold; color: #2563eb; text-decoration: none;">
              Buka Google Maps ↗
            </a>
          </div>
        </div>
      `;

      L.marker([wp.lat, wp.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(popupContent);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Change Map Style (Satellite vs Street vs Dark)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !activeTileLayer) return;

    map.removeLayer(activeTileLayer);

    let newUrl = '';
    let attribution = '';

    if (mapLayerType === 'satellite') {
      newUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = '© Esri, Maxar, Earthstar Geographics';
    } else if (mapLayerType === 'street') {
      newUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '© OpenStreetMap contributors';
    } else {
      newUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      attribution = '© CARTO, OpenStreetMap';
    }

    const newLayer = L.tileLayer(newUrl, { attribution, maxZoom: 18 }).addTo(map);
    setActiveTileLayer(newLayer);
  }, [mapLayerType]);

  // Draw Route and Animate Ship on Selected Country
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous route
    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }
    if (shipMarkerRef.current) {
      map.removeLayer(shipMarkerRef.current);
      shipMarkerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    const coords = REAL_ROUTES[selectedNation.id];
    if (!coords || coords.length === 0) return;

    // Draw route polyline with glowing historical color
    const polyline = L.polyline(coords, {
      color: selectedNation.accentColor,
      weight: 3.5,
      dashArray: '8, 6',
      opacity: 0.9
    }).addTo(map);

    routePolylineRef.current = polyline;

    // Zoom/pan map to encompass the route
    map.flyToBounds(polyline.getBounds(), {
      padding: [40, 40],
      duration: 1.5
    });

    // Create custom Ship marker
    const shipIcon = L.divIcon({
      className: 'real-ship-marker',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
          <div style="background: rgba(10, 19, 32, 0.9); border: 1.5px solid ${selectedNation.accentColor}; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; color: #ffffff; white-space: nowrap; box-shadow: 0 4px 6px rgba(0,0,0,0.6); margin-bottom: 2px;">
            ${selectedNation.flagEmoji} Kapal ${selectedNation.name}
          </div>
          <div style="font-size: 24px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.8));">
            ⛵
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const startPos = coords[0];
    const shipMarker = L.marker(startPos, { icon: shipIcon, zIndexOffset: 1000 }).addTo(map);
    shipMarkerRef.current = shipMarker;

    // Animate ship smoothly across waypoints
    let currentSegment = 0;
    let segProgress = 0;
    const segSpeed = 0.015;

    const animateShip = () => {
      if (currentSegment >= coords.length - 1) {
        if (soundEnabled) playArrivalChime(true);
        return;
      }

      segProgress += segSpeed;
      if (segProgress >= 1) {
        segProgress = 0;
        currentSegment++;
        if (currentSegment >= coords.length - 1) {
          shipMarker.setLatLng(coords[coords.length - 1]);
          if (soundEnabled) playArrivalChime(true);
          return;
        }
      }

      const p1 = coords[currentSegment];
      const p2 = coords[currentSegment + 1];

      const lat = p1[0] + (p2[0] - p1[0]) * segProgress;
      const lng = p1[1] + (p2[1] - p1[1]) * segProgress;

      shipMarker.setLatLng([lat, lng]);
      animFrameRef.current = requestAnimationFrame(animateShip);
    };

    animFrameRef.current = requestAnimationFrame(animateShip);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [selectedNation, soundEnabled]);

  const restartVoyage = () => {
    const map = mapInstanceRef.current;
    const coords = REAL_ROUTES[selectedNation.id];
    if (!map || !coords || !shipMarkerRef.current) return;

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    let currentSegment = 0;
    let segProgress = 0;
    const segSpeed = 0.015;

    const animateShip = () => {
      if (currentSegment >= coords.length - 1) {
        if (soundEnabled) playArrivalChime(true);
        return;
      }

      segProgress += segSpeed;
      if (segProgress >= 1) {
        segProgress = 0;
        currentSegment++;
        if (currentSegment >= coords.length - 1) {
          shipMarkerRef.current?.setLatLng(coords[coords.length - 1]);
          if (soundEnabled) playArrivalChime(true);
          return;
        }
      }

      const p1 = coords[currentSegment];
      const p2 = coords[currentSegment + 1];

      const lat = p1[0] + (p2[0] - p1[0]) * segProgress;
      const lng = p1[1] + (p2[1] - p1[1]) * segProgress;

      shipMarkerRef.current?.setLatLng([lat, lng]);
      animFrameRef.current = requestAnimationFrame(animateShip);
    };

    animFrameRef.current = requestAnimationFrame(animateShip);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden rounded-xl border border-amber-900/30 bg-[#0d1724] shadow-2xl">
      {/* Top Map Toolbar with Maps connection badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-900/20 bg-[#0b131e]/95 px-3 py-2 backdrop-blur-md shrink-0 z-10">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-bold tracking-wider text-amber-100 uppercase font-serif leading-none">
                Peta Terhubung Citra Satelit &amp; Geografi Nyata
              </h2>
              <span className="rounded bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300">
                Terhubung ke Maps
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
              Koordinat pelabuhan nyata Nusantara · Klik pin ⚓ untuk membuka lokasi di Google Maps
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 text-xs">
          {/* Switch back to antique map */}
          <button
            onClick={onSwitchToAntiqueView}
            className="flex items-center gap-1 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-200 hover:bg-amber-500/20 transition"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Peta Kuno Klasik</span>
          </button>

          {/* Layer switcher: Satelit vs Street vs Dark */}
          <div className="flex items-center rounded-lg border border-slate-700 bg-slate-800/80 p-0.5 text-[11px]">
            <button
              onClick={() => setMapLayerType('satellite')}
              className={`px-2 py-0.5 rounded font-medium transition ${
                mapLayerType === 'satellite' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🛰️ Satelit
            </button>
            <button
              onClick={() => setMapLayerType('street')}
              className={`px-2 py-0.5 rounded font-medium transition ${
                mapLayerType === 'street' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🗺️ Peta Jalan
            </button>
            <button
              onClick={() => setMapLayerType('dark')}
              className={`px-2 py-0.5 rounded font-medium transition ${
                mapLayerType === 'dark' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🌙 Malam
            </button>
          </div>

          <button
            onClick={restartVoyage}
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:text-white transition"
            title="Putar ulang kapal"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Ulangi</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map DOM Canvas */}
      <div className="relative flex-1 w-full min-h-0 bg-[#070e17]">
        <div ref={mapContainerRef} className="h-full w-full z-0" />

        {/* Floating Quick Jump Links to Google Maps for each historical port */}
        <div className="absolute bottom-2 left-2 right-2 sm:right-auto flex flex-wrap gap-1.5 z-[500] pointer-events-auto">
          <div className="rounded-lg bg-[#0b1422]/95 border border-slate-700/80 p-1.5 shadow-xl backdrop-blur-md flex flex-wrap items-center gap-1 text-[10px]">
            <span className="text-slate-400 font-bold px-1">Buka di Google Maps:</span>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Pelabuhan+Karangantu+Banten"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-sky-950/80 border border-sky-500/40 px-2 py-0.5 font-semibold text-sky-300 hover:bg-sky-900 flex items-center gap-1"
            >
              <span>Pelabuhan Banten 🇳🇱</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Benteng+Kastela+Ternate"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 font-semibold text-emerald-300 hover:bg-emerald-900 flex items-center gap-1"
            >
              <span>Ternate Maluku 🇵🇹</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Kedaton+Kesultanan+Tidore"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 font-semibold text-amber-300 hover:bg-amber-900 flex items-center gap-1"
            >
              <span>Tidore Maluku 🇪🇸</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Banda+Neira+Maluku"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-rose-950/80 border border-rose-500/40 px-2 py-0.5 font-semibold text-rose-300 hover:bg-rose-900 flex items-center gap-1"
            >
              <span>Kepulauan Banda 🇬🇧</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
