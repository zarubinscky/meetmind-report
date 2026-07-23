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

        items: (report.tasks || []).map(task => ({

            title:
                task.title ??
                task.task ??
                task.text ??
                "",

            owner:
                task.owner ??
                task.assignee ??
                task.responsible ??
                "",

            deadline:
                task.deadline ??
                task.due_date ??
                task.due ??
                "",

            priority:
                task.priority ??
                task.business_priority ??
                "",

            status:
                task.status ??
                ""
        }))
    };
}

    function buildOwnersModel(report) {
        function buildOwnersModel(report) {

    return {
        id: "owners",
        title: "Owners",
        items: (report.owners || []).map(owner => ({

            name:
                owner.name ??
                owner.owner ??
                owner.person ??
                owner.text ??
                "",

            responsibility:
                owner.responsibility ??
                owner.role ??
                owner.description ??
                "",

            department:
                owner.department ??
                "",

            status:
                owner.status ??
                ""
        }))
    };
}

    }

    function buildStatisticsModel(report) {

    return {

        id: "statistics",

        title: "Meeting Statistics",

        items: (report.statistics || []).map(item => ({

            label:
                item.label ??
                item.name ??
                item.title ??
                "",

            value:
                item.value ??
                item.metric ??
                item.count ??
                "",

            unit:
                item.unit ??
                "",

            trend:
                item.trend ??
                "",

            type:
                item.type ??
                ""
        }))
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
