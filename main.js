define(function (require, exports, module) {
    "use strict";
    var namespace = 'brackets-htmllint';

    var CodeInspection = brackets.getModule("language/CodeInspection"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeDomain = brackets.getModule("utils/NodeDomain");

    var htmllintDomain = new NodeDomain("htmllint", ExtensionUtils.getModulePath(module, "node/htmllintDomain"));

    function handleLinter(html, fullPath, options) {
        var defer = new $.Deferred();
        htmllintDomain.exec("lint", html)
            .done(function (errors) {
                var result = {
                    errors: [],
                };
                errors.forEach(function (error) {
                    console.log("old error: ", error);
                    var returnedError = {
                        pos: {line: error.line, col: error.column},
                        message: error.name + ": " + error.msg,
                        type: CodeInspection.Type.ERROR
                    };
                    console.log("new error: ", returnedError);
                    result.errors.push(returnedError);
                });
                defer.resolve(result);
            }).fail(function (err) {
                console.error("Failed: ", err);
            });
        return defer.promise();
    }

    CodeInspection.register("html", {
        name: namespace,
        scanFileAsync: handleLinter
    });
});