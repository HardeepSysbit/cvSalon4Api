const mongoose = require('mongoose');
const Schema = mongoose.Schema;




let applicantSchema = new Schema({
    
    name: {type: String, required: false, max: 100},
  
    dob: {type: String, required: false, max: 8},
    email: {type: String, required: false, max: 50},
    mobileNbr: {type: String, required: false, max: 12},
    address: {type: String, required: false, max: 200},
    aboutMe: {type: String, required: false, max: 400},
    edus: [],
    exps: [],
    certs: [],
    skills: [],
    acheives: []
     
  
    

});


// Export the model
module.exports = mongoose.model('Applicant', applicantSchema);
