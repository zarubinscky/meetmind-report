(function () {
    "use strict";

    function renderCards(stats, mode = "default") {
    const safeMode = [
        "default",
        "compact",
        "dense",
        "inline"
    ].includes(mode)
        ? mode
        : "default";

    return `
        <div class="mm-stats-grid mm-stats-grid--${safeMode}">
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

    function renderCompactCards(stats) {
    return `
        <div class="mm-stats-grid mm-stats-grid--compact">
            ${stats.map((stat) =>
                RenderHelpers.card(`
                    <div class="mm-stat mm-stat--compact">

                        <span class="mm-stat-value">
                            ${RenderHelpers.escape(String(stat.value))}
                        </span>

                        <span class="mm-stat-label">
                            ${RenderHelpers.escape(stat.label)}
                        </span>

                    </div>
                `)
            ).join("")}
        </div>
    `;
}

  function buildStatisticsModel(statisticsBlock) {
  console.log("Statistics Block:", statisticsBlock);
    return {
        title: statisticsBlock?.title || "",
        items: statisticsBlock?.data?.items || []
    };
}

function renderDefault(model) {
    return renderCards(model.items, "default");
}

function renderCompact(model) {
    return renderCompactCards(model.items);
}

function renderDense(model) {
    return renderCards(model.items, "dense");
}

function renderInline(model) {
    return renderCards(model.items, "inline");
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
