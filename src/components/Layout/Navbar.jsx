import React from 'react';
import { Download, Eye, Layers, Sparkles } from 'lucide-react';

const Navbar = ({ onPreviewAll, onExport }) => {
    return (
        <header className="h-16 border-b border-ui-border bg-ui-bg/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50 transition-all">
            <div className="flex items-center gap-3 group cursor-default">
                <div className="relative">
                    <div className="absolute inset-0 bg-accent-primary/20 blur-md rounded-lg group-hover:bg-accent-primary/40 transition-colors"></div>
                    <div className="w-9 h-9 bg-gradient-to-br from-accent-primary to-purple-700 rounded-lg flex items-center justify-center relative shadow-lg transform group-hover:rotate-6 transition-transform duration-300">
                        <Layers size={20} className="text-white" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-lg font-display tracking-widest text-ui-text leading-none">Carousel Studio</h1>
                    <span className="text-[10px] text-ui-text-muted uppercase tracking-widest font-mono">Create Viral Content</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={onPreviewAll}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-ui-text-muted hover:text-ui-text hover:bg-ui-surface transition-all border border-transparent hover:border-ui-border"
                >
                    <Eye size={16} />
                    Preview All
                </button>

                <div className="h-6 w-px bg-ui-border/50"></div>

                <button
                    onClick={onExport}
                    className="group relative px-6 py-2 rounded-lg bg-accent-primary hover:bg-accent-primary-hover text-white text-sm font-medium transition-all shadow-lg shadow-accent-primary/25 hover:shadow-accent-primary/40 flex items-center gap-2 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <Download size={16} className="relative z-10" />
                    <span className="relative z-10">Export Carousel</span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;
