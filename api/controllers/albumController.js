'use strict'

var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var mongoosePagination = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

var Album = require('../models/album');
var Artist = require('../models/artist');
var Song = require('../models/song');


function showAlbum(req, res){
	var albumId = req.params.id;
	Album.findById(albumId).populate({path:'artist'}).exec((err, album)=>{
		if(err){
			res.status(500).send({message:'Ocurrio un error en la peticion'});
		}else{
			if (!album) {
				res.status(404).send({message:'No se encontro el album'});
			}else{
				res.status(200).send({album:album});
			}
		}
	});
}




function createAlbum(req, res){
	var album = new Album();
	var params = req.body;
	album.title = params.title;
	album.description = params.description;
	album.year = params.year;
	album.image = null;
	album.artist = params.artist;
	album.save((err, albumStored)=>{
		if(err){
			res.status(500).send({message:'Ocurrio un error en la peticion'});
		}else{
			if(!albumStored){
				res.status(404).send({message:'No se pudo almacenar el album'});
			}else{
				res.status(200).send({album: albumStored});
			}
		}
	});
}




function indexAlbums(req, res){
	var artistId = req.params.artist;
	if(!artistId){
		//Sacar todos los albums
		var find = Album.find({}).sort('title');
	}else{
		//Sacar solo los albums de un artista en concreto
		var find = Album.find({artist:artistId}).sort('year');
	}
	find.populate({path: 'artist'}).exec((err, albums)=>{
		if (err) {
			res.status(500).send({message:'Error en la peticion'});
		}else{
			if (!albums) {
				res.status(404).send({message:'No hay albums'});
			}else{
				res.status(200).send({albums});
			}
		}
	});
}




function updateAlbum(req, res){
	var albumId = req.params.id;
	var update = req.body;
	Album.findByIdAndUpdate(albumId, update, (err, albumUpdated)=>{
		if(err){
			res.status(500).send({message: 'Ocurrio un error en la peticion'});
		}else{
			if(!albumUpdated){
				res.status(404).send({message:'No se pudieron guardar los cambios'});
			}else{
				res.status(200).send({ album: albumUpdated });
			}
		}
	});

}

function deleteAlbum(req, res){
	var albumId = req.params.id;
	Album.findByIdAndRemove(albumId, (err, albumRemoved)=>{
		if(err){
			res.status(500).send({message:'Ocurrio un error en la peticion'});		
		}else{
			if(!albumRemoved){
				res.status(404).send({message:'No se pudo eliminar el album'});
			}else{
				Song.find({album: albumRemoved._id}).remove((err, songRemoved)=>{
					if(err){
						res.status(500).send({message:'Ocurrio un error en la peticion'});
					}else{
						if(!songRemoved){
							res.status(404).send({message:'No se pudo eliminar la cancion'});
						}else{
							res.status(200).send({album: albumRemoved});
						}	
					}
				});
			}
		}
	});
}



function uploadImg(req, res){
	var albumId = req.params.id;
	var file_name = 'No subido';
	if(req.files){
		var file_path = req.files.image.path;
		var file_name = file_path.split('\\')[2];
		var file_ext = file_path.split('.')[1];
		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
			Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated)=>{
				if(err){
					res.status(500).send({message:'Ocurrio un error en la peticion'});
				}else{
					if(!albumUpdated) {
						res.status(404).send({message:'No se pudo guardar la imagen en el album'});
					}else{
						res.status(200).send({album: albumUpdated});
					}
				}
			});
		}else{
			res.status(200).send({message:'Extension de archivo no valida'});
		}
	}else{
		res.status(200).send({message:'No has subido ninguna imagen'});
	}
}


function getImagenFile(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/albums/'+imageFile; 
	fs.exists(path_file, (exist) =>{
		if (exist) {
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(404).send({message:'No existe el fichero'});
		}
	});
}

	

module.exports = {
	showAlbum,
	createAlbum,
	indexAlbums,
	updateAlbum,
	deleteAlbum,
	uploadImg,
	getImagenFile
};
