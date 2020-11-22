const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const agent_controller = require('../controllers/agent.controller');


// a simple test url to check that all of our files are communicating correctly.
router.get('/test', agent_controller.test);
router.post('/create', agent_controller.agent_create);
router.post('/upsert', agent_controller.agent_upsert);
router.get('/:id',  agent_controller.agent_details);
router.get('/getAgent/:agentCode',  agent_controller.getAgent);
router.get('/', agent_controller.agent_list);
router.put('/:id/update', agent_controller.agent_update);

router.delete('/:id/delete', agent_controller.agent_delete);
router.delete('/deleteAll', agent_controller.agent_deleteAll);






module.exports = router;