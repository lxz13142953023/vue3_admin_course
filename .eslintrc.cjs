/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    '.eslintrc-auto-import.json' //后加的，当eslint做校验，就在这个文件中找规则
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  //配置校验规则
  rules: {
    'prettier/prettier': [
      'error',
      {
        semi: false, //没有分号
        wrapAttributes: false, //不刻意换行
        printWidth: 100, //满100换行
        endOfLine: 'auto' // 自动处理换行
      }
    ]
  }
}
