import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

router.route("/").get(async (req, res) => {
  return res.status(200).render("proofreading");
}).post(async (req, res) => {
    
    const theBody = req.body.givenText;
    const theFile = req.files;
    let fileGiven;
    let errors = [];

    if (!theFile && !theBody){
      errors.push("Error: You must input text or a text file!")
      res.status(400).render('proofreading', {hasErrors: true, errors: errors});
    }

    else{
      
      if (!theBody) fileGiven = req.files.userFile;

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
