const loadingSliproutes = require("./loading_slip");
const companyRoutes = require("./company");
const authRoutes = require("./auth");
const customer = require("./customer");
const isAuthenticated = require("../../middlewares/isAuthenticated");

const main_root = (app) => {
  baseURL = "/api";

  app.use(baseURL + "/auth", authRoutes);
  app.use(baseURL + "/company", isAuthenticated.isAuthenticated, companyRoutes);
  app.use(baseURL + "/customer", isAuthenticated.isAuthenticated, customer);
  app.use(
    baseURL + "/loadingslips",
    isAuthenticated.isAuthenticated,
    loadingSliproutes
  );
};

module.exports = {
  main_root,
};
