import React, { useRef, useState } from 'react';
import { CarouselProvider, useCarousel } from './context/CarouselContext';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Controls from './components/Editor/Controls';
import SlideRenderer from './components/Canvas/SlideRenderer';
import { downloadAllSlides } from './utils/exportUtils';
import clsx from 'clsx';
import { X, Loader2 } from 'lucide-react';

const MainLayout = () => {
  const { slides, activeSlide } = useCarousel();
  const exportContainerRef = useRef(null);
  const [showPreviewAll, setShowPreviewAll] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);

    // Give UI a moment to update
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      // Gather all slide elements from the hidden container
      const slideElements = Array.from(exportContainerRef.current.children).map((el, index) => ({
        element: el,
        index
      }));

      await downloadAllSlides(slideElements);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-ui-bg text-ui-text font-ui overflow-hidden selection:bg-accent-primary/30 selection:text-white">
      <Navbar
        onPreviewAll={() => setShowPreviewAll(true)}
        onExport={handleExport}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar css={{ zIndex: 30 }} />

        <main className="flex-1 flex flex-col relative overflow-hidden bg-ui-bg">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #3A3A42 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }}
          />

          <div className="flex-1 overflow-y-auto p-8 relative z-10 flex flex-col items-center">
            <div className="w-full max-w-5xl">
              <Controls />

              <div className="flex justify-center py-12 min-h-[600px] items-center">
                {activeSlide ? (
                  <div className="relative shadow-2xl shadow-black/50 transition-all duration-500 ease-out hover:scale-[1.01]">
                    <SlideRenderer slide={activeSlide} scale={1} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 w-full max-w-2xl border-2 border-dashed border-ui-border rounded-3xl bg-ui-surface/20 text-ui-text-muted gap-4">
                    <p className="text-xl font-medium">No Slide Selected</p>
                    <p className="text-sm opacity-60">Select a slide from the sidebar to start editing</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Preview All Modal */}
      {showPreviewAll && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col animate-in fade-in duration-300">
          <div className="h-20 flex items-center justify-between px-8 border-b border-ui-border/30 bg-black/20">
            <div>
              <h2 className="text-2xl font-display tracking-widest text-white">Full Carousel Preview</h2>
              <p className="text-xs text-ui-text-muted font-mono mt-1">
                {slides.length} Slides • Ready to Export
              </p>
            </div>
            <button
              onClick={() => setShowPreviewAll(false)}
              className="p-2.5 bg-ui-surface/50 rounded-full hover:bg-accent-danger hover:text-white transition-all border border-ui-border group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-ui-bg/50 p-8">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8 max-w-[1600px] mx-auto pb-20">
              {slides.map((slide, index) => (
                <div key={slide.id} className="flex flex-col gap-4 group fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="aspect-square w-full rounded-xl overflow-hidden shadow-2xl relative border border-ui-border/50 group-hover:border-accent-primary/50 transition-colors bg-ui-bg">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative shadow-lg" style={{ width: '500px', height: '500px', transform: 'scale(0.55)', transformOrigin: 'center' }}>
                        <SlideRenderer slide={slide} readOnly />
                      </div>
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-accent-primary/0 group-hover:bg-accent-primary/10 transition-colors pointer-events-none" />
                  </div>
                  <div className="flex items-center justify-between px-2">
                    <span className="text-sm font-mono font-bold text-ui-text-muted group-hover:text-accent-primary transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-ui-text-muted font-bold opacity-60">
                      {slide.type}
                    </span>
                  </div>
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
          <div key={`export-${slide.id}`} className="mb-0">
            <SlideRenderer slide={slide} readOnly scale={1} />
          </div>
        ))}
      </div>

      {/* Loading Overlay */}
      {isExporting && (
        <div className="fixed inset-0 z-[200] bg-ui-bg/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-accent-primary blur-xl opacity-20 animate-pulse"></div>
            <Loader2 size={64} className="text-accent-primary animate-spin relative z-10" />
          </div>
          <h3 className="text-2xl font-display tracking-widest mt-8 text-white">Rendering Carousel</h3>
          <p className="text-ui-text-muted mt-2 font-mono text-sm max-w-xs text-center">
            Creating high-quality images for your download...
          </p>
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
