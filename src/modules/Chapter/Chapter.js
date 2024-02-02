const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const ChapterSchema = new Schema({
  title: {
    type: String,
  },
  chapter: Number,
  volume: Number,
  body: String,
  isFree: Boolean,
  price: Number,
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  novel: {
    type: Schema.Types.ObjectId,
    ref: "Novel",
  },
});

ChapterSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Chapter", ChapterSchema);
