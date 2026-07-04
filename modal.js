(function () {

"use strict";

let currentModal = null;

function show(config) {

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
