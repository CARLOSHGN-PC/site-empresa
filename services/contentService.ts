
import { AppData, ReportSection, ContentItem, SectionType, GlobalSettings } from '../types';
import { INITIAL_DATA } from '../constants';

const STORAGE_KEY = 'cacu_report_data_v4'; // Version bump for new structure

export const ContentService = {
  getData: (): AppData => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedData = JSON.parse(stored);
      // Ensure settings exist if migrating from old data
      if (!parsedData.settings) {
          parsedData.settings = INITIAL_DATA.settings;
      }
      return parsedData;
    }
    return INITIAL_DATA;
  },

  saveData: (data: AppData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  updateSettings: (newSettings: GlobalSettings) => {
    const data = ContentService.getData();
    data.settings = newSettings;
    ContentService.saveData(data);
    // Force reload to apply theme changes immediately
    window.location.reload();
  },

  updateSectionItem: (sectionId: string, item: ContentItem) => {
    const data = ContentService.getData();
    const sectionIndex = data.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return;

    const itemIndex = data.sections[sectionIndex].items.findIndex(i => i.id === item.id);
    if (itemIndex === -1) return;

    data.sections[sectionIndex].items[itemIndex] = item;
    ContentService.saveData(data);
  },

  addContentItem: (sectionId: string, type: SectionType): string | null => {
      const data = ContentService.getData();
      const sectionIndex = data.sections.findIndex(s => s.id === sectionId);
      if (sectionIndex === -1) return null;

      const newItemId = `new-${Date.now()}`;
      const newItem: ContentItem = {
          id: newItemId,
          type: type,
          title: 'Novo Conteúdo',
          subtitle: 'Editar',
          body: 'Adicione seu texto aqui...',
          bgColor: 'white',
          layout: 'left'
      };

      data.sections[sectionIndex].items.push(newItem);
      ContentService.saveData(data);
      return newItemId;
  },

  addSection: (title: string) => {
      const data = ContentService.getData();
      const newId = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      const newSection: ReportSection = {
          id: newId,
          menuTitle: title,
          items: []
      };
      
      data.sections.push(newSection);
      ContentService.saveData(data);
      return newId;
  },

  removeSection: (sectionId: string) => {
      const data = ContentService.getData();
      data.sections = data.sections.filter(s => s.id !== sectionId);
      ContentService.saveData(data);
  },

  resetData: () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }
};
