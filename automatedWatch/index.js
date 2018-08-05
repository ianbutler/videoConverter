const fs = require("fs");
const path = require("path");
const hbjs = require("handbrake-js");
const hound = require("hound");
const colors = require("colors");
const helpers = require("./helper");
const config = require("./config");
const EventedArray = require("./arrayListener");

const watchFolder1 = config.watchFolder1;
const convertedFiles1 = "/" + config.convertedFolder1 + "/";
const watchFolder2 = config.watchFolder2;
const convertedFiles2 = "/" + config.convertedFolder2 + "/";

const aviFiles = "/" + config.aviFiles + "/";
const originalFiles = "/" + config.originalFiles + "/";
const cancelledFiles = "/" + config.cancelledFiles + "/";

var configOptions = config.configOptions;

let loading = { loading: false };
let handbrakeQueue = new EventedArray(handleArrayChange);

// Need to figure out a way to watch arrays or objects so that when the queue fills up
// we can execute handbrake again

////////////////////////////////////////

function handleArrayChange() {
  if (loading.loading === false && handbrakeQueue.length()) {
    loading.loading = true;
    console.log("handbrakeQueue another starting:::::");
    fileConversion(handbrakeQueue.pop(), false);
  }
}

var watcher1 = hound.watch(path.join(__dirname, "../" + watchFolder1));
watcher1.on("create", createFileHandler);

var watcher2 = hound.watch(path.join(__dirname, "../" + watchFolder2));
watcher2.on("create", createFileHandler);

function createFileHandler(file) {
  if (!file) return;
  const fileName = helpers.getFileName(file);
  const fileExt = helpers.getExt(file);
  // if not a video file exit  i.e. .DS_STORE
  if (!fileName) return;

  if (!fileExt) {
    helpers.diveIntoFolder(file, handbrakeQueue);
  }

  if (fileExt === ".avi") {
    helpers.moveAviFilesAside(file, fileName);
    return "avi";
  }

  // handle mp4 and mkv files
  if (fileExt === ".mp4" || fileExt === ".mkv") {
    handbrakeQueue.push(file);
    return "fileConversion";
  }
}

function fileConversion(file, secondTry, cb = () => {}) {
  console.log("fileConversion() file: ", colors.blue(file));
  var convertedFiles =
    file.indexOf(watchFolder2) >= 0 ? convertedFiles2 : convertedFiles1;

  var options = {
    input: file,
    output:
      path.join(__dirname, "../" + convertedFiles) +
      helpers.getFileName(file) +
      ".mp4"
  };

  helpers.addOptions(configOptions, options);

  hbjs
    .spawn(options)
    .on("progress", helpers.logProgress)
    .on("error", err => {
      if (secondTry) {
        fs.rename(
          file,
          path.join(__dirname, "../" + cancelledFiles) +
            helpers.getFileName(file) +
            helpers.getExt(file)
        );
        return;
      }
      setTimeout(() => {
        fileConversion(file, true);
      }, 10000);
    })
    .on("complete", () => {
      helpers.fileCompleteLog();

      // remove the file from the watched folder
      // move to another folder ready to be dumped
      fs.rename(
        file,
        path.join(__dirname, "../" + originalFiles) +
          helpers.getFileName(file) +
          helpers.getExt(file),
        err => {
          if (err) throw err;
        }
      );
      loading.loading = false;
      if (handbrakeQueue.length()) {
        loading.loading = true;
        let newFile = handbrakeQueue.pop();
        fileConversion(newFile, false);
      }
    })
    .on("cancelled", () => {
      if (secondTry) {
        fs.rename(
          file,
          path.join(__dirname, "../" + cancelledFiles) +
            helpers.getFileName(file) +
            helpers.getExt(file)
        );
        return;
      }
      setTimeout(() => {
        fileConversion(file, true);
      }, 10000);
    });
}

module.exports = {
  createFileHandler,
  fileConversion
};
