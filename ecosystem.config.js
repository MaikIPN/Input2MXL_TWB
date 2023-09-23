module.exports = {
  apps : [{
    name   : "file-service.js",
    script : "./file-service.js",
    cron_restart: '0 0 * * *'
  },{
    name   : "scan-gpg.js",
    script : "./scan-gpg.js",
    cron_restart: '0 0 * * *'
  }]
}
