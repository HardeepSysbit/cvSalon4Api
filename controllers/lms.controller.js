const Lms = require('../models/lms.model');
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
    res.send('Greetings from lms Controller');
   
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
var lmsDocs = "lmsDocs" ;

// files.push({fileName: 'mobileIndo.docx', folder: folder}) ;
// files.push({fileName: 'hardeepSkill Matrix.docx', folder: folder}) ;
// files.push({fileName: 'lmsPhoto.png', folder: folder}) ;
console.log(_id) ;
console.log(name) ;
console.log(docs.length)  ;
for (let ix = 0; ix < docs.length; ix++) {
  
      filePath = path.resolve(`lmsDocs\\${_id}\\${docs[ix].folder}\\${docs[ix].fileName}`) ;
      console.log(docs[ix].folder) ;
      console.log(docs[ix].fileName) ;
  }





zipName  = path.resolve('lmsDocs/' + _id ,name);
console.log(zipName) ;
var strFile = "" ;    
let zip = new JSZip();
//zip.file(req.files.file,'cv.pdf') ;

for (let ix = 0; ix < docs.length; ix++) {
  //  strFile = `\\${lmsDocs}\\${_id}\\${docs[ix].folder}\\${docs[ix].fileName}`
 //   console.log(strFile) ;
    filePath = path.resolve(`lmsDocs\\${_id}\\${docs[ix].folder}\\${docs[ix].fileName}`) ;
    console.log(filePath) ;
    zip.file(docs[ix].fileName, filePath);
}


zip
.generateNodeStream({type:'nodebuffer',streamFiles:true})
.pipe(fs.createWriteStream(zipName))

.on('finish', function () {
    console.log('finish' + zipName)  ;


   res.send({"docFolder":`lmsDocs//${_id}`, "docFile":`${name}`}) ;

});


   
};

exports.zap = function (req, res) {
   
    Lms.remove({}, function (err) {
       if (err) return next(err);
       res.send('Zap table lms successfull!');
   })  
   
      
   };
   
exports.addPoint = function (req, res) {

    var _id = req.params.id ;
    var nbr = req.body.nbr ;
    var reason = req.body.reason ;
    var points = req.body.points ;
    
    
    

    
    var newData = {} ;
     
  

    Lms.find({}).then(function (lms) {

       

        for (let i = 0; i < lms.length; i++) {
            if (lms[i]._id == _id) {
                    newData = lms[i] ;
                    break ;
            }
          }


         // console.log(JSON.stringify(newData.userStories[nbr])) ;
         for (let i = 0; i < newData.userStories.length; i++) {
             if (newData.userStories[i].nbr == nbr) {
          newData.userStories[i].points.push({"points": points, "reason": reason}) ;
          break ;
             }
         }
              
           Lms.findByIdAndUpdate(req.params.id, {$set: newData}, function (err, lms) {
             if (err) return next(err);
             res.send(res.records);
         })     


  
 });

}

exports.list = function (req, res) {


   Lms.find({}).then(function (lmss) {
                res.send(lmss);
                });
};

exports.userStories = function (req, res) {

    Lms.find({}).then(function (lms) {

        var lst = [] ;

        for (let i = 0; i < lms.length; i++) {
            for (let x = 0; x < lms[i].userStories.length; x++) {
                 
                totPts = 0 ;

                for (let y = 0; y < lms[i].userStories[x].points.length; y++) {
                    totPts += lms[i].userStories[x].points[y].points ;
                }

                lst.push({"_id": lms[i]._id, "learner": lms[i].name, "email": lms[i].email, "nbr": lms[i].userStories[x].nbr, "role": lms[i].userStories[x].role, "function": lms[i].userStories[x].function, "benefit": lms[i].userStories[x].benefit, "totPoints": totPts, "points": lms[i].userStories[x].points} ) ;
            }
          }

    //    lst =   lst.sort((a, b) => {  
      
    //         return a.totPoints- b.totPoints * -1 
          
    //     });

        res.send(lst.sort((a, b) => {  
      
            if (a.totPoints > b.totPoints) return -1;
            if (b.totPoints > a.totPoints) return 1;
          
            return 0;
           
          
        }));
                 });
 };

