import React from 'react';
import { useCarousel } from '../../context/CarouselContext';
import { Plus, LayoutTemplate, Circle, Type, GripVertical } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const { slides, activeSlideIndex, setActiveSlideIndex, addSlide, MAX_SLIDES } = useCarousel();

    const getIcon = (type) => {
        switch (type) {
            case 'cover': return <LayoutTemplate size={18} />;
            case 'circle': return <Circle size={18} />;
            case 'content': return <Type size={18} />;
            default: return <LayoutTemplate size={18} />;
        }
    };

    return (
        <aside className="w-72 bg-ui-bg border-r border-ui-border flex flex-col h-full shrink-0 z-20">
            <div className="h-16 flex items-center justify-between px-5 border-b border-ui-border bg-ui-bg/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex flex-col">
                    <h3 className="text-xs font-bold text-ui-text uppercase tracking-widest">Outline</h3>
                    <span className="text-[10px] text-ui-text-muted mt-0.5">
                        {slides.length} / {MAX_SLIDES} Slides
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin">
                {slides.map((slide, index) => (
                    <div key={slide.id} className="group relative flex items-start gap-3">
                        <div className="flex flex-col items-center pt-3 gap-1 min-w-[20px]">
                            <span className={clsx(
                                "text-[10px] font-mono font-medium transition-colors",
                                activeSlideIndex === index ? "text-accent-primary" : "text-ui-text-muted group-hover:text-ui-text"
                            )}>
                                {String(index + 1).padStart(2, '0')}
                            </span>
                        </div>

                        <button
                            onClick={() => setActiveSlideIndex(index)}
                            className={clsx(
                                "w-full aspect-square rounded-lg border-2 transition-all p-3 flex flex-col items-center justify-center gap-3 relative overflow-hidden text-left",
                                activeSlideIndex === index
                                    ? "bg-ui-surface border-accent-primary shadow-lg shadow-accent-primary/10"
                                    : "bg-ui-surface/50 border-ui-border hover:border-ui-text-muted hover:bg-ui-surface"
                            )}
                        >
                            {/* Slide Function Icon */}
                            <div className={clsx(
                                "p-2 rounded-md transition-colors",
                                activeSlideIndex === index ? "bg-accent-primary/10 text-accent-primary" : "bg-ui-bg text-ui-text-muted group-hover:text-ui-text"
                            )}>
                                {getIcon(slide.type)}
                            </div>

                            <span className="text-[10px] uppercase font-bold text-ui-text-muted tracking-wider group-hover:text-ui-text transition-colors">
                                {slide.type} Slide
                            </span>

                            {/* Active Indicator */}
                            {activeSlideIndex === index && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-primary" />
                            )}
                        </button>
                    </div>
                ))}

                <button
                    onClick={() => addSlide('cover')}
                    disabled={slides.length >= MAX_SLIDES}
                    className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-ui-border text-ui-text-muted hover:text-accent-primary hover:border-accent-primary hover:bg-accent-primary/5 transition-all gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-ui-border disabled:hover:text-ui-text-muted mt-2"
                >
                    <div className="w-8 h-8 rounded-full bg-ui-surface flex items-center justify-center shadow-sm">
                        <Plus size={16} />
                    </div>
                    <span className="text-xs font-medium">Add New Slide</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
