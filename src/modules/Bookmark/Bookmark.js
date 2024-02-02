const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const BookmarkSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  novel: [
    {
      type: Schema.Types.ObjectId,
      ref: "Novel",
    },
  ],
});

BookmarkSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Bookmark", BookmarkSchema);
