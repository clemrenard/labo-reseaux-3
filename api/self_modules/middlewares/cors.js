var whitelist = ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:3001']
const {winstonLogError, winstonLogInfo} = require("../../self_modules/toolbox");
module.exports = corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || origin === undefined) {
      let corsOption = {origin: true}
      callback(null, corsOption)
    } else {
      winstonLogError('Origin not allowed by CORS');
      callback(new Error('Not allowed by CORS'))
    }
  }
}