import express from "express";
const router = express.Router();
import {
  firstNameChecking,
  lastNameChecking,
  validateUserId,
  validatePassword,
  validateEmail,
  signUpInputErrorChecking,
} from "../tasks/form_validation_helpers.js";
import { getUserByUserId, addUser, signIn } from "../data/users.js";

router
  .route("/signin")
  .get(async (req, res) => {
    return res.status(200).render("signin");
  })
  .post(async (req, res) => {
    try {
      let { userId, password } = req.body;
      console.log(userId, password);
      if (!userId || !password) {
        return res.status(400).json({ message: "Invalid UserId or Password" });
      }
      userId = userId.trim();
      password = password.trim();
      await validateUserId(userId);
      await validatePassword(password);
      let isSignedIn = await signIn(userId, password);
      if (isSignedIn.boolean) {
        const userData = isSignedIn.data;
        req.session.user = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          userId: userData.userId,
          email: userData.email,
          role: userData.role,
        };
        console.log(req.session.user);
        res.locals.userId = userData.userId;
        return res.redirect("/home");
      } else {
        return res.status(401).render("signin", { error });
      }
      // Need to sanitisen res.status(200).json({ userId, password });
    } catch (error) {
      console.log(error);
      if (error.status)
        return res.status(error.status).json({ error: error.error });
      return res.status(500).json({ error });
    }
  });

router
  .route("/signup")
  .get(async (req, res) => {
    return res.status(200).render("signup");
  })
  .post(async (req, res) => {
    try {
      let { firstName, lastName, userId, email, password, confirmPassword } =
        req.body;
      console.log(
        firstName,
        lastName,
        userId,
        email,
        password,
        confirmPassword
      );
      const error = await signUpInputErrorChecking(
        firstName,
        lastName,
        userId,
        email,
        password,
        confirmPassword
      );
      if (error !== "") {
        return res.status(400).render("signup", { error });
      }
      await firstNameChecking(firstName);
      await lastNameChecking(lastName);
      await validateUserId(userId);
      await validateEmail(email);
      await validatePassword(password);
      await validatePassword(confirmPassword);
      let checkIfUserExists = await getUserByUserId(userId);
      if (!checkIfUserExists.boolean) {
        let addUserResult = await addUser(
          firstName,
          lastName,
          userId,
          password,
          email
        );
        if (addUserResult.boolean) {
          return res.redirect("/signin");
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(error.status).json({ error: error.error });
    }
  });

router.route("/signout").get(async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    } else {
      return res.status(200).render("signout");
    }
  });
});
export default router;
