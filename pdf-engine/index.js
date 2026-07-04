(function () {

    "use strict";

    const VERSION = "1.1.0";

    async function generate(report, options = {}) {

        console.log("🚀 MeetMind PDF Engine", VERSION);

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
