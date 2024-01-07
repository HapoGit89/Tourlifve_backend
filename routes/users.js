const express = require('express')
const User = require("../models/user.js")
const router = new express.Router();
const db = require("../db")
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
        console.log(req.params)
      if (req.params.username != res.locals.user.username && !res.locals.user.isAdmin){
        throw new UnauthorizedError
      }
      const user = await User.get(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  });


module.exports = router;