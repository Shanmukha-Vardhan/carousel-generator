import React, { useRef } from 'react';
import { useCarousel } from '../../context/CarouselContext';
import { Trash2, Image as ImageIcon, Camera, Type, LayoutTemplate, Palette, Plus } from 'lucide-react';
import clsx from 'clsx';

const BACKGROUNDS = [
    { id: 'paper', color: '#E5E1DC', name: 'Paper' },
    { id: 'cream', color: '#EDE9E3', name: 'Cream' },
    { id: 'slate', color: '#D4D0CB', name: 'Slate' },
    { id: 'charcoal', color: '#2A2A2A', name: 'Charcoal' }
];

const SLIDE_TYPES = [
    { id: 'cover', icon: LayoutTemplate, label: 'Cover' },
    { id: 'circle', icon: Type, label: 'Circle' },
    { id: 'content', icon: Type, label: 'Content' },
];

const Controls = () => {
    const { activeSlide, updateSlide, deleteSlide, activeSlideIndex } = useCarousel();
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                updateSlide(activeSlide.id, { image: event.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    if (!activeSlide) {
        return (
            <div className="w-full flex items-center justify-center p-8 text-ui-text-muted border-2 border-dashed border-ui-border rounded-xl">
                <span className="flex items-center gap-2">
                    <LayoutTemplate className="w-5 h-5" />
                    Select a slide to start editing
                </span>
            </div>
        );
    }

    return (
        <div className="bg-ui-surface/50 backdrop-blur-md p-4 rounded-2xl border border-ui-border/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 transition-all hover:bg-ui-surface hover:border-ui-border hover:shadow-xl">

            <div className="flex flex-wrap items-center gap-6">
                {/* Slide Type Selection */}
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-ui-text-muted uppercase tracking-widest flex items-center gap-1.5">
                        <LayoutTemplate size={12} />
                        Slide Type
                    </label>
                    <div className="flex bg-ui-bg rounded-lg p-1 border border-ui-border">
                        {SLIDE_TYPES.map(type => (
                            <button
                                key={type.id}
                                onClick={() => updateSlide(activeSlide.id, { type: type.id })}
                                className={clsx(
                                    "px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2",
                                    activeSlide.type === type.id
                                        ? "bg-ui-surface shadow-sm text-white"
                                        : "text-ui-text-muted hover:text-ui-text hover:bg-ui-surface/50"
                                )}
                            >
                                {activeSlide.type === type.id && <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />}
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-px h-8 bg-ui-border hidden md:block" />

                {/* Background Selection */}
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-ui-text-muted uppercase tracking-widest flex items-center gap-1.5">
                        <Palette size={12} />
                        Theme
                    </label>
                    <div className="flex gap-2">
                        {BACKGROUNDS.map(bg => (
                            <button
                                key={bg.id}
                                onClick={() => updateSlide(activeSlide.id, { background: bg.id })}
                                className={clsx(
                                    "w-8 h-8 rounded-full border-2 transition-all hover:scale-110 relative group",
                                    activeSlide.background === bg.id
                                        ? "border-accent-primary ring-2 ring-ui-bg ring-offset-2 ring-offset-accent-primary"
                                        : "border-ui-border hover:border-ui-text-muted"
                                )}
                                style={{ backgroundColor: bg.color }}
                                aria-label={`Select ${bg.name} theme`}
                            >
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                    {bg.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-end border-t md:border-t-0 border-ui-border pt-4 md:pt-0">
                {/* Upload Image Handler - Only shows when relevant but available in toolbar */}
                {activeSlide.type === 'cover' && (
                    <>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="btn btn-secondary text-xs py-2 h-9 group"
                        >
                            <Camera size={14} className="group-hover:text-accent-primary transition-colors" />
                            Change Image
                        </button>
                    </>
                )}

                <button
                    onClick={() => deleteSlide(activeSlideIndex)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-ui-text-muted hover:text-accent-danger hover:bg-accent-danger/10 transition-colors"
                    title="Delete Slide"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default Controls;
