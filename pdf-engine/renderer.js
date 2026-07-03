(function () {

    "use strict";

    window.PDFRenderer = {

        render(report){

            console.log("Renderer started");

            const html = this.renderPage(report);

            return html;

        },

        renderPage(report){

            return `
                <div class="mm-report">

                    ${this.renderHeader(report)}

                    ${this.renderStatistics(report)}

                    ${this.renderSummary(report)}

                    ${this.renderStrategicFindings(report)}

                    ${this.renderTasks(report)}

                    ${this.renderOwners(report)}

                    ${this.renderArchitecture(report)}

                    ${this.renderTranscript(report)}

                    ${this.renderFooter(report)}

                </div>
            `;

        },

      renderHeader(report){
    return HeaderRenderer.render(report);
},

renderStatistics(report){
    const stats = [

        {
            label: "Duration",
            value:
                report?.duration ||
                report?.meeting_duration ||
                "-"
        },

        {
            label: "Participants",
            value:
                report?.participants ||
                report?.participant_count ||
                "-"
        },

        {
            label: "Tasks",
            value:
                report?.tasks?.length ?? 0
        },
        
        {
            label: "Decisions",
            value:
                report?.decisions?.length ?? 0
        }
    ];
    return this.section(
        "",
        `
            <div class="mm-stats-grid">
                ${stats.map(stat => this.card(`
                    <div class="mm-stat">
                        <div class="mm-stat-value">
                            ${this.escape(String(stat.value))}
                        </div>

                        <div class="mm-stat-label">
                            ${this.escape(stat.label)}
                        </div>
                    </div>
                `)).join("")}
            </div>
        `,
        "mm-statistics-section"
    );
},
        

        renderSummary(report){

    const summary =
        report?.summary ||
        report?.executive_brief ||
        report?.data?.text ||
        "";
    if(!summary){
        return "";
    }

    return this.section(
        "Executive Summary",
        this.card(`
            <p class="mm-pdf-summary-text">
                ${this.escape(summary)}
            </p>
        `),
        "mm-pdf-summary-section"
    );
},
        
       renderStrategicFindings(report){

    const findings = report?.layout?.findings;
    if(!findings){
        return "";
    }

    return this.section(
        findings.title || "Strategic Findings",
        findings.rows.map(row => `
            <div class="mm-findings-row">
              ${row.blocks.map(block =>
    this.renderBlock(block)
).join("")}

            </div>
        `).join(""),
        "mm-strategic-findings"
    );
},
        
        renderTasks(){

            return "";

        },

        renderOwners(){

            return "";

        },

        renderArchitecture(){

            return "";

        },

        renderTranscript(){

            return "";

        },

        renderFooter(){

            return "";

        },



        escape(value){
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
},

section(title, content, className = ""){
    return `
        <section class="mm-pdf-section ${className}">
            ${title ? `<h2 class="mm-pdf-section-title">${this.escape(title)}</h2>` : ""}
            ${content || ""}
        </section>
    `;
},

card(content, className = ""){

    return `

        <div class="mm-pdf-card ${className}">

            ${content || ""}

        </div>

    `;

},

badge(label, className = ""){

    return `

        <span class="mm-pdf-badge ${className}">

            ${this.escape(label)}

        </span>

    `;

},

renderBlock(block){
    if(!block){
        return "";
    }

    return this.card(`
        <strong>${this.escape(block.title || block.type || "Block")}</strong>
    `);
},
        
    };

})();
