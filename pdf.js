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

function layoutBlocks(blocks, theme) {
    const layout = {
      fullWidth: [],
      left: [],
      right: [],
      leftHeight: 0,
      rightHeight: 0
    };
    
    for (const block of blocks) {
        if (
            block.type === 'summary' ||
            block.type === 'metrics'
        ) {
            layout.fullWidth.push(block);
            continue;
        }
       const height = estimateBlockHeight(block);

if (layout.leftHeight <= layout.rightHeight) {
    layout.left.push(block);
    layout.leftHeight += height;
} else {
    layout.right.push(block);
    layout.rightHeight += height;
}
    }
    return layout;
}

function estimateBlockHeight(block) {
    switch (block.type) {
        case 'summary':
            return 8 + (block.items[0]?.title?.length || 0) * 0.03;
        case 'metrics':
            return 10;
        case 'insights':
            return block.items.length * 6;
        case 'tasks':
            return block.items.length * 5;
        case 'decisions':
            return block.items.length * 4;
        case 'risks':
            return block.items.length * 4;
        default:
            return block.items.length * 5;
    }
}


function calculateLayoutScore(blocks) {
    let score = 0;
    blocks.forEach(block => {
        if (block.type === 'summary') {
            score += (block.items[0]?.title?.length || 0) * 0.03;
            return;
        }
        score += block.items.length * 6;
        block.items.forEach(item => {
            score += (item.title?.length || 0) * 0.02;
        });
    });
    return Math.round(score);
}
function choosePdfTheme(score) {
    if (score < 50) {
        return 'xl';
    }
    if (score < 80) {
        return 'l';
    }
    if (score < 110) {
        return 'm';
    }
    return 's';
}

function renderPdfBlock(block) {

    if (block.type === 'summary') {
        return `
            <div class="pdf-card pdf-card-summary">
                <h2>${block.title}</h2>
                <p>${block.items[0].title}</p>
            </div>
        `;
    }

    if (block.type === 'metrics') {
    return `
        <div class="pdf-card">
            <h2>${block.title}</h2>
            <div class="pdf-metrics">
                ${block.items.map(metric => `
                    <div class="pdf-metric">
                        <div class="pdf-metric-label">
                            ${metric.title || ''}
                        </div>
                        <div class="pdf-metric-value">
                            ${metric.value || ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

    const compact =
    window.currentPdfTheme === 'l' ||
    window.currentPdfTheme === 'm';

    return `
<div class="pdf-card">
    <h2>${block.title}</h2>
    ${
        compact
        ?
        `
        <div class="pdf-list-compact">
            ${block.items.map(item=>`
                <div class="pdf-list-item">
                    <strong>${item.title}</strong>
                    ${
                        item.details
                        ? `<div>${item.details}</div>`
                        : ''
                    }
                </div>
            `).join('')}
        </div>
        `
        :
        `
        <ul>
            ${block.items.map(item=>`
                <li>
                    <strong>${item.title}</strong>
                    ${
                        item.details
                        ? `<div>${item.details}</div>`
                        : ''
                    }
                </li>
            `).join('')}
        </ul>
        `
    }
</div>
`;
    
}

function createPdfDOM() {
    const root = document.createElement('div');
    const report = currentMeeting?.report || {};
    const blocks = buildPdfBlocks(report);
    const layoutScore = calculateLayoutScore(blocks);
    const theme = choosePdfTheme(layoutScore);
    console.log("PDF Theme:", theme);
    console.log("Layout Score:", layoutScore);
    window.currentPdfTheme = theme;
    const layout = layoutBlocks(blocks, theme);
    
    root.className = 'pdf-root';
    root.innerHTML = `
        <div class="pdf-slide pdf-theme-${theme}">
            <div class="pdf-header">
                <div class="pdf-brand">
                    <img src="logo.png" alt="MeetMind AI" class="pdf-logo">
                    <span>MeetMind AI</span>
                </div>
                <div class="pdf-label">Executive PDF</div>
            </div>
            
     <div class="pdf-body">
    ${layout.fullWidth.map(renderPdfBlock).join('')}
    <div class="pdf-columns">
        <div class="pdf-column">
            ${layout.left.map(renderPdfBlock).join('')}
        </div>
        <div class="pdf-column">
            ${layout.right.map(renderPdfBlock).join('')}
        </div>
    </div>
</div>

            <div class="pdf-footer">
                <div>Generated by MeetMind AI</div>
                <div>
                    <a href="https://meetmind.ai">meetmind.ai</a>
                    <span>·</span>
                    <a href="https://t.me/meetmind_ai_bot">Open in Telegram</a>
                </div>
            </div>
        </div>
    `;

    return root;
}

async function generateExecutivePdf() {
   const pdfRoot = createPdfDOM();
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
            .from(pdfRoot.querySelector('.pdf-slide'))
            .save();
}  finally {
    pdfRoot.remove();
}
}
    
