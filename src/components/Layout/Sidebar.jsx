import React from 'react';
import { useCarousel } from '../../context/CarouselContext';
import { Plus, LayoutTemplate, Circle, Type } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const { slides, activeSlideIndex, setActiveSlideIndex, addSlide, MAX_SLIDES } = useCarousel();

    const getIcon = (type) => {
        switch (type) {
            case 'cover': return <LayoutTemplate size={20} />;
            case 'circle': return <Circle size={20} />;
            case 'content': return <Type size={20} />;
            default: return <LayoutTemplate size={20} />;
        }
    };

    return (
        <aside className="w-64 bg-ui-surface border-r border-ui-border flex flex-col h-full">
            <div className="p-4 border-b border-ui-border flex justify-between items-center">
                <h3 className="text-xs font-bold text-ui-text-muted uppercase tracking-widest">Slides</h3>
                <span className="text-xs bg-ui-bg px-2 py-1 rounded text-ui-text-muted font-mono">
                    {slides.length}/{MAX_SLIDES}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                {slides.map((slide, index) => (
                    <button
                        key={slide.id}
                        onClick={() => setActiveSlideIndex(index)}
                        className={clsx(
                            "group relative w-full aspect-square rounded-xl border-2 transition-all p-2 flex flex-col items-center justify-center gap-2",
                            activeSlideIndex === index
                                ? "bg-ui-surface-hover border-accent-primary shadow-[0_0_0_2px_rgba(107,92,231,0.2)]"
                                : "bg-ui-bg border-transparent hover:border-ui-border"
                        )}
                    >
                        <span className={clsx(
                            "absolute top-2 left-2 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center",
                            activeSlideIndex === index ? "bg-accent-primary text-white" : "bg-ui-border text-ui-text-muted"
                        )}>
                            {index + 1}
                        </span>

                        <div className={clsx("text-ui-text-muted group-hover:text-ui-text transition-colors", activeSlideIndex === index && "text-accent-primary")}>
                            {getIcon(slide.type)}
                        </div>

                        <span className="text-[10px] uppercase font-bold text-ui-text-muted tracking-wider">
                            {slide.type}
                        </span>
                    </button>
                ))}

                <button
                    onClick={() => addSlide('cover')} // Default add type
                    disabled={slides.length >= MAX_SLIDES}
                    className="w-full aspect-square rounded-xl border-2 border-dashed border-ui-border flex flex-col items-center justify-center gap-2 text-ui-text-muted hover:text-accent-primary hover:border-accent-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    <Plus size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium">Add Slide</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
