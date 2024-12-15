import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

router.route("/").get(async (req, res) => {
  return res.status(200).render("proofreading");
}).post(async (req, res) => {

    const NodeClam = require('clamscan');
    const ClamScan = new NodeClam().init(options);
    
    const theBody = req.body.givenText;
    const theFile = req.files;
    let fileGiven;
    let errors = [];

    if (!theFile && !theBody){
      errors.push("Error: You must input text or a text file!")
      res.status(400).render('proofreading', {hasErrors: true, errors: errors});
    }

    else{
      
      if (!theBody) {
        fileGiven = req.files.userFile
        
        /**          ClamScan.then(async clamscan => {
            try {
                // You can re-use the `clamscan` object as many times as you want
                const version = await clamscan.getVersion();
                console.log(`ClamAV Version: ${version}`);
        
                const {isInfected, file, viruses} = await clamscan.isInfected('' + fileGiven.path + '');
                if (isInfected) {
                  errors.push(`Error: ${file} is infected with ${viruses}!`)
                  res.status(400).render('proofreading', {hasErrors: true, errors: errors});
                };
            } catch (err) {
                // Handle any errors raised by the code in the try block
                errors.push("Error: Couldn't scan file.")
                res.status(400).render('proofreading', {hasErrors: true, errors: errors});
            }
        }).catch(err => {
            // Handle errors that may have occurred during initialization
            errors.push("Error: Couldn't initalize ClamScan.")
            res.status(400).render('proofreading', {hasErrors: true, errors: errors});
      }); */
        
        
      }

      // File checking here with: https://www.npmjs.com/package/clamscan#how-to-install

      const genAI = new GoogleGenerativeAI("AIzaSyAMDWbHKmIoBxEZr_atsDdp-zVbQhSKAEQ");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      let prompt;

      if (fileGiven) prompt = "Proofread and Grammar Check this text: " + fileGiven.data;

      else prompt = "Proofread and Grammar Check this text: " + theBody;

      const result = await model.generateContent(prompt);

      let finalResult = result.response.text();

      res.status(200).render('proofreading', {results: finalResult});
    }
    
});


export default router;
