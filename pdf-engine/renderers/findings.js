(function () {

    "use strict";
    window.FindingsRenderer = {

        render(report, options = {}) {

            const findings = report?.layout?.findings;

            if (!findings) {
                return "";
            }

            const mode =
                options.layoutModes?.findings ??
                "cards";

            console.log("Findings mode:", mode);

            return RenderHelpers.section(

                findings.title || "Strategic Findings",

                findings.rows.map(row => `
                    <div class="mm-findings-row">
                        ${row.blocks
                            .map(block => this.renderBlock(block, mode))
                            .join("")}
                    </div>
                `).join(""),

                "mm-strategic-findings"

            );

        },

        renderBlock(block, mode) {

            if (!block) {
                return "";
            }

            switch (block.type) {

                case "findings":
                    return this.renderFindingsBlock(block, mode);

                default:

                    if (mode === "compact") {

                        return `
                            <div class="mm-findings-compact">
                                <strong>${RenderHelpers.escape(
                                    block.title ||
                                    block.type ||
                                    "Block"
                                )}</strong>
                            </div>
                        `;
                    }

                    return RenderHelpers.card(`
                        <strong>
                            ${RenderHelpers.escape(
                                block.title ||
                                block.type ||
                                "Block"
                            )}
                        </strong>
                    `);

            }

        },

        renderFindingsBlock(block, mode) {

            if (mode === "compact") {

                return `
                    <div class="mm-findings-compact">

                        ${
                            block.title
                                ? `<strong>${RenderHelpers.escape(block.title)}</strong>`
                                : ""
                        }

                        ${
                            block.items?.length
                                ? `
                                    <div class="mm-findings-inline">
                                        ${block.items
                                            .map(item => RenderHelpers.escape(item))
                                            .join(" • ")}
                                    </div>
                                `
                                : ""
                        }

                    </div>
                `;
            }

            return RenderHelpers.card(`

                <div class="mm-findings-block">

                    ${
                        block.title
                            ? `<h3>${RenderHelpers.escape(block.title)}</h3>`
                            : ""
                    }

                    ${
                        block.items?.length
                            ? `
                                <ul>
                                    ${block.items.map(item => `
                                        <li>${RenderHelpers.escape(item)}</li>
                                    `).join("")}
                                </ul>
                            `
                            : ""
                    }

                </div>

            `);

        }

    };

})();
