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
    console.log("===== LAYOUT =====");
    console.dir(layout, { depth: null });
    console.log("blocks:", blocks);

    if (!layout?.rows?.length) {
        return blocks.map(block =>
            this.renderBlock(block, "cards")
        ).join("");
    }

    return layout.rows.map(row => {
        const cells = row.blocks.map(item => {
        const width =
          item.id === "decisions"
            ? "58%"
            : item.id === "risks"
                ? "42%"
                : "50%";

            const itemHtml = (item.items || []).map(entry => {

                const title = RenderHelpers.escape(
                  entry.title ||
                  entry.item ||
                  entry.name ||
                  ""
                );

                const detailsValue =
                 entry.details ||
                 entry.depends_on ||
                 entry.description ||
                 entry.text ||
                  "";

                 const details = detailsValue
                   ? `<div>${RenderHelpers.escape(detailsValue)}</div>`
                   : "";

                return `
                    <div class="mm-finding-item">
                        <strong>${title}</strong>
                        ${details}
                    </div>
                `;

            }).join("");

            return `
                <div class="mm-findings-adaptive-cell" style="flex-basis:${width};">
                    ${RenderHelpers.card(`
                        <h3>${RenderHelpers.escape(item.title)}</h3>
                        ${itemHtml}
                    `)}
                </div>
            `;

        }).join("");

        return `
             <div class="mm-findings-adaptive-row">
             
                ${cells}
            </div>
        `;

    }).join("");
},

    };

})();
