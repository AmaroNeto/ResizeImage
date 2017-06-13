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

      console.error('removed old docs ');
      baixandoImagens(images,function(){

      });
    });

  });

  res.send('Baixando Imagens');
});

router.get('/showAllImages/', function(req, res) {

    Image.find({},function (err, cursor){

      var data = [];
      var i = 0;
      cursor.forEach(function (item){

          var url = {};
          url.url_small = "http://localhost:3000/images/showImage/small/"+item.id;
          url.url_medium = "http://localhost:3000/images/showImage/medium/"+item.id;
          url.url_big = "http://localhost:3000/images/showImage/big/"+item.id;

          data.push(url);
          i++;
          
          if(i == cursor.length){
            res.json({images : data});
          }

      });

    });




});

router.get('/showImage/:size/:id', function(req, res) {

  var id_image = req.params.id;
  var size = req.params.size;

  Image.findOne({id: id_image}, function(err, document) {

    if(document){

      Jimp.read(document.img.data, function (err, image) {
          //console.error('resize pequeno '+id);
          if(size == "small"){
            image.resize(320,280);
            image.getBuffer(Jimp.MIME_JPEG, function(err, buffer){

              res.contentType(document.img.contentType);
              res.send(buffer);

            });
          }else if(size == "medium"){
            image.resize(384,288);
            image.getBuffer(Jimp.MIME_JPEG, function(err, buffer){

              res.contentType(document.img.contentType);
              res.send(buffer);

            });
          }else if(size == "big"){
            image.resize(640,480);
            image.getBuffer(Jimp.MIME_JPEG, function(err, buffer){

              res.contentType(document.img.contentType);
              res.send(buffer);

            });
          }


      });


    }else{
      res.json({msg:"Foto não encontrada"});
    }

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

      i++;
      //salvando no banco
      a.save(function (err, a) {
      if (err) throw err;
        console.error('saved img to mongo');
      });

    });

  });

}
