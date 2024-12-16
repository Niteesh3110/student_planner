import CloudmersiveVirusApiClient from "cloudmersive-virus-api-client";
const defaultClient = CloudmersiveVirusApiClient.ApiClient.instance;
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
const cloudmersiveApiKey = process.env.CLOUDMERSIVE_VIRUS_API;

if (cloudmersiveApiKey) {
  const ApiKey = defaultClient.authentications["Apikey"];
  ApiKey.apiKey = cloudmersiveApiKey;
}

export async function virusScan(inputFilePath) {
  const api = new CloudmersiveVirusApiClient.ScanApi();

  // Return the promise to allow using async/await
  const scanFile = async () => {
    return new Promise((resolve, reject) => {
      api.scanFile(inputFilePath, (err, data, response) => {
        if (err) {
          reject(err); // Reject the promise if there's an error
        } else {
          resolve(data); // Resolve the promise with the data
        }
      });
    });
  };

  // Await the result of the scanFile Promise
  try {
    const result = await scanFile();
    console.log("Scan result:", result); // You can use the result here
    return result;
  } catch (error) {
    console.error("Error during virus scan:", error); // Handle any errors
    throw error;
  }
}
