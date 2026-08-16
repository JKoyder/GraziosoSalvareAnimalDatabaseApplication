const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
    age_upon_outcome: { type: String, required: true }, 
    animal_id: { type: String, required: true },
    animal_type: { type: String, required: true, index: true },
    breed: { type: String, required: true, index: true },
    color: { type: String, required: true },
    date_of_birth: { type: String, required: true },
    datetime: { type: String, required: true },
    monthyear: { type: String, required: true },
    name: { type: String },
    outcome_subtype: { type: String },
    outcome_type: { type: String },
    sex_upon_outcome: { type: String, required: true },
});

const Animal = mongoose.model('animals', animalSchema);
module.exports = Animal;
