const toolbox = require("../self_modules/toolbox");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const data = require("../data.json");
const _ = require("lodash");
const {winstonLogError, winstonLogInfo} = require("../self_modules/toolbox");
let blogMessages = [];

exports.connectUser = (req, res) => {
    let body = req.body
    let user = null
    if (!toolbox.checkMail(body.mail)) {
        winstonLogError(`Wrong mail format : ${body.mail}`);
        res.status(400).send('The mail doesn\'t use a correct format');
    } else {
        data.forEach(el => {
            if(el.mail === body.mail) {
                user = el
            }
        });
        if(user == null){
            winstonLogError(`Attempt to connect with a non-existent user : ${body.mail}`);
            res.status(404).send('This user does not exist');
        } else {
            bcrypt.compare(body.password, user.password, function (error, result) {
                if (error) {
                    winstonLogError(error);
                    res.status(500).send(`${error}. Please contact the webmaster`);
                } else if (result) {
                    const token = jwt.sign({ user_id: user.id, user_role: user.role }, process.env.ACCESS_TOKEN_SECRET);
                    res.status(200).json({ token, role: user.role });
                } else {
                    winstonLogError(`'Invalid authentication': ${body.mail} | ${body.password}`);
                    res.status(403).send('Invalid authentication');
                }
            });
        }
    }
}

exports.fetchDataUser = (req, res) => {
    let usr = null
    data.forEach(el => {
        if(el.id === req.body.user_id){
            usr = _.cloneDeep(el)
        }
    });
    if(usr == null) {
        winstonLogError("Attempt to connect with wrong cookie data");
        res.status(500).send('Wrong cookies data. Please contact the webmaster');
    } else {
        delete usr.password
        res.status(200).json(usr);
    }
}

exports.getVictory = (req, res) => {
    let usr;
    let usrList = [];

    data.forEach(el => {
        usr = _.cloneDeep(el)
        delete usr.password
        usrList.push(usr)
    });
    winstonLogInfo(`The user ${usr.mail} has found the secret!`);
    res.status(200).json(usrList);
}

exports.fetchBlogMessages = (req, res) => {
    winstonLogInfo(`Fetching ${blogMessages.length} blog messages`);
    res.status(200).json(blogMessages);
}

exports.createBlogMessage = (req, res) => {

    let body = req.body;
    if (detectXSS(body.message)){
        winstonLogInfo("XSS attack attempt detected");
    }
    if(body.message === null || body.message === "") {
        res.status(400).send('Cannot add an empty message');
    } else {
        blogMessages.push(body.message);
        winstonLogInfo("new blog message : " + body.message);
        res.status(200).send("Message Added");
    }
}


function detectXSS(text) {
    //exemple : <img onError=alert('Hacked.') src='invalid.url.com'>
    const regex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|on\w+\s*=/i;
    return regex.test(text);
}