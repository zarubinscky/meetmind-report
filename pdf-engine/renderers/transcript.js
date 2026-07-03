(function () {

    "use strict";

    window.TranscriptRenderer = {

        render(report){

            const transcript =
                report?.transcript ||
                report?.meeting_transcript ||
                report?.raw_transcript ||
                report?.text ||
                "";

            if(!transcript){
                return "";
            }

            return RenderHelpers.section(

                "Meeting Transcript",

                RenderHelpers.card(`

                    <div class="mm-transcript">

                        ${RenderHelpers.escape(transcript)}

                    </div>

                `),

                "mm-transcript-section"

            );

        }

    };

})();
