import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

let doneBefore = false;
let holder = "";

const router = express.Router();

router.route("/").get(async (req, res) => {
  return res.status(200).render("proofreading");
}).post(async (req, res) => {
    
    const theBody = req.body.givenText;
    const theFile = req.files;
    let data ;
    let fileGiven;
    let errors = [];

    if (!theFile && !theBody){
      errors.push("Error: You must input text or a text file!")
      return res.status(400).render('proofreading', {hasErrors: true, errors: errors});
    }
      
      if (!theBody) {
        fileGiven = req.files.userFile

        // Code for file scanning here.

        data = fs.readFileSync(fileGiven.tempFilePath, 'utf-8'); 
      }

      else{
        if (doneBefore && holder == req.body.givenText){
          doneBefore = false;
          holder = null;
          return res.status(200).render("proofreading");
        }
        else {
          doneBefore = true;
          holder = theBody;
        }
      }

      const genAI = new GoogleGenerativeAI("AIzaSyAMDWbHKmIoBxEZr_atsDdp-zVbQhSKAEQ");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      let prompt;

      if (fileGiven) prompt = "Proofread and Grammar Check this text: " + data;

      else prompt = "Proofread and Grammar Check this text: " + theBody;

      const result = await model.generateContent(prompt);

      let finalResult = result.response.text();

      return res.status(200).render('proofreading', {results: finalResult});
    
    
});


export default router;
