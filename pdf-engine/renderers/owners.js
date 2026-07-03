(function () {

    "use strict";

    window.OwnersRenderer = {

        render(report){

            const owners = report?.owners ?? [];

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
