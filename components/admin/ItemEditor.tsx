import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ContentService } from '../../services/contentService';
import { ContentItem, SectionType, ChartDataPoint, MaterialityItem, SummaryItem } from '../../types';
import { ArrowLeft, Save, Plus, Trash, Check, AlertCircle, Monitor, Smartphone, Layout, Type, Image as ImageIcon, List, Eye, X, PieChart, Layers } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { SectionRenderer } from '../public/SectionRenderer';

export const ItemEditor: React.FC = () => {
  const { sectionId, itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<ContentItem | null>(null);
  const [data, setData] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
        const appData = await ContentService.getData();
        setData(appData);

        if (sectionId && itemId) {
            const section = appData.sections.find(s => s.id === sectionId);
            const foundItem = section?.items.find(i => i.id === itemId);
            if (foundItem) setItem(JSON.parse(JSON.stringify(foundItem)));
            else navigate('/admin');
        }
    };
    load();
  }, [sectionId, itemId, navigate]);

  const handleSave = async () => {
    if (sectionId && item) {
        await ContentService.updateSectionItem(sectionId, item);
        const btn = document.getElementById('save-btn');
        if(btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = `<span class="flex items-center gap-2"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Salvo!</span>`;
            btn.classList.remove('bg-cacu-primary', 'hover:bg-green-600');
            btn.classList.add('bg-green-700');
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.add('bg-cacu-primary', 'hover:bg-green-600');
                btn.classList.remove('bg-green-700');
            }, 2000);
        }
    }
  };

  const updateArrayItem = (arrayName: keyof ContentItem, index: number, field: string, value: any) => {
      if (!item) return;
      const newArray = [...(item[arrayName] as any[])];
      newArray[index][field] = value;
      setItem({ ...item, [arrayName]: newArray });
  };

  const updateNestedArrayItem = (arrayName: keyof ContentItem, index: number, subField: string, subIndex: number, value: any) => {
      if (!item) return;
      const newArray = [...(item[arrayName] as any[])];
      if (subField === 'topics') {
          newArray[index].topics[subIndex] = value;
      }
      setItem({ ...item, [arrayName]: newArray });
  };

  const addArrayItem = (arrayName: keyof ContentItem, template: any) => {
      if (!item) return;
      const newArray = item[arrayName] ? [...(item[arrayName] as any[])] : [];
      newArray.push(template);
      setItem({ ...item, [arrayName]: newArray });
  };

  const removeArrayItem = (arrayName: keyof ContentItem, index: number) => {
      if (!item) return;
      const newArray = [...(item[arrayName] as any[])];
      newArray.splice(index, 1);
      setItem({ ...item, [arrayName]: newArray });
  };

  if (!item) return <div>Carregando editor...</div>;

  const typeLabels: Record<string, string> = {
      [SectionType.HERO]: 'Capa / Destaque (Com máscara de folha)',
      [SectionType.TEXT_IMAGE]: 'Texto com Imagem Lateral',
      [SectionType.STATS]: 'Painel de Estatísticas (Verde)',
      [SectionType.SUMMARY]: 'Sumário Numérico',
      [SectionType.TIMELINE]: 'Linha do Tempo (Anos)',
      [SectionType.COVER]: 'Capa Principal do Site',
      [SectionType.VALUES]: 'Grid de Valores/Ícones',
      [SectionType.GRID_CARDS]: 'Grid de Cards com Imagem (Produtos)',
      [SectionType.CHART]: 'Gráfico de Barras',
      [SectionType.MATERIALITY]: 'Matriz de Materialidade'
  };

  return (
    <AdminLayout data={data}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 lg:px-10 py-4 flex justify-between items-center shadow-sm backdrop-blur-sm bg-white/90">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(`/admin?section=${sectionId}`)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors" title="Voltar">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-lg font-extrabold text-gray-800 leading-tight">Editor de Conteúdo</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-cacu-primary uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded">{typeLabels[item.type]}</span>
                        <span className="text-[10px] text-gray-400 hidden sm:inline">ID: {item.id}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={() => setIsPreviewOpen(true)} className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-cacu-dark bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-all text-sm">
                    <Eye size={18} /> Visualizar
                </button>
                <button id="save-btn" onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-cacu-primary text-white rounded-xl hover:bg-green-600 font-bold shadow-lg shadow-green-200 transition-all transform hover:-translate-y-0.5 text-sm">
                    <Save size={18} /> Salvar
                </button>
            </div>
        </div>

        {/* Preview Modal */}
        {isPreviewOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 lg:p-8 animate-fade-in">
                <div className="bg-white w-full h-full max-w-7xl rounded-3xl overflow-hidden relative flex flex-col shadow-2xl">
                    <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
                        <span className="font-bold text-sm uppercase tracking-widest">Pré-visualização ao Vivo</span>
                        <button onClick={() => setIsPreviewOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto bg-white">
                        <SectionRenderer item={item} settings={data?.settings} />
                    </div>
                </div>
            </div>
        )}

        <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 pb-24">
            {/* Editor Form Fields (Same as previous version, preserved functionality) */}
            <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Layout size={20} /></div>
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Configuração Visual</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Layout</label>
                        <select 
                            value={item.type} 
                            onChange={e => setItem({...item, type: e.target.value as SectionType})}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-cacu-primary focus:border-transparent outline-none transition-all"
                        >
                            {Object.entries(typeLabels).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Cor de Fundo</label>
                        <div className="grid grid-cols-3 gap-3">
                            <button onClick={() => setItem({...item, bgColor: 'white'})} className={`py-3 rounded-xl border text-sm font-bold transition-all ${item.bgColor === 'white' ? 'border-cacu-primary bg-white text-cacu-primary ring-2 ring-cacu-primary ring-offset-1' : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'}`}>Branco</button>
                            <button onClick={() => setItem({...item, bgColor: 'blue'})} className={`py-3 rounded-xl border text-sm font-bold transition-all ${item.bgColor === 'blue' ? 'border-cacu-dark bg-cacu-dark text-white ring-2 ring-cacu-dark ring-offset-1' : 'border-gray-200 bg-cacu-dark/80 text-white/70 hover:bg-cacu-dark'}`}>Verde Escuro</button>
                            <button onClick={() => setItem({...item, bgColor: 'green'})} className={`py-3 rounded-xl border text-sm font-bold transition-all ${item.bgColor === 'green' ? 'border-cacu-primary bg-cacu-primary text-white ring-2 ring-cacu-primary ring-offset-1' : 'border-gray-200 bg-cacu-primary/80 text-white/70 hover:bg-cacu-primary'}`}>Verde Vivo</button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Type size={20} /></div>
                            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Conteúdo de Texto</h2>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Título Principal</label>
                                <input type="text" value={item.title || ''} onChange={e => setItem({...item, title: e.target.value})} className="w-full p-4 border border-gray-200 rounded-xl focus:border-cacu-primary focus:ring-2 focus:ring-cacu-primary/20 outline-none transition-all text-lg font-semibold text-gray-800 placeholder-gray-300" placeholder="Ex: Nossa História" />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Subtítulo / Código GRI / Cargo</label>
                                <input type="text" value={item.subtitle || ''} onChange={e => setItem({...item, subtitle: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:border-cacu-primary focus:ring-2 focus:ring-cacu-primary/20 outline-none transition-all text-gray-600" placeholder="Ex: GRI 2-6 ou Cargo do Funcionario" />
                            </div>

                            {[SectionType.TEXT_IMAGE, SectionType.CHART, SectionType.HERO, SectionType.STATS].includes(item.type) && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Texto Descritivo (Corpo)</label>
                                    <textarea rows={8} value={item.body || ''} onChange={e => setItem({...item, body: e.target.value})} className="w-full p-4 border border-gray-200 rounded-xl focus:border-cacu-primary focus:ring-2 focus:ring-cacu-primary/20 outline-none transition-all leading-relaxed text-gray-600" placeholder="Digite o conteúdo aqui... Use Enter para quebrar linhas." />
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    {[SectionType.HERO, SectionType.TEXT_IMAGE, SectionType.COVER].includes(item.type) && (
                        <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><ImageIcon size={20} /></div>
                                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Imagem</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 relative group shadow-inner">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                            <ImageIcon size={32} className="mb-2 opacity-50" />
                                            <span className="text-xs font-medium">Sem Imagem</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">URL da Imagem</label>
                                    <input type="text" value={item.imageUrl || ''} onChange={e => setItem({...item, imageUrl: e.target.value})} className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:border-cacu-primary focus:ring-2 focus:ring-cacu-primary/20 outline-none font-mono text-blue-600 break-all" placeholder="https://..." />
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {/* List Editors (Timeline, etc) - kept same structure but ensuring full render */}
            {item.type === SectionType.TIMELINE && (
                <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-cacu-light text-cacu-dark rounded-lg"><List size={20} /></div>
                            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Eventos da Linha do Tempo</h2>
                        </div>
                        <button onClick={() => addArrayItem('timelineEvents', { year: '2025', title: 'Novo Marco', description: '' })} className="text-white bg-cacu-primary hover:bg-green-600 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-md"><Plus size={16}/> Adicionar Ano</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {item.timelineEvents?.map((evt, idx) => (
                            <div key={idx} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 relative group hover:border-cacu-primary/30 hover:shadow-md transition-all">
                                <button onClick={() => removeArrayItem('timelineEvents', idx)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-1"><Trash size={16}/></button>
                                <div className="flex gap-4 mb-4">
                                    <div className="w-24">
                                        <label className="text-[10px] uppercase font-extrabold text-gray-400 mb-1 block">Ano</label>
                                        <input value={evt.year} onChange={e => updateArrayItem('timelineEvents', idx, 'year', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-lg font-extrabold text-cacu-primary text-center focus:ring-2 focus:ring-cacu-primary/20 outline-none" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] uppercase font-extrabold text-gray-400 mb-1 block">Título do Evento</label>
                                        <input value={evt.title} onChange={e => updateArrayItem('timelineEvents', idx, 'title', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-cacu-primary/20 outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-extrabold text-gray-400 mb-1 block">Descrição Curta</label>
                                    <textarea rows={2} value={evt.description} onChange={e => updateArrayItem('timelineEvents', idx, 'description', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 focus:ring-2 focus:ring-cacu-primary/20 outline-none" placeholder="O que aconteceu?" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* CHART EDITOR */}
            {item.type === SectionType.CHART && (
                <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><PieChart size={20} /></div>
                            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Dados do Gráfico</h2>
                        </div>
                        <button onClick={() => addArrayItem('chartData', { name: '2025', value1: 0 })} className="text-white bg-cacu-primary hover:bg-green-600 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-md"><Plus size={16}/> Adicionar Coluna</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {item.chartData?.map((dataPoint, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 relative group hover:border-cacu-primary/30 transition-all">
                                <button onClick={() => removeArrayItem('chartData', idx)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors"><Trash size={14}/></button>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[10px] uppercase font-extrabold text-gray-400 mb-1 block">Rótulo (Eixo X)</label>
                                        <input value={dataPoint.name} onChange={e => updateArrayItem('chartData', idx, 'name', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-center outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-extrabold text-gray-400 mb-1 block">Valor</label>
                                        <input type="number" step="0.0001" value={dataPoint.value1} onChange={e => updateArrayItem('chartData', idx, 'value1', parseFloat(e.target.value))} className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-mono text-cacu-primary text-center outline-none" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* MATERIALITY EDITOR */}
            {item.type === SectionType.MATERIALITY && (
                <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Layers size={20} /></div>
                            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Matriz de Materialidade</h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        {item.materialityItems?.map((mat, idx) => (
                            <div key={idx} className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                                <div className="flex justify-between mb-4">
                                    <h3 className="font-bold text-cacu-dark uppercase">{mat.category}</h3>
                                    <span className={`text-xs px-2 py-1 rounded bg-${mat.color === 'green' ? 'green-100 text-green-800' : mat.color === 'blue' ? 'blue-100 text-blue-800' : 'orange-100 text-orange-800'}`}>Cor: {mat.color}</span>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-extrabold text-gray-400 mb-1 block">Tópicos (1 por campo)</label>
                                    {mat.topics.map((topic, tIdx) => (
                                        <div key={tIdx} className="flex gap-2">
                                            <input
                                                value={topic}
                                                onChange={e => updateNestedArrayItem('materialityItems', idx, 'topics', tIdx, e.target.value)}
                                                className="flex-1 p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-cacu-primary"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* SUMMARY EDITOR */}
            {item.type === SectionType.SUMMARY && (
                <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><List size={20} /></div>
                            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Itens do Sumário</h2>
                        </div>
                        <button onClick={() => addArrayItem('summaryItems', { num: '00', label: 'Novo Item', desc: '' })} className="text-white bg-cacu-primary hover:bg-green-600 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-md"><Plus size={16}/> Adicionar Item</button>
                    </div>
                    <div className="space-y-4">
                        {item.summaryItems?.map((sum, idx) => (
                            <div key={idx} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl border border-gray-200 relative">
                                <button onClick={() => removeArrayItem('summaryItems', idx)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors"><Trash size={14}/></button>
                                <div className="w-16">
                                    <label className="text-[10px] uppercase font-extrabold text-gray-400 mb-1 block">Num</label>
                                    <input value={sum.num} onChange={e => updateArrayItem('summaryItems', idx, 'num', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-lg text-center font-bold outline-none" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] uppercase font-extrabold text-gray-400 mb-1 block">Título</label>
                                    <input value={sum.label} onChange={e => updateArrayItem('summaryItems', idx, 'label', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-lg font-bold outline-none" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] uppercase font-extrabold text-gray-400 mb-1 block">Descrição</label>
                                    <input value={sum.desc} onChange={e => updateArrayItem('summaryItems', idx, 'desc', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            
            {/* Other grid editors (Stats, Values, Cards) logic preserved from previous step */}
             {(item.type === SectionType.GRID_CARDS || item.type === SectionType.VALUES || item.type === SectionType.STATS) && (
                <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-cacu-light text-cacu-dark rounded-lg"><List size={20} /></div>
                            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                                {item.type === SectionType.GRID_CARDS ? 'Produtos' : item.type === SectionType.STATS ? 'Estatísticas' : 'Valores'}
                            </h2>
                        </div>
                        <button onClick={() => addArrayItem(item.type === SectionType.STATS ? 'stats' : item.type === SectionType.VALUES ? 'values' : 'products', { title: 'Novo Item', description: '', icon: 'Star' })} className="text-white bg-cacu-primary hover:bg-green-600 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-md"><Plus size={16}/> Adicionar Item</button>
                    </div>
                    <div className="space-y-4">
                        {(item.products || item.values || item.stats)?.map((obj: any, idx: number) => (
                            <div key={idx} className="flex gap-6 items-start p-6 bg-gray-50 rounded-2xl border border-gray-200 group hover:border-cacu-primary/30 hover:bg-white hover:shadow-md transition-all">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6">
                                    {/* Title/Label */}
                                    <div className="md:col-span-3">
                                        <label className="text-[10px] uppercase font-extrabold text-gray-400 block mb-2">Título / Rótulo</label>
                                        <input value={obj.title || obj.label} onChange={e => updateArrayItem(item.type === SectionType.STATS ? 'stats' : item.type === SectionType.VALUES ? 'values' : 'products', idx, item.type === SectionType.STATS ? 'label' : 'title', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-cacu-primary/20 outline-none" />
                                    </div>
                                    
                                    {/* Value (Stats Only) */}
                                    {obj.value !== undefined && (
                                        <div className="md:col-span-2">
                                            <label className="text-[10px] uppercase font-extrabold text-gray-400 block mb-2">Valor (Númerico)</label>
                                            <input value={obj.value} onChange={e => updateArrayItem('stats', idx, 'value', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-cacu-primary focus:ring-2 focus:ring-cacu-primary/20 outline-none" />
                                        </div>
                                    )}

                                    {/* Description */}
                                    <div className="md:col-span-5">
                                        <label className="text-[10px] uppercase font-extrabold text-gray-400 block mb-2">Descrição</label>
                                        <textarea rows={2} value={obj.description} onChange={e => updateArrayItem(item.type === SectionType.STATS ? 'stats' : item.type === SectionType.VALUES ? 'values' : 'products', idx, 'description', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 focus:ring-2 focus:ring-cacu-primary/20 outline-none" />
                                    </div>

                                    {/* Icon or Image */}
                                    <div className="md:col-span-2">
                                        {(item.type === SectionType.VALUES || item.type === SectionType.STATS) ? (
                                            <>
                                                <label className="text-[10px] uppercase font-extrabold text-gray-400 block mb-2">Nome do Ícone</label>
                                                <input value={obj.icon} onChange={e => updateArrayItem(item.type === SectionType.STATS ? 'stats' : 'values', idx, 'icon', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-mono text-orange-500 focus:ring-2 focus:ring-cacu-primary/20 outline-none" placeholder="Ex: Leaf, User" />
                                            </>
                                        ) : (
                                            <>
                                                <label className="text-[10px] uppercase font-extrabold text-gray-400 block mb-2">URL Imagem</label>
                                                <input value={obj.imageUrl} onChange={e => updateArrayItem('products', idx, 'imageUrl', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-mono text-blue-500 overflow-hidden text-ellipsis focus:ring-2 focus:ring-cacu-primary/20 outline-none" />
                                            </>
                                        )}
                                    </div>
                                </div>
                                <button onClick={() => removeArrayItem(item.type === SectionType.STATS ? 'stats' : item.type === SectionType.VALUES ? 'values' : 'products', idx)} className="mt-8 text-gray-300 hover:text-red-500 transition-colors bg-white p-2 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100"><Trash size={18}/></button>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    </AdminLayout>
  );
};
