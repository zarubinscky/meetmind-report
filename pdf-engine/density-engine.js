// MeetMind PDF Engine
(function () {

    "use strict";

    function chooseDensity(measurement) {

        if (measurement.overflow <= 0) {
            return "normal";
        }

        if (measurement.overflow <= 300) {
            return "compact";
        }

        return "ultra";

    }

    function optimize(layout) {
        return layout;
    }

    function getDensityLevel(blockId, options) {
    const modeId =
        options?.layoutModes?.[blockId];

    if (!modeId) {
        return 0;
    }

    const mode =
        LayoutRegistry.getMode(
            blockId,
            modeId
        );

    return mode?.level ?? 0;
}

    
    window.DensityEngine = {
        version: "1.0.0",
        optimize,
        chooseDensity,
        getDensityLevel
    };

    console.log("✅ Density Engine loaded.");

})();
