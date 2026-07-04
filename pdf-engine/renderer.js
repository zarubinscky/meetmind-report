(function () {

    "use strict";

    window.PDFRenderer = {

       render(report, options = {}) {
            console.log("Renderer started");
            const html = this.renderPage(report);
           
            return html;

        },

        renderPage(report){

            return `
    <div class="mm-report">
    ${options.header !== false
        ? this.renderHeader(report)
        : ""}

    ${options.statistics !== false
        ? this.renderStatistics(report)
        : ""}

    ${options.summary !== false
        ? this.renderSummary(report)
        : ""}

    ${options.findings !== false
        ? this.renderStrategicFindings(report)
        : ""}

    ${options.tasks !== false
        ? this.renderTasks(report)
        : ""}

    ${options.owners !== false
        ? this.renderOwners(report)
        : ""}

    ${options.architecture !== false
        ? this.renderArchitecture(report)
        : ""}

    ${options.footer !== false
        ? this.renderFooter(report)
        : ""}
</div>
`;

        },

      renderHeader(report){
    return HeaderRenderer.render(report);
},
renderStatistics(report){
    return StatisticsRenderer.render(report);
},
      renderSummary(report){
    return SummaryRenderer.render(report);

},
      renderStrategicFindings(report){
    return FindingsRenderer.render(report);

},
        renderTasks(report){
    return TasksRenderer.render(report);
},
       renderOwners(report){
    return OwnersRenderer.render(report);
},
        renderArchitecture(report){
    return ArchitectureRenderer.render(report);
},
        renderFooter(report){
    return FooterRenderer.render(report);
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

        
    };

})();
