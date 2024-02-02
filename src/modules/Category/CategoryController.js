const Category = require("./Category");
const express = require("express");
const router = express.Router();
const {
  isAuthorized,
  isAdmin,
  isTranslator,
} = require("../../middleware/protect");

router.get("/", async (req, res) => {
  try {
    let categories = await Category.find({});

    res.json({
      code: 0,
      categories,
    });
  } catch (err) {
    console.error(err); // Log the error
    res.json({ code: 1, message: "Алдаа гарлаа" }); // Send a generic error response
  }
});

router.get("/:category_id", async (req, res) => {
  try {
    let category = await Category.findById(req.params.category_id);

    res.json({
      code: 0,
      category,
    });
  } catch (err) {
    console.error(err); // Log the error
    res.json({ code: 1, message: "Алдаа гарлаа" }); // Send a generic error response
  }
});

router.post("/", isAuthorized, isAdmin, async (req, res) => {
  try {
    let category = await Category.create(req.body);

    res.json({
      code: 0,
      category,
    });
  } catch (err) {
    console.error(err); // Log the error
    res.json({ code: 1, message: "Алдаа гарлаа" }); // Send a generic error response
  }
});

module.exports = router;
