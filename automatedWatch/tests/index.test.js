const fs = require("fs");
const path = require("path");
const colors = require("colors");

const config = require("../config");
const aviFiles = "/" + config.aviFiles + "/";

const createFileHandler = require("../index.js").createFileHandler;
let fileConversion = require("../index.js").fileConversion;
let moveAviFilesAside = require("../index.js").moveAviFilesAside;

describe("index.js", () => {
  describe("createFileHandler()", () => {
    beforeEach(() => {
      fileConversion = jest.fn();
      moveAviFilesAside = jest.fn();
    });

    [
      "/Users/ianbutler/Desktop/patflix/TEST NEED CONVERT/testFile Volume 2.avi",
      "/Users/patflix/TESTNEEDCONVERT/testFile Volume2.avi"
    ].forEach(arrItem => {
      it("should run moveAviFilesAside and return avi: " + arrItem, () => {
        const result = createFileHandler(arrItem);
        expect(result).toBe("avi");
      });
    });

    [
      "/Users/ianbutler/Desktop/patflix/TEST NEED CONVERT/testFile Volume 2.mkv",
      "/Users/patflix/TESTNEEDCONVERT/testFile Volume2.mp4"
    ].forEach(arrItem => {
      it(
        "should run files with mkv and mp4 file extensions and return fileConversion: " +
          arrItem,
        () => {
          const result = createFileHandler(arrItem);
          expect(result).toBe("fileConversion");
        }
      );
    });

    it("should dive a deeper level if the item passed in is a folder and look for more files", () => {});
  });

  // tested this manually.  seems to work
  //describe("moveAviFilesAside()");

  describe("fileConversion()", () => {});
});
