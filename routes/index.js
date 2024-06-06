const express = require("express");
const router = express.Router();
let { switchDatabase } = require("../db");

/* GET home page. */
router.get("/", function (req, res) {
  res.redirect("/catalog");
});

router.post("/switch", function (req, res) {
  const usingSQL = switchDatabase();
  console.log("Switched to " + (usingSQL ? "SQL" : "MongoDB"));
  res.end();
});
module.exports = router;
