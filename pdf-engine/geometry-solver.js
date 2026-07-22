(function () {
    "use strict";

    const DEFAULT_PAGE = {
        width: 794,
        height: 1123,
        marginTop: 48,
        marginBottom: 48,
        marginLeft: 48,
        marginRight: 48,
        gap: 16
    };

    const FINDING_IDS = ["insights", "decisions", "risks"];

    function getContentArea(page = DEFAULT_PAGE) {
        return {
            x: page.marginLeft,
            y: page.marginTop,
            width: page.width - page.marginLeft - page.marginRight,
            height: page.height - page.marginTop - page.marginBottom
        };
    }

    function calculateWeight(block) {
        if (!block || !block.data) return { items: 0, chars: 0, score: 0 };

        let items = 0;
        let chars = 0;

        Object.values(block.data).forEach((value) => {
            if (Array.isArray(value)) {
                items += value.length;
                value.forEach((item) => {
                    chars += JSON.stringify(item || {}).length;
                });
            } else if (typeof value === "string") {
                chars += value.length;
            }
        });

        return {
            items,
            chars,
            score: items * 10 + chars * 0.02
        };
    }

    function calculateContentWeights(report) {
    const result = {};

    [
        "insights",
        "decisions",
        "risks"
    ].forEach(section => {

        const items = report[section] || [];
        const itemCount = items.length;
        const chars = items.reduce((sum, item) => {

            if (typeof item === "string") {
                return sum + item.length;
            }

            return sum +
                JSON.stringify(item).length;

        }, 0);

        result[section] = {
            items: itemCount,
            chars,
            rawWeight:
                itemCount * 10 +
                chars * 0.02
        };
    });

    const total =
        Object.values(result)
            .reduce(
                (s, b) => s + b.rawWeight,
                0
            ) || 1;

    Object.values(result).forEach(block => {
        block.weight =
            block.rawWeight / total;
    });
    return result;
}


    function calculateDensity(items) {

    if (!Array.isArray(items) || !items.length) {
        return 0;
    }

    const chars = items.reduce((sum, item) => {
        return sum + JSON.stringify(item || {}).length;
    }, 0);

    return chars / items.length;

}

function calculateHierarchyScore(items) {

    if (!Array.isArray(items) || !items.length) {
        return 0;
    }

    return items.reduce((score, item) => {

        if (typeof item !== "object") {
            return score + 1;
        }

        let value = 1;

        if (item.title) value += 1;
        if (item.description) value += 1;
        if (item.details) value += 1;

        return score + value;

    }, 0);
}
    

    

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function splitBlocks(blocks) {
        const findings = blocks.filter((block) => FINDING_IDS.includes(block.id));
        const beforeFindings = blocks.filter(
            (block) => !FINDING_IDS.includes(block.id) && block.readingOrder < 70
        );
        const afterFindings = blocks.filter(
            (block) => !FINDING_IDS.includes(block.id) && block.readingOrder >= 70
        );

        return { beforeFindings, findings, afterFindings };
    }

    function estimateFindingHeight(block, width) {
        const count = block.data?.items?.length || 1;
        const chars = block.weight?.chars || 0;

        const widthFactor = clamp(220 / Math.max(width, 120), 0.75, 1.45);

        return clamp(
            58 + count * 20 + chars * 0.035 * widthFactor,
            88,
            260
        );
    }

    function enrichFindings(findings) {
        const enriched = findings.map((block) => ({
            ...block,
            weight: block.weight || calculateWeight(block)
        }));

        const totalScore =
            enriched.reduce((sum, block) => sum + Math.max(block.weight.score, 1), 0) || 1;

        return enriched.map((block) => ({
            ...block,
            layoutWeight: Math.max(block.weight.score, 1) / totalScore
        }));
    }

    function getCandidateLayouts(blocks, area, page) {
        const count = blocks.length;

        if (count === 0) return [];

        if (count === 1) {
            return [
                {
                    name: "single-full",
                    rows: [[{ id: blocks[0].id, span: 1 }]]
                }
            ];
        }

        if (count === 2) {
            return [
                {
                    name: "two-equal",
                    rows: [[
                        { id: blocks[0].id, span: 1 },
                        { id: blocks[1].id, span: 1 }
                    ]]
                },
                {
                    name: "two-stacked",
                    rows: [
                        [{ id: blocks[0].id, span: 1 }],
                        [{ id: blocks[1].id, span: 1 }]
                    ]
                }
            ];
        }

        return [
            {
                name: "three-equal-row",
                rows: [[
                    { id: blocks[0].id, span: 1 },
                    { id: blocks[1].id, span: 1 },
                    { id: blocks[2].id, span: 1 }
                ]]
            },
            {
                name: "dominant-first",
                rows: [
                    [{ id: blocks[0].id, span: 1 }],
                    [
                        { id: blocks[1].id, span: 1 },
                        { id: blocks[2].id, span: 1 }
                    ]
                ]
            },
            {
                name: "first-two-then-third",
                rows: [
                    [
                        { id: blocks[0].id, span: 1 },
                        { id: blocks[1].id, span: 1 }
                    ],
                    [{ id: blocks[2].id, span: 1 }]
                ]
            },
            {
                name: "stacked",
                rows: [
                    [{ id: blocks[0].id, span: 1 }],
                    [{ id: blocks[1].id, span: 1 }],
                    [{ id: blocks[2].id, span: 1 }]
                ]
            }
        ];
    }

    function materializeCandidate(candidate, blocks, area, page) {
        const gap = page.gap;
        const blockById = Object.fromEntries(blocks.map((block) => [block.id, block]));

        let y = 0;
        const rows = [];
        let totalHeight = 0;

        candidate.rows.forEach((rowSpec) => {
            const rowCount = rowSpec.length;
            const availableRowWidth = area.width - gap * (rowCount - 1);

            const rowBlocks = rowSpec.map((spec) => blockById[spec.id]).filter(Boolean);

            const totalWeight =
                rowBlocks.reduce((sum, block) => sum + block.layoutWeight, 0) || 1;

            let x = 0;

            const placedBlocks = rowBlocks.map((block, index) => {
                let width;

                if (rowCount === 1) {
                    width = area.width;
                } else {
                    const raw = availableRowWidth * (block.layoutWeight / totalWeight);
                    width = clamp(raw, 120, availableRowWidth * 0.72);
                }

                const height = estimateFindingHeight(block, width);

                const placed = {
                    ...block,
                    box: {
                        x,
                        y,
                        width,
                        height
                    }
                };

                x += width + gap;

                if (index === rowBlocks.length - 1) {
                    const rowUsed = placed.box.x + placed.box.width;
                    const remaining = area.width - rowUsed;
                    if (remaining > 0 && remaining < 80) {
                        placed.box.width += remaining;
                    }
                }

                return placed;
            });

            const rowHeight = Math.max(...placedBlocks.map((block) => block.box.height));

            placedBlocks.forEach((block) => {
                block.box.height = rowHeight;
            });

            rows.push({
                type: "row",
                height: rowHeight,
                blocks: placedBlocks
            });

            y += rowHeight + gap;
            totalHeight += rowHeight;
        });

        totalHeight += gap * Math.max(0, rows.length - 1);

        return {
            id: "strategic-findings",
            type: "adaptive-group",
            title: "Strategic Findings",
            strategy: candidate.name,
            rows,
            height: totalHeight
        };
    }

    function scoreCandidate(layout, area) {
        const blocks = layout.rows.flatMap((row) => row.blocks);
        const totalBlockArea = blocks.reduce(
            (sum, block) => sum + block.box.width * block.box.height,
            0
        );

        const boundingArea = area.width * layout.height;
        const utilization = boundingArea ? totalBlockArea / boundingArea : 0;

        const maxHeight = Math.max(...blocks.map((block) => block.box.height));
        const minHeight = Math.min(...blocks.map((block) => block.box.height));
        const imbalance = maxHeight ? (maxHeight - minHeight) / maxHeight : 0;

        const rowPenalty = layout.rows.length * 0.06;

        const readingOrderPenalty = blocks.some((block, index) => {
            if (index === 0) return false;
            return blocks[index - 1].readingOrder > block.readingOrder;
        }) ? 1 : 0;

        return utilization - imbalance * 0.25 - rowPenalty - readingOrderPenalty;
    }

    function solveFindingsGeometry(findings, area, page) {
        if (!findings.length) return null;

        const enriched = enrichFindings(findings);
        const candidates = getCandidateLayouts(enriched, area, page);

        const scored = candidates
            .map((candidate) => {
                const layout = materializeCandidate(candidate, enriched, area, page);

                return {
                    candidate,
                    layout,
                    score: scoreCandidate(layout, area)
                };
            })
            .sort((a, b) => b.score - a.score);

        return {
            ...scored[0].layout,
            score: scored[0].score,
            evaluatedStrategies: scored.map((item) => ({
                name: item.candidate.name,
                score: Number(item.score.toFixed(4)),
                height: Number(item.layout.height.toFixed(1))
            }))
        };
    }


/*
Geometry Solver v2
Input:
selected layout
Output:
absolute coordinates
Solver never creates layouts.
Solver never scores layouts.
Solver never evaluates density.
Its only responsibility is computing positions.
*/

    
    function solve(blocks, page = DEFAULT_PAGE) {

        /*
Geometry Solver v2
Input:
selected layout
Output:
absolute coordinates
Solver never creates layouts.
Solver never scores layouts.
Solver never evaluates density.
Its only responsibility is computing positions.
*/

      // if(layout.selectedCandidate){
//
//     console.log(
//         "Geometry Solver: using selected candidate",
//         layout.selectedCandidate.name
//     );
//
// }
        
        const area = getContentArea(page);

        const enrichedBlocks = blocks.map((block) => ({
            ...block,
            weight: calculateWeight(block)
        }));

        const { beforeFindings, findings, afterFindings } = splitBlocks(enrichedBlocks);

        const findingsLayout = solveFindingsGeometry(findings, area, page);

        return {
            page,
            area,
            blocks: enrichedBlocks,
            layout: {
                beforeFindings,
                findings: findingsLayout,
                afterFindings
            }
        };
    }

    
window.GeometrySolver = {
    version: "1.0.0",
    solve,
    calculateContentWeights,
    calculateDensity,
    calculateHierarchyScore
};
    
 console.log("✅ Geometry Solver loaded.");

})();
