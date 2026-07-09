(function () {

    "use strict";

    window.TasksRenderer = {

       render(report, options = {}) {

    const tasks = report?.tasks ?? [];

    const mode =
        options.layoutModes?.tasks ??
        "cards";

    console.log("Tasks mode:", mode);

    if (!tasks.length) {
        return "";
    }

    let content = "";

    switch (mode) {

        case "inline":

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
            
        case "compact":

            content = tasks.map(task => `
                <div class="mm-task-compact">

                    <span class="mm-task-compact-title">
                        ${RenderHelpers.escape(
                            task.title ||
                            task.task ||
                            task.text ||
                            ""
                        )}
                    </span>

                    ${
                        task.deadline
                            ? RenderHelpers.badge(task.deadline)
                            : ""
                    }

                </div>
            `).join("");

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
