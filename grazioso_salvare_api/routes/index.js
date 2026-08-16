const express = require("express");
const router = express.Router();

const animalsController = require("../controllers/animals");

// define route endpoints
router
    .route("/animals")
    .get(animalsController.animalsList); 

router
    .route("/filtered_animals")
    .get(animalsController.animalsFindByQuery);
    
module.exports = router;