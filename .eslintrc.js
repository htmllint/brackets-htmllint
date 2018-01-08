module.exports = {
    "rules": {
        // the rules below should be sorted in a same way they are sorted on http://eslint.org/docs/rules page
        // http://eslint.org/docs/rules/#possible-errors
        "no-caller": 2,
        "no-control-regex": 2,
        "no-empty": 2,
        "no-invalid-regexp": 2,
        "no-regex-spaces": 2,
        "no-unsafe-negation": 2,
        "valid-jsdoc": 0,
        "valid-typeof": 2,
        // http://eslint.org/docs/rules/#best-practices
        "curly": 2,
        "eqeqeq": ["error", "always", {"null": "ignore"}],
        "guard-for-in": 0,
        "no-else-return": 2,
        "no-fallthrough": 2,
        "no-invalid-this": 2,
        "no-iterator": 2,
        "no-loop-func": 2,
        "no-multi-str": 2,
        "no-new-func": 2,
        "no-new-wrappers": 2,
        "no-new": 2,
        "no-proto": 2,
        "no-script-url": 2,
        "wrap-iife": [2, "outside"],
        // http://eslint.org/docs/rules/#strict-mode
        "strict": 2,
        // http://eslint.org/docs/rules/#variables
        "no-shadow-restricted-names": 2,
        "no-shadow": 2,
        "no-undef": 2,
        "no-unused-vars": [2, {"vars": "all", "args": "none"}],
        "no-use-before-define": 0,
        // http://eslint.org/docs/rules/#nodejs-and-commonjs
        "no-new-require": 2,
        // http://eslint.org/docs/rules/#stylistic-issues
        "block-spacing": 2,
        "brace-style": [2, "1tbs", { allowSingleLine: true }],
        "camelcase": 2,
        "comma-dangle": 2,
        "comma-spacing": 2,
        "comma-style": [2, "last"],
        "computed-property-spacing": 2,
        "eol-last": 2,
        "func-call-spacing": 2,
        "indent": ["warn", 4, { "SwitchCase": 1 }],
        "key-spacing": [2, { beforeColon: false, afterColon: true }],
        "max-len": [2, 120],
        "new-cap": [0, {
            "capIsNewExceptions": [
                "$.Deferred",
                "$.Event",
                "CodeMirror.Pos",
                "Immutable.Map",
                "Immutable.List",
                "JSLINT"
            ]
        }],
        "new-parens": 2,
        "no-bitwise": 2,
        "no-new-object": 2,
        "no-trailing-spaces": 2,
        "semi-spacing": 2,
        "semi": 2,
        "no-console": 0
    },
    "globals": {
        "console": false
    }
};
