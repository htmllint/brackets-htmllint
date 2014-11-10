(function () {
    "use strict";
    
    var htmllint = require("htmllint");
        
    /**
     * @private
     * Handler function for htmllint
     * @param {string} html The html to check
     * @param {array} opts The options to use
     * @return {array} The list of errors.
     */
    function lint(html, opts) {
        return htmllint(html, opts);
    }
    
    /**
     * Initializes the test domain with several test commands.
     * @param {DomainManager} domainManager The DomainManager for the server
     */
    function init(domainManager) {
        if (!domainManager.hasDomain("htmllint")) {
            domainManager.registerDomain("htmllint", {major: 0, minor: 1});
        }
        domainManager.registerCommand(
            "htmllint",       // domain name
            "lint",    // command name
            lint,   // command handler function
            true,          // this command is synchronous in Node
            "Returns the errors in linted html",
            [{name: "html", // parameters
                type: "string",
                description: "the string of html to check"},
             {name: "opts", // parameters
                type: "array",
                description: "the options to pass in"}],
            [{name: "errors", // return values
                type: "array",
                description: "the errors from the linted html"}]
        );
    }
    
    exports.init = init;
    
}());