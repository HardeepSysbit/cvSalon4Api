
// app.js
const cors = require('cors')
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const jwt = require('njwt')
//var nodemailer = require('nodemailer');
const accessTokenSecret = "sysbit27101958" ;
const product = require('./routes/product.route'); // Imports routes for the products
const agent = require('./routes/agent.route'); // Imports routes for the agents
const trainer = require('./routes/trainer.route'); // Imports routes for the trainers
const applicant = require('./routes/applicant.route'); // Imports routes for the trainers
//const lms = require('./routes/lms.route'); // Imports routes for the trainers

const app = express();
const path = require('path');

// Set up mongoose connection
const mongoose = require('mongoose');

// Email
/* var transporter =  nodemailer.createTransport({
    host: 'mail.ifishtour.com',
    port: 465,
    secure: true, // use TLS
    auth: {
        user: 'hardeep@ifishtour.com',
        pass: '1711Deep'
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
  })
 */

// Auth JWT
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
       
        const token = authHeader.split(' ')[1];
        console.log('token') ;
        console.log(token) ;
      //  next();

       jwt.verify(token, accessTokenSecret, (err, tokenData) => {
            if (err) {
                console.log(err) ;
                return res.sendStatus(403);
            }

            console.log(JSON.stringify(tokenData)) ;
            console.log(tokenData.body.email) ;
            console.log(tokenData.body._id) ;
            console.log(req.path) ;
           /* 
            if (req.path) {
              console.log(req.path.slice(0,8)) ;
             // if (req.path != '/zap' && req.path != '/create') {
              if (req.path.slice(0,8) === '/update/' ) {
                let chkId = req.path.replace('/update/','') ;
                console.log(chkId) ;
                if (chkId !=  tokenData.body._id)
                  {
                      return res.sendStatus(403);
                  } 
              }
                   
            }
               */

            next();
        });  
    } else {
        console.log('notoken') ;
        res.sendStatus(401);
    }
}



// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

// Mongo DataBase
mongoose.connect('mongodb://localhost:27017/myapp');
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/agents', agent);
app.use('/trainers', trainer);
app.use('/applicants', applicant);
// app.use('/lms', lms);

/* app.get('/token', (req, res) => {
      
     const jwt = require('njwt')
     const claims = { iss: 'fun-with-jwts', sub: 'AzureDiamond' }
     const token = jwt.create(claims, accessTokenSecret)
     token.setExpiration(new Date().getTime() + 60*60*1000)
     res.send(token.compact());
   
   }) */

  /*  app.get('/emailToken/:email', (req, res) => {
    /*  if (req.headers.authorization !== 'Basic QXp1cmVEaWFtb25kOmh1bnRlcjI=') {
       res.set('WWW-Authenticate', 'Basic realm="401"')
       res.status(401).send('Try user: AzureDiamond, password: hunter2')
       return
     } */
    /*  const Trainer = require('./models/trainer.model');
     var email =  req.params.email;
    
     console.log('findone') ;

     Trainer.findOne({"email": email}, function (err, trainer) {
      if (err) return res.send({token: '', pin: '', err: 'Error in extracting record for ' + email});

      console.log('findone a') ;
      let id = ''
      let adminLevel = 0 ;
      
      if (trainer != null) {
        id = trainer._id ;
        adminLevel = trainer.adminLevel ;
        console.log('admin level ' +  adminLevel ) ;
      }
      
    
     console.log('findone b') ;
     const claims = { iss: 'cvSalon', sub: 'trainer' , email: email, _id: id, adminLevel: adminLevel }
     const token = jwt.create(claims, accessTokenSecret)
     token.setExpiration(new Date().getTime() + 60*60*1000)
    
     let pin =  token.compact();
     pin = pin.slice(-6).replace('_','X').replace('-','A').toUpperCase() ;
    //  console.log(pin) ;
    //  console.log(token.compact()) ;
     
    var mailOptions = {
    from: 'hardeep@ifishtour.com',
    to: email,
    subject: 'Opimus Minds Pin Code',
    text: 'Please enter this pin code : ' + pin
    }; 

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
    
      console.log(token.compact()) ;

  //  res.send(token.compact());
        res.send({token: token.compact(), pin: pin, err: '',_id: id, adminLevel: adminLevel});
   
   }) */

  


let port = 3000;

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});



