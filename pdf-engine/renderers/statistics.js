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

    /*
     * Пока все уровни используют старый шаблон.
     * На следующих шагах заменим уровни 1 и 2
     * на действительно компактные представления.
     */

function renderDefault(stats, options) {
    return renderCards(stats, options);
}
    
function renderCompact(stats, options) {
    return renderCards(stats, options);
}

function renderDense(stats, options) {
    return renderCards(stats, options);
}

function renderInline(stats, options) {
    return renderCards(stats, options);
}
    
    const renderStrategies = {
    default: renderDefault,
    compact: renderCompact,
    dense: renderDense,
    inline: renderInline
    };

    function getRenderStrategy(level) {
        return (
            renderStrategies[level] ||
            renderStrategies[0]
        );
    }

    window.StatisticsRenderer = {
        render(report, options = {}) {
            const level =
                DensityEngine.getDensityLevel(
                    "statistics",
                    options
                );

            console.log(
                "Statistics density level:",
                level
            );

            const statisticsBlock =
                BlockRegistry
                    .getBlocks(report)
                    .find(
                        (block) =>
                            block.type ===
                            "statistics"
                    );

            const stats =
                statisticsBlock?.data?.items || [];

            if (!stats.length) {
                return "";
            }

            const renderStrategy =
                getRenderStrategy(level);

            return RenderHelpers.section(
                "",
                renderStrategy(stats),
                `mm-statistics-section mm-density-level-${level}`
            );
        }
    };
})();
