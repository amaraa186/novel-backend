const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const NovelSchema = new Schema({
  title: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "Author",
  },
  description: String,
  rating: [
    {
      type: Schema.Types.ObjectId,
      ref: "Rating",
    },
  ],
  chapters: [
    {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
    },
  ],
  status: {
    type: String,
    enum: ["ongoing", "complete"],
    default: "ongoing",
    required: true,
  },
  cover: String,
  released: Number,
  country: String,
  total_chapter: Number,
  volume_count: Number,
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  total_views: {
    type: Number,
    default: 0,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

NovelSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Novel", NovelSchema);
