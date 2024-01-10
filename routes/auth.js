"use strict"

const jsonschema = require("jsonschema")
const express = require("express")
const router = new express.Router();
const User = require("../models/user")
const { BadRequestError} = require("../expressError")
const userAuthSchema = require("../schemas/userAuthSchema.json")
const userRegisterSchema = require("../schemas/userRegisterSchema.json")
const userAuthUpdateSchema = require("../schemas/userAuthUpdateSchema.json")
const userUpdateSchema = require ("../schemas/userAuthUpdateSchema.json")
const {createToken} = require("../helpers/tokens")


// POST {username, password} => {token}
// * Authorization required: none

router.post("/token", async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, userAuthSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const { username, password } = req.body;
      const user = await User.authenticate(username, password);
      const token = createToken(user);
      return res.json({ token });
    } catch (err) {
      return next(err);
    }
  });



/** POST /auth/register:   { username, email, password, (image:url) } => { token }
 *
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const newUser = await User.register({ ...req.body});
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

// Updates user password 

// {username, password, new_password} => {token}

router.patch("/token", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAuthUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const { username, password, new_password } = req.body;
    const user = await User.updatePassword(username, password, new_password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});


  module.exports = router;