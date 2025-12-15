import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import { ContentService } from '../../services/contentService';
import { Logo } from '../Logo';
import { LayoutDashboard, FileText, LogOut, ExternalLink, ChevronRight, Plus, Trash2, X } from 'lucide-react';
import { AppData } from '../../types';

interface Props {
    children: React.ReactNode;
    data: AppData | null;
}

export const AdminLayout: React.FC<Props> = ({ children, data }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPageTitle, setNewPageTitle] = useState('');

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    const handleCreatePage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPageTitle.trim()) {
            const newId = ContentService.addSection(newPageTitle);
            setNewPageTitle('');
            setIsModalOpen(false);
            // Force reload to refresh data or handle state update in parent. 
            // For simplicity in this architecture, navigating to the new section triggers re-fetch in Dashboard
            window.location.href = `#/admin?section=${newId}`;
            window.location.reload();
        }
    };

    const handleDeletePage = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm('Tem certeza que deseja excluir esta página inteira e todo o seu conteúdo? Esta ação não pode ser desfeita.')) {
            ContentService.removeSection(id);
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row font-sans text-gray-800">
            {/* Sidebar */}
            <aside className="w-full lg:w-72 bg-white border-r border-gray-200 shadow-sm lg:h-screen lg:fixed lg:top-0 lg:left-0 z-20 flex flex-col">
                <div className="p-8 border-b border-gray-100 flex flex-col items-center lg:items-start bg-gray-50/50">
                    <Logo mode="dark" className="scale-90 origin-left mb-2" settings={data?.settings} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-cacu-primary bg-green-100 px-2 py-1 rounded-full">Painel Administrativo</span>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                    <div className="px-3 mb-3 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Visão Geral</div>
                    <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${location.pathname === '/admin' && !location.search ? 'bg-cacu-primary text-white shadow-lg shadow-green-200' : 'text-gray-600 hover:bg-gray-50 hover:text-cacu-dark'}`}>
                        <LayoutDashboard size={18} /> Início
                    </Link>

                    <div className="px-3 mb-3 mt-8 flex justify-between items-center">
                        <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Páginas do Site</span>
                        <button onClick={() => setIsModalOpen(true)} className="text-cacu-primary hover:bg-green-50 p-1 rounded transition-colors" title="Nova Página">
                            <Plus size={14} strokeWidth={3} />
                        </button>
                    </div>
                    <div className="space-y-1">
                        {data?.sections.map(section => (
                            <div key={section.id} className="group relative flex items-center">
                                <Link 
                                    to={`/admin?section=${section.id}`} 
                                    className={`flex-1 flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${location.search.includes(section.id) ? 'bg-green-50 text-cacu-dark font-bold border border-green-100' : 'text-gray-500 hover:bg-gray-50 hover:pl-5'}`}
                                >
                                    <span className="flex items-center gap-3 truncate">
                                        <FileText size={16} className={location.search.includes(section.id) ? 'text-cacu-primary' : 'text-gray-400 group-hover:text-cacu-primary'} /> 
                                        {section.menuTitle}
                                    </span>
                                    {location.search.includes(section.id) && <ChevronRight size={14} className="text-cacu-primary" />}
                                </Link>
                                <button 
                                    onClick={(e) => handleDeletePage(e, section.id)}
                                    className="absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md shadow-sm transition-all z-10"
                                    title="Excluir Página"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-100 space-y-2 bg-gray-50/30">
                    <a href="/" target="_blank" className="flex items-center justify-center gap-2 w-full px-4 py-3 text-xs font-bold text-cacu-dark bg-white border border-gray-200 rounded-xl hover:border-cacu-primary hover:text-cacu-primary transition-colors shadow-sm">
                        <ExternalLink size={14} /> Ver Site Online
                    </a>
                    <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <LogOut size={14} /> Sair do Sistema
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 lg:ml-72 min-h-screen p-2 lg:p-0">
                {children}
            </div>

            {/* Create Page Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                        <h3 className="text-xl font-bold text-cacu-dark mb-4">Adicionar Nova Página</h3>
                        <form onSubmit={handleCreatePage} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-2">Nome da Página (Menu)</label>
                                <input 
                                    type="text" 
                                    value={newPageTitle}
                                    onChange={e => setNewPageTitle(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cacu-primary focus:border-transparent outline-none"
                                    placeholder="Ex: Novos Projetos"
                                    autoFocus
                                />
                            </div>
                            <button type="submit" className="w-full bg-cacu-primary text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-200">
                                Criar Página
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};