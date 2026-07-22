(function () {
    "use strict";

    async function optimize({
        report,
        builderOptions,
        evaluateCandidate,
        pageHeight,
        densityModes = [
            "normal",
            "compact",
            "ultra"
        ]
    }) {
        if (
            typeof evaluateCandidate !== "function"
        ) {
            throw new Error(
                "LayoutOptimizer: evaluateCandidate is required"
            );
        }

        const layoutCandidates =
            LayoutSearchEngine.generateAdaptiveCandidates(
                report,
                builderOptions
            );

        let bestCandidate = null;
        let closestCandidate = null;

        for (const layoutModes of layoutCandidates) {
            for (const densityMode of densityModes) {
                const candidateOptions = {
                    ...builderOptions,
                    densityMode,
                    layoutModes
                };

                const result =
                    await evaluateCandidate(
                        report,
                        candidateOptions
                    );

                result.penalty =
                    LayoutSearchEngine.calculatePenalty(
                        layoutModes,
                        densityMode
                    );

                result.overflow = Math.max(
                    0,
                    result.measurement.totalHeight -
                        pageHeight
                );

                result.fits =
                    result.overflow === 0;

                if (
                    !closestCandidate ||
                    result.overflow <
                        closestCandidate.overflow ||
                    (
                        result.overflow ===
                            closestCandidate.overflow &&
                        result.penalty <
                            closestCandidate.penalty
                    )
                ) {
                    closestCandidate = result;
                }

                if (!result.fits) {
                    continue;
                }

                if (
                    !bestCandidate ||
                    result.penalty <
                        bestCandidate.penalty ||
                    (
                        result.penalty ===
                            bestCandidate.penalty &&
                        result.measurement.totalHeight <
                            bestCandidate.measurement.totalHeight
                    )
                ) {
                    bestCandidate = result;
                }
            }
        }

        return bestCandidate || closestCandidate;
    }

    window.LayoutOptimizer = {
        version: "2.0.0",
        optimize
    };

    console.log("✅ Layout Optimizer loaded.");
})();
