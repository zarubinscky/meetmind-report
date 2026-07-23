(function () {

    "use strict";

    function buildSummaryModel(report) {

        return {
            id: "summary",
            title: "Executive Summary",
            content:
                report?.summary ||
                report?.meeting_summary ||
                ""
        };

    }

    function buildFindingsModel(report) {

        const sections = [];

        if (report.executive_brief) {
            sections.push({
                id: "executive_brief",
                title: "Executive Brief",
                items: [report.executive_brief]
            });
        }

        if (report.insights?.length) {
            sections.push({
                id: "insights",
                title: "Insights",
                items: report.insights
            });
        }

        if (report.dependencies?.length) {
            sections.push({
                id: "dependencies",
                title: "Dependencies",
                items: report.dependencies
            });
        }

        if (report.decisions?.length) {
            sections.push({
                id: "decisions",
                title: "Decisions",
                items: report.decisions
            });
        }

        if (report.risks?.length) {
            sections.push({
                id: "risks",
                title: "Risks",
                items: report.risks
            });
        }

        return {
            id: "findings",
            title: "Strategic Findings",
            sections
        };

    }

    function buildTasksModel(report) {

        return {
            id: "tasks",
            title: "Tasks",
            items: report.tasks || []
        };

    }

    function buildOwnersModel(report) {

        return {
            id: "owners",
            title: "Owners",
            items: report.owners || []
        };

    }

    function buildStatisticsModel(report) {

        return {
            id: "statistics",
            title: "Meeting Statistics",
            items: report.statistics || []
        };

    }

    function buildArchitectureModel(report) {

        return {
            id: "architecture",
            title: "Architecture",
            items: report.architecture || []
        };

    }

    window.DocumentModelBuilder = {

        buildSummaryModel,

        buildFindingsModel,

        buildTasksModel,

        buildOwnersModel,

        buildStatisticsModel,

        buildArchitectureModel

    };

})();
