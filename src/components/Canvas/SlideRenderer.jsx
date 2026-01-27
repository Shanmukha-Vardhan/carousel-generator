import React, { useRef } from 'react';
import { useCarousel } from '../../context/CarouselContext';
import HandDrawnCircle from './HandDrawnCircle';
import { Camera } from 'lucide-react';
import clsx from 'clsx';
import './SlideRenderer.css';

const SlideRenderer = ({ slide, readOnly = false, scale = 1 }) => {
  const { updateSlide, updateSection } = useCarousel();
  const fileInputRef = useRef(null);

  // --- Handlers ---

  const handleTextChange = (field, value) => {
    if (readOnly) return;
    updateSlide(slide.id, { [field]: value });
  };

  const handleSectionChange = (sectionId, field, value) => {
    if (readOnly) return;
    updateSection(slide.id, sectionId, field, value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateSlide(slide.id, { image: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    if (!readOnly && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // --- Render Helpers ---

  const Editable = ({ value, className, onChange, as: Component = 'div' }) => (
    <Component
      className={clsx('editable', className)}
      contentEditable={!readOnly}
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.currentTarget.innerText)}
    >
      {value}
    </Component>
  );

  // --- Layouts ---

  const CoverLayout = () => (
    <div className="slide-content slide-cover">
      <Editable 
        value={slide.headline} 
        className="cover-headline" 
        onChange={(val) => handleTextChange('headline', val)} 
      />
      
      <div className="polaroid-container">
        <div className="polaroid-frame">
          <div 
            className="polaroid-img-area" 
            onClick={triggerUpload}
            style={slide.image ? { backgroundImage: `url(${slide.image})` } : {}}
          >
            {!slide.image && <Camera size={48} className="opacity-20" />}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
          <Editable 
            value={slide.meta} 
            className="polaroid-meta text-center" 
            onChange={(val) => handleTextChange('meta', val)} 
          />
        </div>
      </div>

      <Editable 
        value={slide.quote} 
        className="cover-quote" 
        onChange={(val) => handleTextChange('quote', val)} 
      />
    </div>
  );

  const CircleLayout = () => (
    <div className="slide-content slide-circle">
      <Editable 
        value={slide.subtitle} 
        className="circle-subtitle" 
        onChange={(val) => handleTextChange('subtitle', val)} 
      />
      
      <div className="circle-highlight-box">
        <div className="circle-svg">
          <HandDrawnCircle />
        </div>
        <Editable 
          value={slide.circleText} 
          className="circle-text" 
          onChange={(val) => handleTextChange('circleText', val)} 
        />
      </div>

      <Editable 
        value={slide.bodyText} 
        className="circle-body" 
        onChange={(val) => handleTextChange('bodyText', val)} 
      />
    </div>
  );

  const ContentLayout = () => (
    <div className="slide-content slide-content-layout">
      <Editable 
        value={slide.topicTitle} 
        className="content-topic" 
        onChange={(val) => handleTextChange('topicTitle', val)} 
      />
      <Editable 
        value={slide.definition} 
        className="content-definition" 
        onChange={(val) => handleTextChange('definition', val)} 
      />
      
      <div className="flex flex-col gap-6 mt-4">
        {slide.sections?.map(section => (
          <div key={section.id} className="content-section">
            <Editable 
              value={section.title} 
              className="section-title mb-1" 
              onChange={(val) => handleSectionChange(section.id, 'title', val)} 
            />
            <Editable 
              value={section.body} 
              className="section-body" 
              onChange={(val) => handleSectionChange(section.id, 'body', val)} 
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div 
      className={clsx('slide-canvas', `bg-${slide.background}`)}
      style={{ 
        transform: `scale(${scale})`, 
        transformOrigin: 'top left' 
      }}
    >
      {slide.type === 'cover' && <CoverLayout />}
      {slide.type === 'circle' && <CircleLayout />}
      {slide.type === 'content' && <ContentLayout />}
      
      {/* Fallback for unknown types */}
      {!['cover', 'circle', 'content'].includes(slide.type) && (
        <div className="flex-center h-full text-muted">Unknown Slide Type</div>
      )}
    </div>
  );
};

export default SlideRenderer;
