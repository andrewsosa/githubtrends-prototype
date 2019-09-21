module.exports = {
  extends: [
    "airbnb-base",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:flowtype/recommended",
  ],
  parser: "babel-eslint",
  plugins: ["prettier", "flowtype"],
  env: {
    browser: true,
    jest: true,
    es6: true,
  },
  rules: {
    "no-console": "off",
    "no-param-reassign": "off",
    "import/prefer-default-export": "off",
    "prettier/prettier": "error",
    "react/prop-types": "off",
  },
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: false,
    },
  },
};
