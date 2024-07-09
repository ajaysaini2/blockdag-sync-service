const Sequelize = require("sequelize-cockroachdb");
import * as config from './config';
(async () => {
   await config.initiate();
})();

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    application_name: "docs_simplecrud_node-sequelize",
  }
});
