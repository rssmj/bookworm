import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing

// Define the user schema for MongoDB using Mongoose
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  profileImage: {
    type: String,
    default: '',
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // If the password is not modified, skip hashing
  // Middleware to hash the password before saving the user document
  const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
  this.password = await bcrypt.hash(this.password, salt); // Hash the password with the generated salt
  next(); // Call the next middleware in the stack
});

const User = mongoose.model('User', userSchema); // Create a model named 'User' using the defined schema > 'users'

export default User; // Export the User model for use in other parts of the application
