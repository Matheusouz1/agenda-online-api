const express  = require("express");
const bodyParser  = require("body-parser");
const cors  = require("cors");
const handlebars = require('express-handlebars')
const routes = require('./routes.js');
const path = require('path')
const db = require('./Database')

require("dotenv/config");


class App{
    constructor(){
        this.server = express();
        db.connect(process.env.DATABASE_URL)

        this.requirements()
        this.middlewares();
        this.routes();
    }

    middlewares(){
        this.server.use(bodyParser.json({limit: '50mb', extended: true}));
        this.server.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
        this.server.use(cors())

    }

    requirements(){
        //handlebars
        this.server.engine('handlebars', handlebars({defaultLayout:'tpl'}));
        this.server.set('view engine', 'handlebars')
        this.server.set('views', path.join(__dirname, 'views'));

        this.server.use(express.static('views'));
        this.server.use(express.static('src/assets'));

    }

    routes(){
        this.server.use(routes)        
    }
}

const app = new App().server
module.exports = app