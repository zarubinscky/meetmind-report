(function () {

"use strict";

window.GeometryGenerator = {

    version: "1.0.0",

    generate(layout){

        const findings = layout.layout.findings;

        if(!findings){
            return [];
        }

        const blocks = findings.blocks;

        const candidates = [];

        candidates.push(this.createThreeEqual(blocks));

        candidates.push(this.createDominantFirst(blocks));

        candidates.push(this.createFirstTwoThenThird(blocks));

        candidates.push(this.createStacked(blocks));

        return candidates;

    },

    createThreeEqual(blocks){

        return {
            name:"three-equal-row",
            rows:[
                {
                    blocks:[...blocks]
                }
            ]
        };

    },

    createDominantFirst(blocks){

        return {
            name:"dominant-first",
            rows:[
                {
                    blocks:[blocks[0]]
                },
                {
                    blocks:blocks.slice(1)
                }
            ]
        };

    },

    createFirstTwoThenThird(blocks){

        return {
            name:"first-two-then-third",
            rows:[
                {
                    blocks:blocks.slice(0,2)
                },
                {
                    blocks:blocks.slice(2)
                }
            ]
        };

    },

    createStacked(blocks){

        return {
            name:"stacked",
            rows:blocks.map(b=>({
                blocks:[b]
            }))
        };

    },

    generateAdaptiveGeometry(weights, blocks){

    if(!weights){
        return this.createThreeEqual(blocks);
    }

    const insightWeight =
        weights.insights?.weight ?? 0;

    const decisionWeight =
        weights.decisions?.weight ?? 0;

    const riskWeight =
        weights.risks?.weight ?? 0;

    console.log("Adaptive geometry weights:",{
        insightWeight,
        decisionWeight,
        riskWeight
    });

    return this.createThreeEqual(blocks);

},

};

console.log("✅ Geometry Generator loaded.");

})();
