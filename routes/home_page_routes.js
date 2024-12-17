import express from "express";
const router = express.Router();

router.route("/").get(async (req, res) => {
  console.log(req.session.user);
  if (req.session.user) {
    let firstName = req.session.user.firstName;
    firstName = firstName.toUpperCase();
    return res.status(200).render("home", { firstName });
  } else {
    return res.status(200).render("home", { firstName: "First Name" });
  }
});

export default router;
