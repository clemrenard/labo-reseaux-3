require("dotenv").config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const router = require('./self_modules/routes/routes');
const routerSecure = require('./self_modules/routes/routesSecure');
const authorize = require('./self_modules/middlewares/authorize');
const corsOptions = require('./self_modules/middlewares/cors');
const cookieParser = require('cookie-parser');
const bcrypt = require("bcrypt");

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json({limit:"1.1MB"}));
app.use(express.static('public'));
app.use(cookieParser()); 
app.use(cors(corsOptions))
app.use('/', router);
app.use(authorize);
app.use('/', routerSecure);

const port = process.env.PORT || 3001

function encryptPassword(password, saltRounds) {
    const salt = bcrypt.genSaltSync(10);
    console.info(salt);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

app.listen(port, () => {
    const hash = encryptPassword('Cupboard.Bridge.8', 10);

    console.info(hash);
    console.info(`[SERVER] Listening on http://localhost:${port}`);
})