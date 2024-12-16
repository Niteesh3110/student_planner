import ConvertAPI from "convertapi";
import fs from "fs";
const convertapi = new ConvertAPI(process.env.CONVERT_API);
export { listOptions, startConversion, clearDir };

const conversionOptions = [
    { "csv": ["pdf", "xlsx"] },
    { "docx": ["jpg", "pdf", "png", "tiff", "txt", "webp", "xml"] },
    { "jpg": ["pdf", "png", "svg", "tiff", "webp"] },
    { "pdf": ["docx", "pptx", "xlsx"] },
    { "png": ["jpg", "pdf", "svg", "tiff", "webp"] },
    { "pptx": ["jpg", "pdf", "png", "tiff", "webp"] },
    { "txt": ["jpg"] },
    { "xlsx": ["csv", "jpg", "pdf", "png", "tiff", "webp"] },
    { "xml": ["docx"] }
];

const listOptions = async (fileGiven) => {
    let type = fileGiven.name.split(".");
    type = type[type.length - 1];
    for (let i = 0; i < conversionOptions.length; i++) {
        if (conversionOptions[i].hasOwnProperty(type)) {
            return conversionOptions[i][type];
        }
    }
    return [];
};

const startConversion = async (filePath, convertType) => {
  try {
    const result = await convertapi.convert(convertType, { File: filePath });
    const link = result.file.url;
    return link;
  } catch (e) {
    console.error(e.toString());
  }
};

const clearDir = async () => {
  fs.readdir("./public/toConvert", (err, files) => {
    if (err) {
      console.error(err.toString());
      return;
    }
    for (let file of files) {
      if (file === ".keep") continue;
      fs.unlink(`./public/toConvert/${file}`, (err) => {
        if (err) {
          console.error(err.toString());
          return;
        }
      });
    }
  });
};