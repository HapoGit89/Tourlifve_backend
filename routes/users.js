const express = require('express')
const router = new express.Router();
const db = require("../db")


router.get("/", async(req,res, next)=>{
try{
    const response = await db.query("SELECT * FROM users")
    return res.json(response.rows)}
catch(e){
    return next(e)
}
})


module.exports = router;