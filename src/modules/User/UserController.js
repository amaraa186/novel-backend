const express = require("express");
const router = express.Router();
const User = require("./User");
const _ = require("lodash");
const {
  isAuthorized,
  isAdmin,
  isTranslator,
} = require("../../middleware/protect");

router.get("/all", isAuthorized, isAdmin, async (req, res) => {
  try {
    // Retrieve all users with async/await
    const users = await User.find({});

    res.json({ code: 0, users });
  } catch (err) {
    console.error(err); // Log the error
    res.json({ code: 1, message: "Алдаа гарлаа" }); // Send a generic error response
  }
});

router.get("/:user_id", isAuthorized, isAdmin, async (req, res) => {
  try {
    // Retrieve user with async/await
    const user = await User.findById(req.params.user_id);

    // Check if user found
    if (!user) return res.json({ code: 1, message: "Хэрэглэгч олдсонгүй" });

    res.json({ code: 0, user });
  } catch (err) {
    console.error(err); // Log the error
    res.json({ code: 1, message: "Алдаа гарлаа" }); // Send a generic error response
  }
});

router.post("/", async (req, res) => {
  try {
    const email = req.body.email;

    // Check for existing user with async/await
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.json({ code: 1, message: "Бүртгэлтэй хэрэглэгч" }); // User already exists

    // Create a new user
    const user = await User.create(req.body);
    const token = user.getJWT();

    return res.json({ code: 0, token, user });
  } catch (err) {
    console.error(err); // Log the error
    res.json({ code: 1, message: "Алдаа гарлаа" }); // Send a generic error response
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.json({
        code: 1,
        message: "Талбаруудыг бүрэн бөглөнө үү",
      });

    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.json({
        code: 1,
        message: "Нууц үг эсвэл имэйл хаяг буруу байна",
      });

    const checked = await user.checkPassword(password);

    if (!checked)
      return res.json({
        code: 1,
        data: "Нууц үг эсвэл имэйл хаяг буруу байна",
      });

    return res.json({
      code: 0,
      user,
      token: user.getJWT(),
    });
  } catch (err) {
    console.error(err); // Log the error
    res.json({ code: 1, error: "Алдаа гарлаа" }); // Send a generic error response
  }
});

router.delete("/:user_id", isAuthorized, async (req, res) => {
  try {
    // Retrieve all users with async/await
    await User.findByIdAndDelete(req.params.user_id);

    res.json({ code: 0 });
  } catch (err) {
    console.error(err); // Log the error
    res.json({ code: 1, error: "Алдаа гарлаа" }); // Send a generic error response
  }
});

// router.put("/:user_id", (req, res, next) => {
//   User.findByIdAndUpdate(req.params.user_id, req.body);
// });
module.exports = router;
