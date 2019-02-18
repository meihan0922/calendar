module.exports = {
    extends: ['google', 'plugin:react/recommended'],
    rules: {
        indent: ['error', 4,{ "SwitchCase": 1 }],
        'linebreak-style': ['error', 'windows'],
        'require-jsdoc': 'off',
        'space-infix-ops':'error',
        'no-invalid-this': 'off',
        'max-len': 0,
        'object-curly-newline': ['error',{
            "ImportDeclaration": "never"
            }
        ],
        'object-curly-spacing': ['error', 'always'],
        // react
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
        'react/jsx-first-prop-new-line': 'multiline',
        'react/jsx-max-props-per-line': [1, { 'when': 'always' }],
        "react/jsx-equals-spacing": 'error',
        'react/jsx-tag-spacing':'error'
    },
    env: { browser: true, commonjs: true, es6: true, node: true },
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module',
        allowImportExportEverywhere: true,
        ecmaFeatures: {
            ecmaVersion: 6,
            impliedStrict: true,
            jsx: true,
        },
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
