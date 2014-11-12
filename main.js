define(function (require, exports, module) {
    "use strict";
    var logger = '[brackets-htmllint]',
        namespace = 'brackets-htmllint';

    var CodeInspection = brackets.getModule("language/CodeInspection"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeDomain = brackets.getModule("utils/NodeDomain");

    var htmllintDomain = new NodeDomain("htmllint", ExtensionUtils.getModulePath(module, "node/htmllintDomain"));

    function handleLinter(html, fullPath, opts) {
        htmllintDomain.exec("lint", html)
            .done(function (errors) {
                var result = {};
                result.errors = [];

                errors.forEach(function (error) {
                    console.log("[brackets-htmllint] error: ", error);
                    result.errors.push({
                        pos: {
                            line: error.line,
                            ch: error.column
                        },
                        message: error.name + ": " + error.msg,
                        type: CodeInspection.Type.ERROR
                    });
                })
                return result;

            }).fail(function (err) {
                console.error("[brackets-htmllint] failed", err);
            });
    }

    CodeInspection.register("html", {
        name: namespace,
        //scanFile: handleLinter,
        scanFileAsync: handleLinter
    });
});