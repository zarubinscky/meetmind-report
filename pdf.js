/*
 * MeetMind AI
 * Executive PDF Generator
 */

'use strict';

const PDF_CONFIG = {
    pageWidth: 1280,
    pageHeight: 720,
    fileSuffix: ' - MeetMind AI.pdf'
};

function sanitizePdfFilename(value) {
    return String(value || 'Meeting Report')
        .replace(/[\\/:*?"<>|]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function getPdfTitle() {
    return (
        currentMeeting?.meeting_title ||
        currentMeeting?.title ||
        currentMeeting?.report?.meeting_title ||
        currentMeeting?.report?.title ||
        document.querySelector('.editable-title')?.innerText ||
        'Meeting Report'
    );
}

async function generateExecutivePdf() {
    const report = document.querySelector('.report');

    if (!report) {
        alert('Report not found');
        return;
    }

    const title = sanitizePdfFilename(getPdfTitle());
    const filename = `${title}${PDF_CONFIG.fileSuffix}`;

    const options = {
        margin: 0,
        filename,
        image: {
            type: 'jpeg',
            quality: 1
        },
        html2canvas: {
            scale: 2,
            useCORS: true
        },
        jsPDF: {
            unit: 'px',
            format: [PDF_CONFIG.pageWidth, PDF_CONFIG.pageHeight],
            orientation: 'landscape'
        }
    };

    await html2pdf()
        .set(options)
        .from(report)
        .save();
}
