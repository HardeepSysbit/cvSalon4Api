const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const lms_controller = require('../controllers/lms.controller');




// a simple test url to check that all of our files are communicating correctly.
/* router.get('/test', lms_controller.test);
router.get('/zap', lms_controller.zap);
router.post('/create', lms_controller.create);
router.get('/', lms_controller.list);
router.get('/:id',  lms_controller.getById);
router.post('/upsert', lms_controller.upsert);
router.post('/upLoadPhoto', lms_controller.upLoadPhoto);
router.post('/upLoadDoc', lms_controller.upLoadDoc);
router.get('/downLoadPhoto/:id', lms_controller.downLoadPhoto);
router.post('/query', lms_controller.query);
router.delete('/delete/:id', lms_controller.delete);
router.put('/update/:id', lms_controller.update);
router.get('/getlms/:email',  lms_controller.getByEmail);
 */
router.get('/test', lms_controller.test);
router.post('/zipper', lms_controller.zipper);
router.get('/zap', lms_controller.zap);
router.post('/', lms_controller.create);
router.get('/', lms_controller.list);
router.get('/userStories', lms_controller.userStories);
router.get('/:id',  lms_controller.get);
router.post('/upsert', lms_controller.upsert);
router.post('/upLoadPhoto', lms_controller.upLoadPhoto);
router.post('/upLoadDoc', lms_controller.upLoadDoc);
router.put('/addPoint/:id', lms_controller.addPoint);
router.get('/downLoadPhoto/:id', lms_controller.downLoadPhoto);
router.get('/downLoadFile/:id/folder/:folder/file/:file', lms_controller.downLoadFile);
router.post('/query', lms_controller.query);
router.post('/aquery', lms_controller.query);
router.put('/:id', lms_controller.update);
router.get('/getRec/:email',  lms_controller.getRec);
router.get('/getToken/:email',  lms_controller.getToken); 
router.delete('/zap', lms_controller.zap);

router.delete('/:id', lms_controller.delete);



module.exports = router;