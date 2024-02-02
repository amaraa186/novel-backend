const Rating = require("./Rating");
const express = require("express");
const _ = require("lodash");
const router = express.Router();
const {
  isAuthorized,
  isAdmin,
  isTranslator,
} = require("../../middleware/protect");
const Novel = require("../Novel/Novel");

router.get("/", async (req, res) => {
  try {
    let ratings = await Rating.find({});

    res.json({
      code: 0,
      ratings,
    });
  } catch (err) {
    console.error(err); // Log the error
    res.json({ code: 1, message: "Алдаа гарлаа" }); // Send a generic error response
  }
});

router.post("/", isAuthorized, async (req, res) => {
  try {
    let rating = await Rating.findOneAndUpdate(
      { user: req.user._id, novel: req.body.novel },
      { $set: { score: req.body.score } },
      { new: true }
    );

    if (_.isEmpty(rating)) {
      let id = Rating.generate_id();
      rating = await Rating.create({
        ...req.body,
        _id: id,
        user: req.user._id,
      });

      await Novel.findOneAndUpdate(
        { _id: req.body.novel, "rating.user": { $ne: req.user._id } },
        { $push: { rating: id } },
        { new: true }
      );
    }

    res.json({ code: 0, rating });
  } catch (err) {
    console.error(err); // Log the error
    res.json({ code: 1, message: "Алдаа гарлаа" }); // Send a generic error response
  }
});

module.exports = router;
