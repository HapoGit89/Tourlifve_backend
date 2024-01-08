const express = require('express')
const User = require("../models/user.js")
const {UnauthorizedError, BadRequestError} = require("../expressError.js")
const router = new express.Router();
const jsonschema = require("jsonschema")
const userUpdateSchema = require("../schemas/userUpdateSchema.json")
const { ensureLoggedIn} = require("../middleware/auth");


/** GET / => { users: [ {username, email, image_url }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: login
 **/

router.get("/", ensureLoggedIn, async(req,res, next)=>{
try{
    const response = await User.findAll()
    return res.json(response)}
catch(e){
    return next(e)
}
})

/** GET /:username => { user: {username, email, image_url } }
 *
 * Returns information on user for given username
 *
 * Authorization required: logged in, users can only see own information
 **/

router.get("/:username", ensureLoggedIn, async function (req, res, next) {
    try {
      if (req.params.username != res.locals.user.username){
        throw new UnauthorizedError
      }
      const user = await User.get(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  });


  /** PATCH/:username {email, image_url}=> { user: {username, email, image_url } }
 *
 * Updates User Details and returns full user information
 *
 * Authorization required: logged in, users can only patch own profile
 **/


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


/** PATCH/:username {email, image_url}=> { user: {username, email, image_url } }
 *
 * Updates User Details and returns full user information
 *
 * Authorization required: logged in, users can only patch own profile
 **/


  router.delete("/:username", ensureLoggedIn, async function (req, res, next) {
    try {
      if (req.params.username != res.locals.user.username){
        throw new UnauthorizedError
      }
      const user = await User.remove(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  });


module.exports = router;