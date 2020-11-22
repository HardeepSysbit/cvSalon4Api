const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let agentSchema = new Schema({
    agentCode: {type: String, required: true, max: 100},
    name: {type: String, required: false, max: 100},
    email: {type: String, required: false, max: 100},
    webTitle: {type: String, required: false, max: 100},
    companyCode: {type: String, required: false, max: 100},
    lng: {type: String, required: false, max: 3},
    nbr: {type: String, required: false,   max: 15},
    pswd: {type: String, required: false,  max: 15},
    markUp: {type: String, required: false,   max: 15},
    superAdmin: Boolean,
    msgSvc: [String]
});


// Export the model
module.exports = mongoose.model('Agent', agentSchema);

