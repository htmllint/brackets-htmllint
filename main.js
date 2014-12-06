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

            htmllintDomain.exec("lint", html)
                .done(function (errors) {
                    // Success!
                    var result = {
                        errors: [],
                    };
                    errors.forEach(function (error) {
                        var newCode = "(" + error.code + ")";
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
                            .done(function (message) {
                                returnedError.message = message + " " + newCode;
                            });
                        result.errors.push(returnedError);
                    });
                    defer.resolve(result);
                }).fail(function (err) {
                    console.error("Failed: ", err);
                    defer.reject(err);
                });
        })
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
            rootPath,
            finalConfigs = [];

        // if nothing is open, return [] as the option.
        if (!projectRootEntry) {
            return result.resolve([]).promise();
        }

        // get the full absolute path to this directory.
        rootPath = projectRootEntry.fullPath;
        console.log("rootPath", rootPath);
        // get the path relative to the root of the project.
        relPath = FileUtils.getRelativeFilename(rootPath, fullPath);
        console.log("relPath before", relPath);

        // for files outside the root, use default config
        if (!relPath) {
            return result.resolve([]).promise();
        }

        // get the parent directory of our relative path (to remove the *.html part)
        relPath = FileUtils.getDirectoryPath(relPath);
        console.log("relPath after", relPath);

        function addToArray(configs) {
            console.log(configs);
            finalConfigs = finalConfigs.concat(configs);
        }

        getConfig(rootPath + relPath).done(addToArray);

        while (relPath.length > 0) {
            // take off the '/' end of the path to get the new parent directory
            relPath = FileUtils.getDirectoryPath(relPath.substr(0, relPath.length - 1));
            console.log("stripping to: ", relPath);
            getConfig(rootPath + relPath).done(addToArray);
        }

        //        _lookupAndLoad(rootPath, relPath, _readConfig)
        //            .done(function (cfg) {
        //                result.resolve(cfg);
        //            });
        console.log("returning: ", finalConfigs);
        return result.resolve(finalConfigs).promise();
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
        console.log("searching for: ", filePath);

        // get the file object for the filename.
        file = FileSystem.getFileForPath(filePath);
        file.read(function (err, content) {
            if (!err) {
                var config = [];
                try {
                    config = JSON.parse(content);
                } catch (e) {
                    console.error("brackets-htmllint: error parsing " + file.fullPath + ". Details: " + e);
                    result.reject(e);
                    return;
                }
                console.log("Found file at " + filePath + "!!!", config);
                result.resolve(config);
            } else {
                // file does not exist.
                console.log("brackets-htmllint: error finding file " + filePath + ". Details: " + err);
                result.resolve(["not found at " + filePath]);
            }
        });
        //result.resolve(["hello"]);
        return result.promise();
    }

    CodeInspection.register("html", {
        name: namespace,
        scanFileAsync: handleLinter
    });
});