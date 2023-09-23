const gpg = require("gpg");
var http = require('http');
var fs = require('fs');
var log = require('./log-file');
var path = require('./config-files');

var idCH = "";
var intMail = "";
var trigram = "";
var fileEncrypted = "";
var fileDecrypted = "";


const privateKey = `-----BEGIN PGP PRIVATE KEY BLOCK-----

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
bilEF1k=
=L84c
-----END PGP PRIVATE KEY BLOCK-----`;

function main(listFiles){
    try{
        var chk = log.pullFileSt("gpgFile");
        if(chk=="false"){
            log.pushFileSt("true","gpgFile");
            processFile(listFiles);
        }
        else{
            log.pushLog("gpgfile:main:the processfile is running");
        }
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
};

function processFile(listFiles){
    try{
        log.pushLog("gpgfile:processfile:listFile:"+listFiles);
        var arrayListFiles = listFiles.split(",");
        console.log(arrayListFiles.length);
        for(var j=0;j<arrayListFiles.length;j++){
            //console.log(arrayListFiles[j]);
            listDirFiles(arrayListFiles[j]);
        }
        log.pushFileSt("false","gpgfile");
    }
    catch(err){
        log.pushLog("gpgfile:processfile:exception:" + err);
    }
}

function listDirFiles(fileName){
    var src = path.gpgfiles;
    try{
        log.pushLog("gpgfile:listDirFiles:"+src +"/"+ fileName);

            var dateFilesM = [];
            var dateFilesN = [];
            var sizeFiles = [];
            var nameFiles = [];
    
            log.pushLog("gpgfile:listDirFiles:"+src+"/"+fileName);
            log.readLineFile(src+fileName);
            nameFiles.push(fileName); 
            var input = src+"/"+fileName;
            fs.stat(input,(err,stats)=>{
                if(err){
                    log.pushLog("gpgfile:listDirFiles:stat:" + err);
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
                //log.pushLog("MOVE FILE "+ nameFiles[sizeFiles.length-1]+" OTRO "+src+" OTRO "+path.inputfiles+" OTRO "+dateFilesN[dateFilesN.length-1]);
                filedecrypt(nameFiles[sizeFiles.length-1],src,path.inputfiles);
                //moveFile(nameFiles[sizeFiles.length-1],src,path.outputfiles,dateFilesN[dateFilesN.length-1]);
                //fileDescription(nameFiles[sizeFiles.length-1],sizeFiles[sizeFiles.length-1],dateFilesM[dateFilesM.length-1]);
                //insertDB(nameFiles[sizeFiles.length-1],sizeFiles[sizeFiles.length-1],dateFilesM[dateFilesM.length-1]);
            });
                

    }
    catch(err){
        log.pushLog("gpgfile:listDirFiles:exception:"+err);
    }
}
function filedecrypt(fileName,src,dest){
    try{

        
        fileEncrypted = src + "/" + fileName;
        fileDecrypted = dest+"/"+fileName+".txt";
        
        gpg.importKey(privateKey, [], (success, err) => {
          gpg.decryptFile(fileEncrypted,
            (err, success) => {
                if(err){
                    log.pushLog("gpgfile:filedecrypt:error: "+err);
                    moveFile(fileName,src,path.gpgfileserror);
                }else{
                    if(success){
                        log.pushLog("Decrypt procces: decripting ")
                        gpg.decryptToFile(
                            {
                            source: fileEncrypted,
                            dest: fileDecrypted,
                            },
                            (err, success) => {
                            if(err){
                                log.pushLog("gpgfile:filedecrypt:error: "+err);
                                moveFile(fileName,src,path.gpgfileserror);
                            }else{
                                log.pushLog("Decrypt procces: success ")
                                moveFile(fileName,src,path.gpgfilesbackup);
                            }
                            }
                        )
                    }
                    else{
                        log.pushLog("Decrypt procces: else "+ success + " error " + err)
                        moveFile(fileName,src,path.gpgfileserror);
                    }
                }
            }
          )
        })

    }
    catch(err){
        log.pushLog("processfile:moveFile:exception:"+err);
    }
}

function moveFile(fileName,src,dest){
    try{
        //var chName = trigram+"_"+idCH+"_0_"+date+"_"+fileName;
        var chName = fileName;
        fs.rename(src+"/"+fileName, dest+chName, (err) =>{
            if(err){
                log.pushLog("gpgfile:moveFile:" + err);
            }
            else{
                log.pushLog("gpgfile:moveFile:" + src+"/"+fileName+" moved to "+dest+chName);
            }
        })
    }
    catch(err){
        log.pushLog("gpgfile:moveFile:exception:"+err);
    }
}
/*
*/

module.exports = main;