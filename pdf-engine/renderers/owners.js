(function () {

    "use strict";

    window.OwnersRenderer = {

      render(report, options = {}) {

    const owners = report?.owners ?? [];

    const mode =
        options.layoutModes?.owners ??
        "cards";

          if (mode === "hidden") {
    return "";
}

    console.log("Owners mode:", mode);

    if (!owners.length) {
        return "";
    }

    let content = "";

    switch (mode) {

        case "inline":

            content = `
                <div class="mm-owners-inline">
                    ${owners.map(owner =>
                        `<span class="mm-owner-inline">
                            ${RenderHelpers.escape(
                                owner.name ||
                                owner.owner ||
                                owner.text ||
                                ""
                            )}
                        </span>`
                    ).join(", ")}
                </div>
            `;

            break;

     case "compact":

    content = `
        <div class="mm-owners-inline">
            ${owners.map(owner =>
                RenderHelpers.escape(
                    owner.name ||
                    owner.owner ||
                    owner.text ||
                    ""
                )
            ).join(" • ")}
        </div>
    `;

    break;

        default:

            content = owners.map(owner =>
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
