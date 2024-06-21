module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'airbnb-base',
    ],
    plugins: ['import', 'prettier'],
    settings: {
        'import/extensions': ['.js', '.jsx', '.ts', '.tsx', '.vue', '.json'],
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },  
    },
    rules: {
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'prettier/prettier': 'error',
        'import/prefer-default-export': 'off',
        'import/extensions': 'off',
        'import/no-named-as-default': 'off',
        'import/no-extraneous-dependencies': ['error', { devDependencies: true, optionalDependencies: true, peerDependencies: true }],
    }
}