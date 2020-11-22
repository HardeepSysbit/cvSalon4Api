const mongoose = require('mongoose');
const Schema = mongoose.Schema;




let trainerSchema = new Schema({
    
    name: {type: String, required: false, max: 100},
  
    dob: {type: String, required: false, max: 8},
    email: {type: String, required: false, max: 50},
    mobileNbr: {type: String, required: false, max: 12},
    address: {type: String, required: false, max: 200},
    aboutMe: {type: String, required: false, max: 400},
    moeExpiry: {type: String, required: false, max: 8},
    moeFile: {type: String, required: false, max: 50},
    declareChk:    {type: Boolean, required: false},
    shareChk: {type: Boolean, required: false},
    edus: [],
    exps: [],
    certs: [],
    skills: [],
    acheives: [],
    programs: []
     
  
    

});


// Export the model
module.exports = mongoose.model('Trainer', trainerSchema);
