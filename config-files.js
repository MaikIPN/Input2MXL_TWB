var pathFiles= {
    logfiles: "./log/",
    inputfiles: "./input/",
    outputfiles: "./output/",
    ntOutputfiles: "./ntoutput/",
    ftpOutputfiles: "./ftpoutput/",
    ftpInputfiles: "./ftpinput/",
    chOutputfiles: "./choutput/",

    configfiles: "./config/",
    //Modulo de GPG
    gpgfiles: "./gpg/",
    gpgfilesbackup: "./gpgbackup/",
    gpgfileserror: "./gpgerror/",
    /***********************/
    outXML: true,
    outTXT: false,
    nIntScanInput: -1,
    tIntScanInput: 120000,
    nIntScanFTPout: -1,
    tIntScanFTPout: 120000,
    nIntScanFTPin: -1,
    tIntScanFTPin: 120000,
    nIntScanValidate: -1,
    tIntScanValidate: 120000,
    //************************/
    port:1990,
    server: 'localhost',
    
    stfiles: "./st/",
}

module.exports = pathFiles;
