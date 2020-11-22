const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const trainer_controller = require('../controllers/trainer.controller');




// a simple test url to check that all of our files are communicating correctly.
/* router.get('/test', trainer_controller.test);
router.get('/zap', trainer_controller.zap);
router.post('/create', trainer_controller.create);
router.get('/', trainer_controller.list);
router.get('/:id',  trainer_controller.getById);
router.post('/upsert', trainer_controller.upsert);
router.post('/upLoadPhoto', trainer_controller.upLoadPhoto);
router.post('/upLoadDoc', trainer_controller.upLoadDoc);
router.get('/downLoadPhoto/:id', trainer_controller.downLoadPhoto);
router.post('/query', trainer_controller.query);
router.delete('/delete/:id', trainer_controller.delete);
router.put('/update/:id', trainer_controller.update);
router.get('/getTrainer/:email',  trainer_controller.getByEmail);
 */
router.get('/test', trainer_controller.test);
router.post('/zipper', trainer_controller.zipper);
router.get('/zap', trainer_controller.zap);
router.post('/', trainer_controller.create);
router.get('/', trainer_controller.list);
router.get('/:id',  trainer_controller.get);
router.post('/upsert', trainer_controller.upsert);
router.post('/upLoadPhoto', trainer_controller.upLoadPhoto);
router.post('/upLoadDoc', trainer_controller.upLoadDoc);
router.get('/downLoadPhoto/:id', trainer_controller.downLoadPhoto);

router.get('/downLoadFile/:id/folder/:folder/file/:file', trainer_controller.downLoadFile);
router.post('/query', trainer_controller.query);

router.put('/:id', trainer_controller.update);
router.get('/getRec/:email',  trainer_controller.getRec);
router.get('/getToken/:email',  trainer_controller.getToken); 
router.delete('/zap', trainer_controller.zap);

router.delete('/:id', trainer_controller.delete);



module.exports = router;