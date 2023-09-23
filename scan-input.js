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
        
        log.pushLog("scan-input:main:"+arg);
        var chk = log.pullFileSt("scanInput");
        if(chk=="false"){
            log.pushFileSt("true","scanInput");
            inter = 0;
            numInter = path.nIntScanInput;
            timeInter = path.tIntScanInput;
            idInter = setInterval(scanFile,timeInter);
            log.pushLog("scan-input:interval:"+timeInter+" ms "+numInter+" time(s)");
        }
        else{
            log.pushLog("scan-input:main:the scan is running");
        }
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
};

function scanFile(){
    try{
        log.pushLog("scan-input:scanFiles:"+path.inputfiles);
        var forceStop = log.pullFileSt("scanInput");
        if(forceStop=="false"){
            log.pushLog("scan-input:stop_interval_idleStart:"+idInter._idleStart + " repeat:" + idInter._repeat);
            log.pushFileSt("false","scanInput");
            clearInterval(idInter);
        }
        else{
            listDirFiles();
            inter++;
        }
        
    }
    catch(err){
        log.pushLog("scan-input:exception:" + err);
    }
}

function listDirFiles(){
    var src = path.inputfiles;
    try{
        log.pushLog("scan-input:listDirFiles:"+src);

        fs.readdir(src,(err,list)=>{
            if(err){
                log.pushLog("scan-input:listDirFiles:fs:"+err);
            }
            if(list!=null){
                if(list.length>0){
                    log.pushLog("scan-input:listDirFiles:there are " + list.length + " files");
                    getClassProcessFile(list);
                }
                else{
                    log.pushLog("scan-input:listDirFiles:No file found"); 
                }
            }
            else{
                log.pushLog("scan-input:listDirFiles:No Dir found");
            }
        });
        
    }
    catch(err){
        log.pushLog("scan-input:listDirFiles:exception:"+err);
    }
}

function getClassProcessFile(listFiles){
    try{
        log.pushLog("scan-input:getClassProcessFile:execute:listFiles:" + listFiles);
        var params = {
            hostname: path.server,
            port: path.port,
            path: '/input/'+listFiles
        }
        http.get(params, function(response){
            if(response.statusCode == 200){
                response.on('data',function(data){
                    inData = JSON.parse(data);
                    log.pushLog("scan-input:getClassProcessFile:execute:" + inData.execute);
                })
            }
            else{
                log.pushLog("scan-input:getClassProcessFile:statusCode:" + response.statusCode);
            }
        });
    }
    catch(err){
        log.pushLog("scan-input:getClassProcessFile:exception:"+err);
    }
}

module.exports = main;