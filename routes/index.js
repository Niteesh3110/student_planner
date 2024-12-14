import academicPlannerRoute from "./academic_planner.js";
import homeRoutes from "./home_page_routes.js";
import qnaRoutes from "./qna.js";
<<<<<<< HEAD
import calendarRoutes from "./calendar.js"
import fileConversion from "./file_conversion.js"
=======
import calendarRoutes from "./calendar.js";
import authRoutes from "./auth_routes.js";
import proofRoutes from "./proofreading.js";
>>>>>>> main

const constructorMethod = (app) => {
  app.use("/", authRoutes);
  app.use("/home", homeRoutes);
  app.use("/ap", academicPlannerRoute);
  app.use("/qna", qnaRoutes);
  app.use("/calendar", calendarRoutes);
<<<<<<< HEAD
  app.use("/file_conversion", fileConversion);
=======
  app.use("/proofread", proofRoutes);
>>>>>>> main

  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Not Found!!!" });
  });
};

export default constructorMethod;
