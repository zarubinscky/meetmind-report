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

function isPdfValueVisible(value) {
    return value !== null &&
        value !== undefined &&
        String(value).trim() !== '' &&
        value !== 'Не указано' &&
        value !== 'Not specified';
}

function normalizePdfItem(item) {
    if (typeof item === 'string') {
        return {
            title: item,
            details: ''
        };
    }
    const title = item.title || item.task || item.name || '';
    const details = [
        item.details,
        item.description,
        item.owner ? `Owner: ${item.owner}` : '',
        item.due_date ? `Due: ${item.due_date}` : '',
        item.dueDate ? `Due: ${item.dueDate}` : ''
    ]
        .filter(Boolean)
        .join(' · ');
    return {
        title,
        details
    };
}

function buildPdfBlocks(report) {
    const blocks = [];
    
    if ((report.key_metrics || []).length) {
    blocks.push({
        key: 'metrics',
        title: 'Key Metrics',
        type: 'metrics',
        priority: 98,
        items: report.key_metrics
    });
}

    if (isPdfValueVisible(report.summary)) {
        blocks.push({
            key: 'summary',
            title: 'Executive Summary',
            type: 'summary',
            priority: 100,
            items: [{ title: report.summary, details: '' }]
        });
    }

    if ((report.insights || []).length) {
        blocks.push({
            key: 'insights',
            title: 'Insights',
            type: 'list',
            priority: 90,
            items: report.insights.map(normalizePdfItem)
        });
    }

    if ((report.decisions || []).length) {
        blocks.push({
            key: 'decisions',
            title: 'Decisions',
            type: 'list',
            priority: 95,
            items: report.decisions.map(normalizePdfItem)
        });
    }
    if ((report.risks || []).length) {
        blocks.push({
            key: 'risks',
            title: 'Risks',
            type: 'list',
            priority: 85,
            items: report.risks.map(normalizePdfItem)
        });
    }
    
    if ((report.tasks || []).length) {
        blocks.push({
            key: 'tasks',
            title: 'Tasks',
            type: 'tasks',
            priority: 95,
            items: report.tasks.map(normalizePdfItem)
        });
    }
    return blocks.sort((a, b) => b.priority - a.priority);
}

async function generateExecutivePdf() {
   const report = currentMeeting.report;
   const html = await MeetMindPDF.generate(report);
   const pdfRoot = document.createElement("div");
   pdfRoot.className = "pdf-root";
   pdfRoot.innerHTML = html;
   document.body.appendChild(pdfRoot);
    
    pdfRoot.style.background = "#ffffff";
    document.body.style.background = "#ffffff";
    pdfRoot.style.position = "absolute";
    pdfRoot.style.left = "0";
    pdfRoot.style.top = "0";
    
   pdfRoot.style.width = PDF_CONFIG.pageWidth + 'px';
   pdfRoot.style.height = PDF_CONFIG.pageHeight + 'px';
   
await new Promise(resolve => setTimeout(resolve, 500));
    const filename =
        sanitizePdfFilename(getPdfTitle()) +
        PDF_CONFIG.fileSuffix;
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
    try {
        await html2pdf()
            .set(options)
            .from(pdfRoot.querySelector(".mm-report"))
            .save();
}  finally {
    pdfRoot.remove();
}
}
    
