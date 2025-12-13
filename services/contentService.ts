
import { AppData, ReportSection, ContentItem, SectionType, GlobalSettings } from '../types';
import { INITIAL_DATA } from '../constants';
import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const DOC_ID = 'main_report';
const COLLECTION = 'reports';

// Cached data in memory to avoid excessive reads
let cachedData: AppData | null = null;

export const ContentService = {

  // Initialize Database if empty
  initialize: async (): Promise<void> => {
      try {
          const docRef = doc(db, COLLECTION, DOC_ID);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
              console.log('Initializing Firestore with default data...');
              await setDoc(docRef, INITIAL_DATA);
              cachedData = INITIAL_DATA;
          } else {
              cachedData = docSnap.data() as AppData;
          }
      } catch (error) {
          console.error("Error initializing data:", error);
          // Fallback to local data if firebase fails (e.g. no config)
          cachedData = INITIAL_DATA;
      }
  },

  getData: async (): Promise<AppData> => {
    if (cachedData) return cachedData;

    try {
        const docRef = doc(db, COLLECTION, DOC_ID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            cachedData = docSnap.data() as AppData;

            // Ensure settings exist if migrating from old data structure
            if (!cachedData.settings) {
                cachedData.settings = INITIAL_DATA.settings;
            }
            return cachedData;
        }
    } catch (e) {
        console.warn("Could not fetch from Firebase, using default.", e);
    }

    return INITIAL_DATA;
  },

  saveData: async (data: AppData): Promise<void> => {
    cachedData = data; // Optimistic update
    try {
        const docRef = doc(db, COLLECTION, DOC_ID);
        await setDoc(docRef, data);
    } catch (e) {
        console.error("Error saving to Firebase", e);
        throw e;
    }
  },

  updateSettings: async (newSettings: GlobalSettings) => {
    const data = await ContentService.getData();
    data.settings = newSettings;
    await ContentService.saveData(data);
    window.location.reload();
  },

  updateSectionItem: async (sectionId: string, item: ContentItem) => {
    const data = await ContentService.getData();
    const sectionIndex = data.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return;

    const itemIndex = data.sections[sectionIndex].items.findIndex(i => i.id === item.id);
    if (itemIndex === -1) return;

    data.sections[sectionIndex].items[itemIndex] = item;
    await ContentService.saveData(data);
  },

  addContentItem: async (sectionId: string, type: SectionType): Promise<string | null> => {
      const data = await ContentService.getData();
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
      await ContentService.saveData(data);
      return newItemId;
  },

  addSection: async (title: string): Promise<string> => {
      const data = await ContentService.getData();
      const newId = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      const newSection: ReportSection = {
          id: newId,
          menuTitle: title,
          items: []
      };
      
      data.sections.push(newSection);
      await ContentService.saveData(data);
      return newId;
  },

  removeSection: async (sectionId: string) => {
      const data = await ContentService.getData();
      data.sections = data.sections.filter(s => s.id !== sectionId);
      await ContentService.saveData(data);
  },

  resetData: async () => {
    await ContentService.saveData(INITIAL_DATA);
    window.location.reload();
  }
};
