(function () {

    "use strict";
    const VERSION = "1.1.0";

const DEFAULT_PDF_OPTIONS = {
    header: true,
    statistics: true,
    summary: true,
    findings: true,
    tasks: true,
    owners: true,
    architecture: true,
    footer: true
    densityMode: "normal"
};

    
    async function generate(report, options = {}) {
        console.log("🚀 MeetMind PDF Engine", VERSION);

        options = {
    ...DEFAULT_PDF_OPTIONS,
    ...options
};
        
        if (!report) {
            throw new Error("Report is required.");
        }

        const html = PDFRenderer.render(report, options);
        return html;
    }

    window.MeetMindPDF = {
        version: VERSION,
        generate
    };

    console.log("✅ MeetMind PDF Engine loaded.");

})();
