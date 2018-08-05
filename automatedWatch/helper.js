const colors = require("colors");
const fs = require("fs");
const path = require("path");

const config = require("./config");
const aviFiles = "/" + config.aviFiles + "/";

var helpers = {
  logProgress,
  getFileName,
  getExt,
  fileCompleteLog,
  addOptions,
  diveIntoFolder,
  moveAviFilesAside
};

////////////////////////////////////////

function logProgress(progress) {
  console.log("Percent complete: % %s", colors.green(progress.percentComplete));
}

// move avi files to a different folder for later use/ manual conversion
function moveAviFilesAside(file, fileName) {
  const newPath = path.join(__dirname, "../" + aviFiles) + fileName + ".avi";
  return fs.rename(file, newPath, err => {
    if (err) {
      throw err;
      console.log("ERROR renaming file: ", err);
    }
  });
}

function getFileName(file) {
  var lastSlash = file.lastIndexOf("/");
  var lastPeriod = file.lastIndexOf(".");

  var fileName =
    lastPeriod >= 0
      ? file.slice(lastSlash + 1, lastPeriod)
      : file.slice(lastSlash + 1);
  if (fileName.indexOf(".DS_Store") > 0) return false;
  return fileName;
}

function diveIntoFolder(folder, queue) {
  fs.readdir(folder, (err, files) => {
    if (!files) return;
    files.forEach(file => {
      let extension = getExt(file);
      if (extension === ".avi") {
        moveAviFilesAside(folder + "/" + file, getFileName(file));
      } else if (!extension) {
        return diveIntoFolder(file);
      } else if (
        extension === ".mkv" ||
        extension === ".mpeg" ||
        extension === ".mp4"
      ) {
        queue.push(folder + "/" + file);
      }
    });
  });
}

function getExt(file) {
  var lastPeriod = file.lastIndexOf(".");
  if (lastPeriod <= 0) return false;
  var extension = file.slice(lastPeriod);
  return extension;
}

function fileCompleteLog() {
  console.log("FILE CONVERSION COMPLETE!");
}

function addOptions(configOptions, fileOptions) {
  for (var key in configOptions) {
    fileOptions[key] = configOptions[key];
  }
}

module.exports = helpers;
