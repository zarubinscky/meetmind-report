(function () {

    "use strict";

    window.OwnersRenderer = {

        render(report, options = {}) {

            const owners = report?.owners ?? [];

            const mode =
            options.layoutModes?.owners ??
            "cards";

            console.log("Owners mode:", mode);
            
            if(!owners.length){
                return "";
            }

            return RenderHelpers.section(

                "Owners",

                owners.map(owner =>

                    RenderHelpers.card(`

                        <div class="mm-owner">

                            ${RenderHelpers.escape(
                                owner.name ||
                                owner.owner ||
                                owner.text ||
                                ""
                            )}

                        </div>

                    `)

                ).join(""),

                "mm-owners-section"

            );

        }

    };

})();
