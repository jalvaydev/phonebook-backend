const mongoose = require('mongoose')
require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { response, json } = require('express')
const app = express()
const Person = require('./models/person');

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('body', function (request, response) {
    return JSON.stringify(request.body);
})

app.use(
    morgan(
        ':method :url :status :response-time ms :body'
    )
)

app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person){
            response.json(person)
        } else {
            response.status(404).end()
        }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(person => {
        response.json(person)
    }).catch(error => next(error))
})



app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }
    console.log(body.name, body.number, request.params.id)
    Person.findByIdAndUpdate(request.params.id, person, {new:true})
        .then(updatedPerson => {
            console.log("UpdatedPerson: ",updatedPerson)
            response.json(updatedPerson)
        }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person
        .save()
        .then(savedAndFormattedPerson => {
            response.json(savedAndFormattedPerson)
        })
        .catch(error => next(error))
})

app.get('/info', (request, response) => {
    let today = new Date()
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
                 "Oct", "Nov", "Dec"];
    Person.find({}).then(person => {
        response.send(`<p>Phonebook currenty has ${person.length} people in it</p> 
        <p>${days[today.getDay()]} ${months[today.getMonth()]} ${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} UTC ${today.getTimezoneOffset()/60}</p>`)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {    
        return response.status(400).json({ error: error.message })  
    }
  
    next(error)
}
  
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})