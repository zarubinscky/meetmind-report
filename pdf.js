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

const PDF_BUILDER_DEFAULT = {
    header: true,
    statistics: true,
    summary: true,
    findings: true,
    tasks: true,
    owners: true,
    architecture: true,
    footer: true
};

let pdfBuilderOptions = {
    ...PDF_BUILDER_DEFAULT
};

function resetPdfBuilderOptions() {
    pdfBuilderOptions = {
        ...PDF_BUILDER_DEFAULT
    };
}

function setPdfBuilderOptions(options) {
    pdfBuilderOptions = {
        ...PDF_BUILDER_DEFAULT,
        ...options
    };
}

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

async function generateExecutivePdf() {
   const report = currentMeeting.report;
   const html = await MeetMindPDF.generate(report);
   const pdfRoot = document.createElement("div");
   pdfRoot.className = "pdf-root";
   pdfRoot.innerHTML = html;
   document.body.appendChild(pdfRoot);
    
    pdfRoot.style.background = "#ffffff";
    pdfRoot.style.position = "fixed";
    pdfRoot.style.left = "-100000px";
    pdfRoot.style.top = "0";
    pdfRoot.style.pointerEvents = "none";
    pdfRoot.style.zIndex = "-1";
    
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

function showPdfBuilder() {
    Modal.show({
        title: "Export PDF",

        content: `
            <div class="mm-pdf-options">

                <label class="mm-option">
                    <input type="checkbox" checked>
                    <span>Header</span>
                </label>

                <label class="mm-option">
                    <input type="checkbox" checked>
                    <span>Statistics</span>
                </label>

                <label class="mm-option">
                    <input type="checkbox" checked>
                    <span>Executive Summary</span>
                </label>

                <label class="mm-option">
                    <input type="checkbox" checked>
                    <span>Insights</span>
                </label>

                <label class="mm-option">
                    <input type="checkbox" checked>
                    <span>Tasks</span>
                </label>

                <label class="mm-option">
                    <input type="checkbox" checked>
                    <span>Owners</span>
                </label>

                <label class="mm-option">
                    <input type="checkbox" checked>
                    <span>Architecture</span>
                </label>
                <label class="mm-option">
                    <input type="checkbox" checked>
                    <span>Footer</span>
                </label>
            </div>
        `,

        actions: [
            {
                id: "cancel",
                label: "Cancel"
            },
            {
                id: "export",
                label: "Export PDF",
                className: "mm-modal-button-primary"
            }
        ]
    });
}
    

    
