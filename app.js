import express from "express";
import session from "express-session";
const app = express();
import configRoutes from "./routes/index.js";
import exphbs from "express-handlebars";
import fileUpload from "express-fileupload";

import {
  rootMiddleware,
  signInMiddleware,
  signUpMiddleware,
  signOutMiddleware,
  academicPlannerMiddleware,
  qnaMiddleware,
  homeMiddleware,
  isLoggedInMiddleware,
  isMeToo,
  proofreadMiddleware,
  calendarMiddleware,
  localUserIdMiddleware,
  fileConversionMiddleware,
  sessionRoutesMiddleware,
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
  exphbs.engine({
    defaultLayout: "main",
    partialsDir: "views/partials",
    helpers: {
      ifEquals: function (a, b, options) {
        if (a === b) {
          return options.fn(this);
        }
        return options.inverse(this);
      },
    },
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

app.use("/public", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.use(isMeToo);
app.use(isLoggedInMiddleware);
app.use("/", rootMiddleware);
app.use("/signin", signInMiddleware);
app.use("/signup", signUpMiddleware);
app.use(localUserIdMiddleware);
app.use("/home", homeMiddleware);
app.use("/ap", academicPlannerMiddleware);
app.use("/qna", qnaMiddleware);
app.use("/proofread", proofreadMiddleware);
app.use("/calendar", calendarMiddleware);
app.use("/file_conversion", fileConversionMiddleware);
app.use("/session", sessionRoutesMiddleware);
app.use("/signout", signOutMiddleware);

app.set("view engine", "handlebars");

configRoutes(app);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(3000, () => {
  console.log("Server will be running on http://localhost:3000");
});
