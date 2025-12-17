
import React, { useState, useEffect } from 'react';
import { AppData, SectionType, GlobalSettings } from '../../types';
import { ContentService } from '../../services/contentService';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Edit, PlusCircle, Trash2, Image as ImageIcon, BarChart2, Clock, Type, LayoutTemplate, ChevronRight, Settings, Search, X, Save, Palette, Edit3, ArrowUp, ArrowDown, Copy, Phone } from 'lucide-react';
import { AdminLayout } from './AdminLayout';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeSectionId = searchParams.get('section');
  
  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState<GlobalSettings | null>(null);

  // Rename Section State
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  useEffect(() => {
    const load = async () => {
        const d = await ContentService.getData();
        setData(d);
    };
    load();
  }, []);

  const openSettings = () => {
      if (data) {
          setTempSettings({ ...data.settings });
          setIsSettingsOpen(true);
      }
  };

  const saveSettings = async (e: React.FormEvent) => {
      e.preventDefault();
      if (tempSettings) {
          await ContentService.updateSettings(tempSettings);
          setIsSettingsOpen(false);
      }
  };

  const applyPalette = (primary: string, dark: string) => {
      if (tempSettings) {
          setTempSettings({
              ...tempSettings,
              primaryColor: primary,
              darkColor: dark
          });
      }
  };

  const handleAddItem = async (sectionId: string) => {
      const newItemId = await ContentService.addContentItem(sectionId, SectionType.TEXT_IMAGE);
      if (newItemId) {
          navigate(`/admin/edit/${sectionId}/${newItemId}`);
      }
  };

  const handleDuplicateItem = async (sectionId: string, itemId: string) => {
      if (confirm('Deseja duplicar este bloco?')) {
          await ContentService.duplicateContentItem(sectionId, itemId);
          const d = await ContentService.getData();
          setData(d);
      }
  };

  const handleReorderItem = async (sectionId: string, itemId: string, direction: 'up' | 'down') => {
      await ContentService.reorderContentItem(sectionId, itemId, direction);
      const d = await ContentService.getData();
      setData(d);
  };

  const handleRenameSection = async (e: React.FormEvent) => {
      e.preventDefault();
      if (activeSectionId && newSectionTitle.trim()) {
          await ContentService.updateSectionTitle(activeSectionId, newSectionTitle);
          setIsRenameOpen(false);
          // Refresh data
          const d = await ContentService.getData();
          setData(d);
      }
  };

  const handleReorder = async (direction: 'up' | 'down') => {
      if (activeSectionId) {
        await ContentService.reorderSection(activeSectionId, direction);
        const d = await ContentService.getData();
        setData(d);
      }
  };

  const openRenameModal = () => {
      if (activeSection) {
          setNewSectionTitle(activeSection.menuTitle);
          setIsRenameOpen(true);
      }
  };

  const getIconForType = (type: SectionType) => {
      switch(type) {
          case SectionType.CHART: return <BarChart2 size={24} className="text-purple-500" />;
          case SectionType.TIMELINE: return <Clock size={24} className="text-orange-500" />;
          case SectionType.STATS: return <BarChart2 size={24} className="text-green-500" />;
          case SectionType.HERO: 
          case SectionType.COVER: return <ImageIcon size={24} className="text-blue-500" />;
          case SectionType.CONTACT: return <Phone size={24} className="text-indigo-500" />;
          default: return <Type size={24} className="text-gray-500" />;
      }
  };

  const getLabelForType = (type: SectionType) => {
      switch(type) {
          case SectionType.CHART: return "Gráfico";
          case SectionType.TIMELINE: return "Linha do Tempo";
          case SectionType.STATS: return "Estatísticas";
          case SectionType.HERO: return "Capa / Destaque";
          case SectionType.COVER: return "Capa Principal";
          case SectionType.GRID_CARDS: return "Grade de Cards";
          case SectionType.VALUES: return "Valores";
          case SectionType.MATERIALITY: return "Matriz";
          case SectionType.CONTACT: return "Contato / Social";
          default: return "Texto e Imagem";
      }
  };

  if (!data) return <div>Carregando sistema...</div>;

  const activeSection = activeSectionId 
    ? data.sections.find(s => s.id === activeSectionId) 
    : null;

  return (
    <AdminLayout data={data}>
        <div className="p-6 lg:p-10 max-w-7xl mx-auto animate-fade-in relative">
            
            {/* Top Bar for Settings */}
            <div className="flex justify-end mb-4">
                <button onClick={openSettings} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-cacu-primary transition-all shadow-sm">
                    <Palette size={16} /> Personalizar Site (Logo/Cores/Cabeçalho/Rodapé)
                </button>
            </div>

            {!activeSection ? (
                // Welcome Screen
                <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
                    <div className="relative">
                        <div className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center text-cacu-primary relative z-10">
                            <LayoutTemplate size={64} strokeWidth={1} />
                        </div>
                        <div className="absolute inset-0 bg-cacu-primary/20 rounded-full blur-2xl scale-110"></div>
                    </div>
                    
                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold text-gray-800">Bem-vindo ao CMS</h1>
                        <p className="text-gray-500 max-w-md mx-auto text-lg">Gerencie o conteúdo e a aparência do seu site em um só lugar.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mt-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-md transition-all">
                            <span className="text-5xl font-extrabold text-cacu-dark mb-2">{data.sections.length}</span>
                            <span className="text-xs uppercase text-gray-400 font-bold tracking-widest">Páginas Ativas</span>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-md transition-all">
                            <span className="text-5xl font-extrabold text-cacu-primary mb-2">
                                {data.sections.reduce((acc, s) => acc + s.items.length, 0)}
                            </span>
                            <span className="text-xs uppercase text-gray-400 font-bold tracking-widest">Blocos de Conteúdo</span>
                        </div>
                    </div>
                </div>
            ) : (
                // Section Editor View
                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div>
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <Settings size={14} />
                                <span className="text-xs font-bold uppercase tracking-wider">Gerenciando Página</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-4xl font-extrabold text-cacu-dark">{activeSection.menuTitle}</h1>
                                <button onClick={openRenameModal} className="text-gray-400 hover:text-cacu-primary transition-colors p-2 rounded-lg hover:bg-gray-50" title="Renomear Página">
                                    <Edit3 size={20} />
                                </button>

                                <div className="flex items-center gap-1 ml-4 border-l border-gray-200 pl-4">
                                    <button onClick={() => handleReorder('up')} className="p-2 text-gray-400 hover:text-cacu-primary hover:bg-gray-50 rounded-lg" title="Mover para Cima">
                                        <ArrowUp size={20} />
                                    </button>
                                    <button onClick={() => handleReorder('down')} className="p-2 text-gray-400 hover:text-cacu-primary hover:bg-gray-50 rounded-lg" title="Mover para Baixo">
                                        <ArrowDown size={20} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-500 mt-2">Gerencie os blocos de conteúdo desta seção.</p>
                        </div>
                        <button 
                            onClick={() => handleAddItem(activeSection.id)}
                            className="flex items-center gap-2 px-6 py-4 bg-cacu-primary text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-600 hover:-translate-y-1 transition-all w-full md:w-auto justify-center"
                        >
                            <PlusCircle size={20} /> Adicionar Novo Bloco
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {activeSection.items.map((item, idx) => (
                            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-cacu-primary/30 transition-all group flex flex-col h-full relative">
                                {/* Actions Overlay (Reorder / Delete) */}
                                <div className="absolute top-4 right-4 z-20 flex gap-2">
                                    <button onClick={() => handleReorderItem(activeSection.id, item.id, 'up')} className="p-1.5 bg-white/80 hover:bg-white text-gray-500 hover:text-cacu-primary rounded-lg shadow-sm backdrop-blur-sm" title="Mover para cima">
                                        <ArrowUp size={14} />
                                    </button>
                                    <button onClick={() => handleReorderItem(activeSection.id, item.id, 'down')} className="p-1.5 bg-white/80 hover:bg-white text-gray-500 hover:text-cacu-primary rounded-lg shadow-sm backdrop-blur-sm" title="Mover para baixo">
                                        <ArrowDown size={14} />
                                    </button>
                                    <button onClick={() => handleDuplicateItem(activeSection.id, item.id)} className="p-1.5 bg-white/80 hover:bg-white text-gray-500 hover:text-blue-500 rounded-lg shadow-sm backdrop-blur-sm" title="Duplicar">
                                        <Copy size={14} />
                                    </button>
                                </div>

                                {/* Card Header / Preview */}
                                <div className="h-48 bg-gray-50 relative overflow-hidden border-b border-gray-100">
                                    {item.imageUrl ? (
                                        <>
                                            <img src={item.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50">
                                            {getIconForType(item.type)}
                                            <span className="text-[10px] font-bold mt-2 uppercase tracking-wide opacity-50">{getLabelForType(item.type)}</span>
                                        </div>
                                    )}
                                    
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className="px-3 py-1 bg-white/95 backdrop-blur-md rounded-lg text-[10px] font-bold text-cacu-dark uppercase shadow-sm border border-gray-100 tracking-wider">
                                            {getLabelForType(item.type)}
                                        </span>
                                    </div>
                                    
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-cacu-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1 group-hover:text-cacu-primary transition-colors" title={item.title}>
                                            {item.title || <span className="italic text-gray-400">Sem Título Definido</span>}
                                        </h3>
                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider line-clamp-1">
                                            {item.subtitle || "Sem subtítulo"}
                                        </p>
                                    </div>
                                    
                                    <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-1 leading-relaxed">
                                        {item.body ? item.body : <span className="italic opacity-50">Conteúdo visual ou lista.</span>}
                                    </p>
                                    
                                    <div className="flex gap-3 mt-auto pt-4 border-t border-gray-50">
                                        <Link 
                                            to={`/admin/edit/${activeSection.id}/${item.id}`}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-700 rounded-xl font-bold text-sm hover:bg-cacu-primary hover:text-white transition-all group-hover:bg-cacu-light group-hover:text-cacu-dark group-hover:hover:bg-cacu-primary group-hover:hover:text-white"
                                        >
                                            <Edit size={16} /> Editar
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Global Settings Modal */}
            {isSettingsOpen && tempSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                            <h3 className="text-xl font-bold text-cacu-dark flex items-center gap-2">
                                <Palette size={20} className="text-cacu-primary"/> Configurações do Site
                            </h3>
                            <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto space-y-6">
                            
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Cabeçalho (Header)</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Nome da Empresa</label>
                                        <input 
                                            type="text" 
                                            value={tempSettings.companyName}
                                            onChange={e => setTempSettings({...tempSettings, companyName: e.target.value})}
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cacu-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Título do Relatório</label>
                                        <input 
                                            type="text" 
                                            value={tempSettings.reportTitle || ''}
                                            onChange={e => setTempSettings({...tempSettings, reportTitle: e.target.value})}
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cacu-primary outline-none"
                                            placeholder="Ex: Relatório de Sustentabilidade"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Subtítulo (Ano/Safra)</label>
                                        <input 
                                            type="text" 
                                            value={tempSettings.reportSubtitle || ''}
                                            onChange={e => setTempSettings({...tempSettings, reportSubtitle: e.target.value})}
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cacu-primary outline-none"
                                            placeholder="Ex: Safras 2023/24 e 2024/25"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">URL da Logo (Imagem)</label>
                                        <input 
                                            type="text" 
                                            value={tempSettings.logoUrl || ''}
                                            onChange={e => setTempSettings({...tempSettings, logoUrl: e.target.value})}
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cacu-primary outline-none font-mono text-xs text-blue-600"
                                            placeholder="https://exemplo.com/logo.png"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Deixe em branco para usar a logo padrão (Triângulo).</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Rodapé (Footer)</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Texto Principal</label>
                                        <textarea
                                            value={tempSettings.footerText || ''}
                                            onChange={e => setTempSettings({...tempSettings, footerText: e.target.value})}
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cacu-primary outline-none"
                                            placeholder="Ex: Energia que transforma..."
                                            rows={2}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Texto de Copyright (Direitos)</label>
                                        <input
                                            type="text"
                                            value={tempSettings.footerCopyright || ''}
                                            onChange={e => setTempSettings({...tempSettings, footerCopyright: e.target.value})}
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cacu-primary outline-none"
                                            placeholder="Ex: Desenvolvido para"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Estilo Visual</h4>

                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Paletas de Cores Prontas</label>
                                    <div className="flex flex-wrap gap-2">
                                        <button onClick={() => applyPalette('#009E49', '#0B3B24')} className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-xs font-bold flex gap-2 items-center">
                                            <span className="w-3 h-3 rounded-full bg-[#009E49]"></span>
                                            <span className="w-3 h-3 rounded-full bg-[#0B3B24]"></span>
                                            Natureza (Padrão)
                                        </button>
                                        <button onClick={() => applyPalette('#2563EB', '#1E3A8A')} className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-xs font-bold flex gap-2 items-center">
                                            <span className="w-3 h-3 rounded-full bg-[#2563EB]"></span>
                                            <span className="w-3 h-3 rounded-full bg-[#1E3A8A]"></span>
                                            Oceano
                                        </button>
                                        <button onClick={() => applyPalette('#D97706', '#78350F')} className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-xs font-bold flex gap-2 items-center">
                                            <span className="w-3 h-3 rounded-full bg-[#D97706]"></span>
                                            <span className="w-3 h-3 rounded-full bg-[#78350F]"></span>
                                            Terra
                                        </button>
                                        <button onClick={() => applyPalette('#9333EA', '#581C87')} className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-xs font-bold flex gap-2 items-center">
                                            <span className="w-3 h-3 rounded-full bg-[#9333EA]"></span>
                                            <span className="w-3 h-3 rounded-full bg-[#581C87]"></span>
                                            Tech
                                        </button>
                                        <button onClick={() => applyPalette('#1F2937', '#000000')} className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-xs font-bold flex gap-2 items-center">
                                            <span className="w-3 h-3 rounded-full bg-[#1F2937]"></span>
                                            <span className="w-3 h-3 rounded-full bg-[#000000]"></span>
                                            Minimalista
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Cor Principal</label>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="color" 
                                                value={tempSettings.primaryColor}
                                                onChange={e => setTempSettings({...tempSettings, primaryColor: e.target.value})}
                                                className="h-10 w-10 rounded cursor-pointer border-0 p-0"
                                            />
                                            <input 
                                                type="text"
                                                value={tempSettings.primaryColor}
                                                onChange={e => setTempSettings({...tempSettings, primaryColor: e.target.value})}
                                                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm font-mono uppercase"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Cor Secundária</label>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="color" 
                                                value={tempSettings.darkColor}
                                                onChange={e => setTempSettings({...tempSettings, darkColor: e.target.value})}
                                                className="h-10 w-10 rounded cursor-pointer border-0 p-0"
                                            />
                                            <input 
                                                type="text"
                                                value={tempSettings.darkColor}
                                                onChange={e => setTempSettings({...tempSettings, darkColor: e.target.value})}
                                                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm font-mono uppercase"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Tipografia (Fonte)</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setTempSettings({...tempSettings, fontTheme: 'sans'})}
                                            className={`p-3 rounded-xl border text-left flex flex-col ${tempSettings.fontTheme !== 'serif' ? 'border-cacu-primary bg-green-50 ring-1 ring-cacu-primary' : 'border-gray-200 hover:bg-gray-100'}`}
                                        >
                                            <span className="font-bold text-sm text-gray-800 font-sans">Moderna (Sans)</span>
                                            <span className="text-xs text-gray-500 font-sans mt-1">Inter, Helvetica, Arial. Limpo e direto.</span>
                                        </button>
                                        <button
                                            onClick={() => setTempSettings({...tempSettings, fontTheme: 'serif'})}
                                            className={`p-3 rounded-xl border text-left flex flex-col ${tempSettings.fontTheme === 'serif' ? 'border-cacu-primary bg-green-50 ring-1 ring-cacu-primary' : 'border-gray-200 hover:bg-gray-100'}`}
                                        >
                                            <span className="font-bold text-sm text-gray-800 font-serif">Clássica (Serif)</span>
                                            <span className="text-xs text-gray-500 font-serif mt-1">Merriweather, Times. Elegante e tradicional.</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                            <button onClick={saveSettings} className="w-full bg-cacu-primary text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-200 flex justify-center items-center gap-2">
                                <Save size={18} /> Salvar Alterações
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-2">A página será recarregada para aplicar as alterações.</p>
                        </div>
                    </div>
                </div>
            )}

             {/* Rename Section Modal */}
            {isRenameOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative">
                        <button onClick={() => setIsRenameOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                        <h3 className="text-lg font-bold text-cacu-dark mb-4">Renomear Página</h3>
                        <form onSubmit={handleRenameSection} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-2">Nome da Página</label>
                                <input
                                    type="text"
                                    value={newSectionTitle}
                                    onChange={e => setNewSectionTitle(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cacu-primary focus:border-transparent outline-none"
                                    autoFocus
                                />
                            </div>
                            <button type="submit" className="w-full bg-cacu-primary text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors shadow-md">
                                Salvar Nome
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    </AdminLayout>
  );
};
