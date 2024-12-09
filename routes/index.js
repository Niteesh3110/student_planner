import academicPlannerRoute from "./academic_planner.js";
import homeRoutes from "./home_page_routes.js";
import qnaRoutes from "./qna.js";
import calendarRoutes from "./calendar.js";
const constructorMethod = (app) => {
  app.use("/", authRoutes);
  app.use("/home", homeRoutes);
  app.use("/ap", academicPlannerRoute);
  app.use("/qna", qnaRoutes);
  app.use("/calendar", calendarRoutes);

  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Not Found!!!" });
  });
};

export default constructorMethod;
