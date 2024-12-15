import ConvertAPI from "convertapi";
const convertapi = new ConvertAPI("secret_fepD2chDFjsEzSLn");
export { listOptions, startConversion };

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
