const fs = require("fs");
const path = require("path");
const colors = require("colors");

const logProgress = require("../helper.js").logProgress;
const getFileName = require("../helper.js").getFileName;
const getExt = require("../helper.js").getExt;
const fileCompleteLog = require("../helper.js").fileCompleteLog;
const addOptions = require("../helper.js").addOptions;

describe("helper.js", () => {
  describe("getFileName", () => {
    // Test cases
    [
      {
        expected: "testFile Volume 2",
        testString:
          "/Users/ianbutler/Desktop/patflix/TEST NEED CONVERT/testFile Volume 2.avi"
      },
      {
        expected: "testFile",
        testString:
          "/Users/ianbutler/Desktop/patflix/TEST NEED CONVERT/testFile.mp3"
      },
      {
        expected: "Test_Folder",
        testString:
          "/Users/ianbutler/Desktop/patflix/TEST NEED CONVERT/Test_Folder.mkv"
      }
    ].forEach(testObj => {
      it("should return the filename " + testObj.expected, () => {
        const result = getFileName(testObj.testString);
        expect(testObj.expected).toBe(result);
      });
    });

    // Test cases
    [
      {
        expected: "testFolder copy",
        testString:
          "/Users/ianbutler/Desktop/patflix/TEST NEED CONVERT/testFolder copy"
      },
      {
        expected: "testFolder",
        testString:
          "/Users/ianbutler/Desktop/patflix/TEST NEED CONVERT/testFolder"
      },
      {
        expected: "Test_Folder",
        testString:
          "/Users/ianbutler/Desktop/patflix/TEST NEED CONVERT/Test_Folder"
      }
    ].forEach(testObj => {
      it(
        "should return the folder name if there is a folder: " +
          testObj.expected,
        () => {
          const result = getFileName(testObj.testString);
          expect(testObj.expected).toBe(result);
        }
      );
    });
  });

  describe("getExt", () => {
    [
      {
        expected: false,
        testString: "/testDir/subfolder/testFolder copy"
      },
      {
        expected: false,
        testString: "/testDir/subfolder/testFolder"
      },
      {
        expected: false,
        testString: "/testDir/subfolder/Test_Folder"
      }
    ].forEach(testObj => {
      it(
        "should return false if there is no extension, for example when the item is a folder titled: " +
          testObj.testString,
        () => {
          const result = getExt(testObj.testString);
          console.log("result", colors.blue(result));
          expect(result).toBe(testObj.expected);
        }
      );
    });

    // Test cases
    [
      {
        expected: ".mpeg",
        testString: "/testDir/subfolder/testFile Volume 2.mpeg"
      },
      {
        expected: ".avi",
        testString: "/testDir/subfolder/testFile Volume 2.avi"
      },
      {
        expected: ".mp3",
        testString: "/testDir/subfolder/testFile.mp3"
      },
      {
        expected: ".mkv",
        testString: "Test_File.mkv"
      }
    ].forEach(testObj => {
      it(
        "should return the file extension if there is one: " +
          testObj.testString,
        () => {
          const result = getExt(testObj.testString);
          expect(result).toBe(testObj.expected);
        }
      );
    });
  });

  describe("diveIntoFolders()", () => {
    it("should go into a folder and add all non avi files to a queue");
  });

  describe("fileCompleteLog", () => {});
  describe("addOptions", () => {});
});
