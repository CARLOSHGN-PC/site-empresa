
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

          if (docSnap.exists()) {
              cachedData = docSnap.data() as AppData;
          } else {
              // Try to create only if we have permissions, but don't crash
              try {
                console.log('Initializing Firestore with default data...');
                await setDoc(docRef, INITIAL_DATA);
                cachedData = INITIAL_DATA;
              } catch (writeErr) {
                 console.warn("Could not write initial data to Firestore (permissions?). Using local fallback.", writeErr);
                 cachedData = INITIAL_DATA;
              }
          }
      } catch (error) {
          console.error("Error initializing data (likely permissions). Using local fallback.", error);
          // Fallback to local data if firebase fails (e.g. no config)
          cachedData = INITIAL_DATA;
      }
  },

  getData: async (): Promise<AppData> => {
    // If we have cached data (from initialize or previous fetch), return it
    if (cachedData) {
        // Double check settings existence to prevent "undefined" errors
        if (!cachedData.settings) {
            cachedData.settings = INITIAL_DATA.settings;
        }
        return cachedData;
    }

    // If not cached, try to fetch again
    try {
        const docRef = doc(db, COLLECTION, DOC_ID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            cachedData = docSnap.data() as AppData;
        } else {
             cachedData = INITIAL_DATA;
        }
    } catch (e) {
        console.warn("Could not fetch from Firebase, using default.", e);
        cachedData = INITIAL_DATA;
    }

    // Ensure integrity before returning
    if (!cachedData) cachedData = INITIAL_DATA;
    if (!cachedData.settings) cachedData.settings = INITIAL_DATA.settings;

    return cachedData;
  },

  saveData: async (data: AppData): Promise<void> => {
    cachedData = data; // Optimistic update
    try {
        const docRef = doc(db, COLLECTION, DOC_ID);
        await setDoc(docRef, data);
    } catch (e) {
        console.error("Error saving to Firebase", e);
        alert("Erro ao salvar no banco de dados. Verifique sua conexão ou permissões. Suas alterações estão salvas apenas nesta sessão.");
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

  updateSectionTitle: async (sectionId: string, newTitle: string) => {
    const data = await ContentService.getData();
    const sectionIndex = data.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return;

    data.sections[sectionIndex].menuTitle = newTitle;
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

  // DUPLICATE CONTENT ITEM
  duplicateContentItem: async (sectionId: string, itemId: string): Promise<string | null> => {
      const data = await ContentService.getData();
      const sectionIndex = data.sections.findIndex(s => s.id === sectionId);
      if (sectionIndex === -1) return null;

      const originalItem = data.sections[sectionIndex].items.find(i => i.id === itemId);
      if (!originalItem) return null;

      // Deep copy manually or via JSON to avoid reference issues
      const newItem: ContentItem = JSON.parse(JSON.stringify(originalItem));
      newItem.id = `dup-${Date.now()}`;
      newItem.title = `${newItem.title} (Cópia)`;

      // Insert after the original
      const originalIndex = data.sections[sectionIndex].items.findIndex(i => i.id === itemId);
      data.sections[sectionIndex].items.splice(originalIndex + 1, 0, newItem);

      await ContentService.saveData(data);
      return newItem.id;
  },

  // REORDER CONTENT ITEM (Within a section)
  reorderContentItem: async (sectionId: string, itemId: string, direction: 'up' | 'down') => {
      const data = await ContentService.getData();
      const sectionIndex = data.sections.findIndex(s => s.id === sectionId);
      if (sectionIndex === -1) return;

      const items = data.sections[sectionIndex].items;
      const index = items.findIndex(i => i.id === itemId);
      if (index === -1) return;

      const newIndex = direction === 'up' ? index - 1 : index + 1;

      // Bounds check
      if (newIndex < 0 || newIndex >= items.length) return;

      // Swap
      const temp = items[newIndex];
      items[newIndex] = items[index];
      items[index] = temp;

      await ContentService.saveData(data);
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

  reorderSection: async (sectionId: string, direction: 'up' | 'down') => {
      const data = await ContentService.getData();
      const index = data.sections.findIndex(s => s.id === sectionId);
      if (index === -1) return;

      const newIndex = direction === 'up' ? index - 1 : index + 1;

      // Bounds check
      if (newIndex < 0 || newIndex >= data.sections.length) return;

      // Swap
      const temp = data.sections[newIndex];
      data.sections[newIndex] = data.sections[index];
      data.sections[index] = temp;

      await ContentService.saveData(data);
  },

  resetData: async () => {
    await ContentService.saveData(INITIAL_DATA);
    window.location.reload();
  }
};
