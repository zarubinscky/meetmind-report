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

    function renderMeetingMetrics(items) {

    if (!items.length) {
        return "";
    }

    return `
        <div class="mm-section">

            <div class="mm-section-title">
                Key Metrics
            </div>

            <div class="mm-key-metrics">

                ${items.map(item => `
                    <div class="mm-key-metric">

                        <span class="mm-key-metric-label">
                            ${RenderHelpers.escape(item.label)}
                        </span>

                        <span class="mm-key-metric-value">
                            ${RenderHelpers.escape(String(item.value))}
                        </span>

                    </div>
                `).join("")}

            </div>

        </div>
    `;
}

  function buildStatisticsModel(statisticsBlock) {
    const items = statisticsBlock?.data?.items || [];
    return {
        title: statisticsBlock?.title || "",

        items,

        documentItems: items.filter(
            item => item.source === "key_metric"
        ),

        meetingItems: items.filter(
            item => item.source !== "key_metric"
        )
    };
}

function renderDefault(model) {
    return `
    ${renderCards(model.documentItems, "default")}
    ${renderMeetingMetrics(model.meetingItems)}
`;
}

function renderCompact(model) {
    return renderCompactCards(model.documentItems);
}

function renderDense(model) {
    return renderCards(model.documentItems, "dense");
}

function renderInline(model) {
    return renderCards(model.documentItems, "inline");
}
    
    const renderStrategies = {
    default: renderDefault,
    compact: renderCompact,
    dense: renderDense,
    inline: renderInline
    };

    window.StatisticsRenderer = {
        render(report, options = {}) {
        console.log("=== STATISTICS OPTIONS ===");
        console.log(options);
console.log("=== STATISTICS LAYOUT MODES ===");
console.log(options?.layoutModes);

console.log("=== STATISTICS MODE VALUE ===");
console.log(options?.layoutModes?.statistics);   
            
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
            console.log("STATISTICS MODEL:", model);
          
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
