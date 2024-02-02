const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
  score: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  novel: {
    type: Schema.Types.ObjectId,
    ref: "Novel",
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

RatingSchema.statics.generate_id = () => {
  return new mongoose.Types.ObjectId();
};

RatingSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Rating", RatingSchema);
