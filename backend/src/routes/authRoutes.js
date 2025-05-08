import express from 'express';

const router = express.Router(); // Create a new router instance

router.post('/register', async (req, res) => {
  res.send('register'); // Handle register requests
});

router.post('/login', async (req, res) => {
  res.send('login'); // Handle login requests
});

export default router;
