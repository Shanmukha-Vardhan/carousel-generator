import React, { useRef, useState } from 'react';
import { CarouselProvider, useCarousel } from './context/CarouselContext';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Controls from './components/Editor/Controls';
import SlideRenderer from './components/Canvas/SlideRenderer';
import { downloadAllSlides } from './utils/exportUtils';
import clsx from 'clsx';
import { X } from 'lucide-react';

const MainLayout = () => {
  const { slides, activeSlide } = useCarousel();
  const exportContainerRef = useRef(null);
  const [showPreviewAll, setShowPreviewAll] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);

    // Gather all slide elements from the hidden container
    const slideElements = Array.from(exportContainerRef.current.children).map((el, index) => ({
      element: el,
      index
    }));

    await downloadAllSlides(slideElements);
    setIsExporting(false);
  };

  return (
    <div className="flex flex-col h-screen bg-ui-bg text-ui-text font-ui overflow-hidden">
      <Navbar
        onPreviewAll={() => setShowPreviewAll(true)}
        onExport={handleExport}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex flex-col p-8 overflow-y-auto items-center bg-ui-bg">
          <div className="w-full max-w-4xl">
            <Controls />

            <div className="flex justify-center py-8">
              {activeSlide ? (
                <SlideRenderer slide={activeSlide} scale={1} />
              ) : (
                <div className="text-ui-text-muted">Select a slide to edit</div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Preview All Modal */}
      {showPreviewAll && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col p-8 animate-in fade-in duration-200">
          <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto w-full">
            <h2 className="text-2xl font-display tracking-widest text-white">All Slides Preview</h2>
            <button
              onClick={() => setShowPreviewAll(false)}
              className="p-2 bg-ui-surface rounded-full hover:bg-accent-danger hover:text-white transition-colors border border-ui-border"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto pb-20">
              {slides.map((slide, index) => (
                <div key={slide.id} className="flex flex-col gap-2 group">
                  <div className="aspect-square w-full rounded-lg overflow-hidden shadow-2xl relative">
                    <div className="absolute inset-0 origin-top-left transform scale-[0.5] sm:scale-[0.6] w-[200%] h-[200%] pointer-events-none">
                      <SlideRenderer slide={slide} readOnly />
                    </div>
                  </div>
                  <span className="text-center text-sm font-mono text-ui-text-muted mt-2">
                    {index + 1}. {slide.type.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hidden Export Container */}
      <div
        ref={exportContainerRef}
        className="fixed top-0 left-[-9999px] flex flex-col pointer-events-none opacity-0"
      >
        {slides.map(slide => (
          <div key={`export-${slide.id}`} className="mb-4">
            <SlideRenderer slide={slide} readOnly scale={1} />
          </div>
        ))}
      </div>

      {/* Loading Overlay */}
      {isExporting && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-accent-primary border-t-white rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-display tracking-widest">Generating Your Masterpiece...</p>
        </div>
      )}
    </div>
  );
};

const App = () => (
  <CarouselProvider>
    <MainLayout />
  </CarouselProvider>
);

export default App;
