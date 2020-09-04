const mongoose = require('mongoose')
require("dotenv").config();
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { response, json } = require('express')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token("body", function (request, response) {
  return JSON.stringify(request.body);
});

app.use(
  morgan(
    ":method :url :status :response-time ms :body"
  )
);

app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    }).catch(error => response.status(404).json({
        error: 'id does not exist'
    }))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id).then(person => {
        response.json(person)
    }).catch(error => response.status(404).json({
        error: 'id does not exist'
    }))
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if(body.name === undefined){
        return response.status(400).json({ error: 'content missing'})
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
        })
})
    
    // const body = request.body

    // if (!body.name) {
    //     return response.status(400).json({
    //         error: 'name missing',
    //     })
    // } else if (!body.number){
    //     return response.status(400).json({
    //         error: 'number missing'
    //     })
    // } else if (nameExists(body.name)) {
    //     return response.status(400).json({
    //         error: 'name must be unique (already exists)'
    //     })
    // }
    // const person = {
    //     name: body.name,
    //     number: body.number,
    //     id: generateId()
    // }

    // persons = persons.concat(person)

    // response.send(person)
    // })

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

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})