(function () {

    "use strict";

    window.StatisticsRenderer = {

        render(report){

            const duration =
                report?.duration ??
                "";

            const participants =
                report?.participants?.length ??
                report?.participants ??
                0;

            const tasks =
                report?.tasks?.length ??
                0;

            const decisions =
                report?.decisions?.length ??
                0;

            return RenderHelpers.section(

                "Meeting Statistics",

                RenderHelpers.card(`

                    <div class="mm-stats-grid">

                        <div class="mm-stat">
                            <div class="mm-stat-value">${duration}</div>
                            <div class="mm-stat-label">Duration</div>
                        </div>

                        <div class="mm-stat">
                            <div class="mm-stat-value">${participants}</div>
                            <div class="mm-stat-label">Participants</div>
                        </div>

                        <div class="mm-stat">
                            <div class="mm-stat-value">${tasks}</div>
                            <div class="mm-stat-label">Tasks</div>
                        </div>

                        <div class="mm-stat">
                            <div class="mm-stat-value">${decisions}</div>
                            <div class="mm-stat-label">Decisions</div>
                        </div>

                    </div>

                `),

                "mm-statistics-section"

            );

        }

    };

})();
