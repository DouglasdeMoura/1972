import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [
    {
      type: String,
      required: true,
      enum: ['user', 'admin'],
      default: 'user',
    },
  ],
})

const Customer = mongoose.model('Customer', schema)
export default Customer
