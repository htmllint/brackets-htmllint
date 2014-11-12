define(function (require, exports, module) {
    "use strict";
    var logger = '[brackets-htmllint]',
        namespace = 'brackets-htmllint';

    var CodeInspector = brackets.getModule("language/CodeInspection"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeDomain = brackets.getModule("utils/NodeDomain");

    var htmllintDomain = new NodeDomain("htmllint", ExtensionUtils.getModulePath(module, "node/htmllintDomain"));

    

    function handleLinter() {
        htmllintDomain.exec("lint", currentDoc.getText())
            .done(function (errors) {
                errors.forEach(function (error) {
                    console.log("[brackets-htmllint] error: ", error);
                })
            }).fail(function (err) {
                console.error("[brackets-htmllint] failed", err);
            });
    }

    CodeInspection.register("html", {
        name: namespace,
        scanFile: handleLinter,
        scanFileAsync: handleLinter
    });
});