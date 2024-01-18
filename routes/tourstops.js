const express = require('express')
const {UnauthorizedError, BadRequestError} = require("../expressError.js")
const router = new express.Router();
const Tour = require("../models/tours.js")
const User = require("../models/user.js")
const Tourstop = require("../models/tourstop.js")
const jsonschema = require("jsonschema")
const tourstopCreateSchema = require("../schemas/tourstopCreateSchema.json")
const tourstopUpdateSchema = require("../schemas/tourstopUpdateSchema.json")
const { ensureLoggedIn, ensureAdmin} = require("../middleware/auth");

// create tourstop {location_id, tour_id} => {tourstop: {id, location_id, tour_id}}
// for user swho own the tour

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
        // check if logged in user owns tour for tour_id
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
   // GET full Tourstop Infos for given tourstop_id
    router.get("/:tourstop_id", ensureLoggedIn, async(req,res, next)=>{
        try{
           const tourstop_id = req.params.tourstop_id
           const tourstop = await Tourstop.getFullData(tourstop_id)
            const tour = await Tour.get(tourstop.tour_id)
            const user = await User.get(res.locals.user.username)
            // check of user owns tour for tourstop or is Admin
            if (user.id != tour.user_id && !res.locals.user.isAdmin){
                throw new UnauthorizedError
            }
            
            return res.json({tourstop:tourstop})
        }
        catch(e){
            return next(e)
        }
        })

    // PATCH  {date} => {tourstop : {date, location_id, tour_id}}
    // only allows for change of date for tourstop in order to not make the activvities table entries obsolete
    // only user owning the tour or admin to patch


    router.patch("/:tourstop_id", ensureLoggedIn, async(req,res, next)=>{
        try{
            const validator = jsonschema.validate(req.body, tourstopUpdateSchema);
            if (!validator.valid) {
              const errs = validator.errors.map(e => e.stack);
              throw new BadRequestError(errs);
            }
            const tourstop_id = req.params.tourstop_id
            const tourstop = await Tourstop.getbyTourstopId(tourstop_id)

            const user = await User.get(res.locals.user.username)
            const testArray = user.tours.filter(el => el.id == tourstop.tour_id)
            if (testArray.length == 0 && !res.locals.user.isAdmin){
                throw new UnauthorizedError
            }

            const updatedStop = await Tourstop.update(tourstop_id, req.body)

            return res.json({updated:updatedStop})
        }
        catch(e){
            return next(e)
        }
    })

    // Deletes tourstop for given tourstop_id
    // Only accessible for user owning the tour or admin
    router.delete("/:tourstop_id", ensureLoggedIn, async(req,res, next)=>{
        try{
            console.log(res.locals.user)
            const tourstop_id = req.params.tourstop_id
            const tourstop = await Tourstop.getbyTourstopId(tourstop_id)
            const testArray = user.tours.filter(el => el.id == tourstop.tour_id)
            if (testArray.length == 0 && !res.locals.user.isAdmin){
                throw new UnauthorizedError
            }

            const deleted = await Tourstop.remove(tourstop_id)

            return res.json({deleted: deleted})
        }
        catch(e){
            return next(e)
        }
    })

  

module.exports = router
    
