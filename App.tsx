
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
    setData(ContentService.getData());
  }, []);

  if (!data) return <div className="flex h-screen items-center justify-center text-cacu-dark font-bold animate-pulse">Carregando relatório...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <Navigation sections={data.sections} isOpen={isNavOpen} setIsOpen={setIsNavOpen} />
      
      <main>
        {data.sections.map(section => (
          <div key={section.id} id={section.id}>
             {section.items.map(item => (
               <SectionRenderer key={item.id} item={item} />
             ))}
          </div>
        ))}
        
        <footer className="bg-cacu-dark text-white py-16 px-8 lg:px-24 flex flex-col md:flex-row justify-between items-center gap-8 border-t-4 border-cacu-primary">
            <div className="text-left">
                <p className="font-bold text-2xl mb-2">CACU Agroindustrial S.A.</p>
                <p className="text-white/70">Relatório de Sustentabilidade 2023/2025</p>
                <p className="text-white/50 text-sm mt-4 max-w-md">Energia que transforma o futuro. Compromisso com a terra e com as pessoas.</p>
            </div>
            <div className="text-center md:text-right">
                <p className="opacity-60 text-xs">© 2025 Todos os direitos reservados.</p>
                <p className="opacity-40 text-[10px] mt-1">Desenvolvido para CACU Agroindustrial</p>
            </div>
        </footer>
      </main>

      {/* Floating Admin Access Button */}
      <Link to="/admin" className="fixed bottom-4 left-4 z-50 bg-white/50 hover:bg-white text-cacu-dark p-2 rounded-full shadow-sm backdrop-blur-sm transition-all opacity-50 hover:opacity-100 border border-gray-200" title="Acesso Admin">
        <Lock size={14} />
      </Link>
    </div>
  );
};

const App: React.FC = () => {
  return (
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
  );
};

export default App;
