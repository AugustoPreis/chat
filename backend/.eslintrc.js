module.exports = {
  "env": {
    "commonjs": true,
    "jest": true,
    "es6": true,
    "node": true
  },
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "rules": {
    "for-direction": 1,
    "no-const-assign": 1,
    "no-dupe-else-if": 1,
    "no-dupe-keys": 1,
    "no-duplicate-case": 1,
    "no-empty-pattern": 1,
    "no-func-assign": 1,
    "no-import-assign": 1,
    "no-invalid-regexp": 1,
    "no-irregular-whitespace": 1,
    "no-self-assign": 1,
    "no-undef": 2,
    "no-unexpected-multiline": 1,
    "no-unmodified-loop-condition": 1,
    "no-unreachable": 1,
    "no-unreachable-loop": 1,
    "no-unused-vars": 1,
    "valid-typeof": 1,
    "arrow-body-style": 1,
    "block-scoped-var": 1,
    "dot-notation": 1,
    "no-console": 1,
    "no-else-return": 1,
    "no-empty": 1,
    "no-empty-function": 1,
    "no-eq-null": 1,
    "no-extra-semi": 1,
    "no-extra-boolean-cast": 1,
    "no-global-assign": 1,
    "no-lone-blocks": 1,
    "no-lonely-if": 1,
    "no-multi-assign": 1,
    "no-new-func": 1,
    "no-new-object": 1,
    "no-redeclare": 1,
    "no-regex-spaces": 1,
    "no-return-assign": 1,
    "no-unneeded-ternary": 1,
    "no-useless-computed-key": 1,
    "no-useless-concat": 1,
    "no-useless-escape": 1,
    "no-useless-rename": 1,
    "no-void": 1,
    "object-shorthand": 1,
    "one-var-declaration-per-line": 1,
    "prefer-arrow-callback": 1,
    "prefer-const": 1,
    "prefer-destructuring": ["warn", {
      "VariableDeclarator": {
        "array": false,
        "object": true
      }
    }],
    "require-await": 1,
    "yoda": 1
  }
}