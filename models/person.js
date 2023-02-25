const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);p
  });

// Schema defines the shape of the documents in the collection
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    minlength: 3
  },
  number: {
    type: String,
    required: [true, 'Number is required.'],
    minlength: [8, 'Number must be at least 8 digits.'],
    validate: {
      validator: function(v) { // v for value of number field
        // Two parts: 2-3 digits followed by at least 6 digits (because min length is 8)
        return /\d{2,3}-\d{6,}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number.`
    }
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

// Export model (constructor compiled from Schema definition) 
module.exports = mongoose.model('Person', personSchema); 
// Note: Node modules are defined differently than ES6 modules
// Only the Person model is accessible from outside this module