import html2canvas from 'html2canvas';
import JSZip from 'jszip';

export const downloadSlide = async (element, filename) => {
    if (!element) return;

    try {
        const canvas = await html2canvas(element, {
            scale: 2, // Retina quality
            useCORS: true,
            backgroundColor: null,
            logging: false
        });

        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (err) {
        console.error('Export failed:', err);
    }
};

export const downloadAllSlides = async (slideElements) => {
    const zip = new JSZip();

    // slideElements is an array of DOM nodes { id: 'slide_1', element: node }

    for (let i = 0; i < slideElements.length; i++) {
        const { element, index } = slideElements[i];
        if (!element) continue;

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: null,
                logging: false
            });

            const dataUrl = canvas.toDataURL('image/png');
            const base64Data = dataUrl.split(',')[1];

            zip.file(`slide_${String(index + 1).padStart(2, '0')}.png`, base64Data, { base64: true });
        } catch (err) {
            console.error(`Failed to export slide ${index + 1}:`, err);
        }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.download = 'carousel-export.zip';
    link.href = URL.createObjectURL(content);
    link.click();
};
