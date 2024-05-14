const { sequelize, DataTypes } = require("../db");
const { Author } = require("./author_sql");
const { Genre } = require("./genre_sql");
const Book = sequelize.define("Book", {
  _id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  summary: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.VIRTUAL,
    get() {
      return `/catalog/book/${this._id}`;
    },
  },
});

Book.hasOne(Author, { foreignKey: "author" });
Book.hasOne(Genre, { foreignKey: "genre" });

module.exports = { Book };
