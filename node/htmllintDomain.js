/* eslint-env node */
"use strict";

var htmllint = require("htmllint");

var BRACKETS_TYPE_ERROR = "problem_type_error"; // Same as CodeInspection.Type.ERROR

function lint(html, opts, cb) {
    var promise = htmllint(html, opts);
    promise.then(function (errors) {
        var result = {
            errors: []
        };
        errors.sort(function (a, b) {
            return a.line - b.line;
        });
        for (var i = 0; i < errors.length; i++) {
            var error = errors[i];
            var message = error.code + ' - ' + htmllint.messages.renderIssue(error);
            if (error.rule) {
                message += ' [' + error.rule + ']';
            }
            var returnedError = {
                pos: {
                    line: error.line - 1,
                    ch: error.column
                },
                message: message,
                type: BRACKETS_TYPE_ERROR
            };
            result.errors.push(returnedError);
        }
        cb(null, result);
    }).catch(cb);
}

/**
 * Initializes the test domain with several test commands.
 * @param {DomainManager} domainManager The DomainManager for the server
 */
function init(domainManager) {
    if (!domainManager.hasDomain("htmllint")) {
        domainManager.registerDomain("htmllint", {
            major: 0,
            minor: 1
        });
    }
    domainManager.registerCommand(
        "htmllint", // domain name
        "lint", // command name
        lint, // command handler function
        true, // this command is asynchronous in Node
        "Returns the errors in linted html",
        [
            {
                name: "html", // parameters
                type: "string",
                description: "the string of html to check"
            },
            {
                name: "opts", // parameters
                type: "object",
                description: "the options to pass in"
            }
        ],
        [
            {
                name: "errors", // return values
                type: "array",
                description: "the errors from the linted html"
            }
        ]
    );
}

exports.init = init;
