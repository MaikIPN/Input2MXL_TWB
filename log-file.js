var path = require('./config-files');
var rec = require('./record-file');
var log = require('./log-file');


var writeLog =
{
    active: true,
    logFolder: path.logfiles,
    stFolder: path.stfiles,
    gotFolder: path.ftpInputfiles,
    ntInputFolder: path.ntOutputfiles,
    outXML: path.outXML,
    outTXT: path.outTXT,
    fs: require('fs'),
    xml2js: require('xml2js'),
    pushLog(message){
        if(this.active)
        {
            strDate = formatDate(true);
            strDateTime = formatDate(false);
            var fileName = this.logFolder + "fileLog" + strDate +".log"
            let fd;
            try {
                fd = this.fs.openSync(fileName, 'a');
                this.fs.appendFileSync(fd, strDateTime + ":" + message + "\n", 'utf8');
                //this.fs.appendFileSync(fd, message + "\n", 'utf8');
            } 
            catch (err) {
                /* Handle the error */
                console.log(err);
                process.exit(1);
            } 
            finally {
                if (fd !== undefined)
                this.fs.closeSync(fd);
            }
        }
    },
    getDateFormat: formatDateFile(false),
    getMailFormat: formatDateMail(false),
    pushMail(message){
        if(this.active)
        {
            strDate = formatDate(true);
            strDateTime = formatDate(false);
            var fileName = this.logFolder + "mailLog" + strDate +".log"
            let fd;
            try {
                fd = this.fs.openSync(fileName, 'a');
                this.fs.appendFileSync(fd, "**************************** M a i l ****************************"+"\n", 'utf8');
                this.fs.appendFileSync(fd, "Mail Body:\n" + message + "\n", 'utf8');
                this.fs.appendFileSync(fd, "**************************** M a i l ****************************"+"\n", 'utf8');
                //this.fs.appendFileSync(fd, message + "\n", 'utf8');
            } 
            catch (err) {
                /* Handle the error */
                console.log(err);
                process.exit(1);
            } 
            finally {
                if (fd !== undefined)
                this.fs.closeSync(fd);
            }
        }
    },
    pushFileSt(message,pClass){
        if(this.active)
        {
            var fileName = this.stFolder + pClass +".st"
            let fd;
            try {
                fd = this.fs.writeFileSync(fileName, message+";"+formatDate(false));
            } 
            catch (err) {
                /* Handle the error */
                console.log(err);
                process.exit(1);
            } 
            finally {
                if (fd !== undefined)
                this.fs.closeSync(fd);
            }
        }
    },
    pullFileSt(pClass){
        if(this.active)
        {
            var fileName = this.stFolder + pClass +".st"
            let fd;
            try {
                var stToSplit = this.fs.readFileSync(fileName, 'utf8');
                var state = stToSplit.split(";");
                return state[0];
            } 
            catch (err) {
                /* Handle the error */
                console.log(err);
                process.exit(1);
                
            } 
            finally {
                if (fd !== undefined)
                this.fs.closeSync(fd);
                //return "error";
            }
        }
    },
    readXmlFile(fName){
        if(this.active)
        {
            var fileName = this.gotFolder + fName
            //console.log(fileName);
            let fd;
            try {
                if(this.fs.existsSync(fileName))
                {
                    var xml = this.fs.readFileSync(fileName, 'utf8');
                    this.xml2js.parseString(xml,(err,result) => {
                        if(err) {
                            throw err;
                        }
                    
                    var xmlData = {
                        name: String,
                        time: String,
                        status: String,
                        process: String,
                        message: String,
                        record_ok: Number,
                        record_nok: Number,
                        validate: Number,
                    };
                    //console.log(JSON.stringify(result,null,null));

                    if(result.InputFile.$.name!=null)
                    {
                        xmlData.name = result.InputFile.$.name;
                        //console.log(result.InputFile.$.name);
                        xmlData.status = result.InputFile.$.status;
                        //console.log(result.InputFile.$.status);
                        xmlData.process = result.InputFile.$.process;
                        //console.log(result.InputFile.$.process);
                    }
                    if(result.InputFile.messages!=null)
                    {
                        if(result.InputFile.messages.length>0)
                        {
                            xmlData.message = "";
                            for(var i=0;i<result.InputFile.messages.length;i++)
                            {
                                xmlData.message = xmlData.message + result.InputFile.messages[i].message[0] + ";";
                            //console.log(xmlData.message);
                            }
                        }
                    }
                    if(result.InputFile.records!=null)
                    {
                        if(result.InputFile.records.length>0){
                            xmlData.record_ok = result.InputFile.records[0].$.records_ok;
                            xmlData.record_nok = result.InputFile.records[0].$.records_nok;
                            //console.log( xmlData.record_ok);
                            //console.log( xmlData.record_nok);
                        }
                    }
                
                    insertDB(xmlData,"xml");    
                    });
                }
                else
                {
                    console.log("archivo " + fileName + " no existe");
                }
            } 
            catch (err) {
                /* Handle the error */
                console.log(err);
                process.exit(1);
                
            } 
            finally {
                if (fd !== undefined)
                this.fs.closeSync(fd);
                //return "error";
            }
        }
    },
    readConfigXmlFile(fName){
        if(this.active)
        {
            var fileName = fName
            //console.log(fileName);
            let fd;
            try {
                if(this.fs.existsSync(fileName))
                {
                    var xml = this.fs.readFileSync(fileName, 'utf8');
                    
                }
                else
                {
                    console.log("archivo " + fileName + " no existe");
                }
                return xml;
            } 
            catch (err) {
                /* Handle the error */
                console.log(err);
                process.exit(1);
                
            } 
            finally {
                if (fd !== undefined)
                this.fs.closeSync(fd);
                //return "error";
            }
        }
    },
    readTxtFile(fName){
        if(this.active)
        {
            var fileName = this.gotFolder + fName
            //console.log(fileName);
            let fd;
            try {
                if(this.fs.existsSync(fileName))
                {
                    var txt = this.fs.readFileSync(fileName, 'utf8');

                    txtLines = txt.split(/\r?\n/);
                    
                    var xmlData = {
                        name: String,
                        time: String,
                        status: String,
                        process: String,
                        message: String,
                        record_ok: Number,
                        record_nok: Number,
                        validate: Number,
                    };
                    var arrayValues = [];
                    for(var i=0;i<txtLines.length;i++)
                    {
                        var value = txtLines[i].split(":");
                        if(value!=null)
                        {
                            if(value.length==2)
                            {
                                arrayValues.push(value[1]);
                            }
                            else
                            {
                                arrayValues.push(txtLines[i]);
                            }
                            //console.log(arrayValues[i]);
                        }
                    }

                    if(arrayValues.length==6)
                    {
                        xmlData.name = arrayValues[0].trim();
                        xmlData.status = arrayValues[1].trim();
                        xmlData.process = arrayValues[2].toString().substring(25,40);
                        //console.log(arrayValues[2].toString().substring(25,40));
                        xmlData.record_ok = arrayValues[3].trim();
                        xmlData.record_nok = arrayValues[4].trim();
                    }
                    else 
                    {
                        xmlData.name = arrayValues[0].trim();
                        xmlData.status = arrayValues[1].trim();
                        xmlData.process = arrayValues[2].toString().substring(25,40);
                        //console.log(arrayValues[2].toString().substring(25,40));
                        xmlData.record_ok = arrayValues[3].trim();
                        xmlData.record_nok = arrayValues[4].trim();
                        xmlData.message = arrayValues[6];
                    }

                    insertDB(xmlData,"txt"); 
                }
                else{
                    console.log("archivo " + fileName + " no existe");
                }
            } 
            catch (err) {
                /* Handle the error */
                console.log(err);
                process.exit(1);
                
            } 
            finally {
                if (fd !== undefined)
                this.fs.closeSync(fd);
                //return "error";
            }
        }
    },
    readLineFile(fName){
        if(this.active)
        {
            var fileName = fName
            let fd;
            try {
                if(this.fs.existsSync(fileName))
                {
                    var txt = this.fs.readFileSync(fileName, 'utf8');

                    txtLines = txt.split(/\r?\n/);
                    
                    console.log("Count of lines = " + txtLines.length); 
                    
                    var auxName = fileName.split("/");

                    var auxOutName = rec.getFileName(auxName[2]) + formatDateFile(false)  + "_" + auxName[2];

                    if(this.outXML)
                    {
                        var line = rec.getHeadXML(txtLines[0],txtLines.length,auxOutName);
                        var auxLine = line.split(";");
                        
                        if(auxLine=="*\n")
                        {
                            console.log(auxOutName+" no exist in channel-list"); 
                        }
                        else{
                        //console.log(line);  
                            this.pushInputFileLine(auxLine[0],auxOutName+".xml");
                            var shareXMLData = this.fs.readFileSync(auxLine[1], 'utf8');
                            this.pushInputFileLine(shareXMLData,auxOutName+".xml");

                            for(var i=0;i<txtLines.length-1;i++)
                            {
                                var line = rec.getRecord(txtLines[i],auxName[2],true);
                                this.pushInputFileLine(line,auxOutName+".xml");
                            }

                            var footXML = rec.getFootXML();
                            this.pushInputFileLine(footXML,auxOutName+".xml");
                        }
                    }
                    if(this.outTXT)
                    {
                        for(var i=0;i<txtLines.length-1;i++)
                        {
                        var line = rec.getRecord(txtLines[i],auxName[2],false);
                        //console.log(line);
                            this.pushInputFileLine(line,auxOutName+".txt");
                        }
                    }
                
                }
                else{
                    console.log("file " + fileName + " no found");
                }
            } 
            catch (err) {
                /* Handle the error */
                console.log(err);
                process.exit(1);
                
            } 
            finally {
                if (fd !== undefined)
                this.fs.closeSync(fd);
                //return "error";
            }
        }
    },
    pushInputFileLine(line,name){
        if(this.active)
        {
            var fileName = this.ntInputFolder + name;
            let fd;
            try {
                fd = this.fs.openSync(fileName, 'a');
                this.fs.appendFileSync(fd, line, 'utf8');
            } 
            catch (err) {
                /* Handle the error */
                console.log(err);
                process.exit(1);
            } 
            finally {
                if (fd !== undefined)
                this.fs.closeSync(fd);
            }
        }
    },
    getPadLeft2(str){
        if(str.length<2){
            str = "0" + str;
        }
        return str;
    },
}

