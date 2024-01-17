const express = require('express')
const {UnauthorizedError, BadRequestError} = require("../expressError.js")
const router = new express.Router();
const Tour = require("../models/tours.js")
const User = require("../models/user.js")
const Tourstop = require("../models/tourstop.js")
const Activity = require("../models/activity.js")
const LocationNote = require ("../models/locationNote.js")
const jsonschema = require("jsonschema")
const locationNoteCreateSchema = require ("../schemas/locationNoteCreateSchema.json")
const locationNoteUpdateSchema = require ("../schemas/locationNoteUpdateSchema.json")
const { ensureLoggedIn, ensureAdmin} = require("../middleware/auth");


// This route enables users to save personal notes about locations
// create note for location {location_id, note} => {locationNote: {location_id, note}}
// for all logged in users;

router.post("/", ensureLoggedIn, async(req,res, next)=>{
    try{
        const validator = jsonschema.validate(req.body, locationNoteCreateSchema);
        if (!validator.valid) {
          const errs = validator.errors.map(e => e.stack);
          throw new BadRequestError(errs);
        }
        const {location_id, note} = req.body
        const user = await User.get(res.locals.user.username)
        const user_id = user.id

        const locationNote = await LocationNote.createNote(location_id, user_id, note)
    
        return res.json({locationNote:locationNote})
    }
    catch(e){
        return next(e)
    }
    })

    // GET => {id, location_id, user_id, note}
    router.get("/:username/:location_id", ensureLoggedIn, async(req,res, next)=>{
        try{
            const username = req.params.username
            const location_id = req.params.location_id
            // check if  params user matches logged in user
            if (username != res.locals.user.username){
                throw new UnauthorizedError
            }

            const user= await User.get(username)
            const note = await LocationNote.getNote(user.id, location_id)

            return res.json({locationNote: note})
        }
        catch(e){
            return next(e)
        }
        })


        // PATCH update locationnote for id in params returns updated note
        router.patch("/:locationnote_id", ensureLoggedIn, async(req,res, next)=>{
            try{
                const validator = jsonschema.validate(req.body, locationNoteUpdateSchema);
                if (!validator.valid) {
                  const errs = validator.errors.map(e => e.stack);
                  throw new BadRequestError(errs);
                }
                const locationnote_id = req.params.locationnote_id
                const note = await LocationNote.get(locationnote_id)
                const user = await User.get(res.locals.user.username)
                if (note.user_id != user.id){
                    throw new UnauthorizedError
                }
    
                const updatedNote = await LocationNote.update(locationnote_id, req.body)
    
                return res.json({updated:updatedNote})
            }
            catch(e){
                return next(e)
            }
        })

          // Deletes locationnote for given locationnote_id
    // Only accessible for user owning the note
    router.delete("/:locationnote_id", ensureLoggedIn, async(req,res, next)=>{
        try{
            
            const locationnote_id = req.params.locationnote_id
            const note = await LocationNote.get(locationnote_id)
            const user = await User.get(res.locals.user.username)
            if (user.id != note.user_id){
                throw new UnauthorizedError
            }

            const deleted = await LocationNote.remove(locationnote_id)

            return res.json({deleted: deleted})
        }
        catch(e){
            return next(e)
        }
    })


    module.exports = router