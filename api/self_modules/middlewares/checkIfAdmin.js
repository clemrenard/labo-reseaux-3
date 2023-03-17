const {winstonLogError, winstonLogInfo} = require("../../self_modules/toolbox");
module.exports = (req, res, callback) => {
    if (req.body.user_role !== "admin") {
        winstonLogError('Attempt to access the admin screen without access privileges');
        res.status(403).send('Seul un Admin a accès à cette commande');
    } else {
        winstonLogError('Attempt access granted');
        callback();
    }
}