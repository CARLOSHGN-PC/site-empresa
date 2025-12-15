
import React from 'react';

export const VerifyFonts: React.FC = () => {
    return (
        <div className="p-10 bg-white text-black">
            <h1 className="text-4xl font-serif mb-4">This Title has 'font-serif' class</h1>
            <p className="font-sans">This body has 'font-sans' class.</p>
            <div className="mt-8 p-4 border border-gray-300">
                If the fix works and theme is 'sans', the top title should look identical to the body font (Inter), not Merriweather.
            </div>
        </div>
    );
};
