const express = require('express')
const POI = require("../models/pois.js")
const Tour = require("../models/tours.js")
const {UnauthorizedError, BadRequestError} = require("../expressError.js")
const router = new express.Router();
const poiCreateSchema = require ("../schemas/poiCreateSchema.json")
const poiUpdateSchema = require("../schemas/poiUpdateSchema.json")
const jsonschema = require("jsonschema")
const { ensureLoggedIn, ensureAdmin} = require("../middleware/auth");


/** POST / => {name, type, info, , adress, googleplaces_id} => { poi: {id, name, type, info, , adress, googleplaces_id, info} }
 *
 * Creates new poi in poi table
 *
 * Authorization required: logged in
 **/

router.post("/", ensureLoggedIn, async(req,res, next)=>{
    try{
        const validator = jsonschema.validate(req.body, poiCreateSchema);
        if (!validator.valid) {
          const errs = validator.errors.map(e => e.stack);
          throw new BadRequestError(errs);
        }

        const poi = await POI.createPOI(req.body)
        return res.json({poi:poi})
    }
    catch(e){
        return next(e)
    }
    })

    /** GET /  => { pois:[ {id, name, type, info, , adress, googleplaces_id, info},{...}] }
 *
 * Gets all pois from poi table
 *
 * Authorization required: logged in
 **/

    router.get("/", ensureLoggedIn, async(req,res, next)=>{
        try{
            const pois = await POI.findAll()
            return res.json({pois:pois})
        }
        catch(e){
            return next(e)
        }
    })

    /** GET /  {poi_id}=> { poi:{id, name, type, info, , adress, googleplaces_id, info} }
 *
 * Gets poi by poi_id
 *
 * Authorization required: logged in
 **/

    router.get("/:poi_id", ensureLoggedIn, async(req,res, next)=>{
        try{
            const poi_id = req.params.poi_id
            const poi = await POI.get(poi_id)
            return res.json({poi:poi})
        }
        catch(e){
            return next(e)
        }
    })

        /** PATCH /  {poi_id, name, googlemaps_link, adress}=> { updated:{id, name, type, info, , adress, googleplaces_id, info} }
 *
 * Gets poi by poi_id
 *
 * Authorization required: logged in
 **/

    router.patch("/:poi_id", ensureLoggedIn, ensureAdmin, async(req,res, next)=>{
        try{
            const validator = jsonschema.validate(req.body, poiUpdateSchema);
            if (!validator.valid) {
              const errs = validator.errors.map(e => e.stack);
              throw new BadRequestError(errs);
            }
            const poi_id = req.params.poi_id
            const poi = await POI.update(poi_id, req.body)
            return res.json({updated:poi})
        }
        catch(e){
            return next(e)
        }
    })

        // DELETE / => {deleted: poi_id} only for admins
        router.delete("/:poi_id", ensureLoggedIn, ensureAdmin, async(req,res, next)=>{
            try{
                const poi_id = req.params.poi_id
                await POI.remove(poi_id)
                return res.json({deleted:poi_id})
            }
            catch(e){
                return next(e)
            }
        })

    
    

    module.exports = router
