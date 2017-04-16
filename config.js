module.exports = {


    // configOptions are the configurable options for conversion quality
    configOptions: {
        rate: 30,
        optimize: true,
        encoder: 'x264',
        quality: 21,
        encopts: "subme=2:level=3.1:ref=1:trellis=0:8x8dct=0:weightp=1:vbv-bufsize=14000:mixed-refs=0:vbv-maxrate=14000:rc-lookahead=10",
    },


    
    watchFolder1: "MOVIE NEED CONVERT",
    convertedFolder1: "MOVIES",


    
    watchFolder2: "TV NEED CONVERT",
    convertedFolder2: "TV",



    // these folders must be present as well
    aviFiles: "aviFiles",
    originalFiles: "originalFiles",
    cancelledFiles: "cancelledFiles"
    

}