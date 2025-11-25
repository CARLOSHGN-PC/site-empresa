import React, { useEffect, useRef } from 'react';
import { ContentItem, SectionType } from '../../types';
import { Logo } from '../Logo';
import * as LucideIcons from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';

const IconRenderer = ({ name, className }: { name?: string, className?: string }) => {
    if (!name) return null;
    const Icon = (LucideIcons as any)[name] || LucideIcons.Circle;
    return <Icon className={className} />;
};

const AnimatedBlock: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []);

    return (
        <div ref={ref} className={`animate-on-scroll ${className}`}>
            {children}
        </div>
    );
};

export const SectionRenderer: React.FC<{ item: ContentItem }> = ({ item }) => {
  
  const bgClass = item.bgColor === 'blue' ? 'bg-cacu-dark' : item.bgColor === 'green' ? 'bg-cacu-primary' : 'bg-white';
  const textClass = item.bgColor === 'white' ? 'text-cacu-dark' : 'text-white';

  // --- 1. COVER PAGE ---
  if (item.type === SectionType.COVER) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-gray-100">
        <div className="absolute inset-0">
             <img src={item.imageUrl} alt="Cover" className="w-full h-full object-cover scale-105" />
             <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
        </div>
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -left-[10%] top-0 h-full w-[60%] bg-cacu-primary/90 opacity-90 rounded-r-[100%_50%] transform skew-x-12 mix-blend-multiply"></div>
            <div className="absolute -left-[20%] top-0 h-full w-[50%] bg-cacu-dark/90 opacity-95 rounded-r-[100%_50%] transform skew-x-6"></div>
        </div>

        <div className="absolute top-0 right-0 h-full w-full flex flex-col items-end justify-center pr-8 lg:pr-24 z-30">
             <div className="text-right max-w-2xl animate-fade-in-up">
                 <h1 className="text-5xl lg:text-[5rem] font-serif font-bold text-white mb-4 leading-[0.9] drop-shadow-lg">
                     Relatório de <br/>
                     <span className="text-cacu-accent">Sustentabilidade</span>
                 </h1>
                 <p className="text-xl lg:text-2xl text-white/90 font-sans font-light tracking-wide mb-12 border-t border-white/30 pt-6 inline-block">
                     {item.subtitle}
                 </p>
                 
                 <div className="flex justify-end">
                    <Logo mode="light" className="scale-150 origin-right" />
                 </div>
             </div>
        </div>
      </div>
    );
  }

  // --- 2. HERO PAGES ---
  if (item.type === SectionType.HERO) {
      return (
          <div className={`min-h-screen ${bgClass} relative overflow-hidden flex flex-col lg:flex-row items-center justify-between`}>
              <div className="relative z-20 w-full lg:w-[45%] px-8 lg:px-24 py-12 lg:py-0 flex flex-col justify-center h-full">
                  <AnimatedBlock>
                    <div className="absolute top-32 right-12 text-right text-white/80 text-sm font-light hidden lg:block">
                        {item.subtitle}
                    </div>
                    
                    <h2 className="text-white font-serif text-6xl lg:text-7xl font-medium leading-[1] tracking-tight mb-8">
                        {item.title}
                    </h2>
                    <div className="w-full max-w-[200px] h-1 bg-cacu-primary mb-8"></div>
                    
                    <div className="mt-12">
                        <Logo mode="light" className="scale-100 origin-left opacity-100" />
                    </div>
                  </AnimatedBlock>
              </div>

              <div className="relative w-full lg:w-[55%] h-[60vh] lg:h-screen z-10">
                  <div className="w-full h-full hero-leaf-mask bg-gray-900 relative shadow-[-50px_0_100px_rgba(0,0,0,0.5)]">
                      <img src={item.imageUrl} className="w-full h-full object-cover opacity-90" alt="Hero" />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-full hero-leaf-mask border-l-[20px] border-b-[20px] border-cacu-primary/20 pointer-events-none"></div>
              </div>
          </div>
      );
  }

  // --- 3. SUMMARY ---
  if (item.type === SectionType.SUMMARY) {
      const summaryItems = [
          { num: '01', label: 'Apresentação', desc: 'Mensagem do Presidente, Materialidade' },
          { num: '02', label: 'Quem somos', desc: 'Perfil, Compromisso, Produtos' },
          { num: '03', label: 'Meio ambiente', desc: 'Responsabilidade, Clima, Água' },
          { num: '04', label: 'Social', desc: 'Colaboradores, Comunidade' },
          { num: '05', label: 'Governança', desc: 'Estrutura, Ética, Compliance' },
          { num: '06', label: 'Desempenho', desc: 'Operacional e Financeiro' },
      ];
      return (
          <div className="min-h-screen bg-cacu-dark text-white px-8 lg:px-24 py-24 relative overflow-hidden flex flex-col justify-center">
              <svg className="absolute top-24 left-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 20 Q 50 50 100 80" stroke="white" strokeWidth="0.5" fill="none" />
              </svg>

              <div className="relative z-10 max-w-[1400px] mx-auto w-full">
                  <AnimatedBlock>
                    <h2 className="text-6xl lg:text-8xl text-cacu-primary font-serif font-thin mb-24">Sumário</h2>
                  </AnimatedBlock>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-20">
                      {summaryItems.map((s, i) => (
                          <AnimatedBlock key={i} className={`delay-[${i * 100}ms]`}>
                              <div className="relative pl-4 hover:translate-x-2 transition-transform duration-300">
                                  <span className="absolute -top-12 left-0 text-6xl font-thin text-white/10">{s.num}</span>
                                  <h3 className="text-3xl font-serif font-bold mb-3 mt-4 text-white">{s.label}</h3>
                                  <p className="text-white/70 font-light text-sm leading-relaxed">{s.desc}</p>
                              </div>
                          </AnimatedBlock>
                      ))}
                  </div>
              </div>
          </div>
      );
  }

  // --- 4. TIMELINE ---
  if (item.type === SectionType.TIMELINE) {
      return (
          <div className="min-h-screen bg-cacu-dark text-white py-24 px-0 flex flex-col justify-center overflow-hidden">
              <AnimatedBlock className="px-8 lg:px-24 mb-12">
                  <h2 className="text-5xl font-serif font-bold text-cacu-primary mb-4">{item.title}</h2>
                  <p className="text-white/60 max-w-xl">Uma trajetória de crescimento sustentável e inovação constante.</p>
              </AnimatedBlock>
              
              <div className="w-full overflow-x-auto pb-12 no-scrollbar px-8 lg:px-24">
                  <div className="flex w-max">
                      {item.timelineEvents?.map((event, i) => {
                          const isEven = i % 2 === 0;
                          const arrowColorClass = isEven ? 'bg-cacu-light text-cacu-dark' : 'bg-cacu-primary text-white';
                          
                          return (
                              <AnimatedBlock key={i} className="flex flex-col items-center w-[220px] shrink-0 group cursor-default">
                                  <div className={`timeline-arrow w-full ${arrowColorClass} transition-transform group-hover:-translate-y-2 shadow-lg`}>
                                      {event.year}
                                  </div>
                                  <div className="h-16 border-l-2 border-dashed border-white/20 my-4 relative">
                                      <div className="absolute -bottom-1 -left-[5px] w-2.5 h-2.5 rounded-full bg-white"></div>
                                  </div>
                                  <div className="text-center px-2">
                                      <h4 className="text-cacu-primary font-bold text-lg leading-tight mb-2">{event.title}</h4>
                                      <p className="text-white/60 text-xs font-light">{event.description}</p>
                                  </div>
                              </AnimatedBlock>
                          );
                      })}
                  </div>
              </div>
          </div>
      );
  }

  // --- 5. VALUES ---
  if (item.type === SectionType.VALUES) {
      return (
          <div className="min-h-screen bg-white py-32 px-8 lg:px-24 flex items-center">
              <div className="max-w-7xl mx-auto w-full">
                  <AnimatedBlock>
                    <h2 className="text-5xl lg:text-6xl text-cacu-dark font-serif font-light mb-24 text-center">
                        {item.title} <span className="text-cacu-primary font-bold">.</span>
                    </h2>
                  </AnimatedBlock>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                      {item.values?.map((val, i) => (
                          <AnimatedBlock key={i}>
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-24 h-24 rounded-full bg-cacu-light flex items-center justify-center text-cacu-dark mb-8 group-hover:bg-cacu-primary group-hover:text-white transition-colors duration-500 shadow-lg">
                                    <IconRenderer name={val.icon} className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-cacu-dark mb-4">{val.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">{val.description}</p>
                            </div>
                          </AnimatedBlock>
                      ))}
                  </div>
              </div>
          </div>
      );
  }

  // --- 6. PRODUCTS ---
  if (item.type === SectionType.GRID_CARDS) {
      return (
          <div className="min-h-screen bg-white py-32 px-8 lg:px-24">
              <div className="max-w-7xl mx-auto">
                  <AnimatedBlock>
                    <div className="flex items-end gap-4 mb-16">
                        <h2 className="text-6xl text-cacu-dark font-serif font-light">{item.title}</h2>
                        <span className="text-cacu-primary font-bold text-sm uppercase tracking-widest mb-2 pb-2 border-b-2 border-cacu-primary">{item.subtitle}</span>
                    </div>
                  </AnimatedBlock>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {item.products?.map((prod, i) => (
                          <AnimatedBlock key={i}>
                            <div className="group relative h-[300px] lg:h-[400px] rounded-[2rem] overflow-hidden shadow-card cursor-pointer">
                                <div className="absolute inset-0">
                                    <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-cacu-dark/90 via-cacu-dark/20 to-transparent"></div>
                                </div>
                                <div className="absolute bottom-0 left-0 p-10 w-full">
                                    <div className="bg-cacu-primary w-fit px-4 py-1 rounded-full text-white text-xs font-bold uppercase mb-3">Produto</div>
                                    <h3 className="text-3xl text-white font-bold mb-2">{prod.title}</h3>
                                    <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                                        {prod.description}
                                    </p>
                                </div>
                            </div>
                          </AnimatedBlock>
                      ))}
                  </div>
              </div>
          </div>
      );
  }

  // --- 7. MATERIALITY ---
  if (item.type === SectionType.MATERIALITY) {
      return (
          <div className="min-h-screen bg-white py-32 px-4 overflow-hidden flex flex-col items-center justify-center">
              <div className="max-w-6xl w-full text-center">
                  <AnimatedBlock>
                    <span className="text-cacu-primary font-bold tracking-widest uppercase text-xs">Estratégia ESG</span>
                    <h2 className="text-5xl text-cacu-dark font-serif font-bold mb-16 mt-2">{item.title}</h2>
                  </AnimatedBlock>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                      <AnimatedBlock className="flex flex-col gap-4">
                          <div className="bg-cacu-dark text-white py-3 rounded-t-2xl font-bold uppercase tracking-wider">Ambiental</div>
                          <div className="bg-[#7AA874] text-white p-6 rounded-2xl shadow-md min-h-[120px] flex items-center justify-center text-center font-medium">Mudanças Climáticas</div>
                          <div className="bg-[#9BC995] text-cacu-dark p-6 rounded-2xl shadow-md min-h-[120px] flex items-center justify-center text-center font-medium">Biodiversidade e Solo</div>
                          <div className="bg-[#BFE1B9] text-cacu-dark p-6 rounded-2xl shadow-md min-h-[120px] flex items-center justify-center text-center font-medium">Gestão Hídrica</div>
                      </AnimatedBlock>

                      <AnimatedBlock className="flex flex-col gap-4 delay-100">
                          <div className="bg-cacu-primary text-white py-3 rounded-t-2xl font-bold uppercase tracking-wider">Social</div>
                          <div className="bg-[#009E49] text-white p-6 rounded-2xl shadow-md min-h-[120px] flex items-center justify-center text-center font-medium">Segurança e Saúde</div>
                          <div className="bg-[#4ADE80] text-cacu-dark p-6 rounded-2xl shadow-md min-h-[120px] flex items-center justify-center text-center font-medium">Capital Humano</div>
                          <div className="bg-[#86EFAC] text-cacu-dark p-6 rounded-2xl shadow-md min-h-[120px] flex items-center justify-center text-center font-medium">Comunidades</div>
                      </AnimatedBlock>

                      <AnimatedBlock className="flex flex-col gap-4 delay-200">
                          <div className="bg-[#D4A017] text-white py-3 rounded-t-2xl font-bold uppercase tracking-wider">Governança</div>
                          <div className="bg-[#EAB308] text-white p-6 rounded-2xl shadow-md min-h-[120px] flex items-center justify-center text-center font-medium">Ética e Compliance</div>
                          <div className="bg-[#FACC15] text-cacu-dark p-6 rounded-2xl shadow-md min-h-[120px] flex items-center justify-center text-center font-medium">Gestão de Riscos</div>
                          <div className="bg-[#FEF08A] text-cacu-dark p-6 rounded-2xl shadow-md min-h-[120px] flex items-center justify-center text-center font-medium">Inovação</div>
                      </AnimatedBlock>
                  </div>
              </div>
          </div>
      );
  }

  // --- 8. CHARTS ---
  if (item.type === SectionType.CHART) {
      return (
          <div className="min-h-screen bg-gray-50 py-32 px-8 flex items-center justify-center">
              <AnimatedBlock>
                <div className="bg-white p-8 lg:p-16 rounded-[3rem] shadow-2xl max-w-6xl w-full flex flex-col lg:flex-row gap-16 border border-gray-100">
                    <div className="lg:w-1/3 flex flex-col justify-center">
                        <div className="w-16 h-16 bg-cacu-light rounded-2xl flex items-center justify-center text-cacu-primary mb-8">
                            <LucideIcons.BarChart2 size={32} />
                        </div>
                        <h2 className="text-4xl font-serif font-bold text-cacu-dark mb-4">{item.title}</h2>
                        <p className="text-cacu-primary font-bold uppercase tracking-wide text-sm mb-8">{item.subtitle}</p>
                        <div className="prose text-gray-600 text-sm leading-relaxed">
                            {item.body}
                        </div>
                    </div>
                    <div className="lg:w-2/3 h-[400px] lg:h-[500px] bg-gray-50 rounded-3xl p-8 border border-gray-100">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={item.chartData} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#374151', fontSize: 14}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                                <Tooltip 
                                    cursor={{fill: '#f3f4f6'}}
                                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} 
                                />
                                <Bar dataKey="value1" fill="#009E49" radius={[6, 6, 0, 0]} barSize={60}>
                                    <LabelList dataKey="value1" position="top" fill="#0B3B24" fontWeight="bold" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
              </AnimatedBlock>
          </div>
      );
  }

  // --- 9. STATS ---
  if (item.type === SectionType.STATS) {
      return (
          <div className="min-h-screen bg-cacu-primary relative flex flex-col justify-center px-6 lg:px-24 py-24 text-white overflow-hidden">
              <div className="absolute -right-20 -top-20 w-[500px] h-[500px] rounded-full border-[40px] border-white/10 pointer-events-none animate-pulse"></div>
              
              <div className="max-w-7xl mx-auto w-full relative z-10">
                  <AnimatedBlock>
                    <h2 className="text-6xl lg:text-8xl font-serif font-thin mb-20 leading-none">{item.title}</h2>
                  </AnimatedBlock>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-16 gap-y-16">
                      {item.stats?.map((stat, idx) => (
                          <AnimatedBlock key={idx} className={`delay-[${idx * 50}ms]`}>
                              <div className="group border-t border-white/40 pt-8 hover:border-white transition-colors">
                                  <div className="flex justify-between items-start mb-6">
                                      <IconRenderer name={stat.icon} className="w-10 h-10 opacity-80 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                  <div className="text-5xl font-bold font-sans mb-3 tracking-tight">{stat.value}</div>
                                  <div className="text-base opacity-80 font-light leading-tight">{stat.description}</div>
                              </div>
                          </AnimatedBlock>
                      ))}
                  </div>
              </div>
          </div>
      );
  }

  // --- 10. TEXT/IMAGE ---
  const isRight = item.layout === 'right';
  return (
    <div className={`py-32 px-8 lg:px-24 bg-white min-h-screen flex items-center relative overflow-hidden`}>
      <div className={`flex flex-col ${isRight ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-20 lg:gap-32 items-center w-full max-w-[1600px] mx-auto`}>
        <div className="w-full lg:w-1/2 z-10">
            <AnimatedBlock>
                <div className="mb-12">
                    {item.subtitle && <div className="text-cacu-primary font-bold text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                        <span className="w-12 h-[2px] bg-cacu-primary"></span>
                        {item.subtitle}
                    </div>}
                    <h2 className="text-5xl lg:text-6xl text-cacu-dark font-serif font-light leading-tight">
                        {item.title}
                    </h2>
                </div>
                <div className="text-gray-600 text-lg leading-relaxed space-y-6 font-light">
                    {item.body?.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
                </div>
            </AnimatedBlock>
        </div>
        {item.imageUrl && (
            <div className="w-full lg:w-1/2 relative h-[600px]">
                <AnimatedBlock>
                    <div className="absolute inset-0 w-full h-full rounded-[4rem] overflow-hidden shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-700">
                        <img src={item.imageUrl} alt="Content" className="w-full h-full object-cover scale-110" />
                    </div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cacu-primary rounded-full -z-10 opacity-20"></div>
                </AnimatedBlock>
            </div>
        )}
      </div>
    </div>
  );
};