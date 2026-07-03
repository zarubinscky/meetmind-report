(function () {

    "use strict";

    window.TasksRenderer = {

        render(report){

            const tasks = report?.tasks ?? [];

            if(!tasks.length){
                return "";
            }

            return RenderHelpers.section(

                "Tasks",

                tasks.map(task =>

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

                ).join(""),

                "mm-tasks-section"

            );

        }

    };

})();
