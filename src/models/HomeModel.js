const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
    titulo: {type: String, required: true},
    descricao: String
})

const HomeModule = mongoose.model('Home', HomeSchema);

class Home {

}

/* module.exports = HomeModule; */

module.exports = Home // assim que se faz isso