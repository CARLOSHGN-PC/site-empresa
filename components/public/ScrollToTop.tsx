
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Attach to the main scroll container if possible, or window
    const main = document.querySelector('main');
    if (main) {
        main.addEventListener('scroll', () => {
            if (main.scrollTop > 300) setIsVisible(true);
            else setIsVisible(false);
        });
    } else {
        window.addEventListener('scroll', toggleVisibility);
    }

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    const main = document.querySelector('main');
    if (main) {
        main.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-cacu-primary text-white shadow-lg hover:bg-green-600 transition-all hover:-translate-y-1 print:hidden"
        title="Voltar ao Topo"
    >
        <ArrowUp size={20} />
    </button>
  );
};
