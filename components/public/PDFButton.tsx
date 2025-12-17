
import React from 'react';
import { Printer } from 'lucide-react';

export const PDFButton: React.FC = () => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <button
            onClick={handlePrint}
            className="fixed bottom-4 right-36 z-50 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform text-gray-700 dark:text-gray-200 print:hidden"
            title="Imprimir / Salvar PDF"
        >
            <Printer size={20} />
        </button>
    );
};
