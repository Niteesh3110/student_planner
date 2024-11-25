import academicPlannerRoute from "./academic_planner.js";
import homeRoutes from "./home_page_routes.js";
import qnaRoutes from "./qna.js";

const constructorMethod = (app) => {
  app.use("/", homeRoutes);
  app.use("/ap", academicPlannerRoute);
  app.use("/qna", qnaRoutes);

  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Not Found!!!" });
  });
};

export default constructorMethod;
