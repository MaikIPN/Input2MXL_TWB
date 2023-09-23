var express = require('express');
var router = express.Router();

router.get('/:trigram',function(req,res,next){
    try{
        const threads = require('threads');
        const spawn = threads.spawn;
        var doWork = spawn('./gpg.js');
        doWork.send(req.params.trigram);
        res.json({
            "execute": "call"
        });
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
});

module.exports = router;