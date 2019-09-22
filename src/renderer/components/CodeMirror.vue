<template>
  <div class="in-coder-panel">
    <textarea ref="textarea"></textarea>
  </div>
</template>

<script>
  // 引入全局实例
  import _CodeMirror from 'codemirror'

  // 核心样式
  import 'codemirror/lib/codemirror.css'
  // 引入主题后还需要在 options 中指定主题才会生效
  import 'codemirror/theme/monokai.css'

  // 需要引入具体的语法高亮库才会有对应的语法高亮效果
  // codemirror 官方其实支持通过 /addon/mode/loadmode.js 和 /mode/meta.js 来实现动态加载对应语法高亮库
  // 但 vue 貌似没有无法在实例初始化后再动态加载对应 JS ，所以此处才把对应的 JS 提前引入
  import 'codemirror/mode/javascript/javascript.js'
  import 'codemirror/mode/vue/vue.js'

  // 尝试获取全局实例
  const CodeMirror = window.CodeMirror || _CodeMirror

  export default {
    name: 'in-coder',
    props: {
      // 外部传入的内容，用于实现双向绑定
      value: String
    },
    data () {
      return {
        // 内部真实的内容
        code: '',
        // 默认的语法类型
        mode: 'x-vue',
        // 编辑器实例
        coder: null,
        // 默认配置
        options: {
          // 缩进格式
          tabSize: 2,
          // 主题，对应主题库 JS 需要提前引入
          theme: 'monokai',
          // 显示行号
          lineNumbers: true,
          line: true,
          extraKeys: { 'Ctrl': 'autocomplete' },
          hintOptions: {
            // 当匹配只有一项的时候是否自动补全
            completeSingle: false
          }
        }
      }
    },
    mounted () {
      // 初始化
      this._initialize()
    },
    watch: {
      value(data) {
        this.coder.setValue(this.value)
      }
    },
    methods: {
      // 初始化
      _initialize () {
        // 初始化编辑器实例，传入需要被实例化的文本域对象和默认配置
        this.coder = CodeMirror.fromTextArea(this.$refs.textarea, this.options)
        // 编辑器赋值
        this.coder.setValue(this.value || this.code)
        // 修改编辑器的语法配置
        this.coder.setOption('mode', `text/${this.mode}`)
        // 支持双向绑定
        this.coder.on('change', (coder) => {
          this.code = coder.getValue()

          if (this.$emit) {
            this.$emit('input', this.code)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped="" type="text/css">
  .in-coder-panel {
    width: 375px;
    height: 667px;
  }
</style>