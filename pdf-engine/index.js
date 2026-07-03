(function () {

    "use strict";

    const VERSION = "1.1.0";

    async function generate(report) {

        console.log("🚀 MeetMind PDF Engine", VERSION);

        if (!report) {
            throw new Error("Report is required.");
        }

        const html = PDFRenderer.render(report);

        return html;
    }

    window.MeetMindPDF = {
        version: VERSION,
        generate
    };

    console.log("✅ MeetMind PDF Engine loaded.");

})();
