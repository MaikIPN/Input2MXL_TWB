
var fs = require('fs');
var log = require('./log-file');
var path = require('./config-files');


function main(listFiles){
    try{
        var chk = log.pullFileSt("ftpIN");
        if(chk=="false"){
            log.pushFileSt("true","ftpIN");
            respFile(listFiles);
        }
        else{
            log.pushLog("ftpIN:main:the ftpIN is running");
        }
    }
    catch(err){

        //*******************************aqui debe ir un error indicando que el proceso se interrumpe */
        console.log(err);
        process.exit(1);
    }
};
function respFile(listFiles){
    try{
        log.pushLog("ftpIN:respfile:listFile:"+listFiles);
        var arrayListFiles = listFiles.split(",");
        console.log(arrayListFiles.length);
        for(var j=0;j<arrayListFiles.length;j++){
            listDirFiles(arrayListFiles[j]);
        }
        log.pushFileSt("false","ftpIN");
    }
    catch(err){
        log.pushLog("ftpIN:respfile:exception:" + err);//*********interpretar el error y enviar al log */
    }
}

function listDirFiles(fileName){
    var src = path.ftpInputfiles;
    try{
        log.pushLog("ftpIN:listDirFiles:"+src +"/"+ fileName); 

            var dateFilesM = [];
            var dateFilesN = [];
            var sizeFiles = [];
            var nameFiles = [];
                

            if(fileName.indexOf("Report.txt")!=-1){
                log.readTxtFile(fileName);
            }
            if(fileName.indexOf("Report.xml")!=-1){
                log.readXmlFile(fileName);
            }
            if(fileName.indexOf("Report.zip")!=-1){
                log.pushLog("ftpIN:listDirFiles:****Invoque .ZIP file Verificar la carpeta****:"+src+"/"+fileName);
            }
            
            nameFiles.push(fileName); 
            var input = src+"/"+fileName;
            fs.stat(input,(err,stats)=>{
                if(err){
                    log.pushLog("ftpIN:listDirFiles:stat:" + err);
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
                moveFile(nameFiles[sizeFiles.length-1],src,path.valOutputfiles,dateFilesN[dateFilesN.length-1]);

            });
                

    }
    catch(err){
        log.pushLog("ftpIN:listDirFiles:exception:"+err); //*********interpretar el error y enviar al log */
    }
}

function moveFile(fileName,src,dest,date){
    try{
        var chName = fileName;
        fs.rename(src+"/"+fileName, dest+chName, (err) =>{
            if(err){
                log.pushLog("ftpIN:moveFile:" + err);//*********interpretar el error y enviar al log */
            }
            else{
                log.pushLog("ftpIN:moveFile:" + src+"/"+fileName+" moved to "+dest+chName);
            }
        })
    }
    catch(err){
        log.pushLog("ftpIN:moveFile:exception:"+err); //*********interpretar el error y enviar al log */
    }
}




module.exports = main;