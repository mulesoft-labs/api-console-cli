// module.exports = {
//     "env": {
//         "browser": true,
//         "es6": true,
//         "node": true
//     },
//     "extends": "google",
//     "parserOptions": {
//         "ecmaVersion": 2018,
//         "sourceType": "module"
//     },
//     "rules": {
//
//     }
// };
module.exports = {
  extends: ['@advanced-rest-client/eslint-config'].map(require.resolve),
};
