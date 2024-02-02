const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

const Novel = require("./Novel");
const Categoty = require("../Category/Category");
const Chapter = require("../Chapter/Chapter");

const updateNovelViews = async (novelId) => {
  try {
    const novel = await Novel.findOne({ _id: novelId });
    if (!novel) throw new Error("Novel not found");

    novel.total_views += 1;
    await novel.save();
  } catch (err) {
    throw err;
  }
};

const {
  isAuthorized,
  isAdmin,
  isTranslator,
} = require("../../middleware/protect");

router.get("/", async (req, res) => {
  try {
    let novels = await Novel.find({}).populate([
      "categories",
      "author",
      "created_by",
    ]);

    res.json({
      code: 0,
      novels,
    });
  } catch (err) {
    res.json({ code: 1, message: "Алдаа гарлаа" });
  }
});

// router.get("/popular", (req, res) => {
//   Novel.find({}, "_id title cover_url")
//     .sort({
//       total_views: -1,
//     })
//     .limit(6)
//     .exec((err, novels) => {
//       if (err) throw err;

//       return res.json({
//         code: 0,
//         novels,
//       });
//     });
// });

// router.get("/search", (req, res) => {
//   const limit = 10;
//   const { search_value, page = 1 } = req.query;

//   const query = {};

//   if (search_value) {
//     Object.assign(query, {
//       title: new RegExp("^" + search_value + ".*", "i"),
//     });
//   }

//   Novel.paginate(query, { limit, page }, (err, novels) => {
//     if (err) throw err;
//     // console.log(novels)
//     return res.json({
//       code: 0,
//       novels,
//     });
//   });
// });

router.get("/:novel_id", async (req, res) => {
  try {
    await updateNovelViews(req.params.novel_id);

    const novel = await Novel.findOne({ _id: req.params.novel_id }).populate([
      "categories",
      "author",
      "created_by",
    ]);

    if (!novel) return res.json({ code: 1, message: "Зохиол олдсонгүй" });

    return res.json({ code: 0, novel });
  } catch (err) {
    return res.json({ code: 2, message: err.message });
  }
});

router.post("/", isAuthorized, isTranslator, async (req, res) => {
  try {
    let novel = await Novel.create(req.body, { created_by: req.user._id });

    res.json({
      code: 0,
      novel,
    });
  } catch (err) {
    res.json({ code: 1, message: "Алдаа гарлаа" });
  }
});

module.exports = router;
