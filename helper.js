const colors = require('colors')

var helpers = {
    logProgress:        logProgress,
    getFileName:        getFileName,
    getExt:             getExt,
    fileCompleteLog:    fileCompleteLog,
    addOptions:         addOptions
}


////////////////////////////////////////


function logProgress(progress) {
    console.log("Percent complete: \% %s", colors.green(progress.percentComplete))
}

function getFileName(file){
    var lastSlash = file.lastIndexOf('/')
    var lastPeriod = file.lastIndexOf('.')
    var fileName = file.slice(lastSlash + 1, lastPeriod);
    return fileName
}

function getExt(file){
    var lastPeriod = file.lastIndexOf('.')
    var extension = file.slice(lastPeriod)
    return extension
}

function fileCompleteLog() {
    console.log("FILE CONVERSION COMPLETE!")

    for (let i = 0; i < 10; i++) {
        setTimeout(()=>{
            console.log("...")
            if (i == 9){
                console.log(colors.rainbow("PAT IS GAY FOR IAN"))
            }
        }, (i*500))
    }
}

function addOptions(configOptions, fileOptions) {
    for (var key in configOptions) {
        fileOptions[key] = configOptions[key]
    }
}

module.exports = helpers;