const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("localLibrary", "root", "secretPassword", {
  dialect: "mariadb",
});
sequelize.authenticate().catch((error) => {
  console.error("Unable to connect to mariaDB:", error);
});
sequelize.sync({ alter: true });

let usingSQL = true;
module.exports = { sequelize, DataTypes, usingSQL };
