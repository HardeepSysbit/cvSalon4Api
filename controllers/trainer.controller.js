const Trainer = require('../models/trainer.model');
const path = require('path');
const jwt = require('njwt');
const accessTokenSecret = "sysbit27101958" ;
var nodemailer = require('nodemailer');

var fs = require("fs");
var JSZip = require("jszip");
const { fileURLToPath } = require('url');
const { Console } = require('console');
 


//Import the mongoose module
//const mongoose = require('mongoose');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from Trainer Controller');
   
};

exports.zipper = function (req, res) {

var _id = req.body._id;
var name = req.body.name ;

var docs = {} ;
var Docs = req.body.docs  ;

if (typeof(Docs) == "string") {
  
    docs = JSON.parse(req.body.docs) ;
}
else {
  
    docs = req.body.docs ;
}

var filePath = "" ;
var trainerDocs = "trainerDocs" ;

// files.push({fileName: 'mobileIndo.docx', folder: folder}) ;
// files.push({fileName: 'hardeepSkill Matrix.docx', folder: folder}) ;
// files.push({fileName: 'trainerPhoto.png', folder: folder}) ;
console.log(_id) ;
console.log(name) ;
console.log(docs.length)  ;
for (let ix = 0; ix < docs.length; ix++) {
  
      filePath = path.resolve(`trainerDocs\\${_id}\\${docs[ix].folder}\\${docs[ix].fileName}`) ;
      console.log(docs[ix].folder) ;
      console.log(docs[ix].fileName) ;
  }





zipName  = path.resolve('trainerDocs/' + _id ,name);
console.log(zipName) ;
var strFile = "" ;    
let zip = new JSZip();
//zip.file(req.files.file,'cv.pdf') ;

for (let ix = 0; ix < docs.length; ix++) {
  //  strFile = `\\${trainerDocs}\\${_id}\\${docs[ix].folder}\\${docs[ix].fileName}`
 //   console.log(strFile) ;
    filePath = path.resolve(`trainerDocs\\${_id}\\${docs[ix].folder}\\${docs[ix].fileName}`) ;
    console.log(filePath) ;
    zip.file(docs[ix].fileName, filePath);
}


zip
.generateNodeStream({type:'nodebuffer',streamFiles:true})
.pipe(fs.createWriteStream(zipName))

.on('finish', function () {
    console.log('finish' + zipName)  ;


   res.send({"docFolder":`trainerDocs//${_id}`, "docFile":`${name}`}) ;

});


   
};

exports.zap = function (req, res) {
   
    Trainer.remove({}, function (err) {
       if (err) return next(err);
       res.send('Zap table Trainer successfull!');
   })  
   
      
   };
   

exports.list = function (req, res) {


   Trainer.find({}).then(function (trainers) {
                res.send(trainers);
                });
};

exports.query = function (req, res) {

            
             //  console.log(JSON.stringify( req.body)) ;

               /*  Trainer.find({"trainerName": "HARDEEP SINGH"}).then(function (trainers) {
                 res.send(trainers);
                 });  */

              // var filter = [] ;

              // console.log("______________") ;

              // console.log(JSON.stringify(filter)) ;
               
               Trainer.find({ programs : { $all : req.body }}).then(function (trainers) {
                
                
                   
                    res.send(trainers);
                   
                
                });  


 };


 exports.get = function (req, res) {
    Trainer.findById(req.params.id, function (err, trainer) {
        if (err) return next(err);
        res.send(trainer);
    })
}; 

exports.getRec = function (req, res) {

     Trainer.findOne({"email": req.params.email}, function (err, trainer) {
        if (err) return next(err);
        res.send(trainer);
    })
};

exports.getToken = function (req, res) {
    
     console.log('findone') ;
     
     let email = req.params.email ;
      

      Trainer.findOne({"email":  email}, function (err, trainer) {
      if (err) return res.send({token: '', pin: '', err: 'Error in extracting record for ' + email});

     
     
      let id = ''
      let adminLevel = 0 ;
      
      if (trainer != null) {
        id = trainer._id ;
         
      }
      
     const claims = { iss: 'cvSalon', sub: 'trainer' , email:  email, _id: id, adminLevel: adminLevel }
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

  	    Trainer.findOneAndUpdate(query, 
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
    let trainer = new Trainer(
        {
      
            name: 		    req.body.name,
            idNbr:          req.body.idNbr,
            email:		    req.body.email,
            dob:            req.body.dob,
            mobileNbr:      req.body.mobileNbr,
            address:        req.body.address,
            aboutMe:        req.body.aboutMe,
            edus:           req.body.edus,
            exps:           req.body.exps,
            certs:          req.body.certs,
            skills:         req.body.skills,
            acheives:       req.body.acheives,
            programs:       req.body.programs,
            moeFile:        req.body.moeFile,
            moeExpiry:      req.body.moeExpiry,
            declareChk:     req.body.declareChk,
            shareChk:       req.body.shareChk
        }
    );
 
    trainer.save(function (err,records) {
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
   		 Trainer.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, trainer) {
    		    if (err) return next(err);
     		   res.send(res.records);
    		});
	};


exports.delete = function (req, res) {
    console.log('a') ;
    Trainer.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};

exports.trainer_deleteall = function (req, res) {

    console.log('error delete') ;

    /* Trainer.remove({}, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    }) */
};

exports.upLoadPhoto = function (req, res) {

    try {
  
        console.log("upload photo" ) ;
    
        if(!req.files) {
  
            console.log("no file") ;
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
        
           

           let _id  = req.body._id ;
           let photo = req.files.file ;
           console.log("upload photo 3" ) ;
           
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            console.log(`trainerDocs/${_id}/trainerPhoto.png`) ;
            photo.mv(`trainerDocs/${_id}/trainerPhoto.png`);
  
       
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
        //    let docName = docId + '.' + req.files.file.name ;
           let docName =  req.files.file.name ;
           let doc = req.files.file ;
                      
           //Use the mv() method to place the file in upload directory (i.e. "uploads")
            console.log(`trainerDocs/${_id}/${docTable}/${docName}`) ;
            doc.mv(`trainerDocs/${_id}/${docTable}/${docName}`) ;
  
       
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

 
   
    var fileLocation = path.join('trainerDocs/' + _id  + "/",'trainerPhoto.png');
     
   
 
    res.download(fileLocation, 'trainerPhoto.png'); 


} catch (err) {
    res.status(500).send(err);
}
  }


/* 
  app.get( "/download/dump", authenticate, (req:Request, res:Response) => {
    const file = path.resolve(__dirname, `./dumps/dump.gz`);
    //No need for special headers
    res.download(file); 
})
 */
exports.downLoadFile  = function (req, res) {

    var _id = req.params.id;
    var _folder =  req.params.folder;
    var _file =  req.params.file;

    let file  = "" ; 
    if (_folder == "cv") {
        file = path.resolve('trainerDocs/' + _id  , _file);
    }
    else {
         file = path.resolve('trainerDocs/' + _id  + "/" + _folder, _file);
    }

   console.log('xxx' + file) ;

    res.download(file); 
}

  exports.downLoadFileOld  = function (req, res) {
    try {



  

  var _id = req.params.id;
  var _folder =  req.params.folder;
  var _file =  req.params.file;

 
  var fileLocation = path.join('trainerDocs/' + _id  + "/" + _folder,_file);
   


  res.download(fileLocation, _file); 


} catch (err) {
  res.status(500).send(err);
}
}