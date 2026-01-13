const express = require('express');
const auth = require('../services/auth');

const router = new express.Router();


/**
 * Send login details to authenticate user
 */
router.post('/login', async (req, res, next) => {
  const options = {
    body: req.body
  };

  try {
    const result = await auth.postAuthLogin(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Log the current user out
 */
router.get('/logout', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await auth.getAuthLogout(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Create a new user account
 */
router.post('/register', async (req, res, next) => {
  const options = {
    body: req.body
  };

  try {
    const result = await auth.postAuthRegister(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
