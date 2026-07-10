(function () {

    "use strict";

    window.HeaderRenderer = {

       render(report, options = {}){

            const title =
                report?.title ||
                report?.meeting_title ||
                report?.name ||
                "Meeting Report";

            const date =
                report?.date ||
                report?.meeting_date ||
                "";
           
           const mode =
               options.layoutModes?.header ??
               "default";
           
               console.log("Header mode:", mode);
           
           if (mode === "compact") {
              return RenderHelpers.section(
              "",
             RenderHelpers.card(`
                <div class="mm-header mm-header-compact">
                <div class="mm-logo">
                    MeetMind AI
                </div>
                <h1 class="mm-report-title">
                    ${RenderHelpers.escape(title)}
                </h1>
            </div>
        `),
        "mm-header-section"
    );

}
           
           return RenderHelpers.section(
             "",
    RenderHelpers.card(`
        <div class="mm-header">
            <div class="mm-header-left">
                <div class="mm-logo">
                    MeetMind AI
                </div>
            </div>
            <div class="mm-header-right">
                <h1 class="mm-report-title">
                    ${RenderHelpers.escape(title)}
                </h1>
                ${
                    date
                        ? `<div class="mm-report-date">${RenderHelpers.escape(date)}</div>`
                        : ""
                }
            </div>
        </div>
    `),
    "mm-header-section"
);

        }

    };

})();
