// Import schema
const Mongoose = require('./db');
const Animal = require('./grazioso_salvare');

// Reads seed data
const csv = require('fast-csv');
const fs = require('fs');

// Uncomment the below line and the 'log(doc);' line in the await function to see seeded data in console
//const log = data => console.log(JSON.stringify(data, undefined, 2));

// Code reference: Lunn, Neil. 2018. Import CSV Using Mongoose Schema. Stack Overflow. 
// Accessed from: https://stackoverflow.com/questions/50343116/import-csv-using-mongoose-schema
const seedDB = async() => {
    try {
        await Animal.deleteMany({}); //Empty collection before insertion

        // Remove id and version from headers so that data can be inserted
        let headers = Object.keys(Animal.schema.paths)
            .filter(k => ['_id', '__v'].indexOf(k) === -1);
        
        await new Promise((resolve, reject) => {

            // Buffer manages number of documents being pushed at one time; reduces overhead
            let buffer = [],
                counter = 0;
            let uniqueDocs = [];
            let stream = fs.createReadStream('./data/aac_shelter_outcomes.csv') // Read and parse file
            .pipe(csv.parse({ headers, skipRows: 1 }))
            .on("error", reject)
            .on("data", async doc => {
                stream.pause();
                if (!uniqueDocs.find(document => document.animal_id == doc.animal_id) 
                    && doc.outcome_type != "Euthanasia" 
                    && doc.outcome_type != "Died"
                    && doc.animal_type != "Other"
                    && doc.animal_type != "Bird"
                    && doc.animal_type != "Livestock") { // Filters unique documents, deceased animals, and animals that do not fall under the "Cat" or "Dog" animal type
                    buffer.push(doc);
                    uniqueDocs.push(doc);
                    counter++;
                    //log(doc);
                    try { // Batch insert every 10000 documents
                        if (counter > 10000) {
                            await Animal.insertMany(buffer);
                            buffer = [];
                            counter = 0;
                        }
                    } catch(e) {
                        stream.destroy(e);
                    }
                }

                stream.resume();
            })
            .on("end", async() => {
                try {  // Batch insert remaining documents
                    if ( counter > 0 ) {
                        await Animal.insertMany(buffer);
                        buffer = [];
                        counter = 0;
                        resolve();
                    }
                } catch(e) {
                    stream.destroy(e);
                }
            });
        });
    } catch(e) {
        console.error(e);
    } finally {
        process.exit();
    }
};

// Close connection
seedDB().then(async () => {
    await Mongoose.connection.close();
    process.exit(0);
});