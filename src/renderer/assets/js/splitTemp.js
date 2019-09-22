import fs from 'fs'
import path from 'path'
import outFileBase from './setOutFileBase'
var vueBeautify = require('vue-beautify')

// 读取static/components下的文件名
const getComponentArr = () => {
  const componentPath = path.join(__static, '/components')
  const componentArr = fs.readdirSync(componentPath)
  return componentArr
}

// 获取vue文件并拆分
const getVueContent = (isOut, src) => {
  let realPath = isOut ? `${outFileBase}` : path.join(__static, src)
  let fileContents = fs.readFileSync(realPath, 'utf8')
  return splitTmp(fileContents)
}

// vue字符串拆分成template、js、css
const splitTmp = (fileContents) => {
  const scriptReg = /<script.*?>([\s\S]+?)<\/script>/img
  const temReg = /<template>([\s\S]+?)<\/template>/img
  const styleReg = /<style.*?>([\s\S]+?)<\/style>/img

  let scriptResult = scriptReg.exec(fileContents)[1]
  let temResult = temReg.exec(fileContents)[1]
  let styleResult = styleReg.exec(fileContents)[1]
  scriptResult = scriptResult.split('export default')[1].replace(/(^\s*)|(\s*$)/g, '')
  return {
    temResult,
    scriptResult,
    styleResult
  }
}

/* eslint-disable */
// 将字符串转换成json
const strToJson = (str) => {
  var json = (new Function('return' + str))()
  // var json = eval('('+ str +')')
  return json
}

// 将json对象中的方法转换成字符串，并在方法前加上###Fn###  方便后面去除
const fnToString = (data) => {
  for (let [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      data[key] = value
    } else if (typeof value === 'function') {
      data[key] = `###Fn###${value.toString()}`
    } else if (key === 'props') {
      let props = ''
      for (let [key1, value1] of Object.entries(value)) {
        let name = value1.type.name
        if (name === 'String') {
          props += `${key1}:{default: '${value1.default}', type: ${name}},`
        } else if (name === 'Number' || name === 'Boolean') {
          props += `${key1}:{default: ${value1.default}, type: ${name}},`
        } else if (name === 'Object' || name === 'Array') {
          props += `${key1}:{default: () => {}, type: ${name}},`
        }
        data[key] = `{${props.substr(0, props.length - 1)}}`
      }
    } else {
      fnToString(data[key])
    }
  }
  return data
}

// 转js模块成带有###Fn### 的字符串
const JsonToSpecialStr = (data) => {
  data = fnToString(data)
  data = JSON.stringify(data)
  if (data.indexOf('\\n')) {
    data = data.replace(/\\n/g, ' \n').replace(/["]/g, '')
  }
  return data
}

// 去除###Fn### 
const FnMove = (string) => {
  const FnMoveReg = /###Fn###([\s\S]+?)\(/img
  let  moveStr = FnMoveReg.exec(string)
  if (moveStr === null) {
    return string
  }
  string = string.replace(`${moveStr[1]}:###Fn###`, '')
  return FnMove(string)
}

// 美化模版
const beautifyTmp = (res) => {
  const options = {
    intent_scripts: 'keep',
    indent_size: 2,
    space_in_empty_paren: true
  }
  let output = `
    <template>${res.temResult}</template>
    <script>
      export default ${res.scriptResult}
    </script>
    <style scoped lang="less">
      ${res.styleResult}
    </style>
  `
  output = FnMove(output)
  output = vueBeautify(output, options)
  return output
}

// 起始模版
const originTmp = 
`<template>
  <div class="demo"></div>
</template>
<script>
  export default {}
</script>
<style scoped lang="less">
</style>
`
// 写入文件
const writeFileSync = (output) => {
  fs.writeFileSync(outFileBase, output)
}

// 导出文件到指定目录
const outputFile = (src, output) => {
  fs.writeFileSync(src, output)
}

export {
  getComponentArr,
  getVueContent,
  splitTmp,
  beautifyTmp,
  writeFileSync,
  strToJson,
  JsonToSpecialStr,
  FnMove,
  outputFile,
  originTmp
}