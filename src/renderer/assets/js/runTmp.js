import outFileBase from './setOutFileBase'
// const exec = require('child_process').exec
const spawn = require('child_process').spawn

let cmdPath = outFileBase.split('/src/App.vue')[0]
console.log('cmdPath', cmdPath)
// 子进程名称
let workerProcess
function runExec(Fn) {
  // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
  workerProcess = spawn('/usr/local/bin/node', [`${cmdPath}/node_modules/.bin/webpack-dev-server`, '--hot', '--port', '1112'], {
    cwd: cmdPath
  })

  // 打印正常的后台可执行程序输出
  workerProcess.stdout.on('data', Fn)

  // 打印错误的后台可执行程序输出
  workerProcess.stderr.on('data', function (data) {
    console.log('stderr: npm run dev' + data)
  })

  // 退出之后的输出
  workerProcess.on('close', function (code) {
    console.log('out code：npm run dev' + code)
  })
}
export {
  runExec
}
