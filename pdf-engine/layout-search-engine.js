(function () {
    "use strict";

    function generateCandidates(findings) {
        const count = findings.length;


        // New adaptive geometry

if (
    window.GeometryGenerator &&
    window.GeometrySolver &&
    findings.length >= 1
) {

    const report = {
        insights: findings,
        decisions: [],
        risks: []
    };

    const weights =
        GeometrySolver.calculateContentWeights(report);

    const stats = {
        insights: findings.length,
        decisions: 0,
        risks: 0
    };

    const adaptive =
        GeometryGenerator.generateAdaptiveGeometry(
            weights,
            findings,
            stats
        );

    console.log("Adaptive candidate:", adaptive);
}

        
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
        console.log("SEARCH ENGINE START");
        const findingsGroup = layout.layout.findings;

        if (!findingsGroup || !findingsGroup.rows) {
            return layout;
        }

        const findings = findingsGroup.rows.flatMap((row) => row.blocks);
        const report = {
    insights: findings.filter(b => b.type === "insight"),
    decisions: findings.filter(b => b.type === "decision"),
    risks: findings.filter(b => b.type === "risk")
};

const weights =
    GeometrySolver.calculateContentWeights(report);

const stats = {
    insights: report.insights.length,
    decisions: report.decisions.length,
    risks: report.risks.length
};

const adaptive =

    GeometryGenerator.generateAdaptiveGeometry(
        weights,
        findings,
        stats
    );

const candidates = [adaptive];

        
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
    header: "compact",
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
    header: "compact",
    statistics: "compact",
    tasks: "inline",
    findings: "compact",
    owners: "inline",
    architecture: "compact"
}
];
}

    function improveLayout(layoutModes) {

    const order =
        LayoutRegistry.getDegradationOrder();

    for (const blockId of order) {

        if (
            LayoutRegistry.canDegrade(
                blockId,
                layoutModes[blockId]
            )
        ) {

            return LayoutRegistry.degrade(
                layoutModes,
                blockId
            );
        }
    }
    return null;
}

    function calculatePenalty(layoutModes) {
    let penalty = 0;
    for (const blockId of Object.keys(layoutModes)) {
        const mode =
            LayoutRegistry.getMode(
                blockId,
                layoutModes[blockId]

            );

        if (mode) {
            penalty += mode.penalty || 0;
        }
    }
    return penalty;
}

    function generateCandidates(baseModes) {
    const candidates = [];
    let current = {
        ...baseModes
    };

    while (current) {
        candidates.push(current);
        current = improveLayout(current);
    }
    return candidates;
}

    function generateAdaptiveCandidates(report) {
    const modes = LayoutRegistry.getDefaultModes();
    const sectionBlocks = [];

    if (report.insights?.length) {
        sectionBlocks.push({
            id: "insights",
            title: "Insights",
            type: "insight-section",
            items: report.insights
        });
    }

    console.log("DEPENDENCIES RAW:", report.dependencies);
        
    if (report.dependencies?.length) {
        sectionBlocks.push({
            id: "dependencies",
            title: "Dependencies",
            type: "dependency-section",
            items: report.dependencies
        });
    }

    if (report.decisions?.length) {
        sectionBlocks.push({
            id: "decisions",
            title: "Decisions",
            type: "decision-section",
            items: report.decisions
        });
    }

    if (report.risks?.length) {
        sectionBlocks.push({
            id: "risks",
            title: "Risks",
            type: "risk-section",
            items: report.risks
        });
    }

    const weights =
        GeometrySolver.calculateContentWeights(report);

    const stats = {
        insights: report.insights?.length || 0,
        decisions: report.decisions?.length || 0,
        risks: report.risks?.length || 0
    };

    const geometry =
        GeometryGenerator.generateAdaptiveGeometry(
            weights,
            sectionBlocks,
            stats
        );

    console.log("=== ADAPTIVE SECTIONS ===", sectionBlocks);
    console.log("=== ADAPTIVE GEOMETRY ===", geometry);


        const base = {
    ...modes,
    findings: "adaptive",
    findingsLayout: geometry
};

const manualCandidates = [

    // 1. Полный режим
    {
        ...base
    },

    // 2. Только компактная шапка
    {
        ...base,
        header: "compact"
    },

    // 3. Шапка + компактная статистика
    {
        ...base,
        header: "compact",
        statistics: "compact"
    },

    // 4. Шапка + компактная статистика + compact tasks
    {
        ...base,
        header: "compact",
        statistics: "compact",
        tasks: "compact"
    },

    // 5. Шапка + компактная статистика + inline tasks
    {
        ...base,
        header: "compact",
        statistics: "compact",
        tasks: "inline"
    },

    // 6. Добавляем compact owners
    {
        ...base,
        header: "compact",
        statistics: "compact",
        tasks: "inline",
        owners: "compact"
    },

    // 7. Добавляем inline owners
    {
        ...base,
        header: "compact",
        statistics: "compact",
        tasks: "inline",
        owners: "inline"
    },

    // 8. Максимальная деградация
    {
        ...base,
        header: "compact",
        statistics: "compact",
        tasks: "inline",
        owners: "inline",
        architecture: "compact"
    }
];

        const generatedCandidates =
    generateCandidates(base);

console.log(
    "MANUAL CANDIDATES:",
    manualCandidates.length,
    manualCandidates
);

console.log(
    "GENERATED CANDIDATES:",
    generatedCandidates.length,
    generatedCandidates
);

return manualCandidates;
        
}
    
  window.LayoutSearchEngine = {
    generateCandidates,
    generateReportCandidates,
    generateAdaptiveCandidates,
    scoreCandidate,
    chooseBestCandidate,
    search
};

    console.log("✅ Layout Search Engine loaded.");
})();
