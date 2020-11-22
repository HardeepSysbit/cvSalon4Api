const Agent = require('../models/agent.model');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

exports.agent_list = function (req, res) {
   Agent.find({}).then(function (agents) {
                res.send(agents);
                });
};

exports.agent_details = function (req, res) {
    Agent.findById(req.params.id, function (err, agent) {
        if (err) return next(err);
        res.send(agent);
    })
};

exports.getAgent = function (req, res) {
   Agent.findOne({"agentCode": req.params.agentCode}, function (err, agent) {
        if (err) return next(err);
        res.send(agent);
    })
};


exports.agent_upsert = function (req, res) {
   


   var query = {'_id': req.body._id};

      

  
	Agent.findOneAndUpdate(query, 
        {$set: {      
            
		    agentCode: 	req.body.agentCode,
           	name: 		req.body.name,
            email:		req.body.email,
    		webTitle: 	req.body.webTitle,
             superAdmin:	req.body.superAdmin,
                companyCode:    req.body.companyCode,
                lng: 	        req.body.lng,
                nbr: 	        req.body.nbr,
                pswd:		req.body.pswd,
                superAdmin:	req.body.superAdmin,
                markUp:		req.body.markUp,	
    	        msgSvc:		req.body.msgSvc 
     	}} ,
        {upsert:true}, function(err, doc){ 
	if (err) return res.send(500, { error: err }); 
		return res.send({"msg":"Successfully upserted DATA"}); 

	});

};

  



exports.agent_create = function (req, res) {
    let agent = new Agent(
        {
	   	agentCode: 	req.body.agentCode,
           	name: 		req.body.name,
                email:		req.body.email,
    		webTitle: 	req.body.webTitle,
                superAdmin:	req.body.superAdmin,
                companyCode:     req.body.companyCode,
                lng: 	        req.body.lng,
                nbr: 	        req.body.nbr,
                pswd:		req.body.pswd,
                superAdmin:	req.body.superAdmin,
                markUp:		req.body.markUp,	
    	        msgSvc:		req.body.msgSvc 
        }
    );
 
    agent.save(function (err) {
        if (err) {
            return "dataerror:" + err ;
        }
        res.send({"msg":"Agent Inserted Successfully"})
    })

};

	exports.agent_update = function (req, res) {
   		 Agent.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, agent) {
    		    if (err) return next(err);
     		   res.send('Agent udpated.');
    		});
	};


exports.agent_delete = function (req, res) {
    Agent.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};

exports.agent_deleteAll = function (req, res) {
    Agent.remove({}, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};







