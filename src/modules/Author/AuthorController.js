const Author = require("./Author");
const express = require("express");
const router = express.Router();
const {
  isAuthorized,
  isAdmin,
  isTranslator,
} = require("../../middleware/protect");

router.get("/", async (req, res) => {
  try {
    let { page, limit, filterName } = req.query;
    let query = {};
    console.log(query);
    console.log(req.query);
    if (filterName) {
      Object.assign(query, {
        $or: [
          {
            title: new RegExp("^" + filterName + ".*", "i"),
          },
        ],
      });
    }

    let authors = await Author.paginate(query, {
      limit,
      page,
    });
    console.log(authors);

    res.json({
      code: 0,
      authors,
    });
  } catch (err) {
    console.error(err); // Log the error
    res.json({ code: 1, message: "Алдаа гарлаа" }); // Send a generic error response
  }
});

router.get("/:author_id", async (req, res) => {
  const { author_id } = req.params;
  console.log(req.params);
  try {
    let author;
    if (author_id) author = await Author.findById(author_id);

    res.json({
      code: 0,
      author,
    });
  } catch (err) {
    console.error(err); // Log the error
    res.json({ code: 1, message: "Алдаа гарлаа" }); // Send a generic error response
  }
});

router.post("/", isAuthorized, isAdmin, async (req, res) => {
  try {
    let author = await Author.create(req.body);

    res.json({
      code: 0,
      author,
    });
  } catch (err) {
    console.error(err); // Log the error
    res.json({ code: 1, message: "Алдаа гарлаа" }); // Send a generic error response
  }
});

module.exports = router;
