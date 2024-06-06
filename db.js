const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("localLibrary", "root", "secretPassword", {
  dialect: "mariadb",
});
sequelize.authenticate().catch((error) => {
  console.error("Unable to connect to mariaDB:", error);
});
sequelize.sync({ force: true });
const config = {
  usingSQL: true,
};

function switchDatabase() {
  config.usingSQL = !config.usingSQL;
  return usingSQL;
}
module.exports = { sequelize, DataTypes, config, switchDatabase };
