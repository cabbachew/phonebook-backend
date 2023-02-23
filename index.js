const express = require('express')
const app = express()

// Middleware to handle JSON data
app.use(express.json())

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
    "name": "John Doe",
    "number": "123-456-7890"
  }
]

// Root route
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
  response.json(persons)
})

// Fetch a single resource in the collection
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  }
  else {
    response.statusMessage = `Person with id ${id} not found`
    response.status(404).end()
  }
})

// Delete a single resource in the collection
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})