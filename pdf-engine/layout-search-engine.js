(function () {
    "use strict";

function buildBlockWeights(report) {
    const blocks = BlockRegistry.getBlocks(report);
    return blocks.reduce((weights, block) => {
        weights[block.id] = block.visualWeight || 0;
        return weights;
    }, {});
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

   const height =
    estimateCandidateHeight(candidate);

  const availableHeight =
    candidate.pageHeight ??
    780;

  const overflow =
    Math.max(
        0,
        height - availableHeight
    );

  const rowCount =
    candidate.rows.length;

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


    const overflowPenalty =
    overflow > 0
        ? Math.min(
            overflow / 500,
            1
        )
        : 0;
        
    const score =
    heightScore * 0.30 +
    densityScore * 0.20 +
    balanceScore * 0.25 +
    whitespaceScore * 0.15 +
    readingScore * 0.10 -
    overflowPenalty;
        
    return {
        ...candidate,
        metrics: {
            height,
            overflow,
            overflowPenalty,
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

    function improveLayout(layoutModes) {

    const order =
        LayoutRegistry.getDegradationOrder();

    for (const blockId of order) {

    console.log(
    blockId,
    layoutModes[blockId],
    LayoutRegistry.canDegrade(
        blockId,
        layoutModes[blockId]
    )
);
        
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

  function getActiveLayoutBlocks(report) {
    const blocks = BlockRegistry.getBlocks(report);
    const active = new Set();

    blocks.forEach((block) => {
        switch (block.type) {
            case "header":
                active.add("header");
                break;

            case "statistics":
                active.add("statistics");
                break;

            case "findings":
                active.add("findings");
                break;

            case "tasks":
                active.add("tasks");
                break;

            case "owners":
                active.add("owners");
                break;

            case "architecture":
                active.add("architecture");
                break;
        }
    });

    return LayoutRegistry
        .getDegradationOrder()
        .concat(["header"])
        .filter((blockId, index, list) =>
            active.has(blockId) &&
            list.indexOf(blockId) === index
        );
}

function buildCartesianCandidates(
    blockIds,
    index,
    current,
    result
) {
    if (index >= blockIds.length) {
        result.push({
            ...current
        });

        return;
    }

    const blockId = blockIds[index];
    const modes = LayoutRegistry.getModes(blockId);

    modes.forEach((mode) => {
        current[blockId] = mode.id;

        buildCartesianCandidates(
            blockIds,
            index + 1,
            current,
            result
        );
    });

    delete current[blockId];
}

function candidateKey(candidate) {
    return Object.keys(candidate)
        .filter((key) => key !== "findingsLayout")
        .sort()
        .map((key) => `${key}:${candidate[key]}`)
        .join("|");
}

function selectCandidateSet(
    candidates,
    maxCandidates = 180
) {
    if (candidates.length <= maxCandidates) {
        return candidates;
    }

    const buckets = new Map();

    candidates.forEach((candidate) => {
        const penalty = calculatePenalty(candidate);

        if (!buckets.has(penalty)) {
            buckets.set(penalty, []);
        }

        buckets.get(penalty).push(candidate);
    });

    const penalties = [...buckets.keys()]
        .sort((a, b) => a - b);

    const selected = [];
    const seen = new Set();

    function add(candidate) {
        const key = candidateKey(candidate);

        if (seen.has(key)) {
            return;
        }

        seen.add(key);
        selected.push(candidate);
    }

    // Обязательно сохраняем самый качественный вариант.
    add(candidates[0]);

    // Обязательно сохраняем максимально плотный вариант.
    add(candidates[candidates.length - 1]);

    let cursor = 0;

    while (
        selected.length < maxCandidates &&
        penalties.length
    ) {
        const penalty =
            penalties[cursor % penalties.length];

        const bucket = buckets.get(penalty);

        if (bucket?.length) {
            const position = Math.floor(
                (
                    selected.length /
                    maxCandidates
                ) * bucket.length
            );

            add(
                bucket[
                    Math.min(
                        position,
                        bucket.length - 1
                    )
                ]
            );
        }

        cursor += 1;

        if (
            cursor >
            maxCandidates * penalties.length * 2
        ) {
            break;
        }
    }

    // Заполняем остаток, если стратифицированный проход
    // дал меньше кандидатов из-за повторов.
    for (const candidate of candidates) {
        if (selected.length >= maxCandidates) {
            break;
        }

        add(candidate);
    }

    return selected;
}

function generateModeCandidates(
    report,
    sharedProperties = {}
) {
    const activeBlockIds =
        getActiveLayoutBlocks(report);

    const combinations = [];

    buildCartesianCandidates(
        activeBlockIds,
        0,
        {},
        combinations
    );

    const defaults =
        LayoutRegistry.getDefaultModes();

    const candidates = combinations.map(
        (combination) => ({
            ...defaults,
            ...combination,
            ...sharedProperties
        })
    );

    candidates.sort((a, b) => {
        const penaltyDifference =
            calculatePenalty(a) -
            calculatePenalty(b);

        if (penaltyDifference !== 0) {
            return penaltyDifference;
        }

        return candidateKey(a)
            .localeCompare(candidateKey(b));
    });

    return selectCandidateSet(candidates);
}

    function generateAdaptiveCandidates(report) {
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

    const blockWeights =
    buildBlockWeights(report);
        
    console.log(
    "BLOCK WEIGHTS:",
    blockWeights
    );

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


        const generatedCandidates =
    generateModeCandidates(
        report,
        {
            findingsLayout: geometry
        }
    );
console.log(
    "GENERATED ADAPTIVE CANDIDATES:",
    {
        count: generatedCandidates.length,
        activeBlocks:
            getActiveLayoutBlocks(report),
        first:
            generatedCandidates[0],
        last:
            generatedCandidates[
                generatedCandidates.length - 1
            ]
    }
);

return generatedCandidates;
        
}
    
  window.LayoutSearchEngine = {
    generateAdaptiveCandidates,
    calculatePenalty,
    scoreCandidate
};

    console.log("✅ Layout Search Engine loaded.");
})();
