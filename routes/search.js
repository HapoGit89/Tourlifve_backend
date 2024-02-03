const express = require('express')
const {UnauthorizedError, BadRequestError} = require("../expressError.js")
const router = new express.Router();
const GoogleDistSearch = require ("../models/google.js")
const { ensureLoggedIn, ensureAdmin} = require("../middleware/auth");



// POST {origin, destinations, mode} => {origin, destinations: [{address, distance, duration_text, duration_value_secs, mode},{}]}
// Route for using the googledistancematrix
router.post("/distance", ensureLoggedIn, async(req,res, next)=>{
    try{
        const resp = await GoogleDistSearch.searchDistance(req.body)
    return res.json({response:resp})}
catch(e){
    return next(e)
} })


// POST {lat,long, query} => {places: [{...}]}}
// Route for using the googledistancematrix
router.post("/nearby", ensureLoggedIn, async(req,res, next)=>{
    try{
        const resp = await GoogleDistSearch.searchNearby(req.body)
    return res.json(resp)}
catch(e){
    
    return next(e)
} })

// POST {origin_id, mode, lat, long, query, duration} => {origin, destiations: [{address, distance, duration_text, duration_value_secs, mode, name, place_id}]}
// returns places around origin within given travel criteria

router.post("/complex", ensureLoggedIn, async(req,res, next)=>{
    try{
        const resp = await GoogleDistSearch.combinedSearch(req.body)
    return res.json(resp)}
catch(e){
    return next(e)
} })


module.exports = router