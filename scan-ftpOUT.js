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
        
        log.pushLog("scan-ftpOUT:main:"+arg);
        var chk = log.pullFileSt("scanFTPout");
        if(chk=="false"){
            log.pushFileSt("true","scanFTPout");
            inter = 0;
            numInter = path.nIntScanFTPout;
            timeInter = path.tIntScanFTPout;
            idInter = setInterval(ftpFile,timeInter);
            log.pushLog("scan-ftpOUT:interval:"+timeInter+" ms "+numInter+" time(s)");
        }
        else{
            log.pushLog("scan-ftpOUT:main:the ftp is running");
        }
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
};

function ftpFile(){
    try{
        log.pushLog("scan-ftpOUT:ftpFiles:"+path.inputfiles);
        var forceStop = log.pullFileSt("scanFTPout");
        if(forceStop=="false"){
            log.pushLog("scan-ftpOUT:stop_interval_idleStart:"+idInter._idleStart + " repeat:" + idInter._repeat);
            log.pushFileSt("false","scanFTPout");
            clearInterval(idInter);
        }
        else{
            listDirFiles();
            inter++;
        }
        
    }
    catch(err){
        log.pushLog("scan-ftpOUT:exception:" + err);
    }
}

function listDirFiles(){
    var src = path.ntOutputfiles;
    try{
        log.pushLog("scan-ftpOUT:listDirFiles:"+src);

        fs.readdir(src,(err,list)=>{
            if(err){
                log.pushLog("scan-ftpOUT:listDirFiles:fs:"+err);
            }
            if(list!=null){
                if(list.length>0){
                    log.pushLog("scan-ftpOUT:listDirFiles:there are " + list.length + " files");
                    getClassFTPFile(list);
                }
                else{
                    log.pushLog("scan-ftpOUT:listDirFiles:No file found"); 
                }
            }
            else{
                log.pushLog("scan-ftpOUT:listDirFiles:No Dir found");
            }
        });
        
    }
    catch(err){
        log.pushLog("scan-ftpOUT:listDirFiles:exception:"+err);
    }
}

function getClassFTPFile(listFiles){
    try{
        log.pushLog("scan-ftpOUT:getClassFTPFile:execute:listFiles:" + listFiles);
        var params = {
            hostname: path.server,
            port: path.port,
            path: '/ftpout/'+listFiles
        }
        http.get(params, function(response){
            if(response.statusCode == 200){
                response.on('data',function(data){
                    inData = JSON.parse(data);
                    log.pushLog("scan-ftpOUT:getFTPProcessFile:execute:" + inData.execute);
                })
            }
            else{
                log.pushLog("scan-ftpOUT:getClassFTPFile:statusCode:" + response.statusCode);
            }
        });
    }
    catch(err){
        log.pushLog("scan-ftpOUT:getClassFTPFile:exception:"+err);
    }
}

module.exports = main;