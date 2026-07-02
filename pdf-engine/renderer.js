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

        renderHeader(){

            return "";

        },

        renderStatistics(){

            return "";

        },

        renderSummary(){

            return "";

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

        }

    };

})();
