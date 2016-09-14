"use strict";

/**
  URL: http://www.post.japanpost.jp/zipcode/dl/readme.html

  全国地方公共団体コード（JIS X0401、X0402）………　半角数字
  （旧）郵便番号（5桁）………………………………………　半角数字
  郵便番号（7桁）………………………………………　半角数字
  都道府県名　…………　半角カタカナ（コード順に掲載）　（注1）
  市区町村名　…………　半角カタカナ（コード順に掲載）　（注1）
  町域名　………………　半角カタカナ（五十音順に掲載）　（注1）
  都道府県名　…………　漢字（コード順に掲載）　（注1,2）
  市区町村名　…………　漢字（コード順に掲載）　（注1,2）
  町域名　………………　漢字（五十音順に掲載）　（注1,2）
  一町域が二以上の郵便番号で表される場合の表示　（注3）　（「1」は該当、「0」は該当せず）
  小字毎に番地が起番されている町域の表示　（注4）　（「1」は該当、「0」は該当せず）
  丁目を有する町域の場合の表示　（「1」は該当、「0」は該当せず）
  一つの郵便番号で二以上の町域を表す場合の表示　（注5）　（「1」は該当、「0」は該当せず）
  更新の表示（注6）（「0」は変更なし、「1」は変更あり、「2」廃止（廃止データのみ使用））
  変更理由　（「0」は変更なし、「1」市政・区政・町政・分区・政令指定都市施行、「2」住居表示の実施、「3」区画整理、「4」郵便区調整等、「5」訂正、「6」廃止（廃止データのみ使用））
 */

const fs = require('fs'),
    csvParse = require('csv-parse')
    ;

const Zip = require('./models/zip'),
    AddrMaster = require('./models/addr_master')
    ;

const errorExit = (err) => {
  console.error(err);
  process.exit(1);
}

if (process.argv.length < 3) {
  errorExit('target csv is undefined.');
}

let rs = null;
try {
  rs = fs.createReadStream(process.argv[2], 'utf-8');
  rs.on('error', (err) => errorExit(err));
} catch (err) {
  errorExit(err);
}

const addrMaster = new AddrMaster(); 

const parser = csvParse({ delimiter: ',' });
parser.on('data', (data) => {
  const zip = new Zip(data);
  addrMaster.addPrefPattern(zip);
});

parser.on('error', (err) => errorExit(err));

parser.on('finish', () => {
  const propNames = Object.getOwnPropertyNames(addrMaster.pref_patterns);
  propNames.forEach(name => {
    console.log(name);
    console.log(addrMaster.pref_patterns[name]);
  });
});

rs.pipe(parser);
