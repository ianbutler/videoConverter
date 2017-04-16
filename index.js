
const fs =      require('fs')
const path =    require('path')
const hbjs =    require('handbrake-js')
const hound =   require('hound')
const colors =  require('colors')
const helpers = require('./helper')
const config =  require('./config')

const watchFolder1 = config.watchFolder1  
const convertedFiles1 = "/" + config.convertedFolder1 + "/"
const watchFolder2 = config.watchFolder2
const convertedFiles2 = "/" + config.convertedFolder2 + "/"

const aviFiles = "/" + config.aviFiles + "/"
const originalFiles = "/" + config.originalFiles + "/"
const cancelledFiles = "/" + config.cancelledFiles + "/"

 
var configOptions = config.configOptions

var watcher1 = hound.watch(path.join(__dirname, '../' + watchFolder1))
watcher1.on('create', createFileHandler)

var watcher2 = hound.watch(path.join(__dirname, '../' + watchFolder2))
watcher2.on('create', createFileHandler)


////////////////////////////////////////


function createFileHandler(file, outputFolder) {
    // move avi files to a different folder for later use/ manual conversion
    if (helpers.getExt(file).indexOf('.avi') >= 0){
        fs.rename(
            file,
            path.join(__dirname, '../' + aviFiles) + helpers.getFileName(file)
        )
        return;
    }
    
    // handle mp4 and mkv files 
    if (helpers.getExt(file).indexOf('.mp4') >= 0 || helpers.getExt(file).indexOf('.mkv' >= 0)) {
        fileConversion(file)
    }
}

function fileConversion(file, secondTry){
    var convertedFiles = file.indexOf(watchFolder2) >= 0 ? convertedFiles2 : convertedFiles1

    var options = {
        input: file,
        output: path.join(__dirname, '../' + convertedFiles) + helpers.getFileName(file) + '.mp4' 
    }

    helpers.addOptions(configOptions, options)

    hbjs.spawn(options)
        .on("progress", helpers.logProgress)
        .on("error", (err) => {
            console.log(colors.red('Error!!!! '), err)
            if (secondTry) {
                fs.rename(
                    file,
                    path.join(__dirname, '../' + cancelledFiles) + helpers.getFileName(file) + helpers.getExt(file)
                )
                return;
            }
            setTimeout(() => {
                fileConversion(file, true)
            }, 10000)
        })
        .on("complete", () => {
            helpers.fileCompleteLog();
            
            // remove the file from the watched folder
            // move to another folder ready to be dumped
            fs.rename(
                file,
                path.join(__dirname, '../' + originalFiles) + helpers.getFileName(file) + helpers.getExt(file)
            )
        })
        .on("cancelled", () => {
            if (secondTry) {
                fs.rename(
                    file,
                    path.join(__dirname, '../' + cancelledFiles) + helpers.getFileName(file) + helpers.getExt(file)
                )
                return;
            }
            setTimeout(() => {
                fileConversion(file, true)
            }, 10000)
        })
}


