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

    window.DensityEngine = {
        version: "1.0.0",
        chooseDensity
    };

    console.log("✅ Density Engine loaded.");

})();
