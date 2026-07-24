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

                console.log("TASK RENDERER TASK:", task);
                
                const title = task.title ?? task.task;
                const owner = task.owner;
                const deadline =
                   task.deadline ??
                   task.dueDate ??
                   task.due_date;

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
       
        const title = task.title;

        const owner = task.owner;

        const deadline = task.deadline;

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

            content = tasks.map(task => {
                const title = task.title ?? task.task;
                const owner = task.owner;
                const deadline =
                  task.deadline ??
                  task.dueDate ??
                  task.due_date;

                RenderHelpers.card(`

                    <div class="mm-task">

    <div class="mm-task-title">
    ${RenderHelpers.escape(title)}
</div>

${
    owner
        ? `
            <div class="mm-task-owner">
                ${RenderHelpers.escape(owner)}
            </div>
        `
        : ""
}

${
    deadline
        ? `
            <div class="mm-task-deadline">
                ${RenderHelpers.badge(deadline)}
            </div>
        `
        : ""
}

</div>

            `);

             }).join("");

    }

    return RenderHelpers.section(
        "Tasks",
        content,
        "mm-tasks-section"
    );

}

    };

})();
