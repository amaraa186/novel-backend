const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  title: String,
});

AuthorSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Author", AuthorSchema);
