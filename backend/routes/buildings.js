const express = require('express')

const router = express.Router();

router.get("/",async (req, res) => {
    console.log("Got buildings request");
    return res.status(200).json({message : "Successful..."})
})

module.exports = router;
