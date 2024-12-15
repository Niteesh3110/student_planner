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
  api.scanFile(inputFilePath, async (err, data, response) => {
    if (err) {
      console.error(err);
    } else {
      console.log("API called successfully. Returned data: " + data);
    }
  });
}
