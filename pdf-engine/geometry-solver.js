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

    function solveFindingsGeometry(findings, area, page) {
        if (!findings.length) return null;

        const gap = page.gap;
        const minWidth = 150;
        const maxWidth = 360;
        const availableWidth = area.width;

        const enriched = findings.map((block) => ({
            ...block,
            weight: block.weight || calculateWeight(block)
        }));

        const totalScore =
            enriched.reduce((sum, block) => sum + Math.max(block.weight.score, 1), 0) || 1;

        const blocks = enriched.map((block) => {
            const ratio = Math.max(block.weight.score, 1) / totalScore;
            const rawWidth = availableWidth * ratio;
            const width = clamp(rawWidth, minWidth, maxWidth);

            return {
                ...block,
                layout: {
                    width,
                    height: estimateFindingHeight(block),
                    ratio
                }
            };
        });

        return composeFindingsRows(blocks, area, page);
    }

    function estimateFindingHeight(block) {
        const count = block.data?.items?.length || 1;
        const chars = block.weight?.chars || 0;

        return clamp(70 + count * 22 + chars * 0.04, 105, 260);
    }

    function composeFindingsRows(blocks, area, page) {
        const gap = page.gap;
        const rows = [];
        let currentRow = [];
        let usedWidth = 0;

        blocks.forEach((block) => {
            const nextWidth = currentRow.length
                ? usedWidth + gap + block.layout.width
                : block.layout.width;

            if (currentRow.length && nextWidth > area.width) {
                rows.push(normalizeRow(currentRow, area.width, gap));
                currentRow = [block];
                usedWidth = block.layout.width;
            } else {
                currentRow.push(block);
                usedWidth = nextWidth;
            }
        });

        if (currentRow.length) {
            rows.push(normalizeRow(currentRow, area.width, gap));
        }

        let y = 0;

        const positionedRows = rows.map((row) => {
            const rowHeight = Math.max(...row.map((block) => block.layout.height));
            let x = 0;

            const positionedBlocks = row.map((block) => {
                const placed = {
                    ...block,
                    box: {
                        x,
                        y,
                        width: block.layout.width,
                        height: rowHeight
                    }
                };

                x += block.layout.width + gap;
                return placed;
            });

            y += rowHeight + gap;

            return {
                type: "row",
                height: rowHeight,
                blocks: positionedBlocks
            };
        });

        return {
            id: "strategic-findings",
            type: "adaptive-group",
            title: "Strategic Findings",
            rows: positionedRows,
            height: Math.max(0, y - gap)
        };
    }

    function normalizeRow(row, availableWidth, gap) {
        if (row.length === 1) {
            return row.map((block) => ({
                ...block,
                layout: {
                    ...block.layout,
                    width: availableWidth
                }
            }));
        }

        const totalWidth = row.reduce((sum, block) => sum + block.layout.width, 0);
        const totalGap = gap * (row.length - 1);
        const scale = (availableWidth - totalGap) / totalWidth;

        return row.map((block) => ({
            ...block,
            layout: {
                ...block.layout,
                width: block.layout.width * scale
            }
        }));
    }

    function solve(blocks, page = DEFAULT_PAGE) {
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
        solve
    };

    console.log("✅ Geometry Solver loaded.");
})();
