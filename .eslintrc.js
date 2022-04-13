module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: ["airbnb-base", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "import/no-unresolved": [
      2,
      {
        ignore: ["^@?/", "^\\.?"]
      }
    ],
    "import/extensions": "off",
    "import/no-cycle": [
      2,
      {
        maxDepth: 1
      }
    ],
    "react/jsx-props-no-spreading": "off",
    "import/prefer-default-export": "off",
  }
};
