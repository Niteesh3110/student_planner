import ConvertAPI from "convertapi";
const convertapi = new ConvertAPI("secret_fepD2chDFjsEzSLn");
export { listOptions, startConversion };

const conversionOptions = [
  // There are more options I'm going to add here
  ["png", "jpg"],
  ["png", "pdf"],
  ["png", "svg"],
  ["png", "tiff"],
  ["png", "webp"],
];

const listOptions = async (fileGiven) => {
  let result = [];
  let type = fileGiven.mimetype.split("/")[1];
  for (let i = 0; i < conversionOptions.length; i++) {
    if (conversionOptions[i][0] === type) {
      result.push(conversionOptions[i][1]);
    }
  }
  return result;
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
