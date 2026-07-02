(function () {
    "use strict";

    function generateCandidates(findings) {

        const count = findings.length;

        if (count === 1) {

            return [
                {
                    name: "single",
                    rows: [
                        findings
                    ]
                }
            ];

        }

        if (count === 2) {

            return [

                {
                    name: "two-columns",
                    rows: [
                        findings
                    ]
                },

                {
                    name: "stacked",
                    rows: [
                        [findings[0]],
                        [findings[1]]
                    ]
                }

            ];

        }

        if (count === 3) {

            return [

                {
                    name: "three-equal-row",
                    rows: [
                        findings
                    ]
                },

                {
                    name: "dominant-first",
                    rows: [
                        [findings[0]],
                        [findings[1], findings[2]]
                    ]
                },

                {
                    name: "first-two-then-third",
                    rows: [
                        [findings[0], findings[1]],
                        [findings[2]]
                    ]
                },

                {
                    name: "stacked",
                    rows: [
                        [findings[0]],
                        [findings[1]],
                        [findings[2]]
                    ]
                }

            ];

        }

        return [];

    }

    window.LayoutSearchEngine = {

        generateCandidates,

        search(layout) {

            const findings = layout.findings.rows
                ? layout.findings.rows.flatMap(r => r.blocks)
                : [];

            const candidates = generateCandidates(findings);

            layout.findings.candidates = candidates;

            return layout;

        }

    };

    console.log("✅ Layout Search Engine loaded.");

})();
