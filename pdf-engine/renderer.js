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
    const title =
        report?.title ||
        report?.meeting_title ||
        report?.name ||
        "Meeting Report";

    const date =
        report?.date ||
        report?.meeting_date ||
        "";

    return this.section(
        "",
        this.card(`
            <div class="mm-header">
                <div class="mm-header-left">
                    <div class="mm-logo">
                        MeetMind AI
                    </div>
                </div>
                <div class="mm-header-right">
                    <h1 class="mm-report-title">
                        ${this.escape(title)}
                    </h1>

                    ${
                        date
                        ? `<div class="mm-report-date">${this.escape(date)}</div>`
                        : ""
                    }
                </div>
            </div>
        `),
        "mm-header-section"
    );
},

        renderStatistics(){

            return "";

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
        
        renderStrategicFindings(){
            return "";
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

}

    };

})();
