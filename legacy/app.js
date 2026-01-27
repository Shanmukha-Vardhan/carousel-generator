/**
 * Carousel Generator - Main Application
 * Interactive carousel post generator with live preview and export
 */

// ========================================
// CONSTANTS & STATE
// ========================================

const MAX_SLIDES = 10;

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
            { title: 'WHY IT MATTERS:', body: 'CASH FLOW POSITIVE COMPANIES DON\'T DIE.\n\nEVERYTHING ELSE EXISTS TO EVENTUALLY IMPROVE THIS NUMBER.' },
            { title: 'EXAMPLE:', body: 'REVENUE: $70K | EXPENSES: $55K |\nCASH FLOW = +$15K/MONTH' }
        ],
        background: 'paper'
    }
};

// Application State
let state = {
    slides: [{ ...DEFAULT_SLIDES.cover, id: generateId() }],
    currentSlideIndex: 0
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

function generateId() {
    return 'slide_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function cloneSlide(slideType) {
    return { ...DEFAULT_SLIDES[slideType], id: generateId() };
}

// ========================================
// DOM ELEMENTS
// ========================================

const elements = {
    slidesList: document.getElementById('slidesList'),
    slideCount: document.getElementById('slideCount'),
    addSlideBtn: document.getElementById('addSlideBtn'),
    slideTypeModal: document.getElementById('slideTypeModal'),
    closeModal: document.getElementById('closeModal'),
    previewCanvas: document.getElementById('previewCanvas'),
    carouselNav: document.getElementById('carouselNav'),
    slideTypeSelect: document.getElementById('slideTypeSelect'),
    imageUploadGroup: document.getElementById('imageUploadGroup'),
    imageUpload: document.getElementById('imageUpload'),
    deleteSlideBtn: document.getElementById('deleteSlideBtn'),
    exportBtn: document.getElementById('exportBtn'),
    exportModal: document.getElementById('exportModal'),
    closeExportModal: document.getElementById('closeExportModal'),
    exportPngBtn: document.getElementById('exportPngBtn'),
    exportAllPngBtn: document.getElementById('exportAllPngBtn'),
    exportProgress: document.getElementById('exportProgress'),
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText'),
    previewAllBtn: document.getElementById('previewAllBtn'),
    previewAllModal: document.getElementById('previewAllModal'),
    closePreviewAll: document.getElementById('closePreviewAll'),
    previewAllGrid: document.getElementById('previewAllGrid'),
    colorBtns: document.querySelectorAll('.color-btn')
};

// ========================================
// RENDER FUNCTIONS
// ========================================

function renderSlidesList() {
    elements.slidesList.innerHTML = '';
    
    state.slides.forEach((slide, index) => {
        const thumb = document.createElement('div');
        thumb.className = `slide-thumb ${index === state.currentSlideIndex ? 'active' : ''}`;
        thumb.innerHTML = `
            <span class="slide-thumb-number">${index + 1}</span>
            <div class="slide-thumb-preview">${getSlideTypeIcon(slide.type)}</div>
            <span class="slide-thumb-label">${capitalizeFirst(slide.type)}</span>
        `;
        thumb.addEventListener('click', () => selectSlide(index));
        elements.slidesList.appendChild(thumb);
    });
    
    elements.slideCount.textContent = `${state.slides.length}/${MAX_SLIDES}`;
    elements.addSlideBtn.disabled = state.slides.length >= MAX_SLIDES;
}

function getSlideTypeIcon(type) {
    switch(type) {
        case 'cover': return '📷';
        case 'circle': return '⭕';
        case 'content': return '📝';
        default: return '📄';
    }
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderCarouselNav() {
    elements.carouselNav.innerHTML = '';
    
    state.slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${index === state.currentSlideIndex ? 'active' : ''}`;
        dot.addEventListener('click', () => selectSlide(index));
        elements.carouselNav.appendChild(dot);
    });
}

function renderPreview() {
    const slide = state.slides[state.currentSlideIndex];
    if (!slide) return;

    elements.previewCanvas.className = `preview-canvas bg-${slide.background}`;
    elements.slideTypeSelect.value = slide.type;
    elements.imageUploadGroup.style.display = slide.type === 'cover' ? 'flex' : 'none';

    // Update color button active state
    elements.colorBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.bg === slide.background);
    });
    
    let html = '';
    
    switch(slide.type) {
        case 'cover':
            html = renderCoverSlide(slide);
            break;
        case 'circle':
            html = renderCircleSlide(slide);
            break;
        case 'content':
            html = renderContentSlide(slide);
            break;
    }
    
    elements.previewCanvas.innerHTML = html;
    attachEditableListeners();
}

function renderCoverSlide(slide) {
    const imageStyle = slide.image 
        ? `background-image: url('${slide.image}')`
        : '';
    const imagePlaceholder = slide.image ? '' : 'Click to upload';
    
    return `
        <div class="slide-content slide-cover">
            <div class="headline editable" contenteditable="true" data-field="headline">${slide.headline}</div>
            <div class="polaroid-wrapper">
                <div class="polaroid">
                    <div class="polaroid-image" style="${imageStyle}" data-action="upload">${imagePlaceholder}</div>
                </div>
                <div class="polaroid-meta editable" contenteditable="true" data-field="meta">${slide.meta}</div>
            </div>
            <div class="bottom-quote editable" contenteditable="true" data-field="quote">${slide.quote}</div>
        </div>
    `;
}

function renderCircleSlide(slide) {
    return `
        <div class="slide-content slide-circle">
            <div class="subtitle editable" contenteditable="true" data-field="subtitle">${slide.subtitle}</div>
            <div class="circle-wrapper">
                <div class="hand-drawn-circle">
                    ${generateHandDrawnCircle()}
                </div>
                <div class="circle-text editable" contenteditable="true" data-field="circleText">${slide.circleText.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="body-text editable" contenteditable="true" data-field="bodyText">${slide.bodyText.replace(/\n/g, '<br>')}</div>
        </div>
    `;
}

function generateHandDrawnCircle() {
    // SVG hand-drawn looking ellipse
    return `
        <svg viewBox="0 0 200 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="50" rx="95" ry="45" 
                fill="none" 
                stroke="#1A1A1A" 
                stroke-width="2"
                stroke-linecap="round"
                style="
                    stroke-dasharray: 2 0;
                    animation: none;
                "
            />
            <ellipse cx="100" cy="50" rx="93" ry="43" 
                fill="none" 
                stroke="#1A1A1A" 
                stroke-width="1"
                stroke-linecap="round"
                opacity="0.3"
                transform="rotate(2 100 50)"
            />
        </svg>
    `;
}

function renderContentSlide(slide) {
    const sectionsHtml = slide.sections.map((section, i) => `
        <div class="section">
            <div class="section-title editable" contenteditable="true" data-field="sections" data-section-index="${i}" data-section-field="title">${section.title}</div>
            <div class="section-body editable" contenteditable="true" data-field="sections" data-section-index="${i}" data-section-field="body">${section.body.replace(/\n/g, '<br>')}</div>
        </div>
    `).join('');
    
    return `
        <div class="slide-content slide-content-type">
            <div class="topic-title editable" contenteditable="true" data-field="topicTitle">${slide.topicTitle}</div>
            <div class="definition editable" contenteditable="true" data-field="definition">${slide.definition.replace(/\n/g, '<br>')}</div>
            ${sectionsHtml}
        </div>
    `;
}

// ========================================
// EVENT HANDLERS
// ========================================

function selectSlide(index) {
    state.currentSlideIndex = index;
    renderSlidesList();
    renderCarouselNav();
    renderPreview();
}

function attachEditableListeners() {
    document.querySelectorAll('.editable').forEach(el => {
        el.addEventListener('blur', handleTextEdit);
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                document.execCommand('insertLineBreak');
            }
        });
    });
    
    // Polaroid image click handler
    const polaroidImage = document.querySelector('.polaroid-image[data-action="upload"]');
    if (polaroidImage) {
        polaroidImage.addEventListener('click', () => {
            elements.imageUpload.click();
        });
    }
}

function handleTextEdit(e) {
    const field = e.target.dataset.field;
    const slide = state.slides[state.currentSlideIndex];
    
    if (field === 'sections') {
        const sectionIndex = parseInt(e.target.dataset.sectionIndex);
        const sectionField = e.target.dataset.sectionField;
        slide.sections[sectionIndex][sectionField] = e.target.innerHTML.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]*>/g, '');
    } else {
        slide[field] = e.target.innerHTML.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]*>/g, '');
    }
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        state.slides[state.currentSlideIndex].image = event.target.result;
        renderPreview();
    };
    reader.readAsDataURL(file);
}

function handleSlideTypeChange(e) {
    const newType = e.target.value;
    const currentSlide = state.slides[state.currentSlideIndex];
    
    // Create new slide with default values but keep background
    const newSlide = cloneSlide(newType);
    newSlide.id = currentSlide.id;
    newSlide.background = currentSlide.background;
    
    state.slides[state.currentSlideIndex] = newSlide;
    renderSlidesList();
    renderPreview();
}

function handleBackgroundChange(bg) {
    state.slides[state.currentSlideIndex].background = bg;
    renderPreview();
}

function openSlideTypeModal() {
    if (state.slides.length >= MAX_SLIDES) return;
    elements.slideTypeModal.classList.add('active');
}

function closeSlideTypeModal() {
    elements.slideTypeModal.classList.remove('active');
}

function addSlide(type) {
    if (state.slides.length >= MAX_SLIDES) return;
    
    const newSlide = cloneSlide(type);
    state.slides.push(newSlide);
    state.currentSlideIndex = state.slides.length - 1;
    
    closeSlideTypeModal();
    renderSlidesList();
    renderCarouselNav();
    renderPreview();
}

function deleteCurrentSlide() {
    if (state.slides.length <= 1) {
        alert('You must have at least one slide.');
        return;
    }
    
    state.slides.splice(state.currentSlideIndex, 1);
    state.currentSlideIndex = Math.min(state.currentSlideIndex, state.slides.length - 1);
    
    renderSlidesList();
    renderCarouselNav();
    renderPreview();
}

// ========================================
// EXPORT FUNCTIONS
// ========================================

function openExportModal() {
    elements.exportModal.classList.add('active');
    elements.exportProgress.classList.remove('active');
}

function closeExportModal() {
    elements.exportModal.classList.remove('active');
}

async function exportCurrentSlide() {
    try {
        elements.exportProgress.classList.add('active');
        elements.progressText.textContent = 'Generating image...';
        elements.progressFill.style.width = '50%';
        
        const canvas = await html2canvas(elements.previewCanvas, {
            scale: 2,
            backgroundColor: null,
            useCORS: true
        });
        
        elements.progressFill.style.width = '100%';
        elements.progressText.textContent = 'Downloading...';
        
        const link = document.createElement('a');
        link.download = `slide_${state.currentSlideIndex + 1}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        setTimeout(() => {
            elements.exportProgress.classList.remove('active');
            elements.progressFill.style.width = '0%';
        }, 1000);
    } catch (error) {
        console.error('Export failed:', error);
        alert('Export failed. Please try again.');
        elements.exportProgress.classList.remove('active');
    }
}

async function exportAllSlides() {
    const zip = new JSZip();
    const originalIndex = state.currentSlideIndex;
    
    elements.exportProgress.classList.add('active');
    
    try {
        for (let i = 0; i < state.slides.length; i++) {
            state.currentSlideIndex = i;
            renderPreview();
            
            // Wait for render
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const progress = ((i + 1) / state.slides.length) * 100;
            elements.progressFill.style.width = `${progress}%`;
            elements.progressText.textContent = `Exporting slide ${i + 1} of ${state.slides.length}...`;
            
            const canvas = await html2canvas(elements.previewCanvas, {
                scale: 2,
                backgroundColor: null,
                useCORS: true
            });
            
            const dataUrl = canvas.toDataURL('image/png');
            const base64Data = dataUrl.split(',')[1];
            zip.file(`slide_${String(i + 1).padStart(2, '0')}.png`, base64Data, { base64: true });
        }
        
        elements.progressText.textContent = 'Creating ZIP file...';
        
        const content = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.download = 'carousel_slides.zip';
        link.href = URL.createObjectURL(content);
        link.click();
        
        // Restore original slide
        state.currentSlideIndex = originalIndex;
        renderSlidesList();
        renderCarouselNav();
        renderPreview();
        
        setTimeout(() => {
            elements.exportProgress.classList.remove('active');
            elements.progressFill.style.width = '0%';
        }, 1000);
    } catch (error) {
        console.error('Export failed:', error);
        alert('Export failed. Please try again.');
        state.currentSlideIndex = originalIndex;
        renderPreview();
        elements.exportProgress.classList.remove('active');
    }
}

// ========================================
// PREVIEW ALL
// ========================================

function openPreviewAll() {
    elements.previewAllModal.classList.add('active');
    renderPreviewAllGrid();
}

function closePreviewAll() {
    elements.previewAllModal.classList.remove('active');
}

function renderPreviewAllGrid() {
    elements.previewAllGrid.innerHTML = '';
    
    state.slides.forEach((slide, index) => {
        const item = document.createElement('div');
        item.className = 'preview-all-item';
        item.innerHTML = `
            <div class="preview-all-item-wrapper">
                <div class="mini-slide bg-${slide.background}" style="padding: 20px; font-family: 'Bebas Neue', sans-serif; color: #1A1A1A; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; font-size: 10px;">
                    <strong>Slide ${index + 1}</strong>
                    <span style="margin-top: 5px; text-transform: uppercase; font-size: 8px;">${capitalizeFirst(slide.type)}</span>
                </div>
            </div>
        `;
        item.addEventListener('click', () => {
            closePreviewAll();
            selectSlide(index);
        });
        elements.previewAllGrid.appendChild(item);
    });
}

// ========================================
// EVENT LISTENERS
// ========================================

function initEventListeners() {
    // Add slide
    elements.addSlideBtn.addEventListener('click', openSlideTypeModal);
    elements.closeModal.addEventListener('click', closeSlideTypeModal);
    
    // Slide type selection
    document.querySelectorAll('.slide-type-option').forEach(btn => {
        btn.addEventListener('click', () => addSlide(btn.dataset.type));
    });
    
    // Controls
    elements.slideTypeSelect.addEventListener('change', handleSlideTypeChange);
    elements.imageUpload.addEventListener('change', handleImageUpload);
    elements.deleteSlideBtn.addEventListener('click', deleteCurrentSlide);
    
    // Color buttons
    elements.colorBtns.forEach(btn => {
        btn.addEventListener('click', () => handleBackgroundChange(btn.dataset.bg));
    });
    
    // Export
    elements.exportBtn.addEventListener('click', openExportModal);
    elements.closeExportModal.addEventListener('click', closeExportModal);
    elements.exportPngBtn.addEventListener('click', exportCurrentSlide);
    elements.exportAllPngBtn.addEventListener('click', exportAllSlides);
    
    // Preview All
    elements.previewAllBtn.addEventListener('click', openPreviewAll);
    elements.closePreviewAll.addEventListener('click', closePreviewAll);
    
    // Close modals on outside click
    elements.slideTypeModal.addEventListener('click', (e) => {
        if (e.target === elements.slideTypeModal) closeSlideTypeModal();
    });
    elements.exportModal.addEventListener('click', (e) => {
        if (e.target === elements.exportModal) closeExportModal();
    });
    elements.previewAllModal.addEventListener('click', (e) => {
        if (e.target === elements.previewAllModal) closePreviewAll();
    });
}

// ========================================
// INITIALIZATION
// ========================================

function init() {
    initEventListeners();
    renderSlidesList();
    renderCarouselNav();
    renderPreview();
}

// Start the application
document.addEventListener('DOMContentLoaded', init);
