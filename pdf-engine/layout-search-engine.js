(function () {
    "use strict";

    function generateCandidates(findings) {
        const count = findings.length;

        if (count === 1) {
            return [
                {
                    name: "single",
                    rows: [findings]
                }
            ];
        }

        if (count === 2) {
            return [
                {
                    name: "two-columns",
                    rows: [findings]
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
                    rows: [findings]
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

    function estimateCandidateHeight(candidate) {
        return candidate.rows.reduce((total, row) => {
            const rowHeight = Math.max(
                ...row.map((block) => block.box?.height || 120)
            );

            return total + rowHeight;
        }, 0);
    }

    function scoreCandidate(candidate) {
        const height = estimateCandidateHeight(candidate);

        const heightScore = height > 0 ? 1 / height : 0;

        const rowPenalty = candidate.rows.length * 0.02;

        const score = heightScore - rowPenalty;

        return {
            ...candidate,
            metrics: {
                height,
                rowCount: candidate.rows.length,
                heightScore,
                rowPenalty
            },
            score
        };
    }

    function chooseBestCandidate(candidates) {
        if (!candidates.length) return null;

        return candidates
            .map(scoreCandidate)
            .sort((a, b) => b.score - a.score)[0];
    }

    function search(layout) {
        const findingsGroup = layout.layout.findings;

        if (!findingsGroup || !findingsGroup.rows) {
            return layout;
        }

        const findings = findingsGroup.rows.flatMap((row) => row.blocks);

        const candidates = generateCandidates(findings);
        const evaluatedCandidates = candidates
            .map(scoreCandidate)
            .sort((a, b) => b.score - a.score);

        const bestCandidate = evaluatedCandidates[0] || null;

        findingsGroup.candidates = candidates;
        findingsGroup.evaluatedCandidates = evaluatedCandidates;
        findingsGroup.bestCandidate = bestCandidate;

        if (bestCandidate) {
            findingsGroup.selectedStrategy = bestCandidate.name;
        }

        return layout;
    }

    window.LayoutSearchEngine = {
        generateCandidates,
        scoreCandidate,
        chooseBestCandidate,
        search
    };

    console.log("✅ Layout Search Engine loaded.");
})();
