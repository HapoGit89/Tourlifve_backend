const express = require('express')
const User = require("../models/user.js")
const {UnauthorizedError, BadRequestError} = require("../expressError.js")
const router = new express.Router();
const db = require("../db")
const jsonschema = require("jsonschema")
const userUpdateSchema = require("../schemas/userUpdateSchema.json")
const { ensureLoggedIn, authenticateJWT, ensureAdmin } = require("../middleware/auth");


router.get("/", async(req,res, next)=>{
try{
    const response = await User.findAll()
    console.log(response)
    return res.json(response)}
catch(e){
    return next(e)
}
})


router.get("/:username", ensureLoggedIn, async function (req, res, next) {
    try {
      if (req.params.username != res.locals.user.username && !res.locals.user.isAdmin){
        throw new UnauthorizedError
      }
      const user = await User.get(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  });


  router.patch("/:username", ensureLoggedIn, async function (req, res, next) {
    try {
      if (req.params.username != res.locals.user.username){
        throw new UnauthorizedError
      }
      const validator = jsonschema.validate(req.body, userUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const user = await User.update(req.params.username, req.body);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  });


module.exports = router;