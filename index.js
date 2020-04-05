require("dotenv").config();
const express = require("express");
const app = express();
var morgan = require("morgan");
const cors = require('cors');
const Person = require("./models/person");
app.use(cors());
app.use(express.json());
app.use(express.static("build"));

app.use(morgan(":method :url :status :res[content-length] - :response-time ms", {
    skip: function (request, response) {
        return request.method === "POST"
    }
}))

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :content", {
    skip: function (request, response) {
        return request.method !== "POST"
    }
}))

app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons.map(person => person.toJSON()))
    })
})

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person.toJSON())
    })
})

app.get("/info", (request, response) => {
    const date = new Date()
    response.send(`The phonebook currently has ${persons.length} entries.
        This request was made on ${date}.`)
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    persons = (persons.filter(person => person.id !== id))
    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "Looks like the request is missing some vital information."
        })
    }

    /*
    if (persons.some(person =>
            ( (person.name === body.name) ||
            (person.number === body.number) )
        )
     ) {
         return response.status(400).json({
             error: "Duplicates are not allowed here."
            })
        }
    */
    
    const person = new Person({
        name: body.name,
        number: body.number
    })

    const content = JSON.stringify(body)

    morgan.token("content", function () {
        return content
    })

    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Running the server on port ${PORT}`)
})
