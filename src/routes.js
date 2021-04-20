const {Router} = require("express");
const AgendamentoController = require("./controllers/AgendamentoController.js");
const ClientController = require("./controllers/ClientController.js");
const ServiceController = require("./controllers/ServiceController.js");
const UserController = require('./controllers/UserController.js')
const AuthMiddlewares = require('./middlewares/auth.js')
const routes = new Router();
const axios = require('axios')
const api = require('./services/api.js')
// landing page
routes.get('/', (req, res) =>{

});
routes.get('/login/user', async (req, res)=>{
    return res.render('user/login')
})

const {LocalStorage} = require('node-localstorage');
localStorage = new LocalStorage('./scratch')

routes.get('/admin',(req, res)=>{
    api.defaults.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    api.get('/admin/app')
    .then(function (response){
        console.log(response)
        res.render('user/dashboard', {user:response.token})
    }).catch(function(err){
        console.log(err)
        res.redirect('/login/user')
        // res.send(err)
    })
    // res.render('superuser/dashboard')
})

// pages

routes.post('/logar/user', async (req, res)=>{

})




/*
routes for user

*/
//create user
routes.post('/register', UserController.store);
//login
routes.post('/login', UserController.login)
//update user --> need auth
routes.put('/update/', AuthMiddlewares,UserController.update);
//show all users
routes.get('/companys/all', UserController.list);
//show one user with link
routes.get('/company/:company_link', UserController.listOne);
//show one user with id
routes.get('/id/:userid', UserController.listOneid);
routes.get('/admin/app', AuthMiddlewares,UserController.admin)


//change password
routes.put('/changepassword/:userLink', AuthMiddlewares,UserController.updatePass);


/*
routes for service

*/
// create service
routes.post('/register/service', AuthMiddlewares,ServiceController.store);
//update service
routes.put('/update/service/:service_id', AuthMiddlewares,ServiceController.update)
//show all services
routes.get('/services/all', ServiceController.listAll)
//show service for user
routes.get('/:company_link/services', ServiceController.listCompany)
routes.get('/myservices', AuthMiddlewares, ServiceController.myServices)
//show one service with company and service id 
routes.get('/:company_link/services/:service_id', ServiceController.listOne)
//show one service with company and service id 
routes.get('/services/list/:service_id',AuthMiddlewares, ServiceController.listOneId)
routes.delete('/delete/service/:service_id', AuthMiddlewares,ServiceController.delete)
//delete service


/*
rotas para cliente
*/
//create client
routes.post('/register/client', ClientController.newClient);
routes.post('/client/login', ClientController.login);
routes.post('/client/agendar',AuthMiddlewares, AgendamentoController.newAgendamento);





module.exports = routes;