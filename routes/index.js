import academicPlannerRoute from "./academic_planner.js";

const constructorMethod = (app) => {
  app.use("/ap", academicPlannerRoute);

  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Not Found!!!" });
  });
};

export default constructorMethod;
