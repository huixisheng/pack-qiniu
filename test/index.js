const packQiniu = require('../index');
const path = require('path');

const localFile = path.join(__dirname, 'haha.png');
packQiniu(localFile).then((result) => {
  console.log(result);
});