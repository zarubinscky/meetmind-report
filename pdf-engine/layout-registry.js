(function () {

    "use strict";
    const BLOCK_LAYOUT_MODES = {

        statistics: [
            {
                id: "default",
                label: "Default statistics",
                penalty: 0
            },
            {
                id: "compact",
                label: "Compact statistics",
                penalty: 1
            }
        ],

        findings: [
            {
                id: "cards",
                label: "Cards",
                penalty: 0
            },
            {
                id: "compact",
                label: "Compact findings",
                penalty: 1
            }
        ],

        tasks: [
            {
                id: "cards",
                label: "Task cards",
                penalty: 0
            },
            {
                id: "compact",
                label: "Compact tasks",
                penalty: 1
            }
        ],

        owners: [
            {
                id: "cards",
                label: "Owner cards",
                penalty: 0
            },
            {
                id: "compact",
                label: "Compact owners",
                penalty: 1
            },
            {
                id: "inline",
                label: "Inline owners",
                penalty: 2
            }
        ],

         architecture: [
        {
            id: "cards",
            label: "Architecture cards",
            penalty: 0
        },

        {
            id: "compact",
            label: "Compact architecture",
            penalty: 1
        }
    ]

    };

    function getModes(blockId) {
        return BLOCK_LAYOUT_MODES[blockId] || [
            {
                id: "default",
                label: "Default",
                penalty: 0
            }
        ];
    }

    function getDefaultModes() {

        const result = {};

        Object.keys(BLOCK_LAYOUT_MODES).forEach(blockId => {
            result[blockId] = BLOCK_LAYOUT_MODES[blockId][0].id;
        });

        return result;

    }

    window.LayoutRegistry = {
        version: "1.0.0",
        getModes,
        getDefaultModes
    };

    console.log("✅ Layout Registry loaded.");

})();
