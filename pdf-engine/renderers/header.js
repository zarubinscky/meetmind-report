(function () {

    "use strict";

    window.HeaderRenderer = {

        render(report){

            const title =
                report?.title ||
                report?.meeting_title ||
                report?.name ||
                "Meeting Report";

            const date =
                report?.date ||
                report?.meeting_date ||
                "";

            return `
                <section class="mm-pdf-section mm-header-section">

                    <div class="mm-pdf-card">

                        <div class="mm-header">

                            <div class="mm-header-left">

                                <div class="mm-logo">
                                    MeetMind AI
                                </div>

                            </div>

                            <div class="mm-header-right">

                                <h1 class="mm-report-title">
                                    ${title}
                                </h1>

                                ${
                                    date
                                    ? `<div class="mm-report-date">${date}</div>`
                                    : ""
                                }

                            </div>

                        </div>

                    </div>

                </section>
            `;

        }

    };

})();
