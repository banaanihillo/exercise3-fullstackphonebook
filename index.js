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

app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
            } else {
                console.log(`Found no person with the id ${request.params.id}`)
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.get("/info", (request, response) => {
    const date = new Date()
    Person.find({}).then(persons => {
        response.send(`The phonebook currently has ${persons.length} entries.
            This request was made on ${date}.`)
    })
})

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            console.log(`Successfully deleted ${request.params.id}`)
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post("/api/persons", (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "Looks like the request is missing some vital information."
        })
    }
    
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    })

    const content = JSON.stringify(body)

    morgan.token("content", function () {
        return content
    })
})

app.put("/api/persons/:id", (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedPerson => {
            response.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
})

const notFound = (request, response) => {
    response.status(404).send({error: "Something very bad happened"})
}
app.use(notFound)

const handleError = (error, request, response, next) => {
    if (error.name === "CastError") {
        return response.status(400).send({error: "Wrong id format"})
    }
    next(error)
}
app.use(handleError)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Running the server on port ${PORT}`)
})
