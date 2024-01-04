const express = require('express')
const router = new express.Router();


router.get("/", (req,res)=>{
res.json({users: {username: "Hannes"}})
})


module.exports = router;