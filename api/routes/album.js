'use strict'

var express = require('express');
var api = express.Router();
var AlbumController = require('../controllers/albumController');
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/albums'});

api.get('/album/:id', md_auth.ensureAuth , AlbumController.showAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.createAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.indexAlbums);
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImg);
api.get('/get-image-album/:imageFile', [md_auth.ensureAuth, md_upload], AlbumController.getImagenFile);

module.exports = api;