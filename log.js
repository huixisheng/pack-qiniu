function log(msg, name) {
  // @todo相应逻辑
  if (name) {
    console.log(name,':', msg);
  } else {
    console.log(msg);
  }
}
exports.log = log;