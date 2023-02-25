const mongoose = require('mongoose')

// Check for password argument in command line
if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

// Save password from argument vector
const password = process.argv[2]

// Connect to MongoDB
const url =
  `mongodb+srv://cabbachew:${password}@cluster0.6nvwzbj.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

// Schema defines the shape of the documents in the collection
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// Define model (constructors compiled from Schema definitions)
// Note: An instance of a model is called a document.
const Person = mongoose.model('Person', personSchema) // Mongoose will name the collection "people"


// If no additional arguments are provided, fetch all persons
if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Invalid arguments')
  mongoose.connection.close()
}
