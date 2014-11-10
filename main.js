define(function (require, exports, module) {
    "use strict";

    var ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeDomain     = brackets.getModule("utils/NodeDomain");

    var simpleDomain = new NodeDomain("htmllint", ExtensionUtils.getModulePath(module, "node/htmllintDomain"));

    // Helper function that runs the htmllint command
    // logs the result to the console
    function logLint() {
        simpleDomain.exec("lint", "<html><head></head><body></body></html>")
            .done(function (errors) {
                errors.forEach(function (error) {
                    console.log("[brackets-htmllint] error: ", error);  
                })
            }).fail(function (err) {
                    console.error("[brackets-htmllint] failed", err);
            });
    }

    // Log memory when extension is loaded
    logLint();
});