import express from "express";
const router = express.Router();

router.route('/').get(async (req, res) => {
    res.status(200).json({message: "CAL ROUTE"})
})

export default router;