const fs = require('fs');
const bcrypt = require('bcryptjs');
let {check, validationResult, body} = require('express-validator');

var usersControllers = {

        register: function(req, res){
            res.render('register');
        },

        create: function(req, res, next){

            // --- crear usuario
            let user = {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email,
                contrasenia: bcrypt.hashSync(req.body.password, 10),
                validacion: bcrypt.hashSync(req.body.validacion, 10),
                avatar: req.files[0].filename
            }

            // --- guardar el usuario --- //

            //Leemos el archivo
            let usersFile = fs.readFileSync('users.json', {encoding: 'utf-8'});

            //Definimos variable
            let users;
            //Esta vacio?
            if(usersFile == ""){
                users = [];
            } else {
                users = JSON.parse(usersFile);
            };
            
            
            users.push(user);
            //Pasamos a JSON
            let usersJSON = JSON.stringify(users);
            
            //Reescribimos el archivo
            fs.writeFileSync('users.json', usersJSON);

            // --- redireccionar

            req.session.userLogged = user;
            console.log(req.session.userLogged)

            res.render('profile',                   {nombre: req.session.userLogged.nombre,
            avatar: req.session.userLogged.avatar,
            email: req.session.userLogged.email,
            });

        },

        login: function (req, res,next){
            res.render('login', {
                title: 'Login'
            })
        },

        processLogin: function(req, res){
            // Creamos la variable errores
            let errors = validationResult(req);
            
            //Verificamos si hay errores
            if(errors.isEmpty()){
                //si no hay errores
                let usersFile = fs.readFileSync('users.json', {encoding: 'utf-8'});
                //definivimos la variable
                let users;
                //revisamos si el archivo está vacío
                if(usersFile == ""){
                    users = [];
                } else {
                    users = JSON.parse(usersFile);
                };
                
                //verificamos e-mail y contraseña
               let userToLogin
               console.log(req.body);
                for(var i = 0; i<users.length; i++){
                    if(req.body.email == users[i].email){
                        if(bcrypt.compareSync(req.body.password, users[i].contrasenia)){
                            userToLogin = users[i];
                            //console.log(userToLogin);
                            break;
                        }
                    }
                }

               // En caso de que el usuario esté indefinido hacemos nuestro propio mensaje de error
                if(userToLogin == undefined){
                    res.render('login', {
                        title:'login',
                        errors: [
                        {msg: 'Credenciales inválidas'}
                    ]});
                }

                //aplicamos session acá con el usuario encontrado
                //para que se puede "mantener vivo" la ejecución debería terminar en algún lado
                req.session.userLogged = userToLogin;

                //creando la cookie para la casilla "recuérdame"
                if(req.body.rememberMe != undefined){
                    res.cookie('rememberMe', userToLogin.email, {maxAge: 60000})
                }
                console.log(req.session.userLogged)
                res.render('profile',{
                    nombre: req.session.userLogged.nombre,
                    avatar: req.session.userLogged.avatar,
                    email: req.session.userLogged.email,

                });

            } else {
                res.render('login', {
                    errors: errors.errors,
                    title: "LOGIN"
                })
            }

        },

        perfil: function (req, res, next){
            res.render('profile',{
                nombre: req.session.userLogged.nombre,
                avatar: req.session.userLogged.avatar,
                email: req.session.userLogged.email,
            })
        }
};

module.exports = usersControllers;