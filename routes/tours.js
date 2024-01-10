const express = require('express')
const User = require("../models/user.js")
const Tour = require("../models/tours.js")
const {UnauthorizedError, BadRequestError} = require("../expressError.js")
const router = new express.Router();
const jsonschema = require("jsonschema")
const tourCreateSchema = require("../schemas/tourCreateSchema.json")
const tourUpdateSchema = require("../schemas/tourUpdateSchema.json")
const { ensureLoggedIn} = require("../middleware/auth");

/** POST / => {title, crew, start, end, user_id, artist} => { tour: {id, title, crew, start, end, user_id, artist} }
 *
 * Creates new tour in tour table
 *
 * Authorization required: logged in, users can only create Tours for own user_id
 **/

router.post("/", ensureLoggedIn, async(req,res, next)=>{
    try{
        const validator = jsonschema.validate(req.body, tourCreateSchema);
        if (!validator.valid) {
          const errs = validator.errors.map(e => e.stack);
          throw new BadRequestError(errs);
        }
        const {title, crew, start, end, user_id, artist} = req.body

    
        const user = await User.get(res.locals.user.username)
        if(user_id != user.id){
            throw new UnauthorizedError
        }
        const tour = await Tour.createTour(req.body)
        return res.json({tour:tour})
    }
    catch(e){
        return next(e)
    }
    })

    // GET => {tours: [{tour1..}, {tour2....}]}
    // Access only for logged in users
    router.get("/", ensureLoggedIn, async(req,res, next)=>{
        try{
        const response = await Tour.findAll()
        return res.json(response)}
    catch(e){
        return next(e)
    } })

    /** GET /:tour_id => { tour: {title, startdate, enddate, artist, user_id} } }
 *
 * Returns information on tour for given tour_id
 *
 * Authorization required: logged in, users can only see own tours
 **/

    router.get("/:tour_id", ensureLoggedIn, async(req,res, next)=>{
        try{
        const tour_id = req.params.tour_id
        const response = await Tour.get(tour_id)
        const user = await User.get(res.locals.user.username)
        const testArray = user.tours.filter(el => el.id == tour_id)
        if (testArray.length == 0){
            throw new UnauthorizedError
        }
        return res.json(response)}
    catch(e){
        return next(e)
    } })

    // PATCH / tour:id {data}=>{tour:tour}
    // Users can only patch own tours
    router.patch("/:tour_id", ensureLoggedIn, async(req,res, next)=>{
        try{
            const validator = jsonschema.validate(req.body, tourUpdateSchema);
            if (!validator.valid) {
              const errs = validator.errors.map(e => e.stack);
              throw new BadRequestError(errs);
            }
            const {user_id} = req.body
            const tour_id = req.params.tour_id
    
        
            const user = await User.get(res.locals.user.username)
            const testArray = user.tours.filter(el => el.id == tour_id)
            if (testArray.length == 0){
                throw new UnauthorizedError
            }
            const tour = await Tour.update(tour_id,req.body)
            return res.json({tour:tour})
        }
        catch(e){
            return next(e)
        }
    })
    // DELETE / => {deleted: tour_id} only for users who own the tour
    router.delete("/:tour_id", ensureLoggedIn, async(req,res, next)=>{
        try{
            const tour_id = req.params.tour_id
            const user = await User.get(res.locals.user.username)
            const testArray = user.tours.filter(el => el.id == tour_id)
            if (testArray.length == 0){
                throw new UnauthorizedError
            }
            const tour = await Tour.remove(tour_id)
            return res.json({deleted:tour_id})
        }
        catch(e){
            return next(e)
        }
    })

 module.exports = router;
