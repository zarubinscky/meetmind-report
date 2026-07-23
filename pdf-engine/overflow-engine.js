(function () {

    "use strict";

   function chooseLayout(
    measurement,
    report
) {

    const candidates =
        LayoutSearchEngine
            .generateAdaptiveCandidates(
                report
            );

    let modes =
    candidates[0];

if (measurement.overflow <= 0) {
    return modes;
}

const betterCandidate =
    candidates.find(candidate => {

        const penalty =
            LayoutSearchEngine.calculatePenalty(candidate);

        return penalty >
            LayoutSearchEngine.calculatePenalty(modes);

    });

if (betterCandidate) {
    modes = betterCandidate;
}

        if (measurement.overflow > 200) {
            modes.statistics = "compact";
        }

        if (measurement.overflow > 400) {
            modes.tasks = "compact";
        }

        if (measurement.overflow > 600) {
            modes.findings = "compact";
        }

        if (measurement.overflow > 800) {
            modes.owners = "compact";
        }

        if (measurement.overflow > 1200) {
            modes.owners = "inline";
        }

        return modes;

    }

    window.OverflowEngine = {

        version: "1.0.0",

        chooseLayout

    };

    console.log("✅ Overflow Engine loaded.");

})();
