const express = require('express')
const {UnauthorizedError, BadRequestError} = require("../expressError.js")
const router = new express.Router();
const Tour = require("../models/tours.js")
const User = require("../models/user.js")
const Tourstop = require("../models/tourstop.js")
const Activity = require("../models/activity.js")
const jsonschema = require("jsonschema")
const activityCreateSchema = require("../schemas/activityCreateSchema.json")
const { ensureLoggedIn, ensureAdmin} = require("../middleware/auth");


// create activity {tourstop_id, poi_id} => {activity: {id, tourstop_id, poi_id}}
// for user who owns the tour

router.post("/", ensureLoggedIn, async(req,res, next)=>{
    try{
        const validator = jsonschema.validate(req.body, activityCreateSchema);
        if (!validator.valid) {
          const errs = validator.errors.map(e => e.stack);
          throw new BadRequestError(errs);
        }
        const {tourstop_id} = req.body
        const tourstop = await Tourstop.getFullData(tourstop_id)
        const tour = await Tour.get(tourstop.tour_id)
        const user = await User.get(res.locals.user.username)
        // check if logged in user owns tour for tour_id
        if (user.id != tour.user_id){
            throw new UnauthorizedError
        }

        const activity = await Activity.createActivity(req.body)
    
        return res.json({activity:activity})
    }
    catch(e){
        return next(e)
    }
    })

    // GET => {activity_id} => {id, tourstop_id, poi_id, poi_name, poi_type, poi, googleplaces_id, poi_googlmaps_link, poi_adress}
    router.get("/:activity_id", ensureLoggedIn, async(req,res, next)=>{
        try{
           const activity_id = req.params.activity_id
           const activity = await Activity.getFullData(activity_id)
            const tourstop = await Tourstop.getFullData(activity.tourstop_id)
            const tour = await Tour.get(tourstop.tour_id)
            const user = await User.get(res.locals.user.username)
            // check if logged in user owns tour for tour_id
            if (user.id != tour.user_id){
                throw new UnauthorizedError
            }

            return res.json({activity:activity})
        }
        catch(e){
            return next(e)
        }
        })


module.exports = router