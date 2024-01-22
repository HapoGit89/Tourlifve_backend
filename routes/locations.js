const express = require('express')
const Location = require("../models/location.js")
const Tour = require("../models/tours.js")
const {UnauthorizedError, BadRequestError} = require("../expressError.js")
const router = new express.Router();
const locationCreateSchema = require("../schemas/locationCreateSchema.json")
const locationUpdateSchema = require ("../schemas/locationUpdateSchema.json")
const jsonschema = require("jsonschema")
const { ensureLoggedIn, ensureAdmin} = require("../middleware/auth");



/** POST / => {name, country, city, postal_code, street, number, info, googleplaces_id, lat, lng} => { location: {id, name, country, city, postal_code, street, number, info, googleplaces_id} }
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


    router.get("/:location_id", ensureLoggedIn, async(req,res, next)=>{
            try{
            const location_id = req.params.location_id
            const response = await Location.get(location_id)
            return res.json({location: response})}
        catch(e){
            return next(e)
        } })


    
    // DELETE / => {deleted: location_id}
    router.delete("/:location_id", ensureLoggedIn, ensureAdmin, async(req,res, next)=>{
            try{
                const location_id = req.params.location_id
                await Location.remove(location_id)
                return res.json({deleted:location_id})
            }
            catch(e){
                return next(e)
            }
        })

    module.exports = router;
