const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { response, json } = require('express')
const app = express()

app.use(cors())
app.use(express.json())

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :response-time ms :body"
  )
);

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {    
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const generateId = () => {
    return(Math.floor(Math.random() * 10000000))
}

const nameExists = (nameToCheck) => {
    const nameCheck = persons.filter(person => person.name === nameToCheck)
    return (nameCheck.length !== 0)
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name){
        return res.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number){
        return res.status(400).json({
            error: 'number missing'
        })
    } else if (nameExists(body.name)) {
        return res.status(400).json({
            error: 'name must be unique (already exists)'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    res.send(person)
})

app.get('/info', (req, res) => {
    let today = new Date()
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
                 "Oct", "Nov", "Dec"];
    res.send(`<p>Phonebook currenty has ${persons.length} people in it`)
    console.log(`${days[today.getDay()]} ${months[today.getMonth()]} ${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} UTC ${today.getTimezoneOffset()/60}`)
})

const PORT = proccess.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})