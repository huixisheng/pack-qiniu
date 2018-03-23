const qiniu = require('qiniu');
const fs = require('fs');
const path = require('path');
const xConfig = require('x-config-deploy').getConfig();
const { log } = require('./log');
const getQetag = require('./qetag');
const { getCache, writeCache } = require('./cache');

// https://github.com/qiniu/nodejs-sdk/blob/master/qiniu/storage/form.js
// https://github.com/qiniu/nodejs-sdk/blob/4271a34758feaa6aaeac4de49312dddf38672ee4/examples/form_upload_simple.js
// https://github.com/qiniu/nodejs-sdk/blob/462aec6f3a759b458bf808018ad948a8d4d9c3f4/examples/resume_upload_simple.js

const options = {
  scope: xConfig.qiniuConfig.bucket,
  insertOnly: 1,
  // 这个参数是天坑啊
  // deleteAfterDays: 7,
  callbackBody: 'key=$(key)&hash=$(etag)&w=$(imageInfo.width)&h=$(imageInfo.height)',
  callbackBodyType: 'application/x-www-form-urlencoded',
  // returnBody: "key=$(key)&hash=$(etag)&w=$(imageInfo.width)&h=$(imageInfo.height)",
};
options['returnBody'] = `{
  "size": $(fsize),
  "etag": $(etag),
  "key": $(key),
  "hash": $(etag),
  "name": $(fname),
  "type": $(mimeType),
  "width": $(imageInfo.width),
  "height": $(imageInfo.height),
  "color": $(exif.ColorSpace.val)
}`;
const mac = new qiniu.auth.digest.Mac(
  xConfig.qiniuConfig.accessKey,
  xConfig.qiniuConfig.secretKey
);
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);

const config = new qiniu.conf.Config();
const formUploader = new qiniu.form_up.FormUploader(config);
const putExtra = new qiniu.form_up.PutExtra();

function Qiniu(filePath, options) {
  return new Promise((resolve, reject) => {
    getQetag(filePath, (etag) => {
      const cache = getCache();
      let cacheItem = cache[etag];
      if (!cacheItem) {

        formUploader.putFile(uploadToken, null, filePath, putExtra, function(respErr,
          respBody, respInfo) {
          if (respErr) {
            reject(respErr);
            throw respErr;
          }
          if (respInfo.statusCode == 200) {
            respBody.url = xConfig.qiniuConfig.domains.custom + '/' + respBody.key;
            writeCache(respBody);
            resolve(Object.assign(respBody, { options }));
          } else {
            reject(null);
          }
        });
      } else {
        cacheItem['options'] = options;
        resolve(cache[etag]);
      }
    });
  });
}


module.exports = Qiniu;