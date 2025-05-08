import express from 'express';
import 'dotenv/config';

const app = express(); // Initialize express app
const PORT = process.env.PORT || 3000; // Default port is 3000 if not specified in .env

console.log({ PORT }); // Log the port to verify it's being set correctly

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); // Start the server and listen on the specified port
