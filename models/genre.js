const mongoose = require("mongoose");
const mongooseFuzzySearch = require("mongoose-fuzzy-searching");

const Schema = mongoose.Schema;
const GenreSchema = new Schema({
  name: { type: String, minLength: 3, maxLength: 100, required: true },
});

GenreSchema.virtual("url").get(function () {
  return "/catalog/genre/" + this._id;
});

GenreSchema.plugin(mongooseFuzzySearch, {
  fields: ["name"],
});

module.exports = mongoose.model("Genre", GenreSchema);
