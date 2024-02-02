const express = require("express");
const router = express.Router();
const _ = require("lodash");
const Bookmark = require("./Bookmark");
const Novel = require("../Novel/Novel");

const {
  isAuthorized,
  isAdmin,
  isTranslator,
} = require("../../middleware/protect");
// router.get("/", async (req, res) => {
//   await Bookmark.find({})
//     .exec((err, bookmark) => {
//       if (err) throw err;
//       return res.json({
//         code: 0,
//         bookmark,
//       });
//     })
// });

router.get("/user_bookmark/:user_id", isAuthorized, async (req, res) => {
  try {
    const limit = 10;
    const { page = 1 } = req.query;

    const bookmarks = await Bookmark.paginate(
      { user: req.params.user_id },
      { limit, page, populate: ["novel"] }
    );

    res.json({
      code: 0,
      bookmarks,
    });
  } catch (err) {
    console.error(err); // Log the error
    res.json({ code: 1, message: "Алдаа гарлаа" }); // Send a generic error response
  }
});

router.post("/", isAuthorized, async (req, res) => {
  try {
    const { novel } = req.body;

    let bookmark = await Bookmark.findOne({ user: req.user._id });

    if (_.isEmpty(bookmark)) {
      bookmark = await Bookmark.create({
        user: req.user._id,
        novel: [novel],
      });
    } else {
      const value = await bookmark.novel.find((novel_id) => novel_id == novel);

      if (!value) {
        bookmark = await Bookmark.updateOne(
          { user: req.user._id },
          {
            $push: { novel: novel },
          },
          { new: true, upsert: true }
        );
      } else {
        bookmark = await Bookmark.updateOne(
          { user: req.user._id },
          {
            $pull: { novel: value },
          },
          { new: true, upsert: true }
        );
      }
    }

    return res.json({
      code: 0,
      bookmark,
    });
  } catch (err) {
    console.error(err); // Log the error
    res.json({ code: 1, message: "Алдаа гарлаа" }); // Send a generic error response
  }
});

module.exports = router;
