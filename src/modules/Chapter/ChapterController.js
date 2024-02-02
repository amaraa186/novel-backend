const { json } = require("body-parser");
var express = require("express");
var router = express.Router();
var _ = require("lodash");

var Chapter = require("./Chapter");
var Novel = require("../Novel/Novel");
var { isAuthorized, isTranslator } = require("../../middleware/protect");

router.get("/recently", async (req, res) => {
  try {
    let chapters = await Chapter.find({}, "title volume chapter")
      .sort({
        created_at: -1,
      })
      .limit(10)
      .populate("novel");

    res.json({ code: 0, chapters });
  } catch (err) {
    console.error(err); // Log the error
    res.json({ code: 1, message: "Алдаа гарлаа" }); // Send a generic error response
  }
});

router.get("/:chapter_id", isAuthorized, async (req, res) => {
  try {
    let chapter = await Chapter.findById(req.params.chapter_id).populate(
      "novel"
    );

    res.json({
      code: 0,
      chapter,
    });
  } catch (err) {
    console.error(err); // Log the error
    res.json({ code: 1, message: "Алдаа гарлаа" }); // Send a generic error response
  }
});

router.post("/", isAuthorized, isTranslator, async (req, res) => {
  try {
    let chapter = await Chapter.create({
      ...req.body,
      created_by: req.user._id,
    });

    await Novel.findByIdAndUpdate(
      req.body.novel,
      {
        $push: { chapters: chapter._id },
      },
      { new: true }
    );

    res.json({ code: 0, chapter });
  } catch (err) {
    console.error(err); // Log the error
    res.json({ code: 1, message: "Алдаа гарлаа" }); // Send a generic error response
  }
});

// router.get("/novel/:novel_id", (req, res) => {
//   Chapter.find({ novel: req.params.novel_id }, "_id title episode").exec(
//     (err, chapters) => {
//       if (err) throw err;

//       return res.json({
//         code: 0,
//         chapters,
//       });
//     }
//   );
// });

module.exports = router;
