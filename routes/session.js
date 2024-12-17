import express from "express";
const router = express.Router();
import { validateUserId } from "../tasks/form_validation_helpers.js";
import { getUserByUserId } from "../data/users.js";

router.route("/getUserId").get(async (req, res) => {
  try {
    if (req.session.user.userId && req.session.user) {
      console.log(req.session.user);
      let userId = req.session.user.userId;
      await validateUserId(userId);
      userId = userId.trim();
      const userData = await getUserByUserId(userId);
      const userSignedIn = userData.boolean;
      if (!userSignedIn) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json({ userId });
    } else {
      return res.status(401).json({ error: "Unauthorised" });
    }
  } catch (error) {
    if (error.status === 400)
      return res.status(error.status).json({ error: error.error });
    return res.status(500).json({ error: `Something went wrong ${error}` });
  }
});

export default router;
