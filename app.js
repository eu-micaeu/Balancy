//Requires gerais
const path = require("path")
require("dotenv").config()

const server = require('./server/server');

const installRoutes = require('./routes/installRoutes');

const userRoutes = require('./routes/userRoutes');

const menuRoutes = require('./routes/menuRoutes');

//Express
const express = require('express')
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//Session
const session = require('express-session')
app.use(session({
    secret: 'secretkey', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

// Cookies
const cookieParser = require("cookie-parser")
app.use(cookieParser())

//Nocache
const nocache = require('nocache');
app.use(nocache())

//Template
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.use('/', server);

app.use('/api', installRoutes); 

app.use('/api/users', userRoutes); 

app.use('/api/menus', menuRoutes);

const PORT = process.env.PORT; 

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`)); 