(function () {

    "use strict";

    function buildSummaryModel(report) {

        return {
            summary:
                report?.summary ||
                report?.meeting_summary ||
                ""
        };

    }

    function renderSummaryModel(model) {

        if (!model.summary) {
            return "";
        }

        return RenderHelpers.section(

            "Executive Summary",

            RenderHelpers.card(

                `
                <div class="mm-summary">
                    ${RenderHelpers.escape(model.summary)}
                </div>
                `

            ),

            "mm-summary-section"

        );

    }

    window.SummaryRenderer = {

        render(report) {

            const model = buildSummaryModel(report);

            return renderSummaryModel(model);

        }

    };

})();
