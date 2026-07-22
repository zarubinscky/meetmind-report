(function () {

"use strict";

function measure(reportElement) {

    if (!reportElement) {
        return {
            totalHeight: 0,
            sections: {}
        };
    }

    const sections = {};

    reportElement
        .querySelectorAll(".mm-pdf-section")
        .forEach((section, index) => {

            const className = Array.from(section.classList)
                .find(name => name !== "mm-pdf-section") || `section-${index}`;

            const rect = section.getBoundingClientRect();

            sections[className] = {
                height: Math.ceil(rect.height),
                top: Math.ceil(rect.top),
                bottom: Math.ceil(rect.bottom)
            };
        });
    const reportRect = reportElement.getBoundingClientRect();
    

    const availableHeight =
    DEFAULT_PAGE.height
    - DEFAULT_PAGE.marginTop
    - DEFAULT_PAGE.marginBottom;

console.log("REPORT RECT:", reportRect.height);
console.log("REPORT OFFSET:", reportElement.offsetHeight);
console.log("REPORT SCROLL:", reportElement.scrollHeight);
const lastSection =
    Object.values(sections)
        .sort((a, b) => b.bottom - a.bottom)[0];
console.log("LAST SECTION BOTTOM:", lastSection.bottom);
    
return {
    totalHeight: Math.ceil(reportRect.height),
    availableHeight,
    overflow:
        Math.ceil(reportRect.height)
        - availableHeight,
    sections
};
}

window.LayoutEvaluator = {
    version: "1.0.0",
    measure
};

console.log("✅ Layout Evaluator loaded.");

})();
