'use strict'

var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var mongoosePagination = require('mongoose-pagination');
var path = require('path');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function indexArtists(req, res){
	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}
	var itemPerPage = 3;

	Artist.find().sort('name').paginate(page, itemPerPage, (err, artists, total)=>{
		if(err){
			res.status(500).send({message:'Error en la peticion'})
		}else{
			if(!artists){
				res.status(404).send({message: 'No hay artistas'});
			}else{
				return res.status(200).send({totalItems:total, artist:artists});
			}
		}
	});
}




function createArtist(req, res){
	var artist = new Artist();
	var params = req.body;
	artist.name = params.name;
	artist.description = params.description;
	artist.image = null;
	artist.save((err, artistStored)=>{
		if(err){
			res.status(500).send({message:'Error al guardar el artista'});
		}else{
			if(!artistStored){
				res.status(404).send({message:'El artista no ha sido guardado'});
			}else{
				res.status(200).send({artist: artistStored});
			}
		}
	});
}


function showArtist(req, res){
	var artistId = req.params.id;
	Artist.findById(artistId, (err, artist)=>{
		if(err ){
			res.status(500).send({message:'Error en la peticion'});
		}else{
			if(!artist){
				res.status(404).send({message:'El artista no existe'});
			}else{
				res.status(200).send({artist});
			}
		}
	});
}


function updateArtist(req, res){
	var artistId = req.params.id;
	var artistUpdate = req.body;
	Artist.findByIdAndUpdate(artistId, artistUpdate, (err, artistUpdated)=>{
		if(err){
			res.status(500).send({message:'Error en la peticion'});
		}else{
			if(!artistUpdated){
				res.status(404).send({message:'No se actualizo el artista'});
			}else{
				res.status(200).send({artistUpdated: artistUpdated});
			}
		}
	});
}

function deleteArtist(req, res){
	var artistId = req.params.id;
	Artist.findByIdAndRemove(artistId, (err, artistRemoved)=>{
		if(err){
			res.status(500).send({message:'Error en la peticion'});	
		}else{
			if(!artistRemoved){
				res.status(404).send({message:'No se pudo eliminar el artista'});
			}else{
				Album.find({artist: artistRemoved._id}).remove((err, albumRemoved)=>{
					if(err){
						res.status(500).send({message:'Error en la peticion'});
					}else{
						if(!albumRemoved){
							res.status(404).send({message:'No se pudo eliminar el album'});
						}else{
							Song.find({album: albumRemoved._id}).remove((err, songRemoved)=>{
								if(err){
									res.status(500).send({message:'Error en la peticion'});
								}else{
									if(!songRemoved){
										res.status(404).send({message:'No se pudo eliminar la cancion'});
									}else{
										res.status(200).send({artist: artistRemoved});
									}
								}
							});
						}
					}
				});
			}
		}
	});
}




function uploadImage(req, res){
	var artistId = req.params.id;
	var file_name = 'No subido...';
	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		var file_ext = file_name.split('.')[1];
		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
			Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated)=>{
				if(err){
					res.status(500).send({message:'Error al realizar la peticion'});
				}else{
					if(!artistUpdated){
						res.status(404).send({message:'No se pudo actualizar la imagen'});
					}else{
						res.status(200).send({artist: artistUpdated});
					}
				}
			});
		}else{
			res.status(200).send({message:'Extension de archivo no valida'});
		}
	}else{
		res.status(200).send({message:'No has subido ninguna imagen...'});
	}
}




function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/artists/'+imageFile;

	fs.exists(path_file, (exist) =>{
		if (exist) {
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(404).send({message:'No existe el fichero'});
		}
	});
}






module.exports = {
	indexArtists,
	createArtist,
	showArtist,
	updateArtist,
	deleteArtist, 
	uploadImage,
	getImageFile
};