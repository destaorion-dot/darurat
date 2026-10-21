export type CountryId = 'portugis' | 'spanyol' | 'belanda' | 'inggris';

export interface Waypoint {
  name: string;
  x: number; // percentage or SVG coordinate
  y: number;
  description?: string;
  year?: string;
}

export interface ArrivalRoute {
  id: string;
  title: string;
  pathD: string; // SVG path data
  startPoint: { x: number; y: number; label: string };
  intermediatePoints: { x: number; y: number; label: string }[];
  firstArrivalPoint: {
    x: number;
    y: number;
    islandName: string;
    portName: string;
    year: string;
    description: string;
  };
  approachDirection: string;
}

export interface ForeignNation {
  id: CountryId;
  name: string;
  formalName: string;
  flagEmoji: string;
  flagColors: string[];
  coatOfArmsSymbol?: string;
  motto?: string;
  badgeColor: string;
  accentColor: string;
  firstYear: string;
  firstIslandArrival: string;
  primaryPort: string;
  expeditionLeaders: string[];
  shipType: string;
  routeSummary: string[];
  jalurUmumText: string;
  tahunPentingText: string;
  alasanDatang: string[];
  perkembanganText: string;
  interestingFact: string;
  svgRoute: ArrivalRoute;
}

export interface TimelineEvent {
  year: number;
  yearDisplay: string;
  countryId: CountryId;
  countryName: string;
  title: string;
  location: string;
  description: string;
  category: 'penaklukan' | 'kedatangan' | 'perusahaan_dagang' | 'perjanjian';
}

export interface SpiceItem {
  id: string;
  name: string;
  latinName: string;
  icon: string;
  originRegions: string[];
  description: string;
  europeanUses: string[];
  historicalValue: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
