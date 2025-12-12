
import React from 'react';
import { Logo } from './Logo';
import { ReportSection } from '../types';
import { Menu, X, Lock } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ContentService } from '../services/contentService';

interface Props {
  sections: ReportSection[];
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export const Navigation: React.FC<Props> = ({ sections, isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = ContentService.getData();
  const settings = data.settings;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    
    // If we are on admin page, go home first then scroll
    if (location.pathname.includes('admin')) {
        navigate('/');
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300); // Increased timeout for reliability
    } else {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
    setIsOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm h-24 flex items-center justify-between px-6 lg:px-12 border-b border-gray-100 transition-all">
        <div className="flex items-center gap-6 cursor-pointer" onClick={() => navigate('/')}>
            <Logo mode="dark" className="scale-90 origin-left" />
            
            {/* Dynamic Editable Header Text */}
            <div className="hidden xl:flex flex-col border-l-2 border-cacu-primary pl-4 text-xs text-cacu-dark justify-center h-10">
                <span className="font-bold uppercase tracking-wide leading-tight">{settings?.reportTitle || 'Relatório de Sustentabilidade'}</span>
                <span className="opacity-70 leading-tight">{settings?.reportSubtitle || 'Ano Base'}</span>
            </div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {sections.map(section => (
                <a 
                    key={section.id} 
                    href={`#${section.id}`} 
                    onClick={(e) => handleNavClick(e, section.id)}
                    className="text-xs xl:text-sm font-bold text-gray-500 hover:text-cacu-primary hover:scale-105 transition-all uppercase tracking-wide relative group"
                >
                    {section.menuTitle}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cacu-primary transition-all group-hover:w-full"></span>
                </a>
            ))}
             {/* Explicit React Router Link for Admin */}
             <Link to="/admin" className="ml-4 px-5 py-2 bg-cacu-primary text-white rounded-full text-xs font-bold hover:bg-green-600 transition-all shadow-lg hover:shadow-green-500/30 flex items-center gap-2">
                <Lock size={12} /> ADMIN
            </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="lg:hidden text-cacu-dark p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-32 px-8 lg:hidden flex flex-col animation-fade-in overflow-y-auto">
            <nav className="flex flex-col gap-6">
                {sections.map(section => (
                    <a 
                        key={section.id} 
                        href={`#${section.id}`} 
                        onClick={(e) => handleNavClick(e, section.id)}
                        className="text-xl font-bold text-cacu-dark border-b border-gray-100 pb-4 hover:text-cacu-primary transition-colors"
                    >
                        {section.menuTitle}
                    </a>
                ))}
                 <Link to="/admin" onClick={() => setIsOpen(false)} className="text-lg font-bold text-white bg-cacu-primary p-4 text-center rounded-xl mt-4 shadow-lg">
                    Acesso Administrativo
                </Link>
            </nav>
        </div>
      )}
    </>
  );
};
