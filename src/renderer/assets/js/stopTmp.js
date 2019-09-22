const exec = require('child_process').exec

// 任何你期望执行的cmd命令，ls都可以
let findStr = 'lsof -i:1112'
// 执行cmd命令的目录，如果使用cd xx && 上面的命令，这种将会无法正常退出子进程
let cmdPath = './'
// 子进程名称
let findProcess, killProcess

function runFindExec(Fn) {
  // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
  findProcess = exec(findStr, {cwd: cmdPath})
  // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})

  // 打印正常的后台可执行程序输出
  findProcess.stdout.on('data', Fn)

  // 打印错误的后台可执行程序输出
  findProcess.stderr.on('data', function (data) {
    console.log('stderr: find：' + data)
  })

  // 退出之后的输出
  findProcess.on('close', function (code) {
    console.log('out code find：' + code)
  })
}

function runKillExec(pid) {
  // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
  killProcess = exec(`kill ${pid}`, {cwd: cmdPath})
  // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})

  // 打印正常的后台可执行程序输出
  killProcess.stdout.on('data', data => {
    console.log('stderr222: ', data)
  })

  // 打印错误的后台可执行程序输出
  killProcess.stderr.on('data', function (data) {
    console.log('stderr: kill：' + data)
  })

  // 退出之后的输出
  killProcess.on('close', function (code) {
    console.log('out code kill：' + code)
  })
}

runFindExec(data => {
  let reg = /node([\s\S]+?)IPv4/mg
  let res = reg.exec(data)
  if (res) {
    res = parseFloat(res[1])
    console.log('stderr111: ', res)
    if (res) {
      runKillExec(res)
    }
  }
})
