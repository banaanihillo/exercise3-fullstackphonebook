const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const url = process.env.MONGODB_URI;

console.log(`Connecting to the address ${url}`)
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true} )
    .then(result => {
        console.log("Successfully connected to the database")
    })
    .catch(error => {
        console.log(`Could not connect to the database due to ${error}`)
    })

const personSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 1, unique: true},
    number: {type: String, required: true, minlength: 1, unique: true},
})
personSchema.plugin(uniqueValidator);

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Person", personSchema)
