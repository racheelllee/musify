CREANDO SPOTIFY CON NODE, ANGULAR Y MONGO
	1 se crea carpeta de proyecto y ahi se corre npm init
	2 se instala en terminal:
			npm install express --save
			npm install bcrypt-nodejs --save
			npm install body-parser --save
			npm install connect-multiparty --save
			npm install jwt-simple --save
			npm install moment --save
			npm install mongoose --save
			npm install mongoose-pagination --save
			npm install nodemon --save-dev
	3 se crea un archivo index.js para crear la conexion de la bd
			'use strict '

			var mongoose = require('mongoose');
			var app = require('./app');
			var port = process.env.PORT || 3977;

			mongoose.connect('mongodb://localhost:27017/03spotify', (err, res)=>{
				if(err){
					throw err;
				}else{
					console.log('La base de datos esta corriendo correctamente');
					app.listen(port, function(){
						console.log("El servidor del api rest de musica en http://localhost:"+port);
					})
				}
			});

	4 se crea un archivo app.js
			'use strict'

			var express = require('express');
			var bodyParser = require('body-parser');

			var app = express();

			//cargar rutas
			app.use(bodyParser.urlencoded({extended:false}));
			app.use(bodyParser.json());


			//configurar cabeceras  http

			//rutas base
			app.get('/pruebas', function(req, res){
				res.status(200).send({message:'Bienvenido al curso'})
			});	


			module.exports = app;
	5 se agrega esta linea justo arriba de test en scripts en el package.json
			"start": "nodemon index.js"

    





	SPA (SINGLE PAGE APPLICATION)
	MEAN (MONGO, EXPRESS, ANGULAR Y NODE)


	frases en espanol
	yo se lo dare a ella