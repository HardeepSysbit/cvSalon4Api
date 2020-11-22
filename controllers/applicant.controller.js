const Applicant = require('../models/applicant.model');
const path = require('path');
const jwt = require('njwt');
const accessTokenSecret = "sysbit27101958" ;
var nodemailer = require('nodemailer');

//Import the mongoose module
//const mongoose = require('mongoose');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from Applicant Controller');
   
};



exports.zap = function (req, res) {
   
    Applicant.remove({}, function (err) {
       if (err) return next(err);
       res.send('Zap table Applicant successfull!');
   })  
   
      
   };
   

exports.list = function (req, res) {


   Applicant.find({}).then(function (applicants) {
                res.send(applicants);
                });
};

exports.query = function (req, res) {

            
             //  console.log(JSON.stringify( req.body)) ;

               /*  Applicant.find({"applicantName": "HARDEEP SINGH"}).then(function (applicants) {
                 res.send(applicants);
                 });  */

              // var filter = [] ;

              // console.log("______________") ;

              // console.log(JSON.stringify(filter)) ;
               
               Applicant.find({ programs : { $all : req.body }}).then(function (applicants) {
                
                
                   
                    res.send(applicants);
                   
                
                });  


 };


 exports.get = function (req, res) {
    Applicant.findById(req.params.id, function (err, applicant) {
        if (err) return next(err);
        res.send(applicant);
    })
}; 

exports.getRec = function (req, res) {

     Applicant.findOne({"email": req.params.email}, function (err, applicant) {
        if (err) return next(err);
        res.send(applicant);
    })
};

exports.getToken = function (req, res) {
    
     console.log('findone') ;
     
     let email = req.params.email ;
      

      Applicant.findOne({"email":  email}, function (err, applicant) {
      if (err) return res.send({token: '', pin: '', err: 'Error in extracting record for ' + email});

     
     
      let id = ''
      let adminLevel = 0 ;
      
      if (applicant != null) {
        id = applicant._id ;
         
      }
      
     const claims = { iss: 'cvSalon', sub: 'applicant' , email:  email, _id: id, adminLevel: adminLevel }
     const token = jwt.create(claims, accessTokenSecret)
     token.setExpiration(new Date().getTime() + 60*60*1000)
    
     let pin =  token.compact();
     pin = pin.slice(-6).replace('_','X').replace('-','A').toUpperCase() ;

    var mailOptions = {
    from: 'hardeep@ifishtour.com',
    to: email,
    subject: 'Opimus Minds Pin Code',
    text: 'Please enter this pin code : ' + pin
    }; 

    var transporter =  nodemailer.createTransport({
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
   
   })

  }




exports.upsert = function (req, res) {
   
        if ( req.body._id === null) {
            console.log('null') ;
        }

        var query = {'_id': req.body._id};

  	    Applicant.findOneAndUpdate(query, 
        {$set: {      
            
         
            
            name: 		    req.body.name,
            idNbr:          req.body.idNbr,
            email:		    req.body.email,
            dob:            req.body.dob,
            mobileNbr:      req.body.mobileNbr,
            address:        req.body.address,
            aboutMe:        req.body.aboutMe,
            edus:           req.body.edus,
            exps:           req.body.exps
            
        }} ,
        {upsert:true}, function(err, doc){ 
	if (err) return res.send(500, { error: err }); 
		return res.send({"msg":"Successfully upserted Id-" + doc}); 
       
	});

};

  



exports.create = function (req, res) {
    let applicant = new Applicant(
        {
      
            name: 		    req.body.name,
            idNbr:          req.body.idNbr,
            email:		    req.body.email,
            dob:            req.body.dob,
            mobileNbr:      req.body.mobileNbr,
            address:        req.body.address,
            aboutMe:        req.body.aboutMe,
            edus:           req.body.edus,
            exps:           req.body.exps
        }
    );
 
    applicant.save(function (err,records) {
        if (err) {
            return "dataerror:" + err ;
        }
      //  console.log("Record added as "+ records._id);
       
        res.send(records) ;
    })

};

	exports.update = function (req, res) {
        console.log('si') ;
        console.log(req.params.id) ;
   		 Applicant.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, applicant) {
    		    if (err) return next(err);
     		   res.send(res.records);
    		});
	};


exports.delete = function (req, res) {
    console.log('a') ;
    Applicant.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};

exports.applicant_deleteall = function (req, res) {

    console.log('error delete') ;

    /* Applicant.remove({}, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    }) */
};

exports.upLoadPhoto = function (req, res) {

    try {
  
        console.log("upload photob A" ) ;
    
        if(!req.files) {
  
            console.log("no file") ;
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
        
           console.log("upload photo 2" ) ;

           let _id  = req.body._id ;
           let photo = req.files.file ;
           console.log("upload photo 3" ) ;
           
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            console.log(`applicantDocs/${_id}/applicantPhoto.png`) ;
            photo.mv(`applicantDocs/${_id}/applicantPhoto.png`);
  
       
            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: photo.name,
                    mimetype: photo.mimetype,
                    size: photo.size
                }
            });
        }
    } catch (err) {
        console.log('errrrrr')
        res.status(500).send(err);
    }
  }
  
  
  
  exports.upLoadDoc = function (req, res) {
    try {
  
        console.log("upload doc A" ) ;
    
        if(!req.files) {
  
            console.log("no file") ;
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
           /* console.log("rcvd") ;
           console.log(req.body.myFolder) ;
       */
           let _id  = req.body._id ;
           let docId = req.body.docId ;
           let docTable = req.body.docTable ;
           let docName = docId + '.' + req.files.file.name ;
           let doc = req.files.file ;
                      
           //Use the mv() method to place the file in upload directory (i.e. "uploads")
            console.log(`applicantDocs/${_id}/${docTable}/${docName}`) ;
            doc.mv(`applicantDocs/${_id}/${docTable}/${docName}`) ;
  
       
            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: doc.name,
                    mimetype: doc.mimetype,
                    size: doc.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
  }
  

  exports.downLoadPhoto  = function (req, res) {
      try {
  
  

    

    var _id = req.params.id;

 
   
    var fileLocation = path.join('applicantDocs/' + _id  ,'applicantPhoto.png');
     
   
 
    res.download(fileLocation, 'applicantPhoto.png'); 


} catch (err) {
    res.status(500).send(err);
}
  }
