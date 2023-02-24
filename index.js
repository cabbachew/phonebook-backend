require ('dotenv').config()
const express = require('express')
const app = express() // Create an Express application
const Person = require('./models/person')

const cors = require('cors')
const morgan = require('morgan')

// Middleware 
app.use(express.static('build')) // Serve static files from the build folder
app.use(cors()) // Enable CORS (Cross-Origin Resource Sharing)
app.use(express.json()) // Parse JSON data in the request body
// app.use(morgan('tiny')) // HTTP request logger

morgan.token('body', function (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body")) // Custom HTTP request logger

// Custom middleware
// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }

// app.use(requestLogger)

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  },
  {
    "id": 5,
    "name": "Jark Manzer",
    "number": "123-456-7890"
  },
  {
    "id": 6,
    "name": "Oleg Gordievsky",
    "number": "098-765-4321"
  }
]

// Root route (Overriden by build middleware which serves index.html)
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

// Info route
app.get('/info', (request, response) => {
  const date = new Date()
  const info = `<p>Phonebook has info for ${persons.length} people</p>
                <p>${date}</p>`
  response.send(info)
})

// Fetch all resources in the collection
app.get('/api/persons', (request, response) => {
  // response.json(persons)
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// Fetch a single resource in the collection
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })

  // const id = Number(request.params.id)
  // const person = persons.find(person => person.id === id)

  // if (person) {
  //   response.json(person)
  // }
  // else {
  //   response.statusMessage = `Person with id ${id} not found`
  //   response.status(404).end()
  // }
})

// Generate a new id (increment the max id by 1)
// const generateId = () => {
//   const maxId = persons.length > 0
//     ? Math.max(...persons.map(p => p.id))
//     : 0
//   return maxId + 1
// }

// Generate a new id (random number between 1 and 1000000)
const generateId = () => {
  // From: Math.floor(Math.random() * (max - min + 1)) + min
  return Math.floor(Math.random() * 1000000) + 1 // Inclusive of maximum
}

// Create a new resource in the collection
app.post('/api/persons', (request, response) => {
  const body = request.body
  
  // Check for missing name
  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }
  // Check for missing number
  else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }
  // Check for duplicate
  else if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = new Person({
    // id: generateId(), // Currently not checking for duplicates
    name: body.name,
    number: body.number
  })

  // persons = persons.concat(person)

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

// Delete a single resource in the collection
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  // Could return 404 if resource not found but use 204 in all cases
  response.status(204).end()
})

// Middleware if no route handler matches the request
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001 // Use environment variable or default to 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})