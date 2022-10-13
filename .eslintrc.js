module.exports = {
    env: {
        node: true,
        es2021: true,
    },
    extends: ['standard-with-typescript', 'prettier'],
    overrides: [],
    ignorePatterns: ['built/**/*.ts', 'built/**/*.js'],
    plugins: ['prettier'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
    },
    rules: {
        '@typescript-eslint/semi': ['error', 'always'],
        semi: 'off',
        indent: ['error', 4],
        '@typescript-eslint/indent': 'off',
        strict: 'warn',
        'no-var': 'error',
        'no-unused-expressions': 'error',
        'require-await': 'error',
        camelcase: 'error',
        'prettier/prettier': ['error'],
    },
};
