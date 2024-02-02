const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: [true, "Нууц үгээ оруулна уу"],
    select: false,
  },
  email: {
    type: String,
    required: [true, "Имэйл хаягаа оруулна уу"],
    unique: [true, "Бүртгэлтэй хаяг байна"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Имэйл хаяг буруу байна",
    ],
  },
  role: {
    type: String,
    enum: ["translator", "reader", "admin"],
    default: "reader",
    required: true,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

UserSchema.plugin(mongoosePaginate);

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.getJWT = function () {
  const token = jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );

  return token;
};

UserSchema.methods.checkPassword = async function (entrypwd) {
  return await bcrypt.compare(entrypwd, this.password);
};

module.exports = mongoose.model("User", UserSchema);
