(function () {
    
    "use strict";

    window.FindingsRenderer = {

        render(report, options = {}) {
            const mode =
        options.layoutModes?.findings ??
        "cards";

            console.log("Findings mode:", mode);

            const findings = DocumentModelBuilder.buildFindingsModel(report);
            const blocks = findings.sections;
            
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
                         .map(item =>
                             RenderHelpers.escape(item.title || item.details)
                         )
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
                               .map(item =>
                                   RenderHelpers.escape(item.title || item.details)
                                 )
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
                   <strong>${RenderHelpers.escape(item.title)}</strong>
                      ${
                         item.details
                         ? `<div>${RenderHelpers.escape(item.details)}</div>`
                         : ""
                   }
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

    const blocksMap = new Map(
    blocks.map(block => [block.id, block])
);

    if (!layout?.rows?.length) {
        return blocks.map(block =>
            this.renderBlock(block, "cards")
        ).join("");
    }

    return layout.rows.map(row => {
        const cells = row.blocks.map(item => {
        const block = blocksMap.get(item.id);

    if (!block) {
        return "";
    }
            
        const totalTextLength = block.items.reduce(
    (sum, entry) =>
        sum +
        (entry.title?.length ?? 0) +
        (entry.details?.length ?? 0),
    0
);

const width = totalTextLength > 450
    ? "62%"
    : "38%";

            const itemHtml = block.items.map(entry => {

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
            <h3>${RenderHelpers.escape(block.title)}</h3>
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
