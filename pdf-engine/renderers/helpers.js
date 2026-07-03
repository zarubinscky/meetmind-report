(function () {

    "use strict";

    window.RenderHelpers = {

        escape(value){

            return String(value ?? "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");

        },

        section(title, content, className = ""){

            return `
                <section class="mm-pdf-section ${className}">
                    ${title ? `<h2 class="mm-pdf-section-title">${this.escape(title)}</h2>` : ""}
                    ${content || ""}
                </section>
            `;

        },

        card(content, className = ""){

            return `
                <div class="mm-pdf-card ${className}">
                    ${content || ""}
                </div>
            `;

        },

        badge(label, className = ""){

            return `
                <span class="mm-pdf-badge ${className}">
                    ${this.escape(label)}
                </span>
            `;

        }

    };

})();
