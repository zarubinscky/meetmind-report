(function () {

    "use strict";

    window.SummaryRenderer = {

        render(report){

            const summary =
                report?.summary ||
                report?.meeting_summary ||
                "";

            if(!summary){
                return "";
            }

            return RenderHelpers.section(

                "Executive Summary",

                RenderHelpers.card(`

                    <div class="mm-summary">

                        ${RenderHelpers.escape(summary)}

                    </div>

                `),

                "mm-summary-section"

            );

        }

    };

})();
