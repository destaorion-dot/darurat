import React, { useState } from 'react';
import { BANGSA_ASING } from './data/historicalData';
import { CountryId, ForeignNation } from './types/history';
import { Header } from './components/Header';
import { NauticalMap } from './components/NauticalMap';
import { InteractiveRealMap } from './components/InteractiveRealMap';
import { PidRightPanel } from './components/PidRightPanel';
import { TimelineView } from './components/TimelineView';
import { SpiceExploration } from './components/SpiceExploration';
import { HistoricalQuiz } from './components/HistoricalQuiz';

export default function App() {
  const [activeTab, setActiveTab] = useState<'map' | 'timeline' | 'spices' | 'quiz'>('map');
  const [selectedNationId, setSelectedNationId] = useState<CountryId>('portugis');
  const [mapMode, setMapMode] = useState<'antique' | 'realmaps'>('realmaps');
  const [showAllRoutes, setShowAllRoutes] = useState<boolean>(false);
  const [showSpiceMarkers, setShowSpiceMarkers] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Key to force trigger ship voyage restart from right panel
  const [voyageTrigger, setVoyageTrigger] = useState<number>(0);

  const selectedNation: ForeignNation = BANGSA_ASING[selectedNationId];

  const handleSelectNation = (id: CountryId) => {
    setSelectedNationId(id);
    setVoyageTrigger((prev) => prev + 1);
  };

  const handleRestartVoyage = () => {
    setVoyageTrigger((prev) => prev + 1);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#070e17] text-slate-100 flex flex-col font-sans select-none">
      {/* 1. COMPACT TOP HEADER */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
      />

      {/* 2. MAIN PID VIEWPORT (ZERO WINDOW SCROLL - SPLIT SCREEN) */}
      <main className="flex-1 w-full min-h-0 overflow-hidden p-2 sm:p-2.5">
        {activeTab === 'map' && (
          <div className="h-full w-full flex flex-col md:flex-row gap-2.5 overflow-hidden">
            {/* LEFT / CENTER: PETA INDONESIA (PETA SATELIT / MAPS ATAU PETA KUNO KLASIK) */}
            <div className="flex-1 h-full min-w-0 min-h-0 flex flex-col overflow-hidden">
              {mapMode === 'realmaps' ? (
                <InteractiveRealMap
                  key={`real-${selectedNationId}-${voyageTrigger}`}
                  selectedNation={selectedNation}
                  onSelectNation={handleSelectNation}
                  soundEnabled={soundEnabled}
                  onSwitchToAntiqueView={() => setMapMode('antique')}
                />
              ) : (
                <NauticalMap
                  key={`antique-${selectedNationId}-${voyageTrigger}`}
                  selectedNation={selectedNation}
                  onSelectNation={handleSelectNation}
                  showAllRoutes={showAllRoutes}
                  onToggleShowAllRoutes={() => setShowAllRoutes((prev) => !prev)}
                  showSpiceMarkers={showSpiceMarkers}
                  onToggleSpiceMarkers={() => setShowSpiceMarkers((prev) => !prev)}
                  soundEnabled={soundEnabled}
                  onOpenDetails={() => {}}
                  onSwitchToRealMaps={() => setMapMode('realmaps')}
                />
              )}
            </div>

            {/* RIGHT SIDEBAR: BENDERA NEGARA KECIL-SEDANG & PENJELASAN LENGKAP PID */}
            <div className="w-full md:w-[380px] lg:w-[420px] xl:w-[460px] h-[45%] md:h-full shrink-0 min-h-0 flex flex-col rounded-xl overflow-hidden border border-amber-900/30 shadow-2xl">
              <PidRightPanel
                selectedNation={selectedNation}
                onSelectNation={handleSelectNation}
                soundEnabled={soundEnabled}
                onRestartVoyage={handleRestartVoyage}
              />
            </div>
          </div>
        )}

        {/* TAB 2: GARIS WAKTU KRONOLOGIS */}
        {activeTab === 'timeline' && (
          <div className="h-full w-full overflow-y-auto max-w-5xl mx-auto py-2 px-1 custom-scrollbar">
            <TimelineView
              onSelectCountry={(cId) => {
                setSelectedNationId(cId);
                setActiveTab('map');
              }}
              soundEnabled={soundEnabled}
            />
          </div>
        )}

        {/* TAB 3: PUSAKA REMPAH NUSANTARA */}
        {activeTab === 'spices' && (
          <div className="h-full w-full overflow-y-auto max-w-5xl mx-auto py-2 px-1 custom-scrollbar">
            <SpiceExploration />
          </div>
        )}

        {/* TAB 4: KUIS SEJARAH LENGKAP */}
        {activeTab === 'quiz' && (
          <div className="h-full w-full overflow-y-auto max-w-4xl mx-auto py-2 px-1 custom-scrollbar">
            <HistoricalQuiz
              soundEnabled={soundEnabled}
              onClose={() => setActiveTab('map')}
            />
          </div>
        )}
      </main>
    </div>
  );
}
