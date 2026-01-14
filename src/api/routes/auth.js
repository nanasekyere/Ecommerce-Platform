const express = require('express');
const passport = require('passport');
const auth = require('../services/auth');

const router = new express.Router();


/**
 * Send login details to authenticate user
 */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)

    if (!user) {
      return res.status(401).json({
        status: 401,
        error: info?.message || "Invalid Credentials"
      });
    }

    req.login(user, (err) => {
      if (err) return next(err)

      return res.status(200).json({
        status: 200,
        data: user
      })
    })
  })(req, res, next);
});

/**
 * Log the current user out
 */
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      status: 200,
      message: 'Logged out successfully'
    });
  });
});

/**
 * Create a new user account
 */
router.post('/register', async (req, res, next) => {
  try {
    const result = await auth.register(req.body);

    req.login(result.data, (err) => {
      if (err) {
        return next(err);
      }
      res.status(result.status || 201).json(result.data);
    })
  } catch (err) {
    next(err);
  }
});

module.exports = router;
