const { isAuthorized } = require("../../middleware/protect");
const History = require("./History");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

router.get("/novel/:history_id", isAuthorized, async (req, res) => {
  try {
    let history = await History.findOne({
      novel: req.params.history_id,
      user: req.user._id,
    }).populate(["novel", "chapter"]);

    res.json({
      code: 0,
      history,
    });
  } catch (err) {
    console.error(err); // Log the error
    res.json({ code: 1, message: "Алдаа гарлаа" }); // Send a generic error response
  }
});

router.post("/", isAuthorized, async (req, res) => {
  try {
    let history = await History.findOneAndUpdate(
      {
        novel: req.body.novel,
        user: req.user._id,
      },
      {
        $set: { chapter: req.body.chapter },
      },
      { new: true }
    );

    if (_.isEmpty(history)) history = await History.create(req.body);

    res.json({ code: 0, history });
  } catch (err) {
    console.error(err); // Log the error
    res.json({ code: 1, message: "Алдаа гарлаа" }); // Send a generic error response
  }
});

module.exports = router;
