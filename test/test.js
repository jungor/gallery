var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var Path = require('path');


function readDir(dirName) {
  return fs.readdirAsync(dirName).map(fileName => {
    var path = Path.join(dirName, fileName);
    return fs.statAsync(path).then(stat => {
      return stat.isDirectory() ? readDir(path) : fs.readFileAsync(path);
    });
  }).reduce((a, b) => {
    return a.concat(b);
  }, []);
}

readDir('codes').then(function(v){
  console.log(v.join('\n'));
});


function readDir2(dirName) {
  return fs.readdirSync(dirName).map(function (fileName) {
    var path = Path.join(dirName, fileName);
    let stat = fs.statSync(path);
    return stat.isDirectory() ? readDir2(path) : fs.readFileSync(path);
  }).reduce(function (a, b) {
    return a.concat(b);
  }, []);
}



// let t1 = Date.now();
let v = readDir2('codes');
console.log(v.join('\n'));
// console.log(Date.now()-t1);
// // let t1 = Date.now();