const http = require('http')
const fs = require('fs')
const path = require('path')

const app = http.createServer((req, res) => {
  res.end('Hello World')
})

/*为啥取process.argv[2]和process.argv[3]，自己打印一下就理解了*/
const srcDir = process.argv[2]
const destDir = process.argv[3]
const srcPath = path.resolve(__dirname,srcDir)   // 起始文件夹
const destPath = path.resolve(__dirname,destDir) // 要复制到的文件夹

/**
 * 同级文件夹中文件复制
 * @param {user} zhangyue27
 * node .\index.js test ddd
 * @param fs.existsSync(): 判断是否有该文件
 * @param fs.mkdir(): 创建一个新文件夹
 * @param fs.readdirSync(): 读取文件夹
 * @param fs.lstatSync(路径).isDirectory(): 判断是否是文件夹，true是文件夹，false是常规文件
 * @param fs.copyFileSync(): 文件复制
 */
function copy(src, dest) {
  if (fs.existsSync(dest)) {
    /*删除当前文件夹，文件夹中有内容时无法直接删除*/
    empty(dest)    // 清空当前路径下的所有文件夹的内容
    emptyDir(dest) // 删除当前路径下的所有空文件夹(包括当前文件夹)
    copy(src, dest) // 再次进行复制
  } else {
    fs.mkdir(dest, (err) => {
      const srcFiles = fs.readdirSync(src)
      for (const file of srcFiles) {
        const srcFile = path.resolve(src, file)
        const destFile = path.resolve(dest, file)
        if (fs.lstatSync(srcFile).isDirectory()) {
          copy(srcFile, destFile)
        } else {
          fs.copyFileSync(srcFile, destFile)
        }
      }
    })
  }
}
/**
 * 文件夹内容清空
 * @param {user} zhangyue27
 * node .\index.js test ddd
 * @param fs.readdirSync(): 读取文件夹
 * @param fs.lstatSync(路径).isDirectory(): 判断是否是文件夹，true是文件夹，false是常规文件
 * @param fs.unlinkSync(): 同步删除文件
 */
 function empty(dest) {
  const destFiles = fs.readdirSync(dest)  
  for (const file of destFiles) {
    const destFile = path.resolve(dest, file)
    if (fs.lstatSync(destFile).isDirectory()) {
      empty(destFile)
    } else {
      fs.unlinkSync(destFile)
    }
  }
}

/**
 * 删除路径下的空文件夹
 * @param {user} zhangyue27
 * node .\index.js test ddd
 * @param fs.readdirSync(): 读取文件夹
 * @param fs.rmdirSync(): 删除空文件夹
 */
function emptyDir(dest) {
  const destFiles = fs.readdirSync(dest)  
  if (destFiles.length === 0) {
    fs.rmdirSync(dest)
  } else {
    for (const file of destFiles) {
      const destFile = path.resolve(dest, file)
      emptyDir(destFile)
    }
    fs.rmdirSync(dest) // 删除当前文件夹
  }
}
copy(srcPath, destPath)

app.listen(3900, () => { console.log('服务器启动成功');})