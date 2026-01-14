const passport = require('passport');
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')
const { checkUser, getUserById } = require('../db/queries/user')

passport.use(new LocalStrategy(async function(username, password, done) {
  try {
    const user = await getUser(username)

    if (!user) return done(null, false, { message: 'Incorrect username or password' });

    const isMatch = await bcrypt.compare(password, user.password_hash)

    if (!isMatch) return done(null, false, { message: 'Incorrect username or password' });

    return done(null, user)

  } catch (error) {
    return done(error)
  }
}))

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    return done(null, user)
  } catch (error) {
    done(error)
  }
})
