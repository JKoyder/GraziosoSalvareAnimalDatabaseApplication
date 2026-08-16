const mongoose = require('mongoose');
const Animal = require('../models/grazioso_salvare');
const Model = mongoose.model('animals');

// GET: /animals - lists all the animals in database
const animalsList = async(req, res) => {
    const q = await Model
    .find({}) // Return all records
    .exec();

    if (!q)
    { 
        return res
            .status(404)
            .json(err);
    }
    else { 
        return res
            .status(200)
            .json(q)
    }
};

// GET: /filtered_animals - lists all animals matching query
const animalsFindByQuery= async(req, res) => {
    const filter = {};
        
    //Construct filter query
    Object.keys(req.query).forEach(key => {
        if (key !== "breed" && req.query[key] !== "") {
            filter[key] = req.query[key];
        }
    });

    // Breed key could have an array value so it must be handled separately
    if (Array.isArray(req.query.breed) && req.query.breed.length < 10) {
        filter.breed = { $in: req.query.breed };
    }
    else if (Array.isArray(req.query.breed) && req.query.breed.length >= 10) {
        return res.status(400).json({
            error: 'Too many breed filters.'
        });
    }
    else if (req.query.breed !== "") {
        filter.breed = req.query.breed;
    }

    const q = await Model
        .find(filter)
        .exec();

    if (!q)
    { 
        return res
            .status(404)
            .json(err);
    }
    else { 
        return res
            .status(200)
            .json(q)
    }
};

module.exports = {
    animalsList,
    animalsFindByQuery,
};
