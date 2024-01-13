const express = require('express')
const {UnauthorizedError, BadRequestError} = require("../expressError.js")
const router = new express.Router();
const Tour = require("../models/tours.js")
const User = require("../models/user.js")
const Tourstop = require("../models/tourstop.js")
const jsonschema = require("jsonschema")
const tourstopCreateSchema = require("../schemas/tourstopCreateSchema.json")
const { ensureLoggedIn, ensureAdmin} = require("../middleware/auth");

// create tourstop {location_id, tour_id} => {tourstop: {id, location_id, tour_id}}

router.post("/", ensureLoggedIn, async(req,res, next)=>{
    try{
        const validator = jsonschema.validate(req.body, tourstopCreateSchema);
        if (!validator.valid) {
          const errs = validator.errors.map(e => e.stack);
          throw new BadRequestError(errs);
        }
        const {tour_id, location_id, date} = req.body
     
        const tour = await Tour.get(tour_id)
        const user = await User.get(res.locals.user.username)
        if (user.id != tour.user_id){
            throw new UnauthorizedError
        }
        const tourstop = await Tourstop.createTourstop(tour_id, location_id, date)
        return res.json({tourstop:tourstop})
    }
    catch(e){
        return next(e)
    }
    })
    // GET all tourstops for given tour_id {tour_id} => {tourststops: {location_id, tour_id},{...},..}
    router.get("/:tour_id", ensureLoggedIn, async(req,res, next)=>{
        try{
           const tour_id = req.params.tour_id
            const tour = await Tour.get(tour_id)
            const user = await User.get(res.locals.user.username)
            if (user.id != tour.user_id){
                throw new UnauthorizedError
            }
            
            const tourstops = await Tourstop.get(tour_id)
            return res.json({tourstops:tourstops})
        }
        catch(e){
            return next(e)
        }
        })

    // PATCH 

    router.patch

module.exports = router
    
