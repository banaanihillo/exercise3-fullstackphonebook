const mongoose = require("mongoose");

if (process.argv.length<3) {
    console.log("Your password goes here")
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://banaaniterttu:${password}@clusterofbananas-nxvd7.mongodb.net/persons?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })
    person.save().then(response => {
        console.log(`Added ${process.argv[3]} with the number ${process.argv[4]}.`)
        mongoose.connection.close()
    })
} else if (process.argv.length === 3) {
    console.log("Names and numbers currently stored in the phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name}: ${person.number}`)
        })
        mongoose.connection.close()
    })
} else {
    console.log("Input a name and number after your password to add a new entry")
    console.log("Leave those parameters blank to print out the contents of the database")
    process.exit(1)
}
