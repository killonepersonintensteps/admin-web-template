module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/vue3-essential',
        '@vue/standard', // eslint: recommended
        '@vue/typescript/recommended',
        '@vue/prettier',
    ],
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'prettier/prettier': 'off',
        'vue/no-mutating-props': 'off',
        'vue/multi-word-component-names': [
            'off',
            {
                ignores: [],
            },
        ],
    },
}
