const { sequelize, DataTypes } = require("../db");
const Author = sequelize.define("Author", {
  _id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  family_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date_of_birth: { type: DataTypes.DATE, defaultValue: null },
  date_of_death: { type: DataTypes.DATE, defaultValue: null },
  photo_path: { type: DataTypes.STRING },
  name: {
    type: DataTypes.VIRTUAL,
    get() {
      let fullname = "";
      if (this.first_name && this.family_name) {
        fullname = `${this.family_name}, ${this.first_name}`;
      }

      return fullname;
    },
  },
  ymd_date_of_birth: {
    type: DataTypes.VIRTUAL,
    get() {
      return DateTime.fromJSDate(this.date_of_birth).toISODate();
    },
  },
  ymd_date_of_death: {
    type: DataTypes.VIRTUAL,
    get() {
      return DateTime.fromJSDate(this.date_of_death).toISODate();
    },
  },
  lifespan: {
    type: DataTypes.VIRTUAL,
    get() {
      let birth = this.date_of_birth
        ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(
            DateTime.DATE_MED
          )
        : "??";

      let death = this.date_of_death
        ? DateTime.fromJSDate(this.date_of_death).toLocaleString(
            DateTime.DATE_MED
          )
        : "present";

      return birth + " - " + death;
    },
  },
  url: {
    type: DataTypes.VIRTUAL,
    get() {
      return `/catalog/author/${this._id}`;
    },
  },
});

module.exports = { Author };
