const express = require("express");
const app = express();
var morgan = require("morgan");
app.use(express.json());

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

let persons = [
    {
        id: Math.floor(Math.random() * 100000),
        name: "Foo Bar",
        number: "0-ONE",
    },
    {
        id: Math.floor(Math.random() * 100000),
        name: "Chocolate Bar",
        number: "0-SUGAR",
    }
]

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
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

    if (persons.some(person =>
            ( (person.name === body.name) ||
            (person.number === body.number) )
        )
     ) {
         return response.status(400).json({
             error: "Duplicates are not allowed here."
            })
        }
    
    const person = {
        id: (Math.floor(Math.random() * 100000)),
        name: body.name,
        number: body.number
    }

    const content = JSON.stringify(body)

    morgan.token("content", function () {
        return content
    })

    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Running the server on port ${PORT}`)
})
