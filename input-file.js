var fs = require('fs');
var log = require('./log-file');
var path = require('./config-files');



function main(listFiles){
    try{
        var chk = log.pullFileSt("inputFile");
        if(chk=="false"){
            log.pushFileSt("true","inputFile");
            processFile(listFiles);
        }
        else{
            log.pushLog("inputfile:main:the processfile is running");
        }
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
};

function processFile(listFiles){
    try{
        log.pushLog("inputfile:processfile:listFile:"+listFiles);
        var arrayListFiles = listFiles.split(",");
        console.log(arrayListFiles.length);
        for(var j=0;j<arrayListFiles.length;j++){
            //console.log(arrayListFiles[j]);
            listDirFiles(arrayListFiles[j]);
        }
        log.pushFileSt("false","inputFile");
    }
    catch(err){
        log.pushLog("inputfile:processfile:exception:" + err);
    }
}

function listDirFiles(fileName){
    var src = path.inputfiles;
    try{
        log.pushLog("inputfile:listDirFiles:"+src +"/"+ fileName);

            var dateFilesM = [];
            var dateFilesN = [];
            var sizeFiles = [];
            var nameFiles = [];
    
            log.pushLog("inputfile:listDirFiles:"+src+"/"+fileName);
            log.readLineFile(src+fileName);
            nameFiles.push(fileName); 
            var input = src+"/"+fileName;
            fs.stat(input,(err,stats)=>{
                if(err){
                    log.pushLog("inputfile:listDirFiles:stat:" + err);
                }
                else{
                    dateFilesM.push(stats.ctime.getFullYear()+"-"+ log.getPadLeft2((stats.ctime.getMonth()+1).toString())+"-"+ 
                                log.getPadLeft2(stats.ctime.getDate().toString()) +" "+ log.getPadLeft2(stats.ctime.getHours().toString()) +
                                ":" + log.getPadLeft2(stats.ctime.getMinutes().toString())+":"+log.getPadLeft2(stats.ctime.getSeconds().toString()));
                    dateFilesN.push(stats.ctime.getFullYear()+log.getPadLeft2((stats.ctime.getMonth()+1).toString())+ 
                                log.getPadLeft2(stats.ctime.getDate().toString()) + log.getPadLeft2(stats.ctime.getHours().toString()) +
                                log.getPadLeft2(stats.ctime.getMinutes().toString())+log.getPadLeft2(stats.ctime.getSeconds().toString()));
                    sizeFiles.push(stats.size.toString());
                    
                }
                moveFile(nameFiles[sizeFiles.length-1],src,path.outputfiles,dateFilesN[dateFilesN.length-1]);
            });
                

    }
    catch(err){
        log.pushLog("inputfile:listDirFiles:exception:"+err);
    }
}

function moveFile(fileName,src,dest,date){
    try{
        var chName = fileName;
        fs.rename(src+"/"+fileName, dest+chName, (err) =>{
            if(err){
                log.pushLog("inputfile:moveFile:" + err);
            }
            else{
                log.pushLog("inputfile:moveFile:" + src+"/"+fileName+" moved to "+dest+chName);
            }
        })
    }
    catch(err){
        log.pushLog("processfile:moveFile:exception:"+err);
    }
}


module.exports = main;