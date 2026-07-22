(function () {
    "use strict";

    const BLOCK_PRIORITY = {
        critical: 100,
        high: 80,
        medium: 60,
        low: 40,
        appendix: 10
    };

    function isEmpty(value) {
        if (value == null) return true;
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === "object") return Object.keys(value).length === 0;

        const normalized = String(value)
            .replace(/[#*•\-\s.]/g, "")
            .trim()
            .toLowerCase();

        return !normalized || ["неуказано", "not specified", "n/a", "none", "null"].includes(normalized);
    }

    function toList(value) {
        if (Array.isArray(value)) {
            return value.filter((item) => !isEmpty(item));
        }

        if (isEmpty(value)) return [];
        return String(value)
            .split(/\n+/)
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => line.replace(/^[-•]\s*/, "").trim())
            .filter((line) => !isEmpty(line));
    }

    function normalizeTask(item) {
        if (typeof item === "string") {
            const parts = item
                .split(/\s+—\s+|\s+-\s+/)
                .map((part) => part.trim())
                .filter(Boolean);

            return {
                task: parts[0] || item,
                owner: parts[1] || "",
                dueDate: parts.slice(2).join(" — ") || ""
            };
        }

        return {
            task: item.task || item.title || "",
            owner: item.owner || item.assignee || "",
            dueDate: item.due_date || item.dueDate || item.deadline || "",
            status: item.status || "",
            priority: item.business_priority || item.priority || ""
        };
    }

    function normalizeOwner(owner) {
        if (owner && typeof owner === "object") {
            return {
                name: owner.name || owner.owner || owner.person || "",
                role: owner.role || owner.title || owner.responsibility || ""
            };
        }

        const parts = String(owner)
            .split(/\s+–\s+|\s+-\s+/)
            .map((part) => part.trim())
            .filter(Boolean);

        return {
            name: parts[0] || String(owner || ""),
            role: parts.slice(1).join(" – ")
        };
    }

    function normalizeReport(input = {}) {
        const meeting = input.meeting || input;
        const report = meeting.report || input.report || input;

        return {
            meeting,
            title:
                meeting.meeting_title ||
                meeting.title ||
                report.meeting_title ||
                report.title ||
                "Meeting Report",

            subtitle:
                report.subtitle ||
                report.meeting_subtitle ||
                meeting.subtitle ||
                "",

            createdAt:
                meeting.created_at ||
                report.created_at ||
                "",

            durationSeconds:
                report.stats?.duration_seconds ||
                meeting.duration_seconds ||
                null,

            summary:
                report.executive_brief ||
                report.summary ||
                "",

            insights: toList(report.key_takeaways || report.insights),
            decisions: toList(report.decisions),
            risks: toList(report.risks),

            tasks: toList(report.tasks).map(normalizeTask).filter((task) => !isEmpty(task.task)),
            owners: toList(report.owners || report.responsibles).map(normalizeOwner).filter((owner) => !isEmpty(owner.name)),

            participants: Array.isArray(report.participants)
                ? report.participants
                : Array.isArray(meeting.participants)
                    ? meeting.participants
                    : [],

            architecture: report.architecture || null,
            dependencies: toList(report.dependencies),
            keyMetrics: Array.isArray(report.key_metrics)
           ? report.key_metrics
           : Array.isArray(report.metrics)
           ? report.metrics
           : [],

            transcript:
                meeting.transcript ||
                report.transcript ||
                ""
        };
    }

    function createBlock(config) {
        return {
            id: config.id,
            type: config.type,
            title: config.title,
            data: config.data,

            businessPriority: config.businessPriority,
            layoutPriority: config.layoutPriority,
            priorityScore: BLOCK_PRIORITY[config.businessPriority] || BLOCK_PRIORITY.medium,

            preferredPosition: config.preferredPosition || "flexible",
            preferredWidth: config.preferredWidth || "auto",

            canHide: config.canHide !== false,
            canSplit: !!config.canSplit,
            canShrink: config.canShrink !== false,
            canMoveToAppendix: !!config.canMoveToAppendix,

            readingOrder: config.readingOrder || 999,
            semanticColor: config.semanticColor || null,
            structural: !!config.structural,

            visualWeight: estimateVisualWeight(config),

            meta: config.meta || {}
        };
    }

    function estimateVisualWeight(block) {
        const data = block.data;

        if (block.type === "header") return 8;
        if (block.type === "statistics") return 6;
        if (block.type === "summary") return estimateTextWeight(data?.text || "", 18);

        if (block.type === "findings") {
            return (data?.items || []).reduce((sum, item) => {
                if (typeof item === "string") return sum + estimateTextWeight(item, 6);
                return sum + estimateTextWeight(item.title || "", 4) + estimateTextWeight(item.details || item.description || "", 6);
            }, 0);
        }

        if (block.type === "tasks") return Math.max(8, (data?.items || []).length * 4);
        if (block.type === "owners") return Math.max(4, (data?.items || []).length * 2);
        if (block.type === "participants") return Math.max(3, (data?.items || []).length * 1.5);
        if (block.type === "architecture") return 20;
        if (block.type === "dependencies") return Math.max(6, (data?.items || []).length * 3);
        if (block.type === "transcript") return estimateTextWeight(data?.text || "", 40);

        return 5;
    }

    function estimateTextWeight(text, base) {
        const value = String(text || "").trim();
        if (!value) return 0;

        const lengthWeight = Math.ceil(value.length / 90);
        return base + lengthWeight;
    }

    function buildStatistics(report) {
        const stats = [];
        const keyMetrics = Array.isArray(report.keyMetrics)
    ? report.keyMetrics
    : [];

keyMetrics.forEach((metric, index) => {
    if (!metric) return;

    const label =
        metric.label ||
        metric.title ||
        metric.name ||
        `Metric ${index + 1}`;

    const value =
        metric.value ??
        metric.metric_value ??
        metric.result ??
        "";

    if (isEmpty(label) || isEmpty(value)) {
        return;
    }

    stats.push({
        key:
            metric.key ||
            `key-metric-${index}`,
        label,
        value,
        icon:
            metric.icon ||
            "metric",
        source: "key_metric"
    });
});

        if (report.participants.length > 0) {
            stats.push({
                key: "participants",
                label: "Participants",
                value: report.participants.length,
                icon: "users"
            });
        }

        if (report.tasks.length > 0) {
            stats.push({
                key: "tasks",
                label: "Tasks",
                value: report.tasks.length,
                icon: "tasks"
            });
        }

        if (report.decisions.length > 0) {
            stats.push({
                key: "decisions",
                label: "Decisions",
                value: report.decisions.length,
                icon: "decisions"
            });
        }

        if (report.risks.length > 0) {
            stats.push({
                key: "risks",
                label: "Risks",
                value: report.risks.length,
                icon: "risks"
            });
        }

        if (report.durationSeconds) {
            stats.push({
                key: "duration",
                label: "Minutes",
                value: Math.round(report.durationSeconds / 60),
                icon: "duration"
            });
        }

        return stats;
    }

    function hasArchitecture(architecture) {
        if (!architecture) return false;
        if (Array.isArray(architecture)) return architecture.length > 0;
        if (Array.isArray(architecture.sections)) return architecture.sections.length > 0;
        return Object.keys(architecture).length > 0;
    }

    function getBlocks(input) {
        const report = normalizeReport(input);
        const blocks = [];

        blocks.push(createBlock({
            id: "header",
            type: "header",
            title: "Header",
            data: {
                title: report.title,
                subtitle: report.subtitle,
                createdAt: report.createdAt,
                durationSeconds: report.durationSeconds,
                participantsCount: report.participants.length
            },
            businessPriority: "critical",
            layoutPriority: "primary",
            preferredPosition: "top",
            preferredWidth: "full",
            canHide: false,
            readingOrder: 10,
            structural: true
        }));

        const statistics = buildStatistics(report);
        if (statistics.length) {
            blocks.push(createBlock({
                id: "statistics",
                type: "statistics",
                title: "Statistics",
                data: { items: statistics },
                businessPriority: "critical",
                layoutPriority: "primary",
                preferredPosition: "upper",
                preferredWidth: "full",
                canHide: false,
                readingOrder: 20,
                structural: true
            }));
        }

        if (!isEmpty(report.summary)) {
            blocks.push(createBlock({
                id: "summary",
                type: "summary",
                title: "Executive Summary",
                data: { text: report.summary },
                businessPriority: "critical",
                layoutPriority: "primary",
                preferredPosition: "upper",
                preferredWidth: "full",
                canHide: false,
                readingOrder: 30,
                structural: false
            }));
        }

        if (report.insights.length) {
            blocks.push(createBlock({
                id: "insights",
                type: "findings",
                title: "Insights",
                data: { items: report.insights },
                businessPriority: "high",
                layoutPriority: "primary",
                preferredWidth: "auto",
                semanticColor: "insight",
                readingOrder: 40
            }));
        }

        if (report.decisions.length) {
            blocks.push(createBlock({
                id: "decisions",
                type: "findings",
                title: "Decisions",
                data: { items: report.decisions },
                businessPriority: "high",
                layoutPriority: "primary",
                preferredWidth: "auto",
                semanticColor: "decision",
                readingOrder: 50
            }));
        }

        if (report.risks.length) {
            blocks.push(createBlock({
                id: "risks",
                type: "findings",
                title: "Risks",
                data: { items: report.risks },
                businessPriority: "high",
                layoutPriority: "primary",
                preferredWidth: "auto",
                semanticColor: "risk",
                readingOrder: 60
            }));
        }

        if (report.tasks.length) {
            blocks.push(createBlock({
                id: "tasks",
                type: "tasks",
                title: "Tasks",
                data: { items: report.tasks },
                businessPriority: "high",
                layoutPriority: "primary",
                preferredWidth: "full",
                canSplit: true,
                readingOrder: 70,
                structural: true
            }));
        }

        if (report.owners.length) {
            blocks.push(createBlock({
                id: "owners",
                type: "owners",
                title: "Owners",
                data: { items: report.owners },
                businessPriority: "medium",
                layoutPriority: "secondary",
                preferredWidth: "auto",
                canMoveToAppendix: true,
                readingOrder: 80,
                structural: true
            }));
        }

        if (hasArchitecture(report.architecture)) {
            blocks.push(createBlock({
                id: "architecture",
                type: "architecture",
                title: "Architecture",
                data: report.architecture,
                businessPriority: "high",
                layoutPriority: "secondary",
                preferredWidth: "full",
                canSplit: true,
                canMoveToAppendix: true,
                semanticColor: "architecture",
                readingOrder: 90
            }));
        }

        if (report.dependencies.length) {
            blocks.push(createBlock({
                id: "dependencies",
                type: "dependencies",
                title: "Dependencies",
                data: { items: report.dependencies },
                businessPriority: "medium",
                layoutPriority: "secondary",
                preferredWidth: "auto",
                canMoveToAppendix: true,
                readingOrder: 100,
                structural: true
            }));
        }

        if (report.participants.length) {
            blocks.push(createBlock({
                id: "participants",
                type: "participants",
                title: "Participants",
                data: { items: report.participants },
                businessPriority: "low",
                layoutPriority: "optional",
                preferredWidth: "auto",
                canMoveToAppendix: true,
                readingOrder: 110,
                structural: true
            }));
        }

        if (!isEmpty(report.transcript)) {
            blocks.push(createBlock({
                id: "transcript",
                type: "transcript",
                title: "Meeting Transcript",
                data: { text: report.transcript },
                businessPriority: "appendix",
                layoutPriority: "appendix",
                preferredPosition: "appendix",
                preferredWidth: "full",
                canSplit: true,
                canMoveToAppendix: true,
                readingOrder: 900,
                structural: true
            }));
        }

        return blocks.sort((a, b) => a.readingOrder - b.readingOrder);
    }

    window.BlockRegistry = {
        version: "1.0.0",
        normalizeReport,
        getBlocks
    };

    console.log("✅ PDF Block Registry loaded.");
})();
