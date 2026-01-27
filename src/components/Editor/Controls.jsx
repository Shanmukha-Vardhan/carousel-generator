import React from 'react';
import { useCarousel } from '../../context/CarouselContext';
import { Trash2, Image as ImageIcon, Camera } from 'lucide-react';

const BACKGROUNDS = [
    { id: 'paper', color: '#E5E1DC' },
    { id: 'cream', color: '#EDE9E3' },
    { id: 'slate', color: '#D4D0CB' },
    { id: 'charcoal', color: '#2A2A2A' }
];

const Controls = () => {
    const { activeSlide, updateSlide, deleteSlide, activeSlideIndex } = useCarousel();

    if (!activeSlide) return <div className="p-4 bg-surface rounded-lg">No Slide Selected</div>;

    return (
        <div className="bg-ui-surface p-4 rounded-xl flex flex-wrap items-center gap-6 shadow-sm border border-ui-border mb-6">

            {/* Slide Type */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-ui-text-muted uppercase tracking-wider">Slide Type</label>
                <select
                    value={activeSlide.type}
                    onChange={(e) => updateSlide(activeSlide.id, { type: e.target.value })}
                    className="input-field bg-ui-bg text-sm min-w-[140px]"
                >
                    <option value="cover">Cover Slide</option>
                    <option value="circle">Circle Highlight</option>
                    <option value="content">Content Slide</option>
                </select>
            </div>

            {/* Upload Image (Only for Cover) */}
            {activeSlide.type === 'cover' && (
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-ui-text-muted uppercase tracking-wider">Upload Image</label>
                    <button
                        className="btn btn-secondary text-sm"
                        onClick={() => document.querySelector('.polaroid-img-area')?.click()} // Trigger click on canvas element
                    >
                        <Camera size={16} />
                        Choose Image
                    </button>
                </div>
            )}

            {/* Background Color */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-ui-text-muted uppercase tracking-wider">Background</label>
                <div className="flex gap-2">
                    {BACKGROUNDS.map(bg => (
                        <button
                            key={bg.id}
                            onClick={() => updateSlide(activeSlide.id, { background: bg.id })}
                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${activeSlide.background === bg.id ? 'border-accent-primary ring-2 ring-ui-bg ring-offset-2 ring-offset-accent-primary' : 'border-ui-border'
                                }`}
                            style={{ backgroundColor: bg.color }}
                            title={bg.id}
                        />
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="h-10 w-px bg-ui-border mx-2"></div>

            {/* Actions */}
            <div className="flex items-center mt-auto">
                <button
                    onClick={() => deleteSlide(activeSlideIndex)}
                    className="btn btn-danger text-accent-danger hover:bg-accent-danger/10 border border-accent-danger/30"
                >
                    <Trash2 size={16} />
                    <span className="text-sm">Delete Slide</span>
                </button>
            </div>
        </div>
    );
};

export default Controls;
