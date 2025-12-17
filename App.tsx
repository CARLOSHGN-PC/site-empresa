
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { SectionRenderer } from './components/public/SectionRenderer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ItemEditor } from './components/admin/ItemEditor';
import { Login } from './components/admin/Login';
import { ContentService } from './services/contentService';
import { AuthService } from './services/authService';
import { AppData } from './types';
import { Lock } from 'lucide-react';

const RequireAuth = ({ children }: { children: React.ReactElement }) => {
    if (!AuthService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const PublicView: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
        await ContentService.initialize();
        const d = await ContentService.getData();
        setData(d);
    };
    load();
  }, []);

  if (!data) return <div className="flex h-screen items-center justify-center text-cacu-dark font-bold animate-pulse">Carregando relatório...</div>;

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-50 print:h-auto print:overflow-visible">
      <div className="">
        <Navigation sections={data.sections} settings={data.settings} isOpen={isNavOpen} setIsOpen={setIsNavOpen} />
      </div>
      
      <main className="snap-y snap-proximity h-full w-full overflow-y-auto scroll-smooth pt-24 print:pt-24 print:h-auto print:overflow-visible">
        {data.sections.map(section => (
          <div key={section.id} id={section.id} className="snap-start">
             {section.items.map(item => (
               <SectionRenderer key={item.id} item={item} settings={data.settings} />
             ))}
          </div>
        ))}
        
        <footer className="bg-cacu-dark text-white py-16 px-8 lg:px-24 flex flex-col md:flex-row justify-between items-center gap-8 border-t-4 border-cacu-primary print:hidden snap-start">
            <div className="text-left">
                <p className="font-bold text-2xl mb-2">{data.settings?.companyName || 'CACU Agroindustrial'}</p>
                <p className="text-white/70">{data.settings?.reportTitle || 'Relatório de Sustentabilidade'}</p>
                <p className="text-white/50 text-sm mt-4 max-w-md">{data.settings?.footerText || 'Energia que transforma o futuro. Compromisso com a terra e com as pessoas.'}</p>
            </div>
            <div className="text-center md:text-right">
                <p className="opacity-60 text-xs">© {new Date().getFullYear()} Todos os direitos reservados.</p>
                <p className="opacity-40 text-[10px] mt-1">{data.settings?.footerCopyright || 'Desenvolvido para'} {data.settings?.companyName}</p>
            </div>
        </footer>
      </main>

      {/* Floating Admin Access Button */}
      <Link to="/admin" className="fixed bottom-4 left-4 z-50 bg-white/50 hover:bg-white text-cacu-dark p-2 rounded-full shadow-sm backdrop-blur-sm transition-all opacity-50 hover:opacity-100 border border-gray-200 print:hidden" title="Acesso Admin">
        <Lock size={14} />
      </Link>
    </div>
  );
};

const App: React.FC = () => {
  const [appData, setAppData] = useState<AppData | null>(null);

  useEffect(() => {
      // Load data once to set global styles
      const load = async () => {
          await ContentService.initialize();
          const d = await ContentService.getData();
          setAppData(d);
      };
      load();
  }, []);

  return (
    <>
        {appData && (
            <style>{`
                :root {
                    --color-primary: ${appData.settings?.primaryColor || '#009E49'};
                    --color-dark: ${appData.settings?.darkColor || '#0B3B24'};
                }
                /* Override Tailwind classes dynamically */
                .bg-cacu-primary { background-color: var(--color-primary) !important; }
                .text-cacu-primary { color: var(--color-primary) !important; }
                .border-cacu-primary { border-color: var(--color-primary) !important; }
                .ring-cacu-primary { --tw-ring-color: var(--color-primary) !important; }
                
                .bg-cacu-dark { background-color: var(--color-dark) !important; }
                .text-cacu-dark { color: var(--color-dark) !important; }

                /* Font Theme Overrides */
                ${appData.settings?.fontTheme === 'sans' ? `
                    .font-serif {
                        font-family: 'Inter', sans-serif !important;
                    }
                ` : ''}
            `}</style>
        )}
        <Router>
          <Routes>
            <Route path="/" element={<PublicView />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
                <RequireAuth>
                    <AdminDashboard />
                </RequireAuth>
            } />
            <Route path="/admin/edit/:sectionId/:itemId" element={
                <RequireAuth>
                    <ItemEditor />
                </RequireAuth>
            } />
          </Routes>
        </Router>
    </>
  );
};

export default App;
