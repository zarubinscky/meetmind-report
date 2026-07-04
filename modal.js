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
        <h2>Export PDF</h2>
    </div>
    <div class="mm-modal-body">
        Modal Body
    </div>
    <div class="mm-modal-footer">
        Footer
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
