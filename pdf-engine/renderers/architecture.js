(function () {

    "use strict";

    window.ArchitectureRenderer = {

        render(report){

            const architecture =
                report?.architecture ||
                report?.layout?.architecture ||
                null;

            if(!architecture){
                return "";
            }

            const sections =
                architecture.sections ||
                architecture.blocks ||
                architecture.items ||
                [];

            if(!sections.length){
                return "";
            }

            return RenderHelpers.section(

                architecture.title || "Architecture & Process",

                sections.map(section =>

                    RenderHelpers.card(`

                        <div class="mm-architecture-section">

                            <h3 class="mm-architecture-title">
                                ${RenderHelpers.escape(section.title || section.name || "Architecture Section")}
                            </h3>

                            <div class="mm-architecture-grid">

                                ${(section.cards || section.items || []).map(card => `

                                    <div class="mm-architecture-card">

                                        <div class="mm-architecture-card-title">
                                            ${RenderHelpers.escape(card.title || card.name || "")}
                                        </div>

                                        ${
                                            card.description || card.text
                                                ? `
                                                    <div class="mm-architecture-card-text">
                                                        ${RenderHelpers.escape(card.description || card.text)}
                                                    </div>
                                                `
                                                : ""
                                        }

                                    </div>

                                `).join("")}

                            </div>

                        </div>

                    `)

                ).join(""),

                "mm-architecture-section"

            );

        }

    };

})();
