const express = require('express')
const {UnauthorizedError, BadRequestError} = require("../expressError.js")
const router = new express.Router();
const Tour = require("../models/tours.js")
const User = require("../models/user.js")
const Tourstop = require("../models/tourstop.js")
const Activity = require("../models/activity.js")
const PoiNote = require ("../models/poiNote.js")
const jsonschema = require("jsonschema")
const poiNoteCreateSchema = require("../schemas/poiNoteCreateSchema.json")
const poiNoteUpdateSchema = require ("../schemas/poiNoteUpdateSchema.json")
const { ensureLoggedIn, ensureAdmin} = require("../middleware/auth");


// This route enables users to save personal notes about pois
// create note for poi {poi_id, note} => {poiNote: {poi_id,user_id, note}}
// for all logged in users;

router.post("/", ensureLoggedIn, async(req,res, next)=>{
    try{
        const validator = jsonschema.validate(req.body, poiNoteCreateSchema);
        if (!validator.valid) {
          const errs = validator.errors.map(e => e.stack);
          throw new BadRequestError(errs);
        }
        const {poi_id, note} = req.body
        const user = await User.get(res.locals.user.username)
        const user_id = user.id

        const poiNote = await PoiNote.createNote(poi_id, user_id, note)
    
        return res.json({poiNote:poiNote})
    }
    catch(e){
        return next(e)
    }
    })

    // GET => {} => {poi_id, user_id, note}
    router.get("/:username/:poi_id", ensureLoggedIn, async(req,res, next)=>{
        try{
            const username = req.params.username
            const poi_id = req.params.poi_id
            // check if logged in user matches params username
            if (username != res.locals.user.username){
                throw new UnauthorizedError
            }

            const user= await User.get(username)
            const note = await PoiNote.getNote(user.id, poi_id)

            return res.json({poiNote: note})
        }
        catch(e){
            return next(e)
        }
        })


        // PATCH update poinote for id in params returns updated note
        router.patch("/:poinote_id", ensureLoggedIn, async(req,res, next)=>{
            try{
                const validator = jsonschema.validate(req.body, poiNoteUpdateSchema);
                if (!validator.valid) {
                  const errs = validator.errors.map(e => e.stack);
                  throw new BadRequestError(errs);
                }
                const poinote_id = req.params.poinote_id
                const note = await PoiNote.get(poinote_id)
                const user = await User.get(res.locals.user.username)
                if (note.user_id != user.id){
                    throw new UnauthorizedError
                }
    
                const updatedNote = await PoiNote.update(poinote_id, req.body)
    
                return res.json({updated:updatedNote})
            }
            catch(e){
                return next(e)
            }
        })

          // Deletes locationnote for given locationnote_id
    // Only accessible for user owning the note
    router.delete("/:poinote_id", ensureLoggedIn, async(req,res, next)=>{
        try{
            
            const poinote_id = req.params.poinote_id
            const note = await PoiNote.get(poinote_id)
            const user = await User.get(res.locals.user.username)
            if (user.id != note.user_id){
                throw new UnauthorizedError
            }

            const deleted = await PoiNote.remove(poinote_id)

            return res.json({deleted: deleted})
        }
        catch(e){
            return next(e)
        }
    })


    module.exports = router