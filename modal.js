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
    <div class="mm-modal-header"></div>
    <div class="mm-modal-body"></div>
    <div class="mm-modal-footer"></div>
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
