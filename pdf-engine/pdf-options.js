(function () {

    "use strict";

    window.PDFOptions = {

        defaults() {

            return {
                header: true,
                statistics: true,
                summary: true,
                findings: true,
                tasks: true,
                owners: true,
                architecture: true,
                footer: true
            };

        }

    };

})();
