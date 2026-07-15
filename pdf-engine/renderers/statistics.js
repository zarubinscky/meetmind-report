(function () {

    "use strict";

    window.StatisticsRenderer = {

        render(report, options = {}){

        const level =
          DensityEngine.getDensityLevel(
          "statistics",
          options
         );

         console.log(
         "Statistics density level:",
          level
          );
            
            const stats = [
                {
                    label: "Duration",
                    value:
                        report?.duration ||
                        report?.meeting_duration ||
                        "-"
                },

                {
                    label: "Participants",
                    value:
                        report?.participants?.length ??
                        report?.participants ??
                        report?.participant_count ??
                        "-"
                },

                {
                    label: "Tasks",
                    value:
                        report?.tasks?.length ?? 0
                },

                {
                    label: "Decisions",
                    value:
                        report?.decisions?.length ?? 0
                }

            ];

            return RenderHelpers.section(

                "",

                `
                    <div class="mm-stats-grid">

                        ${stats.map(stat =>

                            RenderHelpers.card(`

                                <div class="mm-stat">

                                    <div class="mm-stat-value">
                                        ${RenderHelpers.escape(String(stat.value))}
                                    </div>

                                    <div class="mm-stat-label">
                                        ${RenderHelpers.escape(stat.label)}
                                    </div>

                                </div>

                            `)

                        ).join("")}

                    </div>
                `,

                "mm-statistics-section"

            );

        }

    };

})();
