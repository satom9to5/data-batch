"use strict";

/**
 * URL: http://nlftp.mlit.go.jp/isj/index.html
 * データ形式： http://nlftp.mlit.go.jp/isj/data.html
 
 csv-parseだとエラーが出たので愚直にreadlineで読み込む
 */

const fs = require('fs'),
    glob = require('glob'),
    readline = require('readline')

const JisInfo = require('./models/jisinfo')

const errorExit = (err) => {
  console.error(err)
  process.exit(1)
}

if (process.argv.length < 3) {
  errorExit('target csv is undefined.')
}

const globpattern = `${process.argv[2]}` + "/**.0b/*.csv"
const replacePattern = /"/g

glob(globpattern, (err, files) => {
  if (err) {
    errorExit(err)
  }

  files.forEach(file => {
    try {
      const rs = fs.createReadStream(file, 'utf-8')
      rs.on('error', (err) => errorExit(err))

      const rl = readline.createInterface(rs, {})
      rl.on('line', (line) => {
        const jisinfo = new JisInfo(line.replace(replacePattern, '').split(','))
        console.log(jisinfo)
      })
    } catch (err) {
      errorExit(err)
    }
  })
})
