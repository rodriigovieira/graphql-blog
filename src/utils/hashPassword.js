import bcrypt from 'bcryptjs'

// Validate and then hash the pvoided plain text
// password, and then returning the hashed version.

const hashPassword = (plainTextPassword) => {
  if (plainTextPassword.length < 8) throw new Error('Password needs at least 8 characters.')

  return bcrypt.hash(plainTextPassword, 10)
}

export default hashPassword
