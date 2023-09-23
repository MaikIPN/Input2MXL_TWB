var http = require('http');
var fs = require('fs');
var log = require('./log-file');
var path = require('./config-files');


var idInter = null;
var inter = 0;
var numInter = 0;
var timeInter = 0;

function main(arg){
    try{
        
        log.pushLog("scan-ftpIN:main:"+arg);
        var chk = log.pullFileSt("scanFTPin");
        if(chk=="false"){
            log.pushFileSt("true","scanFTPin");
            inter = 0;
            numInter = path.nIntScanFTPin;
            timeInter = path.tIntScanFTPin;
            idInter = setInterval(respFile,timeInter);
            log.pushLog("scan-ftpIN:interval:"+timeInter+" ms "+numInter+" time(s)");
        }
        else{
            log.pushLog("scan-ftpIN:main:the ftp is running");
        }
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
};

function respFile(){
    try{
        log.pushLog("scan-ftpIN:resp-dir:ftpFiles:"+path.ftpInputfiles);
        var forceStop = log.pullFileSt("scanFTPin");
        if(forceStop=="false"){
            log.pushLog("scan-ftpIN:resp-dir:stop_interval_idleStart:"+idInter._idleStart + " repeat:" + idInter._repeat);
            log.pushFileSt("false","scanFTPin");
            clearInterval(idInter);
        }
        else{
            listDirFiles();
            inter++;
        }
        
    }
    catch(err){
        log.pushLog("scan-ftpIN:resp-dir:exception:" + err);
    }
}

function listDirFiles(){
    var src = path.ftpInputfiles;
    try{
        log.pushLog("scan-ftpIN:listDirFiles:"+src);

        fs.readdir(src,(err,list)=>{
            if(err){
                log.pushLog("scan-ftpIN:listDirFiles:fs:"+err);
            }
            if(list!=null){
                if(list.length>0){
                    log.pushLog("scan-ftpIN:listDirFiles:there are " + list.length + " files");
                    getClassRespFile(list);
                }
                else{
                    log.pushLog("scan-ftpIN:listDirFiles:No file found");
                    
                    var inData = {
                        response: Number,
                        countRes: { $lt: 7}
                    };
                    inData.response = 0;

                    var inQuery = {
                        _id: Number,
                        countRes: Number,
                    };
                    inQuery._id = 1;
                    inQuery.countRes = 1;
                    
                    db.ftpOUT.find(inData,inQuery).toArray(function(err, result){
                        if(err){
                            log.pushLog("scan-ftpIN:CountFTPout:exception:"+err);
                        }
                        else{
                            
                            //console.log(result);
                            
                            if(result.length>0)
                            {
                                for(var j=0;j<result.length;j++){
                                    log.pushLog("scan-ftpIN:pendingFiles: "+ result[j]._id);
                                }

                                log.pushLog("scan-ftpIN:listDirFiles:****MetodoSFTPInvoque****");

                                var chk = true; 
                                
                                if(chk==true){
                                    
                                    db.ftpOUT.update(inData,{$inc: {countRes: 1}}, {multi: true},function(){});

                                }
                                else{
                                    log.pushLog("scan-ftpIN:listDirFiles:*****Error Allynis Connect*****");
                                }
                            }
                            else{
                                log.pushLog("scan-ftpIN:listDirFiles:*****No pending files*****");
                            }
                        }
                    });
                }
            }
            else{
                log.pushLog("scan-ftpIN:listDirFiles:No Dir found");
            }
        });
    }
    catch(err){
        log.pushLog("scan-ftpIN:listDirFiles:exception:"+err);
    }
}

function getClassRespFile(listFiles){
    try{
        log.pushLog("scan-ftpIN:getClassFTPFile:execute:listFiles:" + listFiles);
        var params = {
            hostname: path.server,
            port: path.port,
            path: '/ftpin/'+listFiles
        }
        http.get(params, function(response){
            if(response.statusCode == 200){
                response.on('data',function(data){
                    inData = JSON.parse(data);
                    log.pushLog("scan-ftpIN:getFTPProcessFile:execute:" + inData.execute);
                })
            }
            else{
                log.pushLog("scan-ftpIN:getClassFTPFile:statusCode:" + response.statusCode);
            }
        });
    }
    catch(err){
        log.pushLog("scan-ftpIN:getClassFTPFile:exception:"+err);
    }
}



module.exports = main;