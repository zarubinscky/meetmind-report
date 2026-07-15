(function () {

    "use strict";

    window.TasksRenderer = {

       render(report, options = {}) {

    const tasks = report?.tasks ?? [];

    const level =
    DensityEngine.getDensityLevel(
        "tasks",
        options
    );

    console.log(
    "Tasks density level:",
    level
    );

    if (!tasks.length) {
        return "";
    }

    let content = "";

    switch (level) {

        case 2:

    content = `
        <div class="mm-tasks-inline">
            ${tasks.map(task => {
                const title =
                    task.title ||
                    task.task ||
                    task.text ||
                    "";

                const owner =
                    task.owner ||
                    task.assignee ||
                    task.responsible ||
                    "";

                const deadline =
                    task.deadline ||
                    task.due_date ||
                    task.due ||
                    "";

                return `
                    <span class="mm-task-inline">
                        ${RenderHelpers.escape(title)}
                        ${owner ? ` — ${RenderHelpers.escape(owner)}` : ""}
                        ${deadline ? ` — ${RenderHelpers.escape(deadline)}` : ""}
                    </span>
                `;
            }).join(" • ")}
        </div>
    `;

    break;
            
        case 1:
    content = tasks.map(task => {
        const title =
            task.title ||
            task.task ||
            task.text ||
            "";

        const owner =
            task.owner ||
            task.assignee ||
            task.responsible ||
            "";

        const deadline =
            task.deadline ||
            task.due_date ||
            task.due ||
            "";

        return `
            <div class="mm-task-compact">

                <span class="mm-task-compact-title">
                    ${RenderHelpers.escape(title)}
                </span>

                <span class="mm-task-compact-meta">
                    ${owner ? RenderHelpers.escape(owner) : ""}
                    ${owner && deadline ? " • " : ""}
                    ${deadline ? RenderHelpers.escape(deadline) : ""}
                </span>

            </div>
        `;
    }).join("");

    break;

        default:

            content = tasks.map(task =>

                RenderHelpers.card(`

                    <div class="mm-task">

                        <div class="mm-task-title">

                            ${RenderHelpers.escape(
                                task.title ||
                                task.task ||
                                task.text ||
                                ""
                            )}

                        </div>

                        ${
                            task.deadline
                                ? `
                                    <div class="mm-task-deadline">
                                        ${RenderHelpers.badge(task.deadline)}
                                    </div>
                                `
                                : ""
                        }

                    </div>

                `)

            ).join("");

    }

    return RenderHelpers.section(
        "Tasks",
        content,
        "mm-tasks-section"
    );

}

    };

})();
