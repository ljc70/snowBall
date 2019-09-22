<!--
 * @Author: lanjicen
 * @LastEditors: lanjicen
 * @Description: 主页面
 * @Date: 2019-07-31 10:24:25
 * @LastEditTime: 2019-09-03 17:47:03
 -->
<template>
  <div class='home'>
    <div class="head">雪球系统</div>
    <div class="main">
      <div class="left">
        <el-menu default-active="2" class="el-menu-vertical-demo">
          <el-submenu :index="`'${index}'`" v-for="(item, index) in list" :key="index">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.title}}</span>
            </template>
            <el-menu-item
              @mousedown.native="mousedown($event, tag)"
              :index="`${index}-${index1}`"
              v-for="(tag, index1) in item.item"
              :key="index1">{{tag}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <div class="middle">
        <div class="content" ref="content">
          <iframe id="iframe" class="iframe" src="http://localhost:1112/" width="375" height="667" frameborder="0"></iframe>
          <div class="hide-box" ref="hideBox"  v-html="hideHtml"></div>
        </div>
        <div class="turn"><i class="el-icon-d-arrow-left" @click="turnToView"></i></div>
        <div class="show-code">
          <code-mirror :value="lastOutput" @input="codeMirrorChange"></code-mirror>
        </div>
      </div>
      <div class="right">
        <el-button type="primary" @click="drawVisible=true">画布样式</el-button>
        <el-button type="primary" @click="containerVisible=true">添加容器</el-button>
        <el-button type="primary" @click="resetFile">文件重置</el-button>
        <el-button type="primary" @click="clearBackground">清除背景</el-button>
        <el-button type="primary" @click="output">导出文件</el-button>
      </div>
    </div>
    <div class="move" v-show="showMove" ref="move">{{nowTag}}</div>
    <el-dialog title="画布样式修改" :visible.sync="drawVisible">
      <el-form :model="form">
        <el-form-item label="组件class名称" :label-width="formLabelWidth">
          <el-input v-model="form.class" type="text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="display属性" :label-width="formLabelWidth">
          <el-select v-model="form.display" placeholder="请选择display属性">
            <el-option label="block" value="block"></el-option>
            <el-option label="flex" value="flex"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="背景颜色" :label-width="formLabelWidth">
          <el-color-picker v-model="form.background"></el-color-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="drawVisible = false">取 消</el-button>
        <el-button type="primary" @click="drawSure">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置容器样式" :visible.sync="containerVisible">
      <el-form :model="container">
        <el-form-item label="display属性" :label-width="formLabelWidth">
          <el-select v-model="container.display" placeholder="请选择display属性">
            <el-option label="block" value="block"></el-option>
            <el-option label="flex" value="flex"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="背景颜色" :label-width="formLabelWidth">
          <el-color-picker v-model="container.background"></el-color-picker>
        </el-form-item>
        <el-form-item label="宽度" :label-width="formLabelWidth">
          <el-input v-model="container.width" type="number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="高度" :label-width="formLabelWidth">
          <el-input v-model="container.height" type="number" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="containerVisible = false">取 消</el-button>
        <el-button type="primary" @click="containerSure">确 定</el-button>
      </div>
    </el-dialog>
    <div class="html-contain" ref="htmlContain"></div>
  </div>
</template>
<script>
import { getComponentArr, splitTmp, getVueContent, beautifyTmp, writeFileSync, strToJson, JsonToSpecialStr, FnMove, outputFile, originTmp } from '../../../renderer/assets/js/splitTemp'
import { getElementPageLeft, getElementPageTop } from '../../../renderer/assets/js/utils'
import { _ } from 'lodash'
import CodeMirror from '../../components/CodeMirror'
const { dialog, BrowserWindow } = require('electron').remote

export default {
  components: {
    CodeMirror
  },
  data() {
    return {
      list: [
        {
          title: '基础组件',
          item: []
        },
        {
          title: '复杂组件',
          item: ['Button', 'Button', 'Button']
        }
      ],
      tempClass: 'demo',
      nowTag: '',
      showMove: false,
      wrapIndex: 0,
      myEvent: null,
      containerVisible: false,
      drawVisible: false,
      form: {
        display: '',
        background: '',
        class: ''
      },
      container: {
        display: '',
        background: '',
        width: '',
        height: ''
      },
      formLabelWidth: '120px',
      hideHtml: '',
      disX: 0,
      disY: 0,
      lastCode: '', // codeMirror中最终内容 双向绑定数据会导致第二次输入的时候光标又在文档首位
      lastOutput: '' // 最终输出
    }
  },
  computed: {},
  watch: {},
  methods: {
    /*
    * 去除调试时设置的背景色
    */
    clearBackground() {
      const reg = /background:([\s\S]+?);/img
      let indexFs = splitTmp(this.lastOutput)
      let arr = indexFs.styleResult.split('}')
      arr = arr.map((item) => {
        if (item.includes(this.tempClass) && item.includes('background')) {
          let result = item.match(reg)[0]
          item = item.replace(result, '')
        }
        return item.replace(/(\s*$)/g, '')
      })
      indexFs.styleResult = arr.join('}')
      const output = beautifyTmp(indexFs)
      writeFileSync(output)
      this.lastOutput = output
    },
    /*
    * 重置文件 同时重置data中部分数据
    */
    resetFile() {
      this.nowTag = ''
      this.wrapIndex = 0
      this.hideHtml = ''
      this.$refs.htmlContain.innerHTML = ''

      this.lastOutput = originTmp
      writeFileSync(originTmp)
    },
    /*
    * 将codeMirror中代码变动缓存起来
    */
    codeMirrorChange(data) {
      this.lastCode = data
    },
    /*
    * 将codeMirror中代码写入文件
    */
    turnToView() {
      if (!this.lastCode) {
        return false
      }
      this.lastOutput = this.lastCode
      writeFileSync(this.lastOutput)
    },
    /*
    * 物体碰撞检测
    */
    mousedown(e, tag) {
      // oDiv为拖拽物体
      let oDiv = this.$refs.move
      this.nowTag = tag
      let left = getElementPageLeft(e.target)
      let top = getElementPageTop(e.target)
      oDiv.style.left = left + 'px'
      oDiv.style.top = top + 'px'
      this.showMove = true
      this.disX = e.clientX - oDiv.offsetLeft - left
      this.disY = e.clientY - oDiv.offsetTop - top
      // oDiv2为总容器
      let oDiv2 = this.$refs.hideBox
      let children = Array.from(oDiv2.childNodes)
      this.mousemove(oDiv, children.length > 0 ? children : [oDiv2], this.disX, this.disY, children.length > 0)
    },
    mousemove(oDiv, arr, disX, disY, needTest = false) {
      // needTest表示总容器中有子容器，若检测完子容器没有碰撞，则需要再检测与总容器是否碰撞
      // 将需要使用到到目标容器属性存在数组中，减少dom操作
      arr = arr.map((item, index) => {
        const obj = {
          className: item.className,
          t2: getElementPageTop(item),
          l2: getElementPageLeft(item),
          r2: getElementPageLeft(item) + item.offsetWidth,
          b2: getElementPageTop(item) + item.offsetHeight
        }
        return obj
      })
      // 移动物体跟着鼠标移动
      document.onmousemove = ev => {
        oDiv.style.left = ev.clientX - disX + 'px'
        oDiv.style.top = ev.clientY - disY + 'px'
      }
      // 鼠标抬起检测碰撞
      document.onmouseup = (ev) => {
        ev = ev || window.event
        let t1 = getElementPageTop(oDiv)
        let l1 = getElementPageLeft(oDiv)
        let r1 = getElementPageLeft(oDiv) + oDiv.offsetWidth
        let b1 = getElementPageTop(oDiv) + oDiv.offsetHeight
        for (let index = 0; index < arr.length; index++) {
          let item = arr[index]
          // isKnocked为true表示没有碰撞
          const isKnocked = b1 < item.t2 || l1 > item.r2 || t1 > item.b2 || r1 < item.l2
          arr[index].isKnocked = !isKnocked
        }
        // 状态重置
        document.onmousemove = null
        document.onmouseup = null
        oDiv.style.left = '0px'
        oDiv.style.top = '0px'
        this.showMove = false
        // 筛选结果 当检测完没有碰到到子盒子时，继续检测是否碰撞到父盒子
        let result = arr.filter((item, index) => {
          return item.isKnocked
        })
        if (result.length > 0) {
          this.knockSuccess(result[0].className)
        } else {
          if (needTest) {
            let oDiv2 = this.$refs.hideBox
            const object = {
              className: oDiv2.className,
              t2: getElementPageTop(oDiv2),
              l2: getElementPageLeft(oDiv2),
              r2: getElementPageLeft(oDiv2) + oDiv2.offsetWidth,
              b2: getElementPageTop(oDiv2) + oDiv2.offsetHeight
            }
            // isKnocked为true表示没有碰撞
            const isKnocked = b1 < object.t2 || l1 > object.r2 || t1 > object.b2 || r1 < object.l2
            if (!isKnocked) {
              this.knockSuccess(oDiv2.className)
            }
            console.log('object~~~~', object, isKnocked)
          }
        }
        console.log('~~~~~碰撞结束', result[0])
      }
    },
    /*
    * 成功碰撞回调，将拖动出来的组件放入碰撞容器，并写入文件
    */
    knockSuccess(container) {
      // this.nowTag 移动的组件 container 承载组件的容器
      let componentFs = getVueContent(false, `/components/${this.nowTag}.vue`)
      let indexFs = splitTmp(this.lastOutput)
      indexFs.styleResult = `${indexFs.styleResult}${componentFs.styleResult}`
      // 处理template部分
      let html = ''
      if (container === 'hide-box') {
        container = this.tempClass
        this.$refs.htmlContain.innerHTML = `${this.$refs.htmlContain.innerHTML.replace(/(\s*$)/g, '')}${componentFs.temResult}`
        html = this.$refs.htmlContain.innerHTML
      } else {
        let box = this.$refs.htmlContain.querySelector(`.${container}`)
        box.innerHTML = `${box.innerHTML.replace(/(\s*$)/g, '')}${componentFs.temResult}`
        html = this.$refs.htmlContain.innerHTML
      }
      indexFs.temResult = `<div class="${this.tempClass}">${html}</div>`
      // 处理js部分
      let componentJson = strToJson(componentFs.scriptResult)
      let indexJson = strToJson(indexFs.scriptResult)
      let componentData = componentJson.data ? componentJson.data() : {}
      let indexData = indexJson.data ? indexJson.data() : {}
      let changeRes = this.preparateLifeCircle(componentJson, indexJson)
      let res = _.merge({}, indexJson, componentJson)
      if (Object.keys(changeRes).length > 0) {
        for (const [key, value] of Object.entries(changeRes)) {
          res[key] = `###Fn###${key}() {
            ${value}
          }`
        }
      }
      res = JsonToSpecialStr(res)
      res = FnMove(res)
      const result = this.dealData(componentData, indexData, res)
      console.log('result~~~', result)
      // indexFs.scriptResult = result
      let lastFs = Object.assign({}, indexFs, {scriptResult: result})
      console.log('lastFs~~~', lastFs)
      lastFs.scriptResult = result
      const output = beautifyTmp(lastFs)
      writeFileSync(output)
      this.lastOutput = output
    },
    /*
    * vue文件data部分单独处理
    */
    dealData(componentData, indexData, res) {
      let data = _.merge(indexData, componentData)
      const reg = /data\(\) \{([\s\S]+?)\},/img
      let result = reg.exec(res)
      let str = this.dealMutiData(data)
      str = `return {
        ${str}}`
      res = result.input.replace(result[1], `${str}`)
      console.log('dealData~~~~~~res', res)
      return res
    },
    /*
    * 处理data中多层嵌套数据结构
    */
    dealMutiData(data) {
      let str = ''
      for (let [key, value] of Object.entries(data)) {
        if (typeof value === 'boolean' || typeof value === 'number') {
          str += `${key}: ${value},
        `
        } else if (typeof value === 'string') {
          str += `${key}: ${value || `''`},
        `
        } else if (typeof value === 'object') {
          str += `${key}: ${JSON.stringify(value).replace(/["]/g, '\'')},
        `
        }
      }
      return str
    },
    /*
    * 检测需要合并的vue文件是否存在生命周期重复，如果有重复，代码合并
    */
    preparateLifeCircle(dataA, dataB) {
      // 筛选出重复的生命周期
      let [arrA, arrB] = [[], []]
      let changeRes = {}
      for (const [key, value] of Object.entries(dataA)) {
        if (typeof value === 'function') {
          arrA.push(key)
        }
      }
      for (const [key, value] of Object.entries(dataB)) {
        if (typeof value === 'function') {
          arrB.push(key)
        }
      }
      const result = arrA.filter((item, index) => {
        return arrB.includes(item)
      }).filter(item => {
        return item !== 'data'
      })
      console.log(result)
      if (result.length > 0) {
        for (let index = 0; index < result.length; index++) {
          const value = result[index]
          let aFn = dataA[value].toString()
          let moveA = `${aFn.split('{')[0]}{`
          aFn = aFn.replace(moveA, '')
          aFn = aFn.substr(0, aFn.length - 1)
          console.log('aFn~~~~', aFn)
          let bFn = dataB[value].toString()
          let moveB = `${bFn.split('{')[0]}{`
          bFn = bFn.replace(moveB, '')
          bFn = bFn.substr(0, bFn.length - 1)
          console.log('bFn~~~~', bFn)
          const output = `${bFn.replace(/(^\s*)|(\s*$)/g, '')}${aFn.replace(/(\s*$)/g, '')}`
          changeRes[value] = output
          console.log('output', output)
        }
      }
      return changeRes
    },
    /*
    * 将创建的容器写入文件
    */
    containerSure() {
      let outStyle = ''
      if (this.container.display === 'flex') {
        outStyle = `display: ${this.container.display};`
      }
      if (this.container.width) {
        outStyle += `width: ${this.container.width}px;`
      }
      if (this.container.height) {
        outStyle += `height: ${this.container.height}px;`
      }
      if (this.container.background) {
        outStyle += `background: ${this.container.background};`
      }
      console.log('outStyle', outStyle)
      let div = document.createElement('div')
      div.className = `${this.tempClass}-wrap${this.wrapIndex}`
      this.$refs.htmlContain.appendChild(div)
      console.log('~~~~~~~~~~innerHTML', this.$refs.htmlContain.innerHTML)
      let readFs = splitTmp(this.lastOutput)
      let res = `<div class="${this.tempClass}">${this.$refs.htmlContain.innerHTML}</div>`
      console.log('res~~~', res)
      readFs.styleResult = readFs.styleResult + `.${this.tempClass}-wrap${this.wrapIndex}{${outStyle}}`
      readFs.temResult = res
      const output = beautifyTmp(readFs)
      writeFileSync(output)
      this.lastOutput = output
      this.hideHtml += `<div class="${this.tempClass}-wrap${this.wrapIndex}" style="${outStyle}"></div>`
      this.wrapIndex += 1
      this.containerVisible = false
    },
    /*
    * 将画布样式写入文件
    */
    drawSure() {
      let outStyle = ''
      let readFs = splitTmp(this.lastOutput)
      let changeReg = new RegExp(this.tempClass, 'g')
      console.log('readFs~~~~~~~~~~~~', readFs)
      if (this.form.display === 'flex') {
        outStyle = `display: ${this.form.display};`
      }
      if (this.form.background) {
        outStyle += `background: ${this.form.background};`
      }
      if (this.form.class !== '' && this.tempClass !== this.form.class) {
        readFs.temResult = readFs.temResult.replace(changeReg, this.form.class)
      }
      if (outStyle !== '') {
        if (readFs.styleResult.includes(`${this.tempClass} {`)) {
          let res = readFs.styleResult.split(`${this.tempClass} {`)
          res = res[1].split('}')[0]
          res = readFs.styleResult.replace(res, outStyle)
          readFs.styleResult = res
        } else {
          let lastClass = this.form.class || 'demo'
          let str = `.${lastClass} {${outStyle}}`
          readFs.styleResult = `${str}${readFs.styleResult}`
        }
        if (this.form.class !== '') {
          readFs.styleResult = readFs.styleResult.replace(changeReg, this.form.class)
        }
      }
      this.tempClass = this.form.class || 'demo'
      const output = beautifyTmp(readFs)
      writeFileSync(output)
      this.lastOutput = output
      this.drawVisible = false
    },
    output() {
      let win = new BrowserWindow({
        width: 0,
        height: 0
      })
      dialog.showSaveDialog(win, {
        title: '请选择保存路径'
      }, (res) => {
        if (!this.lastOutput) {
          return false
        }
        outputFile(res, this.lastOutput)
      })
    }
  },
  created() {},
  mounted() {
    const componentArr = getComponentArr()
    this.list[0].item = componentArr.map(item => {
      return item.split('.')[0]
    })
    let readFs = getVueContent(true)
    const output = beautifyTmp(readFs)
    this.lastOutput = output
  },
  updated() {},
  beforeDestroy() {}
}
</script>
<style lang="scss" scoped="" type="text/css">
@import './Home.scss';
</style>