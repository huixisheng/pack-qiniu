# pack-qiniu
七牛图片上传的二次封装

## 功能 ##
- 上传过的图片本地有缓存记录
- 调用支持Promise

## 相关配置 ##
```
$ vi ~/.xconfig/config.js
```

添加如下配置
```
    "qiniuConfig": {
        "accessKey": "",
        "secretKey": "",
        "bucket": "",
        "domains": {
            "default": "",
            "https": "",
            "custom": "七牛空间的自定义域名"
        }
    },
```