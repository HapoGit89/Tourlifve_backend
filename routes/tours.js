const express = require('express')
const User = require("../models/user.js")
const Tour = require("../models/tours.js")
const {UnauthorizedError, BadRequestError} = require("../expressError.js")
const router = new express.Router();
const jsonschema = require("jsonschema")
const userUpdateSchema = require("../schemas/userUpdateSchema.json")
const { ensureLoggedIn} = require("../middleware/auth");

/** POST / => {title, crew, start, end, user_id, artist} => { tour: {id, title, crew, start, end, user_id, artist} }
 *
 * Creates new tour in tour table
 *
 * Authorization required: logged in, users can only create Tours for own user_id
 **/

router.post("/", ensureLoggedIn, async(req,res, next)=>{
    try{
        const {title, crew, start, end, user_id, artist} = req.body
        const user = await User.get(res.locals.user.username)
        if(user_id != user.id){
            throw new UnauthorizedError
        }
        const tour = await Tour.createTour(req.body)
        console.log("created")
        return res.json({tour:tour})
    }
    catch(e){
        return next(e)
    }
    })


 module.exports = router;
