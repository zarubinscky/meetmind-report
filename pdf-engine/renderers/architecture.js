(function () {

    "use strict";

    window.ArchitectureRenderer = {

        render(report, options = {}) {

            const architecture =
            DocumentModelBuilder.buildArchitectureModel(report);

           if (!architecture?.sections?.length) {
           return "";
           }

            const sections = architecture.sections;

            const level =
              DensityEngine.getDensityLevel(
            "architecture",
            options
            );

            const mode =
            options.layoutModes?.architecture ??
            "cards";

            const effectiveMode =
                level >= 2
                  ? "inline"
                  : level >= 1
                     ? "compact"
                     : mode;

            console.log(
            "Architecture density level:",
            level
            );


            if (mode === "compact") {
    return RenderHelpers.section(
        architecture.title || "Architecture & Process",
        sections.map(section => this.renderSection(section, effectiveMode)).join(""),
        "mm-architecture-section mm-architecture-compact-section"
    );
}
            
            return RenderHelpers.section(

                architecture.title || "Architecture & Process",

                sections
                    .map(section => this.renderSection(section, effectiveMode))
                    .join(""),

                "mm-architecture-section"

            );

        },

        renderSection(section, mode) {

           const cards = section.cards;

            if (mode === "inline") {

                return `
                    <div class="mm-architecture-inline">

                        <strong>
                            ${RenderHelpers.escape(section.title)}
                        </strong>

                        : ${cards.map(card =>
                            RenderHelpers.escape(card.title)
                        ).join(" • ")}

                    </div>
                `;

            }

           if (mode === "compact") {

    return `
        <div class="mm-architecture-compact">
            <strong>
                ${RenderHelpers.escape(section.title)}
            </strong>
            <span class="mm-architecture-inline-items">
                ${cards
                    .map(card =>
                        RenderHelpers.escape(card.title)
                    )
                    .join(" • ")}
            </span>
        </div>
    `;
}

            return RenderHelpers.card(`

                <div class="mm-architecture-section">

                    <h3 class="mm-architecture-title">

                        ${RenderHelpers.escape(section.title)}

                    </h3>

                    <div class="mm-architecture-grid">

                        ${cards.map(card => `

                            <div class="mm-architecture-card">

                                <div class="mm-architecture-card-title">

                                    ${RenderHelpers.escape(card.title)}

                                </div>

                                ${card.description
                                    ? `
                                        <div class="mm-architecture-card-text">

                                            ${RenderHelpers.escape(card.description)}

                                        </div>
                                    `
                                    : ""}

                            </div>

                        `).join("")}

                    </div>

                </div>

            `);

        }

    };

})();
