(function () {
    "use strict";

    function renderCards(stats) {
        return `
            <div class="mm-stats-grid">
                ${stats.map((stat) =>
                    RenderHelpers.card(`
                        <div class="mm-stat">
                            <div class="mm-stat-value">
                                ${RenderHelpers.escape(
                                    String(stat.value)
                                )}
                            </div>

                            <div class="mm-stat-label">
                                ${RenderHelpers.escape(
                                    stat.label
                                )}
                            </div>
                        </div>
                    `)
                ).join("")}
            </div>
        `;
    }

  function buildStatisticsModel(statisticsBlock) {
    return {
        title: statisticsBlock?.title || "",
        items: statisticsBlock?.data?.items || []
    };
}

function renderDefault(model) {
    return renderCards(model.items);
}
    
function renderCompact(model) {
    return renderCards(model.items);
}

function renderDense(model) {
    return renderCards(model.items);
}

function renderInline(model) {
    return renderCards(model.items);
}
    
    const renderStrategies = {
    default: renderDefault,
    compact: renderCompact,
    dense: renderDense,
    inline: renderInline
    };

    window.StatisticsRenderer = {
        render(report, options = {}) {
         const mode =
         options?.layoutModes?.statistics ??
         "default";

           console.log(
           "Statistics mode:",
           mode
           );

            const statisticsBlock =
                BlockRegistry
                    .getBlocks(report)
                    .find(
                        (block) =>
                            block.type ===
                            "statistics"
                    );
            
           const model =
            buildStatisticsModel(statisticsBlock);
          
            if (!model.items.length) {
           return "";
           }

            const renderStrategy =
              renderStrategies[mode] ??
              renderStrategies.default;

            return RenderHelpers.section(
                "",
                renderStrategy(model),
                "mm-statistics-section"
            );
        }
    };
})();
