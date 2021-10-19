// 自动引入当前目录下所有js文件(包括子文件夹)
let modules = {};
const context = require.context('./', true, /\.js$/)
context.keys().forEach(key => {
  if (key !== './index.js') {
    modules[key.replace(/(\.\/|\.js)/g, '')] = context(key).default;
  }
})

export default modules;