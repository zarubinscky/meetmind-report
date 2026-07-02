(function () {
    "use strict";

    window.PDFDesignTokens = {
        version: "1.0.0",

        page: {
            format: "a4",
            orientation: "landscape",
            widthMm: 297,
            heightMm: 210,
            marginMm: {
                top: 12,
                right: 14,
                bottom: 10,
                left: 14
            }
        },

        colors: {
            text: {
                primary: "#0F172A",
                secondary: "#475569",
                muted: "#64748B"
            },

            surface: {
                page: "#FFFFFF",
                subtle: "#F8FAFC",
                card: "#FFFFFF"
            },

            border: {
                default: "#E2E8F0",
                subtle: "#EEF2F7"
            },

            semantic: {
                insight: {
                    base: "#684EFF",
                    soft: "#F3F0FF",
                    border: "#D8D0FF"
                },
                decision: {
                    base: "#22B573",
                    soft: "#ECFDF3",
                    border: "#BBF7D0"
                },
                risk: {
                    base: "#FF6A30",
                    soft: "#FFF4ED",
                    border: "#FDBA74"
                },
                architecture: {
                    base: "#00B8D9",
                    soft: "#ECFEFF",
                    border: "#A5F3FC"
                }
            }
        },

        typography: {
            title: {
                size: 28,
                lineHeight: 34,
                weight: 600
            },
            sectionTitle: {
                size: 18,
                lineHeight: 24,
                weight: 600
            },
            blockTitle: {
                size: 13,
                lineHeight: 18,
                weight: 600
            },
            body: {
                size: 10.5,
                lineHeight: 16,
                weight: 400
            },
            secondary: {
                size: 9,
                lineHeight: 14,
                weight: 400
            },
            table: {
                size: 9,
                lineHeight: 13,
                weight: 400
            },
            caption: {
                size: 8,
                lineHeight: 12,
                weight: 400
            }
        },

        spacing: {
            pageGap: 8,
            sectionGap: 8,
            cardGap: 4,
            cardPadding: 4,
            compactCardPadding: 3,
            tableRowHeight: 6,
            tableHeaderHeight: 7,
            minimumReadableGap: 4
        },

        radius: {
            card: 3,
            badge: 3,
            page: 4
        },

        density: {
            standard: 1,
            compact: 0.92,
            dense: 0.86,
            ultraDense: 0.8
        },

        footer: {
            contentPages: "none",
            appendixPages: "compact",
            maxHeightMm: 4
        }
    };

    console.log("✅ PDF Design Tokens loaded.");
})();
