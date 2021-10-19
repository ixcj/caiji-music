// 引入所有的动效文件，导出的class需要与文件名一致
let modules = {}
let optionsArr = []

const context = require.context('./', true, /\.js$/)

context.keys().forEach(filePath => {
  if (![
    // 不引入的文件
    './index.js',
  ].includes(filePath)) {
    let fileName = filePath.replace(/(\.\/|\.js)/g, '')
    modules[fileName] = context(filePath)[fileName]

    // 自动配置options，需要在动效文件里导出text属性
    optionsArr.push({
      text: context(filePath).text,
      value: fileName
    })
  }
})

export const options = optionsArr
export default modules
