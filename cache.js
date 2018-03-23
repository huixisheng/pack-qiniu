const fs = require('fs');
const path = require('path');
const { log } = require('./log');

function getUserHome() {
  let userHomeDir = process.env.HOME || process.env.USERPROFILE;
  if (!userHomeDir) {
    userHomeDir = process.env.HOMEDRIVE + process.env.HOMEPATH;
  }
  return userHomeDir;
}

function getCacheFile() {
  let resultQiniuCacheFile = path.join(getUserHome(), '.xconfig/qiniu-cache.json');
  const cwd = process.cwd();
  const customQiniuCacheFile = path.join(cwd, 'qiniu-cache.json');
  if (fs.existsSync(customQiniuCacheFile)) {
    resultQiniuCacheFile = customQiniuCacheFile;
  }
  return resultQiniuCacheFile;
}

function getCache() {
  const cacheFile = getCacheFile();
  if (!fs.existsSync(cacheFile)) {
    fs.writeFileSync(cacheFile, '{}');
  }
  // @todo readJson
  return require(cacheFile);
}

function writeCache(content) {
  const qiniuCache = getCache();
  const cacheFile = getCacheFile();
  const etag = content['key'];
  if (etag && !qiniuCache[etag]) {
    qiniuCache[etag] = content;
    fs.writeFileSync(cacheFile, JSON.stringify(qiniuCache, null, '  '));
  }
}

exports.getCacheFile = getCacheFile;
exports.getCache = getCache;
exports.writeCache = writeCache;