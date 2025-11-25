
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import { Logo } from '../Logo';
import { Lock, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (AuthService.login(pass)) {
      navigate('/admin');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cacu-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border-[40px] border-white"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 animate-fade-in">
        <div className="flex justify-center mb-8">
            <Logo mode="dark" className="scale-110" />
        </div>
        
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-cacu-dark mb-2">Acesso Restrito</h2>
            <p className="text-gray-500 text-sm">Painel de Gestão do Relatório</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="password" 
                        value={pass}
                        onChange={(e) => { setPass(e.target.value); setError(false); }}
                        placeholder="Digite a senha de acesso"
                        className={`w-full pl-12 pr-4 py-4 bg-gray-50 border ${error ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-cacu-primary transition-all font-medium text-cacu-dark`}
                        autoFocus
                    />
                </div>
                {error && <p className="text-red-500 text-xs mt-2 pl-2 font-medium">Senha incorreta. Tente novamente.</p>}
            </div>

            <button type="submit" className="w-full bg-cacu-primary text-white font-bold py-4 rounded-xl hover:bg-green-600 transition-all shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2 group">
                Entrar no Painel <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </form>
        
        <div className="mt-8 text-center">
            <a href="/" className="text-xs text-gray-400 hover:text-cacu-primary transition-colors border-b border-transparent hover:border-cacu-primary pb-0.5">
                Voltar para o site público
            </a>
        </div>
      </div>
    </div>
  );
};
