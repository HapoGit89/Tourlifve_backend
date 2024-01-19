const express = require('express')
const {UnauthorizedError, BadRequestError} = require("../expressError.js")
const router = new express.Router();
const GoogleDistSearch = require ("../google.js")
const { ensureLoggedIn, ensureAdmin} = require("../middleware/auth");



// POST {origin, destinations, mode} => {origin, destinations: [{address, distance, duration_text, duration_value_secs, mode},{}]}
// Route for using the googledistancematrix
router.post("/", ensureLoggedIn, async(req,res, next)=>{
    try{
        const resp = await GoogleDistSearch.searchDistance(req.body)
    return res.json({response:resp})}
catch(e){
    return next(e)
} })


module.exports = router