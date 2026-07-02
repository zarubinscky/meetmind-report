(function () {
    "use strict";

    const DEFAULT_PAGE = {

        width: 794,
        height: 1123,

        marginTop: 48,
        marginBottom: 48,

        marginLeft: 48,
        marginRight: 48,

        gap: 16

    };

    function getContentArea(page = DEFAULT_PAGE){

        return {

            x: page.marginLeft,

            y: page.marginTop,

            width:
                page.width
                - page.marginLeft
                - page.marginRight,

            height:
                page.height
                - page.marginTop
                - page.marginBottom

        };

    }

    function solve(blocks, page = DEFAULT_PAGE){

        return {

            page,

            area: getContentArea(page),

            blocks

        };

    }

    window.GeometrySolver = {

        version: "1.0.0",

        solve

    };

    console.log("✅ Geometry Solver loaded.");

})();
