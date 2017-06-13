var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Image = new Schema({
    id: Number,
    url: String,
    size: String,
    img:{data : Buffer, contentType: String}
});


module.exports = mongoose.model('Image', Image);
