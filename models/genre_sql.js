const { sequelize, DataTypes } = require("../db");
const Genre = sequelize.define("Genre", {
  _id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.VIRTUAL,
    get() {
      return "/catalog/genre/" + this._id;
    },
  },
});

module.exports = { Genre };
