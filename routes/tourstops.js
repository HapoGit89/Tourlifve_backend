const express = require('express')
const {UnauthorizedError, BadRequestError} = require("../expressError.js")
const router = new express.Router();
const Tour = require("../models/tours.js")
const User = require("../models/user.js")
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
        const {tour_id, location_id} = req.body
        const tour = await Tour.get(tour_id)
        const user = await User.get(res.locals.user.username)
        if (user.id != tour.user_id){
            throw new UnauthorizedError
        }
        
        const tourstop = await Tourstop.create(tour_id, location_id)
        return res.json({tour:tour})
    }
    catch(e){
        return next(e)
    }
    })
