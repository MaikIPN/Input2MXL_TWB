var express= require('express');
var router = express.Router();
var log = require('./log-file');

router.get('/:nThread',function(req,res){
    try{
        stopThread(req.params.nThread);
        res.json({
            "execute": "call"
        });
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
});

function stopThread(nThread){
    try{
        var pName = "";
        if(nThread=="scanInput"){
            pName = "scanInput";
        }
        if(nThread=="scanFTPout"){
            pName = "scanFTPout";
        }
        if(nThread=="scanFTPin"){
            pName = "scanFTPin";
        }
        //Modulo de GPG
        if(nThread=="scangpg"){
        pName = "scangpg";
        }
        /**********************/
        if(pName!=""){
            log.pushFileSt("false",pName);
        }

    }
    catch(err){
        log.pushLog("stopThreads:exception:"+err);
    }
}


module.exports = router;
