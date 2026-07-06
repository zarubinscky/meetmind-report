(function () {

    "use strict";

    function chooseLayout(measurement) {

        const modes = LayoutRegistry.getDefaultModes();

        if (measurement.overflow <= 0) {
            return modes;
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
