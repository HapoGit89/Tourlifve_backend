const express = require('express')
const POI = require("../models/pois.js")
const Tour = require("../models/tours.js")
const {UnauthorizedError, BadRequestError} = require("../expressError.js")
const router = new express.Router();
const poiCreateSchema = require ("../schemas/poiCreateSchema.json")
const jsonschema = require("jsonschema")
const { ensureLoggedIn, ensureAdmin} = require("../middleware/auth");


/** POST / => {name, type, info, , adress, googleplaces_id, info} => { poi: {id, name, type, info, , adress, googleplaces_id, info} }
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

    module.exports = router
