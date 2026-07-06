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
    const rowCount = candidate.rows.length;

    // 1. Height (меньше = лучше)
    const heightScore = Math.max(0, 1 - (height / 600));

    // 2. Density (меньше строк = выше плотность)
    const densityScore = Math.max(0, 1 - ((rowCount - 1) * 0.2));

    // 3. Balance
    let balanceScore = 1;

    if (rowCount > 1) {

        const heights = candidate.rows.map(row =>
            Math.max(...row.map(block => block.box?.height || 120))
        );

        const maxHeight = Math.max(...heights);
        const minHeight = Math.min(...heights);

        balanceScore = minHeight / maxHeight;
    }

    // 4. Reading Priority
    const readingScore = 1;

    // 5. White Space (временная оценка)
    const whitespaceScore = rowCount === 1
        ? 1
        : rowCount === 2
            ? 0.9
            : 0.8;

    // Общая оценка
    const score =
        heightScore * 0.30 +
        densityScore * 0.20 +
        balanceScore * 0.25 +
        whitespaceScore * 0.15 +
        readingScore * 0.10;
    return {
        ...candidate,
        metrics: {
            height,
            rowCount,
            heightScore,
            densityScore,
            balanceScore,
            whitespaceScore,
            readingScore
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

function generateReportCandidates() {
    const defaults = LayoutRegistry.getDefaultModes();

    return [
    defaults,

    {
        ...defaults,
        statistics: "compact"
    },

    {
        ...defaults,
        statistics: "compact",
        tasks: "compact"
    },

    {
        ...defaults,
        statistics: "compact",
        tasks: "inline"
    },

    {
        ...defaults,
        statistics: "compact",
        tasks: "inline",
        findings: "compact"
    },

    {
        ...defaults,
        statistics: "compact",
        tasks: "inline",
        findings: "compact",
        owners: "compact"
    },

    {
        ...defaults,
        statistics: "compact",
        tasks: "inline",
        findings: "compact",
        owners: "inline"
    },

{
    ...defaults,
    statistics: "compact",
    tasks: "inline",
    findings: "compact",
    owners: "inline",
    architecture: "compact"
}
        
];
    
}
    
   window.LayoutSearchEngine = {
    generateCandidates,
    generateReportCandidates,
    scoreCandidate,
    chooseBestCandidate,
    search
};

    console.log("✅ Layout Search Engine loaded.");
})();
