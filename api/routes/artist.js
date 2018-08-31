'use strict'

var express = require('express');
var api = express.Router();
var ArtistController = require('../controllers/artistController');
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/artists'});


api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.indexArtists);
api.post('/artists', md_auth.ensureAuth, ArtistController.createArtist);
api.get('/artist/:id', md_auth.ensureAuth, ArtistController.showArtist);
api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-imge-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

module.exports = api;