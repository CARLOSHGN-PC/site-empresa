
import React, { useState, useEffect } from 'react';
import { AppData, SectionType, GlobalSettings } from '../../types';
import { ContentService } from '../../services/contentService';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Edit, PlusCircle, Trash2, Image as ImageIcon, BarChart2, Clock, Type, LayoutTemplate, ChevronRight, Settings, Search, X, Save, Palette } from 'lucide-react';
import { AdminLayout } from './AdminLayout';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeSectionId = searchParams.get('section');
  
  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState<GlobalSettings | null>(null);

  useEffect(() => {
    setData(ContentService.getData());
  }, []);

  const openSettings = () => {
      if (data) {
          setTempSettings({ ...data.settings });
          setIsSettingsOpen(true);
      }
  };

  const saveSettings = (e: React.FormEvent) => {
      e.preventDefault();
      if (tempSettings) {
          ContentService.updateSettings(tempSettings);
          setIsSettingsOpen(false);
      }
  };

  const handleAddItem = (sectionId: string) => {
      const newItemId = ContentService.addContentItem(sectionId, SectionType.TEXT_IMAGE);
      if (newItemId) {
          navigate(`/admin/edit/${sectionId}/${newItemId}`);
      }
  };

  const getIconForType = (type: SectionType) => {
      switch(type) {
          case SectionType.CHART: return <BarChart2 size={24} className="text-purple-500" />;
          case SectionType.TIMELINE: return <Clock size={24} className="text-orange-500" />;
          case SectionType.STATS: return <BarChart2 size={24} className="text-green-500" />;
          case SectionType.HERO: 
          case SectionType.COVER: return <ImageIcon size={24} className="text-blue-500" />;
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
                    <Palette size={16} /> Personalizar Site (Logo/Cores/Cabeçalho)
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
                            <h1 className="text-4xl font-extrabold text-cacu-dark">{activeSection.menuTitle}</h1>
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
                            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-cacu-primary/30 transition-all group flex flex-col h-full">
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
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Cores do Tema</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Principal (Verde Vivo)</label>
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
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Secundária (Escura)</label>
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
        </div>
    </AdminLayout>
  );
};
