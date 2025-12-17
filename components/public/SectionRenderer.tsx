
import React, { useEffect, useRef } from 'react';
import { ContentItem, SectionType, GlobalSettings } from '../../types';
import { Logo } from '../Logo';
import * as LucideIcons from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';

const IconRenderer = ({ name, className }: { name?: string, className?: string }) => {
    if (!name) return null;

    const cleanName = name.trim();
    // Try exact match first, then kebab-to-PascalCase conversion
    const pascalName = cleanName.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');

    const Icon = (LucideIcons as any)[cleanName] || (LucideIcons as any)[pascalName] || LucideIcons.Circle;
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

export const SectionRenderer: React.FC<{ item: ContentItem; settings?: GlobalSettings }> = ({ item, settings }) => {
  
  const bgClass = item.bgColor === 'blue' ? 'bg-cacu-dark' : item.bgColor === 'green' ? 'bg-cacu-primary' : 'bg-white';
  const textClass = item.bgColor === 'white' ? 'text-cacu-dark' : 'text-white';

  // --- 1. COVER PAGE (REDESIGNED) ---
  if (item.type === SectionType.COVER) {
    return (
      <div className="relative w-full h-[calc(100vh-6rem)] mt-0 lg:mt-0 lg:h-screen overflow-hidden bg-gray-200 section-page-break">
        <div 
            className="absolute top-0 left-0 h-full w-[120%] lg:w-[65%] bg-cacu-dark z-10 print:bg-cacu-dark"
            style={{
                borderBottomRightRadius: '100% 100%',
                borderTopRightRadius: '20% 50%',
                clipPath: 'ellipse(100% 100% at 0% 50%)'
            }}
        >
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        </div>

        {(item.imageUrl || (item.mediaType === 'video' && item.videoUrl)) && (
            <div className="absolute inset-0 z-0">
                 {item.mediaType === 'video' && item.videoUrl ? (
                    <video
                        src={item.videoUrl}
                        className="w-full h-full object-cover opacity-100 lg:ml-[30%] object-center"
                        style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 100%)' }}
                        autoPlay muted loop playsInline
                    />
                 ) : (
                    <img
                        src={item.imageUrl}
                        alt="Background"
                        className={`w-full h-full object-cover opacity-100 lg:ml-[30%] object-${item.imagePosition || 'center'}`}
                        style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 100%)' }}
                    />
                 )}
                {/* Dynamic Overlay for Visibility */}
                <div
                    className="absolute inset-0 bg-black pointer-events-none lg:ml-[30%]"
                    style={{ opacity: (item.imageOverlayOpacity ?? 10) / 100, maskImage: 'linear-gradient(to right, transparent 0%, black 100%)' }}
                ></div>
            </div>
        )}

        <div className="absolute inset-0 z-20 flex flex-col items-end justify-center px-8 lg:px-24">
            <div className="text-right max-w-3xl animate-fade-in-up mt-24 lg:mt-0">
                 <h1 className="flex flex-col items-end">
                    <span className="text-4xl lg:text-6xl text-white lg:text-white font-serif font-light mb-2 drop-shadow-md lg:drop-shadow-none block">
                        {item.title?.split(' ')[0]} {item.title?.split(' ')[1]}
                    </span>
                    <span className="text-5xl lg:text-[7rem] font-sans font-bold text-cacu-accent lg:text-cacu-primary leading-[0.9] tracking-tight drop-shadow-lg lg:drop-shadow-none lg:text-transparent lg:bg-clip-text lg:bg-gradient-to-br lg:from-cacu-primary lg:to-green-700">
                        {item.title?.split(' ').slice(2).join(' ')}
                    </span>
                 </h1>

                 <p className="text-xl lg:text-3xl text-white/90 lg:text-gray-500 font-sans font-light tracking-wide mt-6 mb-12 border-t border-white/30 lg:border-cacu-primary/30 pt-6 inline-block">
                     {item.subtitle}
                 </p>
                 
                 <div className="flex justify-end mt-8">
                    <div className="lg:hidden">
                        <Logo mode="light" className="scale-125 origin-right" settings={settings} />
                    </div>
                    <div className="hidden lg:block">
                        <Logo mode="dark" className="scale-150 origin-right" settings={settings} />
                    </div>
                 </div>
            </div>
        </div>
        
        <div className="absolute bottom-0 left-0 p-8 z-30 hidden lg:block">
             <div className="w-16 h-1 bg-cacu-accent/50 rounded-full mb-2"></div>
             <div className="w-8 h-1 bg-cacu-accent/30 rounded-full"></div>
        </div>
      </div>
    );
  }

  // --- 2. HERO PAGES ---
  if (item.type === SectionType.HERO) {
      return (
          <div className={`min-h-screen ${bgClass} relative overflow-hidden flex flex-col lg:flex-row items-center justify-between section-page-break`}>
              <div className="relative z-20 w-full lg:w-[45%] px-8 lg:px-24 py-12 lg:py-0 flex flex-col justify-center h-full">
                  <AnimatedBlock>
                    <div className="absolute top-32 right-12 text-right text-white/80 text-sm font-light hidden lg:block">
                        {item.subtitle}
                    </div>
                    
                    <h2 className="text-white font-serif text-6xl lg:text-7xl font-medium leading-[1] tracking-tight mb-8 whitespace-pre-line">
                        {item.title}
                    </h2>

                    {item.body && <p className="text-white/80 text-lg font-light leading-relaxed mb-8 whitespace-pre-line max-w-xl">{item.body}</p>}

                    <div className="w-full max-w-[200px] h-1 bg-cacu-primary mb-8"></div>
                    
                    <div className="mt-12">
                        <Logo mode="light" className="scale-100 origin-left opacity-100" settings={settings} />
                    </div>
                  </AnimatedBlock>
              </div>

              <div className="relative w-full lg:w-[55%] h-[60vh] lg:h-screen z-10">
                  <div className="w-full h-full hero-leaf-mask bg-gray-900 relative shadow-[-50px_0_100px_rgba(0,0,0,0.5)]">
                      {item.mediaType === 'video' && item.videoUrl ? (
                          <video src={item.videoUrl} className="w-full h-full object-cover opacity-90" autoPlay muted loop playsInline />
                      ) : (
                          <img src={item.imageUrl} className={`w-full h-full object-cover opacity-90 object-${item.imagePosition || 'center'}`} alt="Hero" />
                      )}
                      <div className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: (item.imageOverlayOpacity || 0) / 100 }}></div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-full hero-leaf-mask border-l-[20px] border-b-[20px] border-cacu-primary/20 pointer-events-none"></div>
              </div>
          </div>
      );
  }

  // --- 3. SUMMARY ---
  if (item.type === SectionType.SUMMARY) {
      return (
          <div className="min-h-screen bg-cacu-dark text-white px-8 lg:px-24 py-24 relative overflow-hidden flex flex-col justify-center section-page-break">
              <svg className="absolute top-24 left-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 20 Q 50 50 100 80" stroke="white" strokeWidth="0.5" fill="none" />
              </svg>

              <div className="relative z-10 max-w-[1400px] mx-auto w-full">
                  <AnimatedBlock>
                    <h2 className="text-6xl lg:text-8xl text-cacu-primary font-serif font-thin mb-12 whitespace-pre-line">{item.title}</h2>
                    {item.subtitle && <p className="text-white/50 text-xl font-light mb-12 max-w-3xl whitespace-pre-line">{item.subtitle}</p>}
                    {item.body && <div className="text-white/70 text-lg font-light leading-relaxed mb-24 max-w-4xl whitespace-pre-line">{item.body}</div>}
                  </AnimatedBlock>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-20">
                      {item.summaryItems?.map((s, i) => (
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
          <div className="min-h-screen bg-cacu-dark text-white py-24 px-0 flex flex-col justify-center overflow-hidden section-page-break">
              <AnimatedBlock className="px-8 lg:px-24 mb-12">
                  <h2 className="text-5xl font-serif font-bold text-cacu-primary mb-4 whitespace-pre-line">{item.title}</h2>
                  <p className="text-white/60 max-w-xl whitespace-pre-line">{item.subtitle || 'Uma trajetória de crescimento sustentável.'}</p>
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
          <div className="min-h-screen bg-white py-32 px-8 lg:px-24 flex items-center section-page-break">
              <div className="max-w-7xl mx-auto w-full">
                  <AnimatedBlock>
                    <h2 className="text-5xl lg:text-6xl text-cacu-dark font-serif font-light mb-8 text-center whitespace-pre-line">
                        {item.title} <span className="text-cacu-primary font-bold">.</span>
                    </h2>
                    {item.subtitle && <p className="text-gray-500 text-center max-w-3xl mx-auto mb-8 whitespace-pre-line">{item.subtitle}</p>}
                    {item.body && <div className="text-gray-500 text-center max-w-3xl mx-auto mb-24 whitespace-pre-line leading-relaxed">{item.body}</div>}
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
          <div className="min-h-screen bg-white py-32 px-8 lg:px-24 section-page-break">
              <div className="max-w-7xl mx-auto">
                  <AnimatedBlock>
                    <div className="flex items-end gap-4 mb-16">
                        <h2 className="text-6xl text-cacu-dark font-serif font-light whitespace-pre-line">{item.title}</h2>
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
          <div className="min-h-screen bg-white py-32 px-4 overflow-hidden flex flex-col items-center justify-center section-page-break">
              <div className="max-w-6xl w-full text-center">
                  <AnimatedBlock>
                    <span className="text-cacu-primary font-bold tracking-widest uppercase text-xs">Estratégia ESG</span>
                    <h2 className="text-5xl text-cacu-dark font-serif font-bold mb-8 mt-2 whitespace-pre-line">{item.title}</h2>
                    {item.subtitle && <p className="text-gray-500 mb-8 max-w-2xl mx-auto whitespace-pre-line">{item.subtitle}</p>}
                    {item.body && <div className="text-gray-500 mb-16 max-w-3xl mx-auto whitespace-pre-line leading-relaxed">{item.body}</div>}
                  </AnimatedBlock>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                      {item.materialityItems?.map((mat, i) => {
                          // Simple color mapping
                          let headerClass = 'bg-cacu-dark text-white';
                          let cardClass = 'bg-gray-100 text-cacu-dark';
                          if (mat.color === 'green') {
                              headerClass = 'bg-cacu-dark text-white';
                              cardClass = 'bg-[#9BC995] text-cacu-dark';
                          } else if (mat.color === 'blue') {
                              headerClass = 'bg-cacu-primary text-white';
                              cardClass = 'bg-[#86EFAC] text-cacu-dark';
                          } else if (mat.color === 'orange') {
                              headerClass = 'bg-[#D4A017] text-white';
                              cardClass = 'bg-[#FACC15] text-cacu-dark';
                          }

                          return (
                              <AnimatedBlock key={i} className={`flex flex-col gap-4 delay-${i*100}`}>
                                  <div className={`${headerClass} py-3 rounded-t-2xl font-bold uppercase tracking-wider`}>{mat.category}</div>
                                  {mat.topics.map((topic, j) => (
                                      <div key={j} className={`${cardClass} p-6 rounded-2xl shadow-md min-h-[120px] flex items-center justify-center text-center font-medium opacity-90 hover:opacity-100 transition-opacity`}>
                                          {topic}
                                      </div>
                                  ))}
                              </AnimatedBlock>
                          );
                      })}
                  </div>
              </div>
          </div>
      );
  }

  // --- 8. CHARTS ---
  if (item.type === SectionType.CHART) {
      return (
          <div className="min-h-screen bg-gray-50 py-32 px-8 flex items-center justify-center section-page-break">
              <AnimatedBlock>
                <div className="bg-white p-8 lg:p-16 rounded-[3rem] shadow-2xl max-w-6xl w-full flex flex-col lg:flex-row gap-16 border border-gray-100">
                    <div className="lg:w-1/3 flex flex-col justify-center">
                        <div className="w-16 h-16 bg-cacu-light rounded-2xl flex items-center justify-center text-cacu-primary mb-8">
                            <LucideIcons.BarChart2 size={32} />
                        </div>
                        <h2 className="text-4xl font-serif font-bold text-cacu-dark mb-4 whitespace-pre-line">{item.title}</h2>
                        <p className="text-cacu-primary font-bold uppercase tracking-wide text-sm mb-8">{item.subtitle}</p>
                        <div className="prose text-gray-600 text-sm leading-relaxed whitespace-pre-line">
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
          <div className="min-h-screen bg-cacu-primary relative flex flex-col justify-center px-6 lg:px-24 py-24 text-white overflow-hidden section-page-break">
              <div className="absolute -right-20 -top-20 w-[500px] h-[500px] rounded-full border-[40px] border-white/10 pointer-events-none animate-pulse"></div>
              
              <div className="max-w-7xl mx-auto w-full relative z-10">
                  <AnimatedBlock>
                    <h2 className="text-6xl lg:text-8xl font-serif font-thin mb-8 leading-none whitespace-pre-line">{item.title}</h2>
                    {item.subtitle && <p className="text-white/60 text-xl font-light mb-12 uppercase tracking-widest">{item.subtitle}</p>}
                    {item.body && <div className="text-white/80 text-lg font-light leading-relaxed mb-20 max-w-4xl whitespace-pre-line">{item.body}</div>}
                  </AnimatedBlock>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-16 gap-y-16">
                      {item.stats?.map((stat, idx) => (
                          <AnimatedBlock key={idx} className={`delay-[${idx * 50}ms]`}>
                              <div className="group border-t border-white/40 pt-8 hover:border-white transition-colors">
                                  <div className="flex justify-between items-start mb-6">
                                      <IconRenderer name={stat.icon} className="w-10 h-10 opacity-80 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                  <div className="text-5xl font-bold font-sans mb-3 tracking-tight">{stat.value}</div>
                                  <div className="text-base opacity-80 font-light leading-tight whitespace-pre-line">{stat.description}</div>
                              </div>
                          </AnimatedBlock>
                      ))}
                  </div>
              </div>
          </div>
      );
  }

  // --- 10. CONTACT / SOCIAL (NEW) ---
  if (item.type === SectionType.CONTACT) {
      return (
          <div className={`min-h-screen ${bgClass} py-32 px-8 lg:px-24 flex items-center justify-center section-page-break`}>
              <div className="max-w-4xl w-full text-center">
                  <AnimatedBlock>
                      <h2 className={`text-5xl font-serif font-bold mb-6 whitespace-pre-line ${textClass}`}>{item.title || 'Fale Conosco'}</h2>
                      <p className={`text-xl opacity-70 mb-12 leading-relaxed whitespace-pre-line ${textClass}`}>{item.body}</p>

                      {/* Direct Contacts */}
                      {item.contactLinks && item.contactLinks.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                              {item.contactLinks.map((contact, i) => {
                                  let href = '#';
                                  let icon = LucideIcons.Mail;
                                  if (contact.type === 'email') { href = `mailto:${contact.value}`; icon = LucideIcons.Mail; }
                                  if (contact.type === 'phone') { href = `tel:${contact.value}`; icon = LucideIcons.Phone; }
                                  if (contact.type === 'whatsapp') { href = `https://wa.me/${contact.value.replace(/[^0-9]/g, '')}`; icon = LucideIcons.MessageCircle; }

                                  const Icon = icon;

                                  return (
                                      <a key={i} href={href} target="_blank" rel="noreferrer" className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-1 transition-transform flex items-center gap-4 group text-left">
                                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${contact.type === 'whatsapp' ? 'bg-green-500' : 'bg-cacu-primary'}`}>
                                              <Icon size={20} />
                                          </div>
                                          <div>
                                              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">{contact.label}</span>
                                              <span className="text-lg font-bold text-cacu-dark group-hover:text-cacu-primary transition-colors">{contact.value}</span>
                                          </div>
                                      </a>
                                  )
                              })}
                          </div>
                      )}

                      {/* Social Links */}
                      {item.socialLinks && item.socialLinks.length > 0 && (
                          <div className="flex flex-wrap justify-center gap-6">
                              {item.socialLinks.map((social, i) => {
                                  let Icon = LucideIcons.Globe;
                                  let colorClass = 'hover:text-cacu-primary';

                                  if (social.platform === 'instagram') { Icon = LucideIcons.Instagram; colorClass = 'hover:text-pink-600'; }
                                  if (social.platform === 'facebook') { Icon = LucideIcons.Facebook; colorClass = 'hover:text-blue-600'; }
                                  if (social.platform === 'linkedin') { Icon = LucideIcons.Linkedin; colorClass = 'hover:text-blue-700'; }
                                  if (social.platform === 'youtube') { Icon = LucideIcons.Youtube; colorClass = 'hover:text-red-600'; }

                                  return (
                                      <a key={i} href={social.url} target="_blank" rel="noreferrer" className={`p-4 bg-white rounded-full shadow-md text-gray-400 ${colorClass} transition-all hover:scale-110 hover:shadow-lg`}>
                                          <Icon size={32} />
                                      </a>
                                  )
                              })}
                          </div>
                      )}
                  </AnimatedBlock>
              </div>
          </div>
      );
  }

  // --- 11. TEXT/IMAGE ---
  const isRight = item.layout === 'right';
  return (
    <div className={`py-32 px-8 lg:px-24 bg-white min-h-screen flex items-center relative overflow-hidden section-page-break`}>
      <div className={`flex flex-col ${isRight ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-20 lg:gap-32 items-center w-full max-w-[1600px] mx-auto`}>
        <div className="w-full lg:w-1/2 z-10">
            <AnimatedBlock>
                <div className="mb-12">
                    {item.subtitle && <div className="text-cacu-primary font-bold text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                        <span className="w-12 h-[2px] bg-cacu-primary"></span>
                        {item.subtitle}
                    </div>}
                    <h2 className="text-5xl lg:text-6xl text-cacu-dark font-serif font-light leading-tight whitespace-pre-line">
                        {item.title}
                    </h2>
                </div>
                <div className="text-gray-600 text-lg leading-relaxed space-y-6 font-light whitespace-pre-line">
                    {item.body}
                </div>
            </AnimatedBlock>
        </div>
        {(item.imageUrl || (item.mediaType === 'video' && item.videoUrl)) && (
            <div className={`w-full lg:w-1/2 relative ${item.mediaType === 'video' && item.videoUrl ? 'h-auto' : 'h-[600px]'}`}>
                <AnimatedBlock>
                    {item.mediaType === 'video' && item.videoUrl ? (
                         <div className="relative w-full rounded-[3rem] overflow-hidden shadow-2xl bg-black">
                             <video src={item.videoUrl} className="w-full h-auto block" autoPlay muted loop playsInline />
                             <div className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: (item.imageOverlayOpacity || 0) / 100 }}></div>
                         </div>
                    ) : (
                        <div className="absolute inset-0 w-full h-full rounded-[4rem] overflow-hidden shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-700 bg-gray-100">
                            <img src={item.imageUrl} alt="Content" className={`w-full h-full object-cover scale-110 object-${item.imagePosition || 'center'}`} />
                            <div className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: (item.imageOverlayOpacity || 0) / 100 }}></div>
                        </div>
                    )}
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cacu-primary rounded-full -z-10 opacity-20"></div>
                </AnimatedBlock>
            </div>
        )}
      </div>
    </div>
  );
};
