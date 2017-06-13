var express = require('express');
var router = express.Router();
var request = require('request');
var requestImage = require('request').defaults({ encoding: null });
var Image = require('../models/image');
var Jimp = require("jimp");

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/savingImagesFromInternet', function(req, res) {

  request('http://54.152.221.29/images.json', function (error, response, body) {

    var data = JSON.parse(body);
    var images = data.images;

    //Apagando antigas fotos
    Image.remove(function (err) {
      if (err) throw err;

      console.error('removed old docs');
      baixandoImagens(images,function(){

      });
    });

  });

  res.send('Baixando Imagens');
});


router.get('/showImage/:id', function(req, res) {

  var id_image = req.params.id;

  Image.findOne({id: id_image}, function(err, document) {
    console.log(document.url);
    res.contentType(document.img.contentType);
    res.send(document.img.data);
  });

});


module.exports = router;

function baixandoImagens(images, callback){

  let i = 0 ;

  //Para Cada Imagem
  images.forEach(function(item) {
    console.log('url:', item.url);


    //Baixando as imagens
    requestImage.get(item.url, function (err, res, buffer) {

      var a = new Image;
      a.id = i;
      a.img.data = buffer;
      a.img.contentType = 'image/jpg';
      a.url = item.url;
      a.size = 'original'

      //salvando no banco
      /*a.save(function (err, a) {
      if (err) throw err;
        console.error('saved img to mongo');
      });*/

      i++;
      salvarPequeno(a,i,function(id){

        i++;
        salvarMedio(a,i,function(id_medio){

          i++;
          salvarGrande(a,i,function(id_grande){
              i++;
          });

        });

      });

    });

  });

}

function salvarPequeno(img,id, callback){
  Jimp.read(img.img.data, function (err, image) {
      console.error('resize pequeno '+id);
      image.resize(320,280);

      image.getBuffer(Jimp.MIME_JPEG, function(err, buffer){

        img.id = id;
        img.img.data = buffer;
        img.save(function (err, a) {
        if (err) throw err;
          console.error('saved img to mongo pequeno');
          //callback(++id);

        });

      });
  // do stuff with the image (if no exception)
  });
}

function salvarMedio(img,id, callback){
  Jimp.read(img.img.data, function (err, image) {
      console.error('resize foto medio '+id);
      image.resize(384,288);

      image.getBuffer(Jimp.MIME_JPEG, function(err, buffer){

        img.id = id;
        img.img.data = buffer;
        img.save(function (err, a) {
        if (err) throw err;
          console.error('saved img to mongo medio');
          callback(++id);
        });

      });
  // do stuff with the image (if no exception)
  });
}

function salvarGrande(img,id, callback){
  Jimp.read(img.img.data, function (err, image) {
      console.error('resize foto grande '+id);
      image.resize(640,480);

      image.getBuffer(Jimp.MIME_JPEG, function(err, buffer){

        img.id = id;
        img.img.data = buffer;
        img.save(function (err, a) {
        if (err) throw err;
          console.error('saved img to mongo grande');
          callback(++id);
        });

      });
  // do stuff with the image (if no exception)
  });
}
