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

    window.DensityEngine = {

        version: "1.0.0",

        optimize,

        chooseDensity

    };

    console.log("✅ Density Engine loaded.");

})();
