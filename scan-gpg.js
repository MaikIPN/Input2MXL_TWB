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
        
        log.pushLog("scan-gpg:main:"+arg);
        var chk = log.pullFileSt("scangpg");
        if(chk=="false"){
            log.pushFileSt("true","scangpg");
            inter = 0;
            numInter = path.nIntScanInput;
            timeInter = path.tIntScanInput;
            idInter = setInterval(scanFile,timeInter);
            log.pushLog("scan-gpg:interval:"+timeInter+" ms "+numInter+" time(s)");
        }
        else{
            log.pushLog("scan-gpg:main:the scan is running");
        }
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
};

function scanFile(){
    try{
        log.pushLog("scan-gpg:scanFiles:"+path.gpgfiles);
        var forceStop = log.pullFileSt("scangpg");
        if(forceStop=="false"){
            log.pushLog("scan-gpg:stop_interval_idleStart:"+idInter._idleStart + " repeat:" + idInter._repeat);
            log.pushFileSt("false","scangpg");
            clearInterval(idInter);
        }
        else{
            listDirFiles();
            inter++;
        }
        
    }
    catch(err){
        log.pushLog("scan-gpg:exception:" + err);
    }
}

function listDirFiles(){
    var src = path.gpgfiles;
    try{
        log.pushLog("scan-gpg:listDirFiles:"+src);

        fs.readdir(src,(err,list)=>{
            if(err){
                log.pushLog("scan-gpg:listDirFiles:fs:"+err);
            }
            if(list!=null){
                if(list.length>0){
                    log.pushLog("scan-gpg:listDirFiles:there are " + list.length + " files");
                    getClassProcessFile(list);
                }
                else{
                    log.pushLog("scan-gpg:listDirFiles:No file found"); 
                }
            }
            else{
                log.pushLog("scan-gpg:listDirFiles:No Dir found");
            }
        });
        
    }
    catch(err){
        log.pushLog("scan-gpg:listDirFiles:exception:"+err);
    }
}

function getClassProcessFile(listFiles){
    try{
        log.pushLog("scan-gpg:getClassProcessFile:execute:listFiles:" + listFiles);
        var params = {
            hostname: path.server,
            port: path.port,
            path: '/gpg/'+listFiles
        }
        http.get(params, function(response){
            if(response.statusCode == 200){
                response.on('data',function(data){
                    inData = JSON.parse(data);
                    log.pushLog("scan-gpg:getClassProcessFile:execute:" + inData.execute);
                })
            }
            else{
                log.pushLog("scan-gpg:getClassProcessFile:statusCode:" + response.statusCode);
            }
        });
    }
    catch(err){
        log.pushLog("scan-gpg:getClassProcessFile:exception:"+err);
    }
}

module.exports = main;