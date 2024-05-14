const { sequelize, DataTypes } = require("../db");
const { Book } = require("./book_sql");
const BookInstance = sequelize.define("BookInstance", {
  _id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  imprint: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Available", "Maintenance", "Loaned", "Reserved"),
    defaultValue: "Maintenance",
    allowNull: false,
  },
  due_back: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  url: {
    type: DataTypes.VIRTUAL,
    get() {
      return `/catalog/bookinstance/${this._id}`;
    },
  },
});

BookInstance.hasOne(Book, { foreignKey: "book" });

module.exports = { BookInstance };
