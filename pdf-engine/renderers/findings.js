(function () {

    "use strict";

    window.FindingsRenderer = {

        render(report){

            const findings = report?.layout?.findings;

            if(!findings){
                return "";
            }

            return RenderHelpers.section(

                findings.title || "Strategic Findings",

                findings.rows.map(row =>

                    `
                        <div class="mm-findings-row">

                            ${row.blocks
                                .map(block => this.renderBlock(block))
                                .join("")}

                        </div>
                    `

                ).join(""),

                "mm-strategic-findings"

            );

        },

        renderBlock(block){

            if(!block){
                return "";
            }

            switch(block.type){

                case "findings":

                    return this.renderFindingsBlock(block);

                default:

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

        renderFindingsBlock(block){

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

                                        <li>

                                            ${RenderHelpers.escape(item)}

                                        </li>

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
