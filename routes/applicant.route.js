const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const applicant_controller = require('../controllers/applicant.controller');
/* 


GET
http://localhost:3000/applicants/zap - remove all
http://localhost:3000/applicants - list all 
http://localhost:3000/applicants/5eec7af00eeb1e1a1cc1fada - get by Id
http://localhost:3000/applicants/getRec/hardeepdive@gmail.com - get by Email
http://localhost:3000/applicants/getToken/hardeepdive@gmail.com = create Token
http://localhost:3000/applicants/getToken/hardeep@sysbit.com
POST
http://localhost:3000/applicants/create - { "name": "Hardeep Singh"} - create record

DELETE
http://localhost:3000/applicants/5eedf7eefb308d6d548c3f02 - delete record by id

PUT
http://localhost:3000/applicants/5eedf967534b7a045c01fa7c - { "name": "Hardeep Singh","mobileNbr":"87133375"}

*/

// a simple test url to check that all of our files are communicating correctly.
router.get('/test', applicant_controller.test);
router.get('/zap', applicant_controller.zap);
router.post('/', applicant_controller.create);
router.get('/', applicant_controller.list);
router.get('/:id',  applicant_controller.get);
router.post('/upsert', applicant_controller.upsert);
router.post('/upLoadPhoto', applicant_controller.upLoadPhoto);
router.post('/upLoadDoc', applicant_controller.upLoadDoc);
router.get('/downLoadPhoto/:id', applicant_controller.downLoadPhoto);
router.post('/query', applicant_controller.query);

router.put('/:id', applicant_controller.update);
router.get('/getRec/:email',  applicant_controller.getRec);
router.get('/getToken/:email',  applicant_controller.getToken); 
router.delete('/zap', applicant_controller.zap);
router.delete('/:id', applicant_controller.delete);



module.exports = router;