/* global define, brackets, $ */

define(function (require, exports, module) {
    "use strict";
    var namespace = 'brackets-htmllint';
    var _configFileName = ".htmllintrc";

    var CodeInspection = brackets.getModule("language/CodeInspection"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeDomain = brackets.getModule("utils/NodeDomain"),
        FileSystem = brackets.getModule("filesystem/FileSystem"),
        FileUtils = brackets.getModule("file/FileUtils"),
        ProjectManager = brackets.getModule("project/ProjectManager");

    var htmllintDomain = new NodeDomain("htmllint", ExtensionUtils.getModulePath(module, "node/htmllintDomain"));

    function handleLinter(html, fullPath) {
        var defer = new $.Deferred();
        loadConfigs(fullPath).done(function (options) {
            console.log("options: ", options);
            htmllintDomain.exec("lint", html, options)
                .done(function (errors) {
                    // Success!
                    var result = {
                        errors: []
                    };
                    for (var i = 0; i < errors.length; i++) {
                        var error = errors[i];
                        var newCode = error.code + ": ";
                        var returnedError = {
                            pos: {
                                line: error.line - 1, // I don't know why.
                                col: error.column
                            },
                            message: newCode,
                            type: CodeInspection.Type.ERROR
                        };

                        // get the message!
                        htmllintDomain.exec("getMessage", error.code, error.data)
                            .done(function (message) { // eslint-disable-line no-loop-func
                                returnedError.message = newCode + message;
                            });
                        result.errors.push(returnedError);
                        if (i === errors.length - 1) {
                            defer.resolve(result);
                        }
                    }
                }).fail(function (err) {
                    console.error("Failed: ", err);
                    defer.reject(err);
                });
        });
        return defer.promise();
    }

    /*
     * Takes the full path to the file, provided via Brackets.
     * Does a lookup starting from the project root down to the directory of the current file.
     * When it finds a valid .htmllintrc file, it will parse the JSON and add it to the options,
     * overwriting previous options.
     * Returns the final options set.
     */
    function loadConfigs(fullPath) {
        var projectRootEntry = ProjectManager.getProjectRoot(),
            result = new $.Deferred(),
            relPath,
            rootPath;

        // if nothing is open, return {} as the option.
        if (!projectRootEntry) {
            return result.resolve({}).promise();
        }

        // get the full absolute path to this directory.
        rootPath = projectRootEntry.fullPath;
        //console.log("rootPath", rootPath);
        // get the path relative to the root of the project.
        relPath = FileUtils.getRelativeFilename(rootPath, fullPath);
        //console.log("relPath before", relPath);

        // for files outside the root, use default config
        if (!relPath) {
            return result.resolve({}).promise();
        }

        // get the parent directory of our relative path (to remove the *.html part)
        relPath = FileUtils.getDirectoryPath(relPath);
        //console.log("relPath after", relPath);

        lookUpFiles(rootPath, relPath).done(function (configs) {
            //console.log("returning: ", configs);
            result.resolve(configs);
        });

        return result.promise();
    }

    function lookUpFiles(rootPath, relPath) {
        var result = new $.Deferred(),
            finalConfigs = {};

        // any changes made here should also be changed below
        // (too lazy to combine in yet another function)
        getConfig(rootPath + relPath).done(function (configs) {
            //console.log(configs);
            var keys = Object.keys(configs);
            keys.forEach(function (key) {
                if (configs.hasOwnProperty(key) && !finalConfigs[key]) {
                    finalConfigs[key] = configs[key];
                }
            });
            if (!(relPath.length > 0)) {
                result.resolve(finalConfigs);
            }
        });

        while (relPath.length > 0) {
            // take off the '/' end of the path to get the new parent directory
            relPath = FileUtils.getDirectoryPath(relPath.substr(0, relPath.length - 1));
            //console.log("stripping to: ", relPath);
            getConfig(rootPath + relPath).done(function (configs) { // eslint-disable-line no-loop-func
                //console.log(configs);
                var keys = Object.keys(configs);
                keys.forEach(function (key) {
                    if (configs.hasOwnProperty(key) && !finalConfigs[key]) {
                        finalConfigs[key] = configs[key];
                    }
                });
                if (!(relPath.length > 0)) {
                    result.resolve(finalConfigs);
                }
            });
        }

        return result.promise();
    }

    /*
     * Takes a directory.
     * Uses the directory to look for the ".htmllintrc" file
     * and JSON parses it.
     * Returns the object.
     */
    function getConfig(directory) {
        var result = new $.Deferred(),
            filePath = directory + _configFileName,
            file;
        //console.log("searching for: ", filePath);

        // get the file object for the filename.
        file = FileSystem.getFileForPath(filePath);
        file.read(function (err, content) {
            if (!err) {
                var config = {};
                try {
                    config = JSON.parse(content);
                } catch (e) {
                    console.log("brackets-htmllint: error parsing " + file.fullPath + ". Details: " + e);
                    result.resolve({});
                    return;
                }
                console.log("Found .htmllintrc at " + directory + "!", config);
                result.resolve(config);
            } else {
                // file does not exist.
                console.log("brackets-htmllint: error finding file " + filePath + ". Details: " + err);
                result.resolve({});
            }
        });
        return result.promise();
    }

    CodeInspection.register("html", {
        name: namespace,
        scanFileAsync: handleLinter
    });
});
