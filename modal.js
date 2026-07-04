(function () {

"use strict";

let currentModal = null;

function show(config) {
    close();
    const overlay = document.createElement("div");
    overlay.className = "mm-modal-overlay";
    currentModal = overlay;
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
