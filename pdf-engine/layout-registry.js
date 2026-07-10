(function () {

    "use strict";

    const DEGRADATION_ORDER = [
    "statistics",
    "tasks",
    "owners",
    "architecture",
    "findings"
];

    const BLOCK_LAYOUT_MODES = {

        header: [
    {
        id: "default",
        label: "Default header",
        penalty: 0,
        level: 0,
        next: "compact",
        canHide: false
    },
    {
        id: "compact",
        label: "Compact header",
        penalty: 1,
        level: 1,
        next: null,
        canHide: false
    }
],
        
        statistics: [
            {
                id: "default",
                label: "Default statistics",
                penalty: 0,
                level: 0,
                next: "compact",
                canHide: false
            },
            {
                id: "compact",
                label: "Compact statistics",
                penalty: 1,
                level: 1,
                next: null,
                canHide: false
            }
        ],

        findings: [
            {
                id: "cards",
                label: "Cards",
                penalty: 0,
                level: 0,
                next: "compact",
                canHide: false,
                preserveReadingOrder: true
            },
            {
                id: "compact",
                label: "Compact findings",
                penalty: 1,
                level: 1,
                next: "inline",
                canHide: false,
                preserveReadingOrder: true
            },
            {
                id: "inline",
                label: "Inline findings",
                penalty: 2,
                level: 2,
                next: null,
                canHide: false,
                preserveReadingOrder: true
            }
        ],

        tasks: [
            {
                id: "cards",
                label: "Task cards",
                penalty: 0,
                level: 0,
                next: "compact",
                canHide: true
            },
            {
                id: "compact",
                label: "Compact tasks",
                penalty: 1,
                level: 1,
                next: "inline",
                canHide: true
            },
            {
                id: "inline",
                label: "Inline tasks",
                penalty: 2,
                level: 2,
                next: null,
                canHide: true
            }
        ],

        owners: [
            {
                id: "cards",
                label: "Owner cards",
                penalty: 0,
                level: 0,
                next: "compact",
                canHide: true
            },
            {
                id: "compact",
                label: "Compact owners",
                penalty: 1,
                level: 1,
                next: "inline",
                canHide: true
            },
            {
                id: "inline",
                label: "Inline owners",
                penalty: 2,
                level: 2,
                next: null,
                canHide: true
            }
        ],

        architecture: [
            {
                id: "cards",
                label: "Architecture cards",
                penalty: 0,
                level: 0,
                next: "compact",
                canHide: true
            },
            {
                id: "compact",
                label: "Compact architecture",
                penalty: 1,
                level: 1,
                next: "inline",
                canHide: true
            },
            {
                id: "inline",
                label: "Inline architecture",
                penalty: 2,
                level: 2,
                next: null,
                canHide: true
            }
        ]

    };

    function getModes(blockId) {
        return BLOCK_LAYOUT_MODES[blockId] || [
            {
                id: "default",
                label: "Default",
                penalty: 0,
                level: 0,
                next: null,
                canHide: true
            }
        ];
    }

    function getMode(blockId, modeId) {
        return getModes(blockId).find(mode => mode.id === modeId) || null;
    }

    function getDefaultModes() {

        const result = {};

        Object.keys(BLOCK_LAYOUT_MODES).forEach(blockId => {
            result[blockId] = BLOCK_LAYOUT_MODES[blockId][0].id;
        });

        return result;

    }

    function getNextMode(blockId, currentModeId) {
        const currentMode = getMode(blockId, currentModeId);

        if (!currentMode || !currentMode.next) {
            return null;
        }

        return getMode(blockId, currentMode.next);
    }

    function canDegrade(blockId, currentModeId) {
        return !!getNextMode(blockId, currentModeId);
    }

    function degrade(layoutModes, blockId) {
        const currentModeId = layoutModes[blockId];
        const nextMode = getNextMode(blockId, currentModeId);

        if (!nextMode) {
            return layoutModes;
        }

        return {
            ...layoutModes,
            [blockId]: nextMode.id
        };
    }

    function getDegradationOrder() {
    return [...DEGRADATION_ORDER];
}

    window.LayoutRegistry = {
    version: "1.1.0",
    getModes,
    getMode,
    getDefaultModes,
    getNextMode,
    canDegrade,
    degrade,
    getDegradationOrder
};

    console.log("✅ Layout Registry loaded.");
})();
