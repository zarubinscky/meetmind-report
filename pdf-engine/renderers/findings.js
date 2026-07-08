(function () {

    "use strict";

    window.FindingsRenderer = {

        render(report, options = {}) {

            const mode =
                options.layoutModes?.findings ??
                "cards";

            console.log("Findings mode:", mode);

            const blocks = [];

            if (
               report.executive_brief &&
               !options.hideExecutiveBrief
            ) {
                blocks.push({
               title: "Executive Brief",
              items: [report.executive_brief]
             });
             }

            if (report.insights?.length) {
                blocks.push({
                    title: "Insights",
                    items: report.insights
                });
            }

            if (report.dependencies?.length) {
                blocks.push({
                    title: "Dependencies",
                    items: report.dependencies
                });
            }

            if (report.decisions?.length) {
                blocks.push({
                    title: "Decisions",
                    items: report.decisions
                });
            }

            if (report.risks?.length) {
                blocks.push({
                    title: "Risks",
                    items: report.risks
                });
            }

            if (!blocks.length) {
                return "";
            }

            return RenderHelpers.section(

    "Strategic Findings",
  mode === "adaptive"
    ? this.renderAdaptive(
        blocks,
        options.layoutModes?.findingsLayout
    )
    : blocks.map(block =>
        this.renderBlock(
            block,
            mode,
            options.layoutModes?.findingsLayout
        )
    ).join(""),
    "mm-strategic-findings"
);

        },

        renderBlock(block, mode, layout) {

            if (mode === "inline") {

                return `
                    <div class="mm-findings-inline">
                        <strong>${RenderHelpers.escape(block.title)}</strong>:
                        ${block.items
                            .map(item => RenderHelpers.escape(
                                typeof item === "string"
                                    ? item
                                    : item.title || item.text || JSON.stringify(item)
                            ))
                            .join(" • ")}
                    </div>
                `;

            }


            if (mode === "compact") {
                return `
                    <div class="mm-findings-compact">

                        <strong>${RenderHelpers.escape(block.title)}</strong>

                        <div class="mm-findings-inline">

                            ${block.items
                                .map(item => RenderHelpers.escape(
                                    typeof item === "string"
                                        ? item
                                        : item.title || item.text || JSON.stringify(item)
                                ))
                                .join(" • ")}

                        </div>

                    </div>
                `;

            }

            return RenderHelpers.card(`

                <div class="mm-findings-block">

                    <h3>${RenderHelpers.escape(block.title)}</h3>

                    <ul>

                        ${block.items.map(item => `
                            <li>
                                ${RenderHelpers.escape(
                                    typeof item === "string"
                                        ? item
                                        : item.title || item.text || JSON.stringify(item)
                                )}
                            </li>
                        `).join("")}

                    </ul>

                </div>

            `);

        },

renderAdaptive(blocks, layout) {
    console.log("Render adaptive findings:", layout);
    if (!layout || !layout.rows) {
        return blocks.map(block =>
            this.renderBlock(block, "cards")
        ).join("");
    }

    return layout.rows.map(row => `
        <div class="mm-findings-adaptive-row">
            ${row.blocks.map(block => `
                <div class="mm-findings-adaptive-cell">
                    ${this.renderBlock(block, "cards")}
                </div>
            `).join("")}
        </div>
    `).join("");
}

    };

})();
