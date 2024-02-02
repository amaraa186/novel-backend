const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
  chapter: {
    type: Schema.Types.ObjectId,
    ref: "Chapter",
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  novel: {
    type: Schema.Types.ObjectId,
    ref: "Novel",
  },
});

HistorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("History", HistorySchema);
