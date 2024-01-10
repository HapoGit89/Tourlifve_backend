const express = require('express')
const Location = require("../models/location.js")
const Tour = require("../models/tours.js")
const {UnauthorizedError, BadRequestError} = require("../expressError.js")
const router = new express.Router();
const locationCreateSchema = require("../schemas/locationCreateSchema.json")
const jsonschema = require("jsonschema")
const { ensureLoggedIn} = require("../middleware/auth");



/** POST / => {name, country, city, postal_code, street, number, info, googleplaces_id} => { location: {id, name, country, city, postal_code, street, number, info, googleplaces_id} }
 *
 * Creates new tour in tour table
 *
 * Authorization required: logged in, users can only create Tours for own user_id
 **/

router.post("/", ensureLoggedIn, async(req,res, next)=>{
    try{
        const validator = jsonschema.validate(req.body, locationCreateSchema);
        if (!validator.valid) {
          const errs = validator.errors.map(e => e.stack);
          throw new BadRequestError(errs);
        }

        const location = await Location.createLocation(req.body)
        return res.json({location:location})
    }
    catch(e){
        return next(e)
    }
    })

    router.get("/", ensureLoggedIn, async(req,res, next)=>{
        try{
           
            const locations = await Location.findAll()
            return res.json(locations)
        }
        catch(e){
            return next(e)
        }
        })

    module.exports = router;