exports.query = function (req, res) {

            
             //  console.log(JSON.stringify( req.body)) ;

               /*  lms.find({"lmsName": "HARDEEP SINGH"}).then(function (lmss) {
                 res.send(lmss);
                 });  */

              // var filter = [] ;

              // console.log("______________") ;

              // console.log(JSON.stringify(filter)) ;
               
               Lms.find({ programs : { $all : req.body }}).then(function (lmss) {
                
                
                   
                    res.send(lmss);
                   
                
                });  


 };


 exports.get = function (req, res) {
    Lms.findById(req.params.id, function (err, lms) {
        if (err) return next(err);
        res.send(lms);
    })
}; 

exports.getRec = function (req, res) {

    
    Lms.findOne({"email": req.params.email}, function (err, lms) {
        if (err) return next(err);
        res.send(lms);
    })
};

exports.getToken = function (req, res) {
    
     console.log('findone') ;
     
     let email = req.params.email ;
      

      Lms.findOne({"email":  email}, function (err, lms) {
      
        if (err) return res.send({token: '', pin: '', err: 'Error in extracting record for ' + email});

     
     
      let id = ''
      let adminLevel = 0 ;
      
      if (lms != null) {
        id = lms._id ;
         
      }
      
     const claims = { iss: 'cvSalon', sub: 'lms' , email:  email, _id: id, adminLevel: adminLevel }
     const token = jwt.create(claims, accessTokenSecret)
     token.setExpiration(new Date().getTime() + 60*60*1000)
    
     let pin =  token.compact();
     pin = pin.slice(-6).replace('_','X').replace('-','A').toUpperCase() ;

    var mailOptions = {
    from: 'hardeep@sysbit.com',
    to: email,
    subject: 'Sysbit LMS',
    text: 'Please enter this pin code : ' + pin
    }; 

    console.log(email) ;

    // var transporter =  nodemailer.createTransport({
    //     host: 'mail.sysbit.com',
    //     port: 587,
    //     secure: false, // use TLS
    //     auth: {
    //         user: 'hardeep@sysbit.com',
    //         pass: 'hardeep123456'
    //     },
    //     tls: {
    //       // do not fail on invalid certs
    //       rejectUnauthorized: false
    //     }
    //   })


    // transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    //   }); 
    
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

  	    Lms.findOneAndUpdate(query, 
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
    let lms = new Lms(
        {
      
            name: 		    req.body.name,
            email:		    req.body.email,
            mobileNbr:      req.body.mobileNbr,
            aboutMe:        req.body.aboutMe,
            userStories:     req.body.userStories,
            stage:            req.body.stage 
        //     dob:            req.body.dob,
        //     mobileNbr:      req.body.mobileNbr,
        //     address:        req.body.address,
        //     aboutMe:        req.body.aboutMe,
        //     edus:           req.body.edus,
        //     exps:           req.body.exps,
        //     certs:          req.body.certs,
        //     skills:         req.body.skills,
        //     acheives:       req.body.acheives,
        //     programs:       req.body.programs,
        //     moeFile:        req.body.moeFile,
        //     moeExpiry:      req.body.moeExpiry,
        //     declareChk:     req.body.declareChk,
        //     shareChk:       req.body.shareChk
         }
    );
 
    lms.save(function (err,records) {
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
   		 Lms.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, lms) {
    		    if (err) return next(err);
     		   res.send(res.records);
    		});
	};


exports.delete = function (req, res) {
    console.log('a') ;
    Lms.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};

exports.lms_deleteall = function (req, res) {

    console.log('error delete') ;

    /* lms.remove({}, function (err) {
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
            console.log(`lmsDocs/${_id}/lmsPhoto.png`) ;
            photo.mv(`lmsDocs/${_id}/lmsPhoto.png`);
  
       
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
            console.log(`lmsDocs/${_id}/${docTable}/${docName}`) ;
            doc.mv(`lmsDocs/${_id}/${docTable}/${docName}`) ;
  
       
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

 
   
    var fileLocation = path.join('lmsDocs/' + _id  + "/",'lmsPhoto.png');
     
   
 
    res.download(fileLocation, 'lmsPhoto.png'); 


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
        file = path.resolve('lmsDocs/' + _id  , _file);
    }
    else {
         file = path.resolve('lmsDocs/' + _id  + "/" + _folder, _file);
    }

   console.log('xxx' + file) ;

    res.download(file); 
}

  exports.downLoadFileOld  = function (req, res) {
    try {



  

  var _id = req.params.id;
  var _folder =  req.params.folder;
  var _file =  req.params.file;

 
  var fileLocation = path.join('lmsDocs/' + _id  + "/" + _folder,_file);
   


  res.download(fileLocation, _file); 


} catch (err) {
  res.status(500).send(err);
}
}