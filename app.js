import express from "express";
import session from "express-session";
const app = express();
import configRoutes from "./routes/index.js";
import exphbs from "express-handlebars";
import {
  rootMiddleware,
  signInMiddleware,
  signUpMiddleware,
  signOutMiddleware,
  academicPlannerMiddleware,
  qnaMiddleware,
  homeMiddleware,
  isLoggedInMiddleware,
} from "./middleware.js";

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  next();
};

app.use(
  session({
    name: "UserState",
    secret: "CS_546_Group_16",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 3, //Cookies will destroy after 3 hours
    },
  })
);

app.engine(
  "handlebars",
  exphbs.engine({ defaultLayout: "main", partialsDir: "views/partials" })
);

app.use("/public", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.use(isLoggedInMiddleware);
app.use("/", rootMiddleware);
app.use("/signin", signInMiddleware);
app.use("/signup", signUpMiddleware);
app.use("/signout", signOutMiddleware);
app.use("/home", homeMiddleware);
app.use("/ap", academicPlannerMiddleware);
app.use("/qna", qnaMiddleware);

app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
  console.log("Server will be running on http://localhost:3000");
});
