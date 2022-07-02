const { User } = require("../models/user");
const { Router } = require("express");
const router = Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

router.get("/me", [auth], async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    res.status(200).json(_.pick(user, ["_id", "name", "email", "isAdmin"]));
  } catch (err) {
    res.status(500).send("Something went wrong on the server.");
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("Invalid email or password.");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).send("Invalid email or password.");
    }

    const token = user.generateAuthToken();
    res.status(200).send(token);
  } catch (err) {
    res.status(500).send("Something went wrong on the server.");
  }
});

module.exports = router;
