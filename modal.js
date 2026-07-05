(function () {

"use strict";
let currentModal = null;

function show(config) {
    close();
    const overlay = document.createElement("div");
    overlay.className = "mm-modal-overlay";
    currentModal = overlay;

    const dialog = document.createElement("div");
    dialog.className = "mm-modal";

    dialog.innerHTML = `
    <div class="mm-modal-header">
        <h2 class="mm-modal-title">
            ${config.title || ""}
        </h2>
    </div>
    <div class="mm-modal-body">
        ${config.content || ""}
    </div>
    <div class="mm-modal-footer">
        ${(config.actions || []).map(action => `
            <button
                type="button"
                class="mm-modal-button ${action.className || ""}"
                data-action="${action.id || ""}"
            >
                ${action.label || ""}
            </button>
        `).join("")}
    </div>
`;
overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    console.log("Modal.show()", config);
}

function close() {
    if (currentModal) {
        currentModal.remove();
        currentModal = null;
    }
}

window.Modal = {

    show,

    close

};

})();
