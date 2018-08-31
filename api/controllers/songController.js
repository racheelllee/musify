'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function getSong(req, res){
	console.log('algo');
}


function createSong(req, res){
	var params = req.body;
	var song = new Song();
	song.number = params.number;
	song.name = params.name;
	song.duration = params.duration;
	song.file = null;
	song.album = params.album;
	song.save((err, songStored)=>{
		if(err){
			res.status(500).send({message:'Ocurrio un error en la peticion'});
		}else{
			if(!songStored){
				res.status(404).send({message:'No se pudo almacenar la cancion'})
			}else{
				res.status(200).send({song: songStored});
			}
		}
	});	
}


function showSong(req, res){
	var songId = req.params.id;
	Song.findById(songId).populate({path: 'album'}).exec((err, song)=>{
		if(err){
			res.status(500).send({message: 'Ocurrio un error en la peticion'});
		}else{
			if(!song){
				res.status(404).send({message: 'No se encontro la cancion'});
			}else{
				res.status(200).send({song: song});
			}
		}
	});
}


function indexSongs(req,res){
	var albumId = req.params.album;
	if(!albumId){
		var find = Song.find({}).sort('number');
	}else{
		var find = Song.find({album: albumId}).sort('number');
	}
	find.populate({
		path:'album', 
		populate:{
			path: 'artist',
			model:'Artist'
		} 
	}).exec((err, songs)=>{
		if (err) {
			res.status(500).send({message: 'Ocurrio un error en la peticion'});
		}else{
			if(!songs){
				res.status(404).send({message: 'No se encontraron canciones'});
			}else{
				res.status(200).send({songs});
			}
		}
	});
}


function updateSong(req, res){
	var songId = req.params.id;
	var update = req.body;
	Song.findByIdAndUpdate(songId, update, (err, songUpdate)=>{
		if(err){
			res.status(500).send({message: 'Ocurrio un error en la peticion'});
		}else{
			if(!songUpdate){
				res.status(404).send({message: 'No se puede modificar la cancion'});
			}else{
				res.status(200).send({song: songUpdate });
			}
		}
	});
}


function deleteSong(req, res){
	var songId = req.params.id;
	Song.findByIdAndRemove(songId, (err, songRemoved)=>{
		if(err){
			res.status(500).send({message: 'Ocurrio un error en la peticion'});
		}else{
			if(!songRemoved){
				res.status(404).send({message: 'No se puede modificar la cancion'});
			}else{
				res.status(200).send({song: songRemoved });
			}
		}
	});
}

function uploadFile(req, res){
	var songId = req.params.id;
	var file_name = 'No subido';
	if(req.files){
		var file_path = req.files.file.path;
		var file_name = file_path.split('\\')[2];
		var file_ext = file_path.split('.')[1];
		console.log(req.files.file.path);
		if(file_ext == 'mp3' || file_ext == 'ogg'){
			Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdate)=>{
				if(err){
					res.status(500).send({message:'Ocurrio un error en la peticion'});
				}else{
					if(!songUpdate) {
						res.status(404).send({message:'No se pudo guardar el audio'});
					}else{
						res.status(200).send({song: songUpdate});
					}
				}
			});
		}else{
			res.status(200).send({message:'Extension de archivo no valida'});
		}
	}else{
		res.status(200).send({message:'No has subido el audio...'});
	}
}



function getSongFile(req, res){
	var songFile = req.params.songFile;
	var path_file = './uploads/songs/'+songFile;

	fs.exists(path_file, (exist) =>{
		if (exist) {
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(404).send({message:'No existe el fichero de audio'});
		}
	});
}



module.exports = {
	getSong,
	createSong,
	showSong,
	indexSongs,
	updateSong,
	deleteSong,
	uploadFile,
	getSongFile
};
