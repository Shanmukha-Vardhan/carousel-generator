import { createContext, useContext, useState, useEffect } from 'react';

const CarouselContext = createContext();

export const useCarousel = () => useContext(CarouselContext);

const DEFAULT_SLIDES = {
    cover: {
        type: 'cover',
        headline: 'WHAT ARE THE 17 METRICS TO TRACK AS A STARTUP FOUNDER?',
        image: null,
        meta: 'JAN 25 • INNOVATE • 025',
        quote: 'YOU CAN\'T IMPROVE WHAT YOU DON\'T MEASURE.',
        background: 'paper'
    },
    circle: {
        type: 'circle',
        subtitle: 'TRACK WHAT KEEPS YOU ALIVE',
        circleText: 'TRACK WHAT KEEPS YOU ALIVE.\nIGNORE WHAT ONLY SOUNDS IMPRESSIVE.',
        bodyText: 'MOST FOUNDERS TRACK VANITY METRICS THAT LOOK GOOD IN SCREENSHOTS BUT DON\'T PREDICT SURVIVAL.\n\nTHE 17 METRICS IN THIS CAROUSEL ARE THE ONES THAT ACTUALLY MATTER FOR BUILDING A SUSTAINABLE BUSINESS FROM ZERO TO ONE.',
        background: 'paper'
    },
    content: {
        type: 'content',
        topicTitle: 'CASH FLOW (THE ULTIMATE METRIC)',
        definition: 'CASH FLOW =\nHOW MUCH CASH ACTUALLY MOVES IN OR OUT OF YOUR BANK ACCOUNT EACH MONTH.',
        sections: [
            { id: 1, title: 'WHY IT MATTERS:', body: 'CASH FLOW POSITIVE COMPANIES DON\'T DIE.\n\nEVERYTHING ELSE EXISTS TO EVENTUALLY IMPROVE THIS NUMBER.' },
            { id: 2, title: 'EXAMPLE:', body: 'REVENUE: $70K | EXPENSES: $55K |\nCASH FLOW = +$15K/MONTH' }
        ],
        background: 'paper'
    }
};

const MAX_SLIDES = 10;

export const CarouselProvider = ({ children }) => {
    const [slides, setSlides] = useState([
        { ...DEFAULT_SLIDES.cover, id: 'slide_init_' + Date.now() }
    ]);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);

    const activeSlide = slides[activeSlideIndex];

    const addSlide = (type) => {
        if (slides.length >= MAX_SLIDES) return;

        const newSlide = {
            ...DEFAULT_SLIDES[type],
            id: `slide_${Date.now()}`,
            // Inherit background from valid previous slide
            background: activeSlide ? activeSlide.background : 'paper'
        };

        setSlides([...slides, newSlide]);
        setActiveSlideIndex(slides.length);
    };

    const updateSlide = (id, updates) => {
        setSlides(slides.map(slide =>
            slide.id === id ? { ...slide, ...updates } : slide
        ));
    };

    const updateSection = (slideId, sectionId, field, value) => {
        setSlides(slides.map(slide => {
            if (slide.id !== slideId) return slide;

            return {
                ...slide,
                sections: slide.sections.map(section =>
                    section.id === sectionId ? { ...section, [field]: value } : section
                )
            };
        }));
    };

    const deleteSlide = (index) => {
        if (slides.length <= 1) return;

        const newSlides = slides.filter((_, i) => i !== index);
        setSlides(newSlides);

        // Adjust active index
        if (activeSlideIndex >= newSlides.length) {
            setActiveSlideIndex(newSlides.length - 1);
        }
    };

    const moveSlide = (fromIndex, toIndex) => {
        if (toIndex < 0 || toIndex >= slides.length) return;

        const newSlides = [...slides];
        const [moved] = newSlides.splice(fromIndex, 1);
        newSlides.splice(toIndex, 0, moved);

        setSlides(newSlides);
        setActiveSlideIndex(toIndex);
    };

    return (
        <CarouselContext.Provider value={{
            slides,
            activeSlideIndex,
            activeSlide,
            MAX_SLIDES,
            setActiveSlideIndex,
            addSlide,
            updateSlide,
            updateSection,
            deleteSlide,
            moveSlide
        }}>
            {children}
        </CarouselContext.Provider>
    );
};
