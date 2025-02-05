const loadingSliproutes = require("./loading_slip");
const companyRoutes = require("./company");
const authRoutes = require("./auth");
const customer = require("./customer");
const entries = require('./entries')
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
  app.use(baseURL + "/entries", isAuthenticated.isAuthenticated, entries);
};

module.exports = {
  main_root,
};
