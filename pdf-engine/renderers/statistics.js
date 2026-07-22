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

            const densityClass =
              `mm-density-level-${level}`;
            
           const statisticsBlock =
           BlockRegistry
           .getBlocks(report)
           .find((block) =>
           block.type === "statistics"
           );

          const stats =
          statisticsBlock?.data?.items || [];

          if (!stats.length) {
          return "";
          }

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

                `mm-statistics-section ${densityClass}`

            );

        }

    };

})();
