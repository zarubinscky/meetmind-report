(function () {

    "use strict";

    window.OwnersRenderer = {

      render(report, options = {}) {

    const owners = report?.owners ?? [];

    const level =
     DensityEngine.getDensityLevel(
        "owners",
        options
    );

    const mode =
      options.layoutModes?.owners ??
      "cards";

    if (mode === "hidden") {
      return "";
    }

    console.log(
    "Owners density level:",
    level
    );

    if (!owners.length) {
        return "";
    }

    let content = "";

    switch (level) {

        case 2:

            content = `
                <div class="mm-owners-inline">
                    ${owners.map(owner =>
                        `<span class="mm-owner-inline">
                            ${RenderHelpers.escape(owner.name)}
                        </span>`
                    ).join(", ")}
                </div>
            `;

            break;

     case 1:

    content = `
        <div class="mm-owners-inline">
            ${owners.map(owner =>
                RenderHelpers.escape(owner.name)
            ).join(" • ")}
        </div>
    `;

    break;

        default:

            content = owners.map(owner =>
                RenderHelpers.card(`
                    <div class="mm-owner">
                       ${RenderHelpers.escape(owner.name)}
                    </div>
                `)
            ).join("");
    }

    return RenderHelpers.section(
        "Owners",
        content,
        "mm-owners-section"
    );
}

    };

})();
