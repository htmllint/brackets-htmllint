/* eslint-env node */
"use strict";

var htmllint = require("htmllint");

function lint(html, opts) {
    return htmllint(html, {"tag-bans": ["div"]}, opts);
}

function getMessage(code, data) {
    var message = htmllint.messages.renderMsg(code, data);
    //console.log(code + ": " + message);
    return message;
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
    domainManager.registerCommand(
        "htmllint", // domain name
        "getMessage", // command name
        getMessage, // command handler function
        false, // this command is synchronous in Node
        "Gets the proper error message for a code",
        [
            {
                name: "code", // parameters
                type: "string",
                description: "the code to check"
            },
            {
                name: "data", // parameters
                type: "object",
                description: "the object to pass in for data binding"
            }
        ],
        [
            {
                name: "message", // return values
                type: "string",
                description: "the correct message"
            }
        ]
    );
}

exports.init = init;