function formatDate(isOnlyDate){
    var auxDate = new Date(Date.now());
    var strDate = "";
    if(isOnlyDate){
        strDate = auxDate.getFullYear() + "_" + padLeft2((auxDate.getMonth()+1).toString()) + "_" + padLeft2(auxDate.getDate().toString());
    }
    else{
        strDate = auxDate.getFullYear() + "_" + padLeft2((auxDate.getMonth()+1).toString()) + "_" + padLeft2(auxDate.getDate().toString()) +
                "_" + padLeft2(auxDate.getHours().toString()) + "_" + padLeft2(auxDate.getMinutes().toString()) + "_" + padLeft2(auxDate.getSeconds().toString());
    }
    return strDate;
}
function formatDateFile(isOnlyDate){
    var auxDate = new Date(Date.now());
    var strDate = "";
    if(isOnlyDate){
        strDate = auxDate.getFullYear() + padLeft2((auxDate.getMonth()+1).toString()) + padLeft2(auxDate.getDate().toString());
    }
    else{
        strDate = auxDate.getFullYear() + padLeft2((auxDate.getMonth()+1).toString()) + padLeft2(auxDate.getDate().toString()) +
                "" + padLeft2(auxDate.getHours().toString()) + padLeft2(auxDate.getMinutes().toString()) + padLeft2(auxDate.getSeconds().toString());
    }
    return strDate;
}
function formatDateMail(isOnlyDate){
    var auxDate = new Date(Date.now());
    var strDate = "";
    if(isOnlyDate){
        strDate = auxDate.getFullYear() + "-" + padLeft2((auxDate.getMonth()+1).toString()) + "-" + padLeft2(auxDate.getDate().toString());
    }
    else{
        strDate = auxDate.getFullYear() + "-" + padLeft2((auxDate.getMonth()+1).toString()) + "-" + padLeft2(auxDate.getDate().toString()) +
                " " + padLeft2(auxDate.getHours().toString()) + ":" + padLeft2(auxDate.getMinutes().toString()) + ":" + padLeft2(auxDate.getSeconds().toString());
    }
    return strDate;
}

function padLeft2(str){
    if(str.length<2){
        str = "0" + str;
    }
    return str;
}
module.exports = writeLog;