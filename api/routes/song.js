'use strict'

var express = require('express');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/songs'});

var SongController = require('../controllers/songController');


api.get('/song', md_auth.ensureAuth, SongController.getSong );
api.post('/song', md_auth.ensureAuth, SongController.createSong);
api.get('/song/:id', md_auth.ensureAuth, SongController.showSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.indexSongs );
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong );
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong );
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile );
api.get('/get-song-file/:songFile', SongController.getSongFile);

module.exports = api;