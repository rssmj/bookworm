import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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

// Hash the password before saving the user db
userSchema.pre('save', async function (next) {
  // This middleware runs before saving a user document
  if (!this.isModified('password')) return next(); // If the password is not modified, skip hashing >> If the password is modified, proceed to hash it

  // Middleware to hash the password before saving the user document
  const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
  this.password = await bcrypt.hash(this.password, salt); // Hash the password with the generated salt
  next(); // Call the next middleware in the stack
});

// Fuction to compare the provided password with the stored hashed password
userSchema.methods.comparePassword = async function (userPassword) {
  // Method to compare the provided password with the stored hashed password
  return await bcrypt.compare(userPassword, this.password); // Return true if the passwords match, false otherwise
};

// Create a model named 'User' using the defined schema >> 'users'
const User = mongoose.model('User', userSchema);

export default User; // Export the User model for use in other parts of the application
