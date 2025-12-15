
export enum SectionType {
  HERO = 'HERO',          
  TEXT_IMAGE = 'TEXT_IMAGE', 
  STATS = 'STATS',        
  SUMMARY = 'SUMMARY',    
  TIMELINE = 'TIMELINE',  
  COVER = 'COVER',
  VALUES = 'VALUES',      // For Mission/Vision/Values
  GRID_CARDS = 'GRID_CARDS', // For Products
  CHART = 'CHART',        // For Emissions
  MATERIALITY = 'MATERIALITY' // For Materiality Matrix
}

export interface GlobalSettings {
  companyName: string;
  logoUrl?: string; // If present, overrides the SVG logo
  primaryColor: string; // Hex code
  darkColor: string; // Hex code
  reportTitle?: string; // e.g., "Relatório de Sustentabilidade" (Header)
  reportSubtitle?: string; // e.g., "Safras 2023/24 e 2024/25" (Header)
  footerText?: string; // "Energia que transforma..."
  footerCopyright?: string; // "Desenvolvido para..."
}

export interface ContentItem {
  id: string;
  type: SectionType;
  title?: string;
  subtitle?: string;
  body?: string; 
  imageUrl?: string;
  imageCaption?: string;
  stats?: StatItem[];
  timelineEvents?: TimelineEvent[];
  values?: ValueItem[];
  products?: ProductItem[];
  chartData?: ChartDataPoint[];
  bgColor?: 'blue' | 'white' | 'green'; 
  layout?: 'left' | 'right' | 'center';
}

export interface StatItem {
  label: string;
  value: string;
  icon?: string;
  description?: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description?: string;
}

export interface ValueItem {
  title: string;
  description: string;
  icon?: string;
}

export interface ProductItem {
  title: string;
  description: string;
  imageUrl?: string;
}

export interface ChartDataPoint {
  name: string;
  value1: number; // e.g. Scope 1
  value2?: number; // e.g. Scope 2
}

export interface ReportSection {
  id: string;
  menuTitle: string;
  items: ContentItem[];
}

export interface AppData {
  settings: GlobalSettings;
  sections: ReportSection[];
}
