module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  extends: ["@nuxtjs", "plugin:nuxt/recommended"],
  // add your custom rules here
  rules: {
    "nuxt/no-globals-in-created": 0,
    "no-unused-vars": 1,
    "no-undef": 1,
    "quotes": 1
  }
};
