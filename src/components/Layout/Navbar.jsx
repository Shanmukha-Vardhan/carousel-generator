import React from 'react';
import { Download, Eye, Layers } from 'lucide-react';

const Navbar = ({ onPreviewAll, onExport }) => {
    return (
        <header className="h-16 border-b border-ui-border bg-ui-surface flex items-center justify-between px-6 sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-accent-primary to-purple-600 rounded-lg flex items-center justify-center transform rotate-3">
                    <Layers size={18} className="text-white" />
                </div>
                <h1 className="text-xl font-display tracking-widest text-ui-text">Carousel Studio</h1>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={onPreviewAll}
                    className="btn btn-secondary text-sm"
                >
                    <Eye size={18} />
                    Preview All
                </button>

                <button
                    onClick={onExport}
                    className="btn btn-primary shadow-lg shadow-accent-primary/20"
                >
                    <Download size={18} />
                    Export
                </button>
            </div>
        </header>
    );
};

export default Navbar;
